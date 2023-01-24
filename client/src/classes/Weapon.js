import Phaser from "phaser";
import { Turret } from "./Turret";
import { weaponArray } from "../weapons/array";


export class Weapon {
    
    /**
    * @param {Phaser.Scene} scene
    */

    constructor (scene, tank, id) {    
        if (id === null || id === undefined) id = 0

        this.scene = scene
        this.id = id
        this.tank = tank
        this.turret = this.tank.turret
        this.powerFactor = this.turret.powerFactor
        this.terrain = this.scene.terrain
        this.weaponHandler = weaponArray[this.id]

        this.create()
        this.shoot()
    }



    create = () => {
        this.weaponHandler.create(this)
    }



    shoot = () => {
        this.weaponHandler.shoot(this)
    }



    update = () => {
        this.weaponHandler.update(this)
    }


    defaultShoot = (obj, v, g = 300, p, r) => {
        var velocity = v === undefined ? this.tank.power * this.powerFactor : v
        var gravity = g
        var rotation = r === undefined ? this.turret.rotation : r

        if (p !== null && p !== undefined) {
            obj.setPosition(p.x, p.y)
        }
        else {
            obj.setPosition(this.turret.x + (this.turret.height/2) * Math.sin(this.turret.rotation), this.turret.y - (this.turret.height/2) * Math.cos(this.turret.rotation))
        }

        obj.setRotation(rotation)
        obj.setVelocity(velocity * Math.sin(rotation), -velocity * Math.cos(rotation)) 
        obj.body.setGravityY(gravity)
        obj.setDepth(2)
    }



    defaultUpdate = (obj) => {
        var x = obj.x
        var y = obj.y
        
        var tank1 = this.scene.tank1
        var tank2 = this.scene.tank2

        var hitTank1 = false
        var hitTank2 = false

        if (tank1.isPointInside(x, y)) {
            hitTank1 = true
        }
        if (tank2.isPointInside(x, y)) {
            hitTank2 = true
        }

        if (obj.body.velocity.x !== 0) {
            obj.setRotation(Math.atan(obj.body.velocity.y / obj.body.velocity.x))
    
            if (obj.body.velocity.x < 0) {
                obj.setRotation(obj.rotation + Math.PI)
            }
        }
        else {
            if (obj.body.velocity.y < 0) {
                obj.setRotation(-Math.PI/2)
            }
            if (obj.body.velocity.y > 0) {
                obj.setRotation(Math.PI/2)
            }
        }

        if (x <= 0 || x >= this.scene.terrain.width - 1) {
            this.weaponHandler.onOutOfBound(this, obj)
        }
        
        else if (y < 0) {

        }
        
        else if (y >= this.terrain.height) {
            this.weaponHandler.onBaseHit(this, obj)
        }

        else if (hitTank1 === true) {
            this.weaponHandler.onTankHit(this, obj, tank1)
        }

        else if (hitTank2 === true) {
            this.weaponHandler.onTankHit(this, obj, tank2)
        }

        // else if (point.r === 230 && point.g === 0 && point.b === 230) {
        //     this.weaponHandler.onBounceHit(this, obj)
        // }

        else if (this.terrain.getPixel(x, y).alpha > 0) {
            this.weaponHandler.onTerrainHit(this, obj)
        }
    }



    updateTail = (obj, factor, minimum, thickness, color, taper) => {
        var tailLength = obj.body.speed / factor + minimum
        tailLength = Math.floor(tailLength)
    
        var centreX = obj.canvas.width/2
        var centreY = obj.canvas.height/2

        for (let col = 0; col < centreX; col++) {
            for (let row = -thickness/2; row < thickness/2; row++) {
                obj.texture.setPixel(col, centreY + row, 0, 0, 0, 0)
            }
        }

        for (let col = 0; col < tailLength; col++) {
            for (let row = -thickness/2; row < thickness/2; row++) {
                obj.texture.setPixel(centreX - col, centreY + row, color.r, color.g, color.b, 255*(1 - col/tailLength))
            }
            if (taper === true) {
                thickness = thickness * (1 - col / (tailLength * 8))
            }
        }

        obj.texture.refresh();
        obj.texture.update()
    }



