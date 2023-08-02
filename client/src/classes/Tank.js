import { GameObjects, Physics } from "phaser";
import Phaser from "phaser";
import { Turret } from "./Turret";
import { Score } from "./Score";
import { socket } from "../socket";

export class Tank extends GameObjects.Sprite {
    static length = 36
    /**
    * @param {Phaser.Scene} scene
    */
    constructor (scene, id) {
        var canvas = document.createElement('canvas');
        canvas.height = 24 // tank height
        canvas.width = 36  // tank width

        if (scene.textures.exists('tank' + id)) scene.textures.remove('tank' + id)
        scene.textures.addCanvas('tank' + id, canvas);
        //scene.add.sprite(0, 0, 'tank');
        super(scene, 0, 0, 'tank' + id)
        scene.add.existing(this)

        this.canvas = canvas
        this.scene = scene
        this.terrain = this.scene.terrain
        this.prevPos = {x: null, y: null}
        this.power = 60;
        this.id = id
        this.active = false;
        this.weapons = []
        this.name = null
        this.score = 0
        this.selectedWeapon = 0
        this.settled = true
        this.color = null
        this.centre = {x: 0, y: 0}
        this.top = {x: 0, y: 0}
        this.leftSteps = 0
        this.rightSteps = 0
        this.movesRemaining = 4
        this.moving = false
        this.hitRadius = this.height/4
        
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyS = this.scene.input.keyboard.addKey('S');

        this.turret = new Turret(scene, this, id)
        this.scoreHandler = new Score(this.scene, this)
    }



    create = (tankColor, name) => {
        var ctx = this.canvas.getContext('2d')
    
        ctx.fillStyle = tankColor
        this.color = tankColor
        this.name = name

        this.scene.physics.world.enable(this)

        this.randomPos()
    
        ctx.beginPath();
        ctx.moveTo(this.canvas.width/6, this.canvas.height/2)
        ctx.lineTo(0, this.canvas.height/4)
        ctx.lineTo(this.canvas.width/6, this.canvas.height/4)
        ctx.lineTo(this.canvas.width/4, 0)
        ctx.lineTo(this.canvas.width * (3/4), 0)
        ctx.lineTo(this.canvas.width * (5/6), this.canvas.height/4)
        ctx.lineTo(this.canvas.width, this.canvas.height/4)
        ctx.lineTo(this.canvas.width * (5/6), this.canvas.height/2)
        ctx.closePath()
        ctx.fill()

        //this.setBlendMode(Phaser.BlendModes.MULTIPLY)
        this.selectedWeapon = this.weapons.length >= 1 ? 0 : null
        //this.body.setCollideWorldBounds(true)
        this.body.setBounce(1,0)
        //this.body.setSize(1,1)
        this.scene.physics.add.collider(this, this.scene.leftWall)
        this.scene.physics.add.collider(this, this.scene.rightWall)

        this.body.setSize(1,1)

        socket.on('opponentShoot', ({selectedWeapon, power, rotation, rotation1, rotation2, position1, position2}) => {
            if (this.active === false) return
            this.moving = false
            this.leftSteps = 0
            this.rightSteps = 0
            this.scene.tank1.setPosition(position2.x, position2.y)
            this.scene.tank1.setRotation(rotation2)
            this.scene.tank2.setPosition(position1.x, position1.y)
            this.scene.tank2.setRotation(rotation1)

            this.selectedWeapon = selectedWeapon
            this.power = power
            this.turret.setRelativeRotation(rotation)
            this.scene.HUD.weaponScrollDisplay.reset(this)
            this.shoot()
        })

        socket.on('opponentStepLeft', () => {
            if (this.active === false) return
            this.stepLeft()
        })

        socket.on('opponentStepRight', () => {
            if (this.active === false) return
            this.stepRight()
        })

        this.scene.input.keyboard.on('keydown-A', () => {
            this.scene.sound.play('click', {volume: 0.3})
            if (this.active && !this.moving && this.movesRemaining > 0) {
                this.stepLeft()
                window.socket.emit('stepLeft', {})
            }
        })

        this.scene.input.keyboard.on('keydown-D', () => {
            this.scene.sound.play('click', {volume: 0.3})
            if (this.active && !this.moving && this.movesRemaining > 0) {
                this.stepRight()
                window.socket.emit('stepRight', {})
            }
        })

        this.texture.update()

        this.scene.physics.world.on('worldstep', this.physicsStep, this)
        this.scene.physics.world.on('worldstep', this.update, this)
    }



    randomPos = () => {
        var initX = Math.ceil(Math.random() * this.terrain.width / 1.0)
        var initY;
        for (let y = 0; y < this.scene.terrain.height; y++) {
            if (this.scene.terrain.getPixel(initX, y).alpha > 0) {
                initY = y;
                break;
            }
        }
        this.setPosition(initX, initY)
        this.prevPos.x = initX
        this.prevPos.y = initY
        var rotation = this.terrain.getSlope(initX, initY)
        if (rotation !== undefined) {
            this.setRotation(rotation)
        }
    }



