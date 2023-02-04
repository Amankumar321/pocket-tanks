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
        this.scene.physics.world.enable(this)
        //this.body.setCollideWorldBounds(true)
        this.body.setBounce(1, 0)
        this.scene.physics.add.collider(this, this.scene.leftWall)
        this.scene.physics.add.collider(this, this.scene.rightWall)

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

        this.texture.update()
    }



    randomPos = () => {
        var initX = Math.ceil(Math.random() * this.terrain.width / 1.0)
        var initY;
        for (let y = 0; y < this.scene.game.renderer.height; y++) {
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
        // position
        if (this.terrain.getPixel(this.x, this.y).alpha > 0) {
            if (this.y >= 0) {
                if (this.body.speed > 0) {
                    var angle = 0
                    if (this.body.velocity.x !== 0) {
                        angle = Math.atan(this.body.velocity.y / this.body.velocity.x)
                        if (this.body.velocity.x < 0) {
                            angle = this.rotation + Math.PI
                        }
                    }
                    else {
                        if (this.body.velocity.y < 0) {
                            angle = -Math.PI/2
                        }
                        if (this.body.velocity.y > 0) {
                            angle = Math.PI/2
                        }
                    }

                    this.body.stop()
                    this.body.setGravity(0)
                    this.body.setVelocity(0, 0)

                    var pos = null, newX = this.x, newY = this.y, prevX, prevY;
                    for (let i = 0; i < 10; i++) {
                        prevX = newX
                        prevY = newY
                        newX = this.x + i * Math.cos(angle + Math.PI)
                        newY = this.y + i * Math.sin(angle + Math.PI)
                        if (this.terrain.getPixel(newX, newY).alpha === 0) {
                            pos = {x: newX, y: newY}
                            break
                        }
                    }

                    if (pos !== null) {
                        this.setPosition(pos.x, pos.y)
                        var rotation = this.terrain.getSlope(pos.x, pos.y)
                        if (rotation !== undefined) {
                            this.setRotation(rotation)
                            this.settled = true
                        }
                    }
                }
                if(this.isInsideTerrain()) {
                    if (this.x !== this.prevPos.x || this.y !== this.prevPos.y) {
                        this.setPosition(this.prevPos.x, this.prevPos.y)
                        var rotation = this.terrain.getSlope(this.prevPos.x, this.prevPos.y)
                        if (rotation !== undefined) {
                            this.setRotation(rotation)
                            this.settled = true
                        }
                    }
                }
            }
            else {
                this.y = this.y + 1
            }
        }
        else if (this.y >= this.terrain.height) {
            this.y = this.terrain.height
            this.setRotation(this.terrain.getSlope(this.x, this.y))
            this.settled = true
        }
        else {
            this.setPosition(this.x, this.y + 1);
            if (this.terrain.getPixel(this.x, this.y).alpha > 0) {
                var rotation = this.terrain.getSlope(this.x, this.y)
                if (rotation !== undefined) {
                    this.setRotation(rotation)
                    this.settled = true
                }
            }
            else this.settled = false
        }

        this.turret.update()
        this.scoreHandler.update()

        // find centre
        this.centre.x = this.x + this.height/4 * Math.sin(this.rotation)
        this.centre.y = this.y - this.height/4 * Math.cos(this.rotation)
        this.top.x = this.x + this.height/2 * Math.sin(this.rotation)
        this.top.y = this.y - this.height/2 * Math.cos(this.rotation)

        // movement
        if (this.keyA?.isDown) {
            if (this.active && !this.moving && this.movesRemaining > 0)
                this.stepLeft()
        }
        if (this.keyD?.isDown) {
            if (this.active && !this.moving && this.movesRemaining > 0)
                this.stepRight()
        }
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



    isInsideTerrain = () => {
        var x = this.x + 1 * Math.sin(this.rotation)
        var y = this.y - 1 * Math.cos(this.rotation)
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
        nextPos = this.groundLeft(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else if (this.x - (this.canvas.width/2) * Math.cos(this.rotation) <= 0) {
            this.x = (this.canvas.width/2) * Math.cos(this.rotation)
            //this.body.setVelocityX(-this.body.velocity.x)
        }
        else {
            this.setPosition(nextPos.x, nextPos.y)
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
        nextPos = this.groundRight(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else if (this.x + (this.canvas.width/2) * Math.cos(this.rotation) >= this.terrain.width) {
            this.x = this.terrain.width - (this.canvas.width/2) * Math.cos(this.rotation)
            //this.body.setVelocityX(-this.body.velocity.x)
        }
        else {
            this.setPosition(nextPos.x, nextPos.y)
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
            if (this.scene.sceneData.gameType === 3) {
                window.socket.emit('stepLeft', {})
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
            if (this.scene.sceneData.gameType === 3) {
                window.socket.emit('stepRight', {})
            }
        }
    }



    shoot = () => {
        if (!this.active) return
        this.active = false
        this.turret.shoot(this.weapons[this.selectedWeapon]?.id)
        this.scene.hideTurnPointer()

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
            this.x - Math.cos(this.rotation) * w/4, this.y - Math.sin(this.rotation) * w/4,
            this.top.x - Math.cos(this.rotation) * w/4, this.top.y - Math.sin(this.rotation) * w/4,
            this.top.x + Math.cos(this.rotation) * w/4, this.top.y + Math.sin(this.rotation) * w/4,
            this.x + Math.cos(this.rotation) * w/4, this.y + Math.sin(this.rotation) * w/4,
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



    pauseInsideTerrainCheck = () => {
        this.pauseCheck = true
    }




    resumeInsideTerrainCheck = () => {
        this.pauseCheck = false
    }
}