    defaultUpdateScore = (x, y, blastRadius, factor) => {
        if (isNaN(factor)) return

        var tank1 = this.scene.tank1
        var tank2 = this.scene.tank2

        var hitTank1 = false
        var hitTank2 = false

        if (tank1.isPointInside(x, y)) {
            hitTank1 = true
        }
        if (tank2.isPointInside(x, y)) {
            hitTank2 = true
        }

        if (hitTank1 && tank1 === this.tank) {
            this.tank.updateScore(-Math.floor(blastRadius * factor))
        }
        else if (hitTank1 && tank1 !== this.tank) {
            this.tank.updateScore(Math.ceil(blastRadius * factor))
        }
        if (hitTank2 && tank2 === this.tank) {
            this.tank.updateScore(-Math.floor(blastRadius * factor))
        }
        else if (hitTank2 && tank2 !== this.tank) {
            this.tank.updateScore(Math.ceil(blastRadius * factor))
        }

        if (hitTank1 || hitTank2) return

        var dist1 = Phaser.Math.Distance.Between(x, y, this.scene.tank1.centre.x, this.scene.tank1.centre.y)
        var dist2 = Phaser.Math.Distance.Between(x, y, this.scene.tank2.centre.x, this.scene.tank2.centre.y)

        if (tank1 === this.tank) {
            var pointReduce = dist1 - blastRadius > 0 ? 0 : Math.ceil((blastRadius - dist1) * factor)
            var pointIncrease = dist2 - blastRadius > 0 ? 0 : Math.ceil((blastRadius - dist2) * factor)
            
            this.tank.updateScore(pointIncrease)
            this.tank.updateScore(-pointReduce)
        }
        else if (tank2 === this.tank) {
            var pointReduce = dist2 - blastRadius > 0 ? 0 : Math.ceil((blastRadius - dist2) * factor)
            var pointIncrease = dist1 - blastRadius > 0 ? 0 : Math.ceil((blastRadius - dist1) * factor)

            this.tank.updateScore(pointIncrease)
            this.tank.updateScore(-pointReduce)
        }
    }

    
    
    constantUpdateScore = (points) => {
        if (isNaN(points)) return
            this.tank.updateScore(points)
    }



    defaultDigTerrain = (obj, thickness, intensity) => {
        if (obj.prevState !== null && obj.prevState !== undefined) {
            if (this.terrain.getPixel(obj.prevState.x, obj.prevState.y).alpha === 0 && this.terrain.getPixel(obj.x, obj.y).alpha === 0) {
                obj.prevState.x = obj.x
                obj.prevState.y = obj.y
                return
            }

            var x = obj.prevState.x, y = obj.prevState.y;
            if (this.terrain.getPixel(x, y).alpha === 0) {
                while (this.terrain.getPixel(x, y).alpha === 0) {
                    x = obj.prevState.x = obj.prevState.x + Math.cos(obj.rotation)
                    y = obj.prevState.y = obj.prevState.y + Math.sin(obj.rotation)
                }
            }
            if (this.terrain.getPixel(obj.prevState.x, obj.prevState.y).alpha === 0) {
                while (this.terrain.getPixel(x, y).alpha !== 0) {
                    x = obj.prevState.x = obj.prevState.x + Math.cos(obj.rotation)
                    y = obj.prevState.y = obj.prevState.y + Math.sin(obj.rotation)
                }
            }

            var ctx = this.terrain.getContext()

            ctx.globalCompositeOperation = 'source-atop'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = `rgba(0,0,0,${intensity})`
            ctx.lineCap = 'round'
            ctx.globalAlpha = 1
            ctx.lineWidth = thickness

            ctx.beginPath()
            ctx.moveTo(obj.prevState.x, obj.prevState.y)
            ctx.lineTo(obj.x, obj.y)
            ctx.stroke()

            obj.prevState.x = obj.x
            obj.prevState.y = obj.y
        }

        else {
            obj.prevState = {x: obj.x, y: obj.y}
        }
    }



    defaultBounce = (obj, factor = 0.6) => {
        var rotation = 0
        if (obj.body.velocity.x !== 0) {
            rotation = Math.atan(obj.body.velocity.y / obj.body.velocity.x)
    
            if (obj.body.velocity.x < 0) {
                rotation = rotation + Math.PI
            }
        }
        else {
            if (obj.body.velocity.y < 0) {
                rotation = -Math.PI/2
            }
            if (obj.body.velocity.y >= 0) {
                rotation = Math.PI/2
            }
        }

        var x = obj.x
        var y = obj.y
        var initX = x, initY = y;
        var prevX = x, prevY = y;
        var limit = Math.ceil(obj.body.speed / 10)
        var vx = obj.body.velocity.x
        var vy = obj.body.velocity.y
        var v = new Phaser.Math.Vector2(vx, vy)

        if (this.terrain.getPixel(x, y).alpha !== 0) {
            while (this.terrain.getPixel(x, y).alpha !== 0) {
                limit--
                prevX = x
                prevY = y
                obj.x = obj.x - Math.cos(rotation)
                obj.y = obj.y - Math.sin(rotation)
                x = obj.x
                y = obj.y
                
                if (limit < 0) {
                    obj.x = initX
                    obj.y = initY
                    return
                }
            }

            var slope = this.terrain.getSlope(prevX, prevY)
            if (isNaN(slope) === true) {
                if (obj.body.velocity.x > 0) {
                    slope = Math.PI/2
                }
                else {
                    slope = -Math.PI/2
                }
            }
            var perpendicular = slope + Math.PI/2
            var alpha = perpendicular - rotation
            var f = factor
            
            v.rotate(2 * alpha - Math.PI)
            
            obj.setVelocity(v.x * f, v.y * f)
        }
    }
}