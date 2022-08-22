import { GameObjects } from "phaser";
import { Turret } from "./Turret";
import { Score } from "./Score";
import { socket } from "../socket";

export class Tank extends GameObjects.Sprite {
    /**
    * @param {Phaser.Scene} scene
    */
    constructor (scene, id) {
        var canvas = document.createElement('canvas');
        canvas.height = 24 // tank height
        canvas.width = 36  // tank width
    
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

        this.selectedWeapon = this.weapons.length >= 1 ? 0 : null

        socket.on('opponentShoot', ({selectedWeapon, power, rotation}) => {
            if (this.active === false) return
            this.selectedWeapon = selectedWeapon
            this.power = power
            this.turret.setRotation(rotation)
            this.scene.HUD.weaponScrollDisplay.reset(this)
            this.shoot()
        })
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
    }



    update = () => {
        // position
        if (this.terrain.getPixel(this.x, this.y).alpha > 0) {
            this.setRotation(this.terrain.getSlope(this.x, this.y))
            this.settled = true
            //nothing
        }
        else if (this.y >= this.terrain.height) {
            this.setRotation(this.terrain.getSlope(this.x, this.y))
            this.y = this.terrain.height
            this.settled = true
        }
        else {
            this.y = this.y + 1;
            this.settled = false
        }

        this.turret.update()
        this.scoreHandler.update()

        // find centre
        this.centre.x = this.x + this.height/4 * Math.sin(this.rotation)
        this.centre.y = this.y - this.height/4 * Math.cos(this.rotation)

        // movement
        if (this.keyA?.isDown) {
            if (this.active)
                this.moveLeft()
        }
        if (this.keyD?.isDown) {
            if (this.active)
                this.moveRight()
        }
        if (this.keyW?.isDown) {
            if (this.active)
                this.power++;
        }
        if (this.keyS?.isDown) {
            if (this.active)
                this.power--;
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

        var nextPos;
        nextPos = this.groundLeft(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else {
            this.setPosition(nextPos.x, nextPos.y)
            this.setRotation(this.terrain.getSlope(nextPos.x, nextPos.y))
        }
    }



    moveRight = () => {
        if (!this.active) return

        var nextPos;
        nextPos = this.groundRight(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else {
            this.setPosition(nextPos.x, nextPos.y)
            this.setRotation(this.terrain.getSlope(nextPos.x, nextPos.y))
        }
    }



    stepLeft = () => {
        if (this.movesRemaining > 0) {
            this.leftSteps = 80
            this.moving = true
            //this.movesRemaining--
        }
    }



    stepRight = () => {
        if (this.movesRemaining > 0) {
            this.rightSteps = 80
            this.moving = true
            //this.movesRemaining--
        }
    }



    shoot = () => {
        if (!this.active) return
        this.active = false
        this.turret.shoot(this.weapons[this.selectedWeapon]?.id)

        if (this.scene.sceneData.gameType !== 4) {
            this.weapons.splice(this.selectedWeapon, 1)
            this.selectedWeapon = this.weapons.length >= 1 ? 0 : null
        }

    }



    updateScore = (points) => {
        if (points === 0) return
        this.scoreHandler.add(points)
    }



    setPower = (power) => {
        if (power > 100)
            power = 100
        if (power < 0)
            power = 0
        this.power = power
    }
}