    update = () => {
        this.turret.update()
        this.scoreHandler.update()

        // find centre
        this.centre.x = this.body.x + this.height/4 * Math.sin(this.rotation)
        this.centre.y = this.body.y - this.height/4 * Math.cos(this.rotation)
        this.top.x = this.body.x + this.height/2 * Math.sin(this.rotation)
        this.top.y = this.body.y - this.height/2 * Math.cos(this.rotation)

        // movement
        if (this.keyW?.isDown) {
            if (this.active)
                this.setPower(this.power + 1);
        }
        if (this.keyS?.isDown) {
            if (this.active)
                this.setPower(this.power - 1);
        }

        if (this.leftSteps > 0) {
            this.leftSteps--
            this.moveLeft()
        }
        if (this.rightSteps > 0) {
            this.rightSteps--
            this.moveRight()
        } 
        if (this.leftSteps === 0 && this.rightSteps === 0) {
            this.moving = false
        }

        this.prevPos = {x: this.x, y: this.y}
    }


    physicsStep = () => {
        if (this.body.y < 0) {
            if (this.body.x < 0 || this.body.x > this.scene.terrain.width - 1) return

            if (this.body.gravity.length() === 0) {
                this.body.y = this.body.y + 1
                this.settled = false
            }
        }
        else if (this.body.y >= 0) {
            if (this.body.x < 0 || this.body.x > this.scene.terrain.width - 1) return

            var [newX, newY, prevX, prevY] = this.scene.terrain.retractPoint(this.body.x, this.body.y, this.body.velocity, this.body.acceleration, this.body.gravity)
            var pos = {x: prevX, y: prevY}
            
            if (newX === prevX && newY === prevY) {
                if (this.terrain.getPixel(this.body.x, this.body.y).alpha === 0) {
                    this.body.y = this.body.y + 1
                    this.settled = false
                }
                else {
                    this.settled = true
                    var rotation = this.terrain.getSlope(pos.x, pos.y)
                    if (rotation !== undefined) {
                        this.setRotation(rotation)
                    }
                }
                return
            }

            this.body.x = pos.x
            this.body.y = pos.y

            var rotation = this.terrain.getSlope(pos.x, pos.y)
            if (rotation !== undefined) {
                this.setRotation(rotation)
            }
            this.settled = true
            
            this.body.stop()
            this.body.setGravity(0)
            this.body.preUpdate(true, 0)
        }
    }



    isInsideTerrain = () => {
        var x = this.body.x + 1 * Math.sin(this.rotation)
        var y = this.body.y - 1 * Math.cos(this.rotation)
        if (this.terrain.getPixel(x, y).alpha > 0) {
            return true
        }
        return false
    }



    groundRight = (x, y) => {
        var point = this.terrain.getRightGround(x, y)
        return point;
    }



    groundLeft = (x, y) => {
        var point = this.terrain.getLeftGround(x, y)
        return point;
    }



    moveLeft = () => {
        if (!this.active) return
        if (this.isInsideTerrain()) return
        this.scene.hideTurnPointer()

        var nextPos;
        nextPos = this.groundLeft(this.body.x, this.body.y);
        if (nextPos === null) {
            //
        }
        else if (this.body.x - (this.canvas.width/2) * Math.cos(this.rotation) <= 0) {
            this.body.x = (this.canvas.width/2) * Math.cos(this.rotation)
            //this.body.setVelocityX(-this.body.velocity.x)
        }
        else {
            //this.setPosition(nextPos.x, nextPos.y)
            this.body.x = nextPos.x
            this.body.y = nextPos.y
            var rotation = this.terrain.getSlope(nextPos.x, nextPos.y)
            if (rotation !== undefined) {
                this.setRotation(rotation)
            }
            //this.setRotation(this.terrain.getSlope(nextPos.x, nextPos.y))
        }
    }



    moveRight = () => {
        if (!this.active) return
        if (this.isInsideTerrain()) return
        this.scene.hideTurnPointer()

        var nextPos;
        nextPos = this.groundRight(this.body.x, this.body.y);
        if (nextPos === null) {
            //
        }
        else if (this.body.x + (this.canvas.width/2) * Math.cos(this.rotation) >= this.terrain.width) {
            this.body.x = this.terrain.width - (this.canvas.width/2) * Math.cos(this.rotation)
            //this.body.setVelocityX(-this.body.velocity.x)
        }
        else {
            //this.setPosition(nextPos.x, nextPos.y)
            this.body.x = nextPos.x
            this.body.y = nextPos.y
            var rotation = this.terrain.getSlope(nextPos.x, nextPos.y)
            if (rotation !== undefined) {
                this.setRotation(rotation)
            }
            //this.setRotation(this.terrain.getSlope(nextPos.x, nextPos.y))
        }
    }



