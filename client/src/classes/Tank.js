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

        var initX = Math.ceil(Math.random() * this.terrain.width / 1.0)
        var initY;

        for (let y = 0; y < this.scene.game.renderer.height; y++) {
            if (this.scene.terrain.getPixel(initX, y).alpha > 0) {
                initY = y;
                break;
            }
        }

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

        this.setPosition(initX, initY)
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



    update = () => {
        // position
        if (this.terrain.getPixel(this.x, this.y).alpha > 0) {
            this.checkRotation()
            this.settled = true
            //nothing
        }
        else if (this.y >= this.terrain.height) {
            this.checkRotation()
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
    }

    

    checkRotation = () => {
        var i, posRight, posLeft, temp, slope, avgRightX = 0, avgRightY = 0, avgLeftX = 0, avgLeftY = 0, countRight = 0, countLeft = 0;
        posRight = {x: this.x, y: this.y}
        posLeft = {x: this.x, y: this.y}

        for (i = 0; i < 5; i++) {
            temp = this.groundRight(posRight.x, posRight.y)
            if (temp === null) {
                break;
            }
            posRight = this.groundRight(posRight.x, posRight.y)
            avgRightX += posRight.x
            avgRightY += posRight.y
            countRight++
        }

        for (i = 0; i < 5; i++) {
            temp = this.groundLeft(posLeft.x, posLeft.y)
            if (temp === null) {
                break;
            }
            posLeft = this.groundLeft(posLeft.x, posLeft.y)
            avgLeftX += posLeft.x
            avgLeftY += posLeft.y
            countLeft++
        }

        if (posRight.x === posLeft.x && posRight.y === posLeft.y) {
            //slope = this.rotation
        }
        else {
            if ((posRight.x === this.x && posRight.y === this.y) || (posLeft.x === this.x && posLeft.y === this.y)) {
                // null
            }
            else {
                avgLeftX = avgLeftX/countLeft
                avgLeftY = avgLeftY/countLeft
                avgRightX = avgRightX/countRight
                avgRightY = avgRightY/countRight

                slope = (avgRightY - avgLeftY) / (avgRightX - avgLeftX)
                if (slope > 10000) {
                    slope = 10000
                }
                if (slope < -10000) {
                    slope = -10000
                }

                this.setRotation(Math.atan(slope))
            }
        }
        
        if (this.y > this.terrain.height) {
            this.setRotation(0)
        }
    }



    groundRight = (x, y) => {
        var options = [{x: x + 1, y: y - 1}, {x: x + 1, y: y}, {x: x + 1, y: y + 1}]
        var point = null;
        var pixel, abovePixel;

        for (let index = 0; index < options.length; index++) {
            pixel = this.terrain.getPixel(options[index].x, options[index].y)
            abovePixel = this.terrain.getPixel(options[index].x, options[index].y - 1)
            
            if (pixel.alpha > 0 && abovePixel.alpha === 0) {
                point = options[index]
                break;
            }
        }

        if (point === null) {
            var x = this.x + 1
            var minY = this.y - 30 > 0 ? this.y - 30 : 0;
            var maxY = this.y + 30 < this.terrain.height ? this.y + 30 : this.terrain.height;

            for (let y = minY; y < maxY; y++) {
                pixel = this.terrain.getPixel(x, y)
                abovePixel = this.terrain.getPixel(x, y - 1)

                if (pixel.alpha > 0 && abovePixel.alpha === 0) {
                    point = {x: x, y: y}
                    break;
                }
            }
        }

        if (this.y > this.terrain.height - this.height/2 && point === null) {
            point = {x: x + 1, y: y}
        }


        return point;
    }



    groundLeft = (x, y) => {
        var options = [{x: x - 1, y: y - 1}, {x: x - 1, y: y}, {x: x - 1, y: y + 1}]
        var point = null;
        var pixel, abovePixel;

        for (let index = 0; index < options.length; index++) {
            pixel = this.terrain.getPixel(options[index].x, options[index].y)
            abovePixel = this.terrain.getPixel(options[index].x, options[index].y - 1) 
            if (pixel.alpha > 0 && abovePixel.alpha === 0) {
                point = options[index]
                break;
            }
        }

        if (point === null) {
            var x = this.x - 1
            var minY = this.y - 30 > 0 ? this.y - 30 : 0;
            var maxY = this.y + 30 < this.terrain.height ? this.y + 30 : this.terrain.height;

            for (let y = minY; y < maxY; y++) {
                pixel = this.terrain.getPixel(x, y)
                abovePixel = this.terrain.getPixel(x, y - 1)

                if (pixel.alpha > 0 && abovePixel.alpha === 0) {
                    point = {x: x, y: y}
                    break;
                }
            }
        }

        if (this.y > this.terrain.height - this.height/2 && point === null) {
            point = {x: x - 1, y: y}
        }


        return point;
    }



    moveLeft = () => {
        if (!this.active) return

        var nextPos, slope, angle;
        nextPos = this.groundLeft(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else {
            slope = (this.y - nextPos.y) / (this.x - nextPos.x)
            angle = Math.atan(slope)
            this.setPosition(this.x - Math.cos(angle), this.y - Math.sin(angle))
        }
    }



    moveRight = () => {
        if (!this.active) return

        var nextPos, slope, angle;
        nextPos = this.groundRight(this.x, this.y);
        if (nextPos === null) {
            //
        }
        else {
            slope = (this.y - nextPos.y) / (this.x - nextPos.x)
            angle = Math.atan(slope)
            this.setPosition(this.x + Math.cos(angle), this.y + Math.sin(angle))
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
}