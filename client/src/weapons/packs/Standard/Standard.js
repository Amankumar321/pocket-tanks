import Phaser, { Physics } from "phaser"
import { Weapon } from "../../../classes/Weapon"
import * as Logos from "./logos"



export class singleshot {
    constructor() {
        this.id = 0
        this.name = 'Single Shot'
        this.projectile = null
        this.logoCanvas = Logos.singleshot
    }

    reset = () => {
        this.projectile = null
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 80

        ctx.fillStyle = 'rgba(0,255,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 3, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
        this.projectile.canvas = canvas
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        weapon.updateTail(this.projectile, 15, 5, 6, {r: 0, g: 255, b: 255})
        weapon.defaultUpdate(this.projectile)
    }

    onTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 20)
        var bounce = false
        
        while (weapon.terrain.getPixel(x, y).alpha !== 0) {
            prevX = x
            prevY = y
            x = x - Math.cos(obj.rotation)
            y = y - Math.sin(obj.rotation)

            maxCount--
            if (maxCount === 0) {
                x = initX
                y = initY
                return
            }
        }
        
        for (let tempX = prevX - 1; tempX <= prevX + 1; tempX++) {
            for (let tempY = prevY - 1; tempY <= prevY + 1; tempY++) {
                var pixel = weapon.terrain.getPixel(tempX, tempY)
                if (pixel.r === 230 && pixel.g === 0 && pixel.b === 230) {
                    bounce = true
                    break
                }
            }
            if (bounce) break
        }

        if (bounce && obj.bounceCount > 0) {
            this.onBounceHit(weapon, obj)
        }
        
        if (!bounce || obj.bounceCount <= 0) {
            y = Math.min(y, weapon.terrain.height - 1)
            obj.setPosition(x, y)
            this.blast(weapon, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        //obj.setPosition(tank.x, tank.y)
        this.blast(weapon, true)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(255,51,153,0)'}, {relativePosition: 1, color: 'rgba(230,0,115,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 60 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 50, 60/50)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}




export class bigshot {
    constructor() {
        this.id = 1
        this.name = 'Big Shot'
        this.projectile = null
        this.logoCanvas = Logos.bigshot
    }

    reset = () => {
        this.projectile = null
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 20

        ctx.fillStyle = 'rgba(200,200,200,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        weapon.defaultUpdate(this.projectile)
    }

    onTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 20)
        var bounce = false
        
        while (weapon.terrain.getPixel(x, y).alpha !== 0) {
            prevX = x
            prevY = y
            x = x - Math.cos(obj.rotation)
            y = y - Math.sin(obj.rotation)

            maxCount--
            if (maxCount === 0) {
                x = initX
                y = initY
                return
            }
        }
        
        for (let tempX = prevX - 1; tempX <= prevX + 1; tempX++) {
            for (let tempY = prevY - 1; tempY <= prevY + 1; tempY++) {
                var pixel = weapon.terrain.getPixel(tempX, tempY)
                if (pixel.r === 230 && pixel.g === 0 && pixel.b === 230) {
                    bounce = true
                    break
                }
            }
            if (bounce) break
        }

        if (bounce && obj.bounceCount > 0) {
            this.onBounceHit(weapon, obj)
        }
        
        if (!bounce || obj.bounceCount <= 0) {
            y = Math.min(y, weapon.terrain.height - 1)
            obj.setPosition(x, y)
            this.blast(weapon)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        this.blast(weapon)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon) => {
        var grd = [{relativePosition: 0, color: 'rgba(255,0,0,0)'}, {relativePosition: 1, color: 'rgba(255,0,0,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 60, {thickness: 20, gradient: grd})
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 1)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}




export class threeshot {
    constructor() {
        this.id = 2
        this.name = '3 Shot'
        this.projectile = null
        this.logoCanvas = Logos.threeshot
    }

    reset = () => {
        this.projectile = null
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 20

        ctx.fillStyle = 'rgba(200,200,200,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        weapon.defaultUpdate(this.projectile)
    }

    onTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 20)
        var bounce = false
        
        while (weapon.terrain.getPixel(x, y).alpha !== 0) {
            prevX = x
            prevY = y
            x = x - Math.cos(obj.rotation)
            y = y - Math.sin(obj.rotation)

            maxCount--
            if (maxCount === 0) {
                x = initX
                y = initY
                return
            }
        }
        
        for (let tempX = prevX - 1; tempX <= prevX + 1; tempX++) {
            for (let tempY = prevY - 1; tempY <= prevY + 1; tempY++) {
                var pixel = weapon.terrain.getPixel(tempX, tempY)
                if (pixel.r === 230 && pixel.g === 0 && pixel.b === 230) {
                    bounce = true
                    break
                }
            }
            if (bounce) break
        }

        if (bounce && obj.bounceCount > 0) {
            this.onBounceHit(weapon, obj)
        }
        
        if (!bounce || obj.bounceCount <= 0) {
            y = Math.min(y, weapon.terrain.height - 1)
            obj.setPosition(x, y)
            this.blast(weapon)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        this.blast(weapon)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon) => {
        var grd = [{relativePosition: 0, color: 'rgba(255,0,0,0)'}, {relativePosition: 1, color: 'rgba(255,0,0,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 60, {thickness: 20, gradient: grd})
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 1)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}