    stepLeft = () => {
        if (this.movesRemaining > 0) {
            this.leftSteps = 80
            this.moving = true
            if (this.scene.sceneData.gameType !== 4) {
                this.movesRemaining--
            }
        }
    }



    stepRight = () => {
        if (this.movesRemaining > 0) {
            this.rightSteps = 80
            this.moving = true
            if (this.scene.sceneData.gameType !== 4) {
                this.movesRemaining--
            }
        }
    }



    shoot = () => {
        if (!this.active) return
        this.scene.hideTurnPointer()
        
        this.active = false
        this.turret.shoot(this.weapons[this.selectedWeapon]?.id)
        if (this.scene.sceneData.gameType !== 4) {
            this.weapons.splice(this.selectedWeapon, 1)
        }
        this.selectedWeapon = this.weapons.length >= 1 ? Math.min(this.selectedWeapon, this.weapons.length - 1) : null
    }



    updateScore = (points) => {
        if (points === 0) return
        this.scoreHandler.add(points)
    }



    setPower = (power) => {
        power = Math.floor(power)
        if (power > 100)
            power = 100
        if (power < 1)
            power = 1
        this.power = power
    }



    isPointInside = (x, y) => {
        var w = this.width

        var polygon = new Phaser.Geom.Polygon([
            //this.x - Math.cos(this.rotation) * w/3, this.y - Math.sin(this.rotation) * w/3,
            //this.centre.x - Math.cos(this.rotation) * w/2, this.centre.y - Math.sin(this.rotation) * w/2,
            //this.centre.x - Math.cos(this.rotation) * w/3, this.centre.y - Math.sin(this.rotation) * w/3,
            this.body.x - Math.cos(this.rotation) * w/4, this.body.y - Math.sin(this.rotation) * w/4,
            this.top.x - Math.cos(this.rotation) * w/4, this.top.y - Math.sin(this.rotation) * w/4,
            this.top.x + Math.cos(this.rotation) * w/4, this.top.y + Math.sin(this.rotation) * w/4,
            this.body.x + Math.cos(this.rotation) * w/4, this.body.y + Math.sin(this.rotation) * w/4,
            //this.centre.x + Math.cos(this.rotation) * w/3, this.centre.y + Math.sin(this.rotation) * w/3,
            //this.centre.x + Math.cos(this.rotation) * w/2, this.centre.y + Math.sin(this.rotation) * w/2,
            //this.x + Math.cos(this.rotation) * w/3, this.y + Math.sin(this.rotation) * w/3,
        ])

        var pointInside = false

        if (Phaser.Geom.Polygon.ContainsPoint(polygon, {x: x, y: y})) {
            pointInside = true
        }
 
        return pointInside
    }



    autoAdjust = () => {
        var oppTank = (this === this.scene.tank1) ? this.scene.tank2 : this.scene.tank1
        var diffX = this.body.x - oppTank.body.x
        var diffY = -(this.body.y - oppTank.body.y)

        var angle = Math.atan(diffY/diffX)
        
        if (diffX < 0) {
            var minAngle = angle
            var maxAngle = Math.PI/2
        }
        else {
            var minAngle = Math.PI/2
            var maxAngle = angle + Math.PI
        }

        var accelaration = 300
        var cos, sin;
        var newX, newY;
        var v, dist = 10000, temp;
        var k = {angle: 0, v: 0}
        var factor = 4

        for (let theta = minAngle; theta < maxAngle; theta += 0.1 * factor) {
            for (v = this.turret.powerFactor; v < 100 * this.turret.powerFactor; v += this.turret.powerFactor * factor) {
                sin = Math.sin(theta)
                cos = Math.cos(theta)
                for (let t = 0; t < 5; t += 0.01 * factor) {
                    newX = this.turret.x + v * cos * t
                    newY = this.turret.y - v * sin * t + 1/2 * accelaration * t * t
                    if (newX < 0 || newX > this.terrain.width) {
                        break
                    }
                    if (newY > 0 && newY < this.terrain.height) {
                        //this.terrain.setPixel(newX, newY, 255,0,0,255)
                        if (this.terrain.getPixel(newX, newY).alpha > 0 || newY - this.terrain.height > -1) {
                            temp = Math.sqrt( Math.pow( newX - oppTank.body.x, 2 ) + Math.pow( newY - oppTank.body.y, 2 ) )
                            if (temp < dist) {
                                dist = temp
                                k.angle = Math.PI/2 - theta
                                k.v = v
                            }
                            break;
                        }
                    }
                }
            }
        }

        this.turret.setRotation(k.angle)
        this.turret.relativeRotation = k.angle - this.rotation
        this.setPower(k.v / this.turret.powerFactor)
    }

}