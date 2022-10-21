import Phaser, { Physics, Scene } from "phaser"
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

        ctx.fillStyle = 'rgba(150,220,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        weapon.updateTail(this.projectile, 15, 5, 4, {r: 100, g: 200, b: 250})
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
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 46 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd, blowPower: 200}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 46, 60/46)
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
        canvas.width = 40

        ctx.fillStyle = 'rgba(250,0,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        weapon.updateTail(this.projectile, 16, 4, 4, {r: 250, g: 0, b: 220}, true)
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
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 90 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 200}, true)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 90, 30/90)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}











export class threeshot {
    constructor() {
        this.id = 2
        this.name = '3 Shot'
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectiles = []
        this.logoCanvas = Logos.threeshot
    }

    reset = () => {
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectiles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        const makeProjectile = (index) => {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = 20
            canvas.width = 60
    
            ctx.fillStyle = 'rgba(150,220,255,1)'
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
    
            weapon.scene.textures.addCanvas('projectile-' + index, canvas);
    
            var projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + index)
            projectile.setDepth(3)
            projectile.bounceCount = 3
            projectile.canvas = canvas
            projectile.index = index
            return projectile
        }
        
        this.projectile1 = makeProjectile(1)
        this.projectile2 = makeProjectile(2)
        this.projectile3 = makeProjectile(3)
        this.projectiles.push(this.projectile1, this.projectile2, this.projectile3)

    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile1, undefined, undefined, undefined, weapon.tank.turret.rotation + Math.PI/36)
        weapon.defaultShoot(this.projectile2)
        weapon.defaultShoot(this.projectile3, undefined, undefined, undefined, weapon.tank.turret.rotation - Math.PI/36)
    }

    update = (weapon) => {
        this.projectiles.forEach(obj => {
            weapon.updateTail(obj, 15, 5, 4, {r: 100, g: 200, b: 250})
        })
        this.projectiles.forEach(obj => {
            weapon.defaultUpdate(obj)
        })
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
            this.blast(weapon, obj)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        this.blast(weapon, obj)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
        if (this.projectiles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(100,100,0,1)'}, {relativePosition: 1, color: 'rgba(255,255,0,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 46 - weapon.tank.hitRadius, {thickness: 16, gradient: grd, blowPower: 200}, true)
        weapon.defaultUpdateScore(obj.x, obj.y, 46, 20/46)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
        if (this.projectiles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }
}










export class fiveshot {
    constructor() {
        this.id = 3
        this.name = '5 Shot'
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectile4 = null
        this.projectile5 = null
        this.projectiles = []
        this.logoCanvas = Logos.fiveshot
    }

    reset = () => {
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectile4 = null
        this.projectile5 = null
        this.projectiles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        const makeProjectile = (index) => {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = 20
            canvas.width = 60
    
            ctx.fillStyle = 'rgba(150,220,255,1)'
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
    
            weapon.scene.textures.addCanvas('projectile-' + index, canvas);
    
            var projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + index)
            projectile.setDepth(3)
            projectile.bounceCount = 3
            projectile.canvas = canvas
            projectile.index = index
            return projectile
        }
        
        this.projectile1 = makeProjectile(1)
        this.projectile2 = makeProjectile(2)
        this.projectile3 = makeProjectile(3)
        this.projectile4 = makeProjectile(4)
        this.projectile5 = makeProjectile(5)
        this.projectiles.push(this.projectile1, this.projectile2, this.projectile3, this.projectile4, this.projectile5)

    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile1, undefined, undefined, undefined, weapon.tank.turret.rotation + 2 * Math.PI/36)
        weapon.defaultShoot(this.projectile2, undefined, undefined, undefined, weapon.tank.turret.rotation + Math.PI/36)
        weapon.defaultShoot(this.projectile3)
        weapon.defaultShoot(this.projectile4, undefined, undefined, undefined, weapon.tank.turret.rotation - Math.PI/36)
        weapon.defaultShoot(this.projectile5, undefined, undefined, undefined, weapon.tank.turret.rotation - 2 * Math.PI/36)
    }

    update = (weapon) => {
        this.projectiles.forEach(obj => {
            weapon.updateTail(obj, 15, 5, 4, {r: 100, g: 200, b: 250})
        })
        this.projectiles.forEach(obj => {
            weapon.defaultUpdate(obj)
        })
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
            this.blast(weapon, obj)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        this.blast(weapon, obj)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
        if (this.projectiles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(100,30,0,1)'}, {relativePosition: 1, color: 'rgba(255,100,20,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 46 - weapon.tank.hitRadius, {thickness: 16, gradient: grd, blowPower: 200}, true)
        weapon.defaultUpdateScore(obj.x, obj.y, 46, 20/46)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
        if (this.projectiles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }
}










export class jackhammer {
    constructor() {
        this.id = 4
        this.name = 'Jackhammer'
        this.projectile = null
        this.logoCanvas = Logos.jackhammer
        this.jumpCount = 4
        this.projectileDiameter = 7
        this.canvas = null
    }

    reset = () => {
        this.projectile = null
        this.jumpCount = 4
        this.projectileDiameter = 7
        this.canvas = null
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

        this.canvas = canvas
        this.drawProjectile(this.projectileDiameter)

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
        this.projectile.canvas = canvas
    }

    drawProjectile = (diameter = 6) => {
        var canvas = this.canvas
        var ctx = this.canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'rgba(150,220,255,1)'
        ctx.beginPath()
        ctx.fillRect(canvas.width/2, canvas.height/2 - diameter/2, diameter, diameter)
        ctx.closePath()
        ctx.fill()
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        weapon.updateTail(this.projectile, 18, 6, this.projectileDiameter, {r: 100, g: 200, b: 250})
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
        //obj.body.setVelocity(0)
        //obj.body.setGravityY(0)
        //obj.setPosition(tank.x, tank.y)
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

    blast = (weapon, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(255,51,153,0)'}, {relativePosition: 1, color: 'rgba(230,0,115,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 36 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 36, 10/36)
        if (this.jumpCount <= 0) {
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null
        }
        else {
            this.jumpCount--
            this.projectileDiameter--
            this.projectile.setVelocity(0, -200)
            this.drawProjectile(this.projectileDiameter)
        }
    }
}








export class heatseeker {
    constructor() {
        this.id = 5
        this.name = 'Heatseeker'
        this.projectile = null
        this.logoCanvas = Logos.heatseeker
        this.particles = []
    }

    reset = () => {
        this.projectile = null
        this.particles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 30
        canvas.width = 30

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.moveTo(5, 14)
        ctx.lineTo(15, 13)
        ctx.arc(canvas.width/2, canvas.height/2, 2, -Math.PI/2, Math.PI/2)
        ctx.lineTo(5, 16)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = 'rgba(220,0,0,1)'
        ctx.moveTo(5, 14)
        ctx.lineTo(12, 14)
        ctx.lineTo(5, 9)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(5, 16)
        ctx.lineTo(12, 16)
        ctx.lineTo(5, 21)
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
        //weapon.updateTail(this.projectile, 15, 5, 4, {r: 100, g: 200, b: 250})
        this.checkCloseToTank(weapon)
        weapon.defaultUpdate(this.projectile)
    }

    checkCloseToTank = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) < 200) {
            var targetAngle = Phaser.Math.Angle.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) + Math.PI;
            var diff = Phaser.Math.Angle.Wrap(targetAngle - this.projectile.body.velocity.angle())
            this.projectile.body.velocity.rotate(diff/10)
            this.releaseParticles(weapon)
        }
    }

    releaseParticles = (weapon) => {
        const spread = 10
        var particle, theta;

        for (let i = 0; i < this.projectile.body.speed/100; i++) {
            particle = weapon.scene.add.circle(this.projectile.x + spread * (Math.random() - 0.5), this.projectile.y + spread * (Math.random() - 0.5), 0.6, 0xeeeeee)
            theta = this.projectile.angle + (Math.random() > 0.5 ? 90 : -90)
            weapon.scene.tweens.add({
                targets: particle,
                x: particle.x + 20 * Math.cos(theta),
                y: particle.y + 20 * Math.sin(theta),
                alpha: 0.0,
                t: 1,
                ease: 'Linear',
                onComplete: () => {particle.destroy()}
            });
        }
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.4, color: 'rgba(120,0,0,1)'}, {relativePosition: 1, color: 'rgba(230,0,0,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 80 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd, blowPower: 200}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 80, 40/80)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}









export class tracer {
    constructor() {
        this.id = 6
        this.name = 'Tracer'
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectile4 = null
        this.projectile5 = null
        this.projectiles = []
        this.logoCanvas = Logos.fiveshot
    }

    reset = () => {
        this.projectile1 = null
        this.projectile2 = null
        this.projectile3 = null
        this.projectile4 = null
        this.projectile5 = null
        this.projectiles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        const makeProjectile = (index) => {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = 100
            canvas.width = 100
    
            ctx.fillStyle = 'rgba(180,180,180,1)'
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
    
            weapon.scene.textures.addCanvas('projectile-' + index, canvas);
    
            var projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + index)
            projectile.setDepth(3)
            projectile.bounceCount = 3
            projectile.canvas = canvas
            projectile.index = index
            projectile.relativeAngle = -10 + (index - 1) * 5
            return projectile
        }
        
        this.projectile1 = makeProjectile(1)
        this.projectile2 = makeProjectile(2)
        this.projectile3 = makeProjectile(3)
        this.projectile4 = makeProjectile(4)
        this.projectile5 = makeProjectile(5)
        this.projectiles.push(this.projectile1, this.projectile2, this.projectile3, this.projectile4, this.projectile5)

    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile1, undefined, undefined, undefined, weapon.tank.turret.rotation - 2 * Phaser.Math.DegToRad(5))
        weapon.defaultShoot(this.projectile2, undefined, undefined, undefined, weapon.tank.turret.rotation - Phaser.Math.DegToRad(5))
        weapon.defaultShoot(this.projectile3)
        weapon.defaultShoot(this.projectile4, undefined, undefined, undefined, weapon.tank.turret.rotation + Phaser.Math.DegToRad(5))
        weapon.defaultShoot(this.projectile5, undefined, undefined, undefined, weapon.tank.turret.rotation + 2 * Phaser.Math.DegToRad(5))
    }

    update = (weapon) => {
        this.projectiles.forEach(obj => {
            weapon.updateTail(obj, 40, 1, 1, {r: 180, g: 180, b: 180})
        })
        this.projectiles.forEach(obj => {
            weapon.defaultUpdate(obj)
        })
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
            this.blast(weapon, obj)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
   
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
        if (this.projectiles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj) => {
        obj.body.stop()
        obj.setGravity(0)
    
        var sign = obj.relativeAngle > 0 ? '+' : ''
        var angleText = weapon.scene.add.text(obj.x, obj.y + 10, sign + obj.relativeAngle + String.fromCharCode(176))
        angleText.setOrigin(0.5, 0.5).setFont('14px Geneva')

        setTimeout(() => {
            angleText.destroy()
            obj.destroy()
            weapon.scene.textures.remove(obj.texture.key)
            this.projectiles = this.projectiles.filter((ele) => { return ele.index !== obj.index })
            if (this.projectiles.length === 0) {
                weapon.turret.activeWeapon = null
            }
        }, 4000);
    }
}









export class piledriver {
    constructor() {
        this.id = 7
        this.name = 'Pile Driver'
        this.projectile = null
        this.logoCanvas = Logos.piledriver
        this.blastCount = 6
        this.blastRadius = [46, 38, 30, 22, 14, 6]
        this.blastDepth = [-14, 10, 30, 46, 58, 66]
    }

    reset = () => {
        this.blastCount = 6
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

        ctx.fillStyle = 'rgba(240,0,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        weapon.updateTail(this.projectile, 15, 5, 4, {r: 240, g: 0, b: 220})
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'},
                    {relativePosition: 0.01, color: 'rgba(0,0,0,1)'},
                    //{relativePosition: 0.2, color: 'rgba(100,0,80,1)'},
                    //{relativePosition: 0.4, color: 'rgba(180,0,160,1)'},
                    {relativePosition: 0.7, color: 'rgba(250,0,250,1)'},
                    {relativePosition: 0.8, color: 'rgba(250,200,250,1)'},
                    {relativePosition: 1, color: 'rgba(250,200,250,1)'}]
        var blastRadius, x, y, k = 0;

        const makeBlast = (i) => {
            blastRadius = this.blastRadius[i]
            x = Math.floor(this.projectile.x)
            y = Math.floor(this.projectile.y) + this.blastDepth[i]
            weapon.terrain.blast(1, x, y, blastRadius - weapon.scene.tank1.hitRadius, {thickness: 20, gradient: grd, blowPower: 30}, blowTank)
            weapon.defaultUpdateScore(x, y, blastRadius, 20/blastRadius)
        }

        makeBlast(k)
        var myInterval = setInterval(() => {
            k++
            makeBlast(k)
            if (k === this.blastCount) {
                clearInterval(myInterval)
            }
        }, 50);
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}










export class dirtmover {
    constructor() {
        this.id = 8
        this.name = 'Dirt Mover'
        this.projectile = null
        this.logoCanvas = Logos.dirtmover
        this.endPoints = []
        this.ix = 0
        this.iy = 0
    }

    reset = () => {
        this.projectile = null
        this.endPoints = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        var theta = Phaser.Math.DegToRad(weapon.turret.angle - 90)
        
        canvas.height = 26
        canvas.width = 200

        var grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
        grd.addColorStop(0, 'rgba(240,240,240,1)')
        grd.addColorStop(1, 'rgba(80,80,255,1)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
        this.projectile.canvas = canvas
        this.projectile.setRotation(weapon.turret.rotation)
        const pw = this.projectile.canvas.height/2
        var angle = Phaser.Math.Angle.Wrap(Phaser.Math.DegToRad(this.projectile.angle - 90))
        this.projectile.setPosition(weapon.tank.x - pw * Math.cos(angle), weapon.tank.y - pw * Math.sin(angle))

        const shape = weapon.scene.add.graphics();
        const smallW = 40;
        const bigW = 80;
        const h = 120
        shape.fillStyle(0xffffff, 0);
    
        shape.beginPath();
        shape.moveTo(-smallW/2, 0)
        shape.lineTo(-bigW/2, -h)
        shape.lineTo(bigW/2, -h)
        shape.lineTo(smallW/2, 0)
        shape.closePath()
        shape.fill()
        shape.setRotation(weapon.turret.rotation)
        
        shape.setPosition(weapon.tank.x - pw * Math.cos(angle), weapon.tank.y - pw * Math.sin(angle))
    
        const mask = shape.createGeometryMask();
        this.projectile.setMask(mask);

    }
    
    shoot = (weapon) => {
        const h = 120
        const smallW = 40;
        const bigW = 80;
        const pw = this.projectile.canvas.height/2
        var p1, p2, p3, p4;
        var angle = Phaser.Math.Angle.Wrap(Phaser.Math.DegToRad(this.projectile.angle))
        
        p1 = {x: weapon.tank.x - pw * Math.cos(angle - Math.PI/2) + (smallW/2) * Math.cos(angle), y: weapon.tank.y - pw * Math.sin(angle - Math.PI/2) + (smallW/2) * Math.sin(angle)}
        p2 = {x: weapon.tank.x - pw * Math.cos(angle - Math.PI/2) - (smallW/2) * Math.cos(angle), y: weapon.tank.y - pw * Math.sin(angle - Math.PI/2) - (smallW/2) * Math.sin(angle)}
        p3 = {x: weapon.tank.x + (h - pw) * Math.cos(angle - Math.PI/2) - (bigW/2) * Math.cos(angle), y: weapon.tank.y + (h - pw) * Math.sin(angle - Math.PI/2) - (bigW/2) * Math.sin(angle)}
        p4 = {x: weapon.tank.x + (h - pw) * Math.cos(angle - Math.PI/2) + (bigW/2) * Math.cos(angle), y: weapon.tank.y + (h - pw) * Math.sin(angle - Math.PI/2) + (bigW/2) * Math.sin(angle)}
        
        this.endPoints.push(p1, p2, p3, p4)
        this.ix = weapon.tank.x - pw * Math.cos(angle - Math.PI/2)
        this.iy = weapon.tank.y - pw * Math.sin(angle - Math.PI/2)
        
        var theta = Phaser.Math.DegToRad(weapon.turret.angle - 90)
        weapon.scene.tweens.add({
            targets: this.projectile,
            x: this.projectile.x + h * Math.cos(theta),
            y: this.projectile.y + h * Math.sin(theta),
            duration: 800,
            ease: 'Linear',
        });
        
        setTimeout(() => {
            this.projectile.destroy();
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null;
            weapon.terrain.fixTerrainShape(this.endPoints)
        }, 800);
    }

    update = (weapon) => {
        const smallW = 40;
        const bigW = 80;
        const h = 120;
        const pw = this.projectile.canvas.height
        var angle = Phaser.Math.Angle.Wrap(Phaser.Math.DegToRad(this.projectile.angle))
        
        var p1 = {x: this.projectile.x, y: this.projectile.y}
        var p2 = {x: this.projectile.x + pw/2 * Math.cos(angle - Math.PI/2), y: this.projectile.y + pw/2 * Math.sin(angle - Math.PI/2)}

        if (Phaser.Math.Distance.Between(this.ix, this.iy, p2.x, p2.y) > h) return
        //weapon.terrain.setPixel(p1.x - pw/2 * Math.cos(angle + Math.PI/2), p1.y - pw/2 * Math.sin(angle + Math.PI/2), 255,0,0,255)
        var k1 = Math.min(Phaser.Math.Distance.Between(this.ix, this.iy, p1.x, p1.y) / h, 1)
        var k2 = Math.min(Phaser.Math.Distance.Between(this.ix, this.iy, p2.x, p2.y) / h, 1)

        var w1 = smallW * (1 - k1) + bigW * k1
        var w2 = smallW * (1 - k2) + bigW * k2

        var ctx = weapon.terrain.canvas.getContext('2d')
        ctx.globalCompositeOperation = 'destination-out'
    
        ctx.fillStyle = 'rgba(0,0,0,1)'
        
        ctx.beginPath();
        ctx.moveTo(p1.x + (w1/2) * Math.cos(angle), p1.y + (w1/2) * Math.sin(angle))
        ctx.lineTo(p2.x + (w2/2) * Math.cos(angle), p2.y + (w2/2) * Math.sin(angle))
        ctx.lineTo(p2.x - (w2/2) * Math.cos(angle), p2.y - (w2/2) * Math.sin(angle))
        ctx.lineTo(p1.x - (w1/2) * Math.cos(angle), p1.y - (w1/2) * Math.sin(angle))

        ctx.closePath()
        ctx.fill()

        weapon.terrain.update()
    }
}






export class crazyivan {
    constructor() {
        this.id = 9
        this.name = 'Crazy Ivan'
        this.projectile = null
        this.logoCanvas = Logos.crazyivan
        this.particles = []
        this.dissipated = false
    }

    reset = () => {
        this.projectile = null
        this.particles = []
        this.dissipated = false
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 40

        ctx.fillStyle = 'rgba(120,100,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        if (this.dissipated === false) {
            weapon.updateTail(this.projectile, 18, 4, 4, {r: 120, g: 100, b: 255}, true)
            this.checkCloseToTank(weapon)
            if (this.dissipated === false)
                weapon.defaultUpdate(this.projectile)
        }
        else {
            this.particles.forEach(e => {
                this.updateParticleMotion(weapon, e)
                weapon.updateTail(e, 14, 4, 2, {r: 220, g: 200, b: 255}, true)
                weapon.defaultUpdate(e)
            })
        }
    }

    checkCloseToTank = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) < 160) {
            var targetAngle = Phaser.Math.Angle.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) + Math.PI;
            var diff = Phaser.Math.Angle.Wrap(targetAngle - this.projectile.body.velocity.angle())
            var i = 0;

            for (let delta = diff - Math.PI/2; delta <= diff + Math.PI/2; delta += Math.PI/12) {
                this.createParticle(weapon, delta, i)
                i++
            }

            this.projectile.destroy()
            weapon.scene.textures.remove(this.projectile.texture.key)
            this.dissipated = true
        }
    }

    createParticle = (weapon, delta, index) => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 60

        ctx.fillStyle = 'rgba(220,200,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile-' + this.particles.length, canvas);

        var particle = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + this.particles.length)
        particle.setDepth(3)
        particle.bounceCount = 3
        particle.canvas = canvas

        particle.setPosition(this.projectile.body.x, this.projectile.y)
        var v = this.projectile.body.velocity.clone().setLength(200).rotate(delta)
        particle.body.setVelocity(v.x, v.y)
        particle.setGravityY(300)

        this.particles.push(particle)
    }
    
    updateParticleMotion = (weapon, particle) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        var targetAngle = Phaser.Math.Angle.Between(oppTank.x, oppTank.y, particle.x, particle.y) + Math.PI;
        var diff = Phaser.Math.Angle.Wrap(targetAngle - particle.body.velocity.angle())
        var k = Phaser.Math.Distance.Between(particle.x, particle.y, oppTank.x, oppTank.y)

        particle.body.velocity.rotate(diff/100)
    
        if (k > 100 && k < 105) {
            particle.body.velocity.rotate(diff * 2)
            particle.body.velocity.setAngle(Phaser.Math.Clamp(particle.body.velocity.angle(), 0, Math.PI))
        }
        
        if (k > 40 && k < 45) {
            particle.body.velocity.rotate(diff * 3)
            particle.body.velocity.setAngle(Phaser.Math.Clamp(particle.body.velocity.angle(), 0, Math.PI))
        }
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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        this.blast(weapon, obj, true)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (this.dissipated === false) {
            weapon.turret.activeWeapon = null
        }
        else {
            this.particles = this.particles.filter(ele => {
                return ele !== obj
            })

            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,0.4)'}, {relativePosition: 0.4, color: 'rgba(120,120,0,1)'}, {relativePosition: 1, color: 'rgba(255,255,0,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 36 - weapon.scene.tank1.hitRadius, {thickness: 18, gradient: grd, blowPower: 50}, blowTank)
        weapon.defaultUpdateScore(obj.x, obj.y, 36, 20/36)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)

        if (this.dissipated === false) {
            weapon.turret.activeWeapon = null
        }
        else {
            this.particles = this.particles.filter(ele => {
                return ele !== obj
            })


            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }
}











export class spider {
    constructor() {
        this.id = 10
        this.name = 'Spider'
        this.projectile = null
        this.logoCanvas = Logos.spider
        this.particles = []
        this.dissipated = false
        this.particleCount = 0
    }

    reset = () => {
        this.projectile = null
        this.particles = []
        this.dissipated = false
        this.particleCount = 0
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 40

        ctx.fillStyle = 'rgba(200,200,200,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2.5, 0, Math.PI * 2)
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
        if (this.dissipated === false) {
            weapon.updateTail(this.projectile, 18, 4, 5, {r: 200, g: 200, b: 200}, false)
            this.checkCloseToTank(weapon)
            if (this.dissipated === false)
                weapon.defaultUpdate(this.projectile)
        }
        else {
            this.particles.forEach(e => {
                //weapon.updateTail(e, 12, 50, 2, {r: e.red, g: e.green, b: e.blue}, false)
                weapon.defaultUpdate(e)
            })
        }
    }

    checkCloseToTank = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) < 160) {
            var targetAngle = Phaser.Math.Angle.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) + Math.PI;
            var diff = Phaser.Math.Angle.Wrap(targetAngle - this.projectile.body.velocity.angle())
            var vx = this.projectile.body.velocity.x
            var angle = Phaser.Math.Angle.Wrap(Phaser.Math.Angle.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) + Math.PI);

            if ((vx > 0 && targetAngle < Math.PI/2 && targetAngle > 0) || (vx < 0 && targetAngle > Math.PI/2 && targetAngle < Math.PI)) {
                var i = 0;
                var minAngle = (vx > 0 ? 0 : Math.PI/2)
                var maxAngle = (vx > 0 ? Math.PI/2 : Math.PI)
                var step = Math.PI/40
                var delta1 = minAngle
                var delta2 = minAngle + step
                var delta3 = minAngle + 2 * step
                var x = this.projectile.x
                var y = this.projectile.y
                
                this.dissipated = true
                this.projectile.destroy()
                weapon.scene.textures.remove(this.projectile.texture.key)

                setTimeout(() => {
                    while (delta1 <= maxAngle) {
                        this.createParticle(weapon, delta1, x, y)
                        delta1 = delta1 + 3 * step
                    }
                }, 20);
                setTimeout(() => {
                    while (delta2 <= maxAngle) {
                        this.createParticle(weapon, delta2, x, y)
                        delta2 = delta2 + 3 * step
                    }
                }, 200);
                setTimeout(() => {
                    while (delta3 <= maxAngle) {
                        this.createParticle(weapon, delta3, x, y)
                        delta3 = delta3 + 3 * step
                    }
                }, 400);
            }

        }
    }

    createParticle = (weapon, delta, x, y) => {
        this.particleCount++
        var index = this.particleCount
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 1
        canvas.width = 200

        var colorType = 0

        if (Math.random() > 0.5) {
            var grd = ctx.createLinearGradient(0,0,canvas.width/2,0)
            grd.addColorStop(0, 'rgba(100,100,100,0)')
            grd.addColorStop(1, 'rgba(100,100,100,1)')
            ctx.fillStyle = grd
            colorType = 1
        }
        else {
            var grd = ctx.createLinearGradient(0,0,canvas.width/2,0)
            grd.addColorStop(0, 'rgba(220,220,220,0)')
            grd.addColorStop(1, 'rgba(220,220,220,1)')
            ctx.fillStyle = grd
            colorType = 2
        }

        ctx.fillRect(0, 0, canvas.width/2, canvas.height)

        weapon.scene.textures.addCanvas('projectile-' + index, canvas);

        var particle = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + index)
        particle.setDepth(3)
        particle.bounceCount = 3
        particle.canvas = canvas
        particle.scaleX = 1/100

        particle.setPosition(x, y)
        var v = new Phaser.Math.Vector2(1,1).setLength(50).setAngle(delta)
        particle.body.setVelocity(v.x, v.y)

        particle.tween1 = weapon.scene.tweens.add({
            targets: particle.body.velocity,
            x: particle.body.velocity.x * 3,
            y: particle.body.velocity.y * 3,
            ease: 'Linear',
            duration: 2000,
            yoyo: false,
            repeat: 0,
        })

        particle.tween2 = weapon.scene.tweens.add({
            targets: particle,
            scaleX: 1,
            ease: 'Linear',
            duration: 2000,
            yoyo: false,
            repeat: 0,
        })

        this.particles.push(particle)

        if (colorType === 1) {
            particle.red = 200
            particle.green = 200
            particle.blue = 200
        }
        else {
            particle.red = 220
            particle.green = 220
            particle.blue = 220
        }
    }
    
    onTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 10)
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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        //obj.body.setVelocity(0)
        //obj.body.setGravityY(0)
        this.blast(weapon, obj, true)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (this.dissipated === false) {
            weapon.turret.activeWeapon = null
        }
        else {
            this.particles = this.particles.filter(ele => {
                return ele !== obj
            })

            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,0.4)'}, {relativePosition: 0.4, color: 'rgba(140,50,30,0.9)'}, {relativePosition: 1, color: 'rgba(255,110,80,1)'}]
        
        if (this.dissipated === false) {
            weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 80 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 200}, blowTank)
            weapon.defaultUpdateScore(obj.x, obj.y, 80, 20/80)
            obj.destroy()
            weapon.scene.textures.remove(obj.texture.key)
            weapon.turret.activeWeapon = null
        }
        else {
            weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 28 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 30}, blowTank)
            weapon.defaultUpdateScore(obj.x, obj.y, 28, 20/28)
            obj.destroy()
            weapon.scene.textures.remove(obj.texture.key)

            this.particles = this.particles.filter(ele => {return ele !== obj})
            obj.tween1.stop()
            obj.tween2.stop()

            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }
}










export class sniperrifle {
    constructor() {
        this.id = 11
        this.name = 'Sniper Rifle'
        this.projectile = null
        this.logoCanvas = Logos.sniperrifle
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

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
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
        weapon.updateTail(this.projectile, 15, 5, 2, {r: 220, g: 220, b: 220})
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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        var score = (tank === weapon.tank) ? -100 : 100
        weapon.constantUpdateScore(score)
        this.blast(weapon, obj, true)
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

    blast = (weapon, obj, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 1, color: 'rgba(220,220,220,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 1, {thickness: 0, gradient: grd, blowPower: 300}, blowTank)
        var vec = new Phaser.Math.Vector2(1,1)

        for (let index = 0; index < 200; index++) {
            var particle = weapon.scene.add.circle(this.projectile.x, this.projectile.y, 1, 0xffffff, 255) 
            vec.setAngle(Math.PI * 2 * Math.random())
            vec.setLength(Math.pow(Math.random(),2) * 60)
            var t = Math.random() * 1000 + 800
            weapon.scene.tweens.add({
                targets: particle,
                duration: t,
                ease: 'Quad.easeOut',
                x: particle.x + vec.x,
                y: particle.y + vec.y
            })    
            weapon.scene.tweens.add({
                targets: particle,
                duration: t,
                ease: 'Quad.easeOut',
                alpha: 0,
                onComplete: () => { particle.destroy(true) }
            })            
        }

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}












export class magicwall {
    constructor() {
        this.id = 12
        this.name = 'Magic Wall'
        this.projectile = null
        this.logoCanvas = Logos.magicwall
        this.groundHit = false
    }

    reset = () => {
        this.projectile = null
        this.groundHit = false
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

        ctx.fillStyle = 'rgba(150,100,50,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        if (this.groundHit === false) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 150, g: 100, b: 50})
            weapon.defaultUpdate(this.projectile)
        }
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
            this.blast(weapon, obj, true)
            this.groundHit = true
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
       //
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

    blast = (weapon, obj, blowTank = false) => {
        const h = 140
        const w = 8

        var emitter = weapon.scene.add.container()
        var shape = {h: 0, w: 8}
        var vec = new Phaser.Math.Vector2(1,1)

        emitter.emit = () => {
            for (let index = 0; index < 2; index++) {
                var particle = weapon.scene.add.circle(shape.w * (Math.random() - 0.5), 0, 0.8, 0x0099ff, 255) 
                emitter.add(particle)
                vec.setAngle(Math.PI * 2 * Math.random())
                vec.setLength(Math.random() * 30)
                var t = Math.random() * 500 + 800
                weapon.scene.tweens.add({
                    targets: particle,
                    duration: t,
                    x: particle.x + vec.x,
                    y: particle.y + vec.y,
                    ease: 'Quad.easeOut',
                    alpha: 0,
                    onComplete: () => {
                        emitter.remove(particle)
                        particle.destroy(true)
                    }
                })  
                weapon.scene.tweens.add({
                    targets: particle,
                    duration: t,
                    ease: 'Quad.easeIn',
                    alpha: 0,
                })           
            }
        }

        var ctx = weapon.terrain.getContext('2d')
        var g = ctx.createLinearGradient(obj.x, obj.y - h, obj.x, obj.y)
        g.addColorStop(0, 'rgba(120,190,0,1)')
        g.addColorStop(1, 'rgba(120,50,20,1)')
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = g
        
        weapon.scene.tweens.add({
            targets: shape,
            h: h,
            duration: 3000,
            onUpdate: () => {
                ctx.fillRect(obj.x - w/2, obj.y - shape.h, w, shape.h) 
                emitter.setPosition(obj.x, obj.y - shape.h)
                emitter.emit()
            },
            onComplete: () => {
                weapon.terrain.update()
                var p1 = {x: obj.x - w/2 - 1, y: obj.y - 1}
                var p2 = {x: obj.x - w/2 - 1, y: obj.y + 1}
                var p3 = {x: obj.x + w/2 + 1, y: obj.y + 1}
                var p4 = {x: obj.x + w/2 + 1, y: obj.y - 1}
                weapon.terrain.fixTerrainShape([p1, p2, p3, p4, p1])
                weapon.turret.activeWeapon = null
            }
        })

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
    }
}










export class dirtslinger {
    constructor() {
        this.id = 13
        this.name = 'Dirt Slinger'
        this.projectile = null
        this.logoCanvas = Logos.dirtslinger
        this.groundHit = false
    }

    reset = () => {
        this.projectile = null
        this.groundHit = false
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

        ctx.fillStyle = 'rgba(250,200,0,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        if (this.groundHit === false) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 250, g: 200, b: 0})
            weapon.defaultUpdate(this.projectile)
        }
    }

    onTerrainHit = (weapon, obj) => {
        this.groundHit = true

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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
       //
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

    blast = (weapon, obj, blowTank = false) => {
        const h = 90
        const w = 120
        const x = obj.x
        const y = obj.y

        var shape = {h: 0, w: 0}
        var vec1 = new Phaser.Math.Vector2(1,1)
        var vec2 = new Phaser.Math.Vector2(1,1)
   
        var ctx = weapon.terrain.getContext('2d')
        var g = ctx.createLinearGradient(obj.x, obj.y - h, obj.x, obj.y)
        g.addColorStop(0, 'rgba(230,190,130,1)')
        g.addColorStop(1, 'rgba(120,50,20,1)')
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = g
        
        weapon.scene.tweens.add({
            targets: shape,
            h: h,
            w: w,
            duration: 2000,
            onUpdate: () => {
                vec1.set(shape.w/2, shape.h)
                vec2.set(-shape.w/2, shape.h)
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(x + vec1.length() * Math.cos(vec1.angle()), y - vec1.length() * Math.sin(vec1.angle()))
                ctx.lineTo(x + vec2.length() * Math.cos(vec2.angle()), y -  vec2.length() * Math.sin(vec2.angle())) 
                ctx.closePath()
                ctx.fill()
            },
            onComplete: () => {
                weapon.terrain.update()
                var p1 = {x: x, y: y + 4}
                var p2 = {x: x + vec1.length() * Math.cos(vec1.angle()) + 4, y: y - vec1.length() * Math.sin(vec1.angle()) - 4}
                var p3 = {x: x + vec2.length() * Math.cos(vec2.angle()) - 4, y: y - vec2.length() * Math.sin(vec2.angle()) - 4}
                var p4 = {x: x, y: y + 4}
                weapon.terrain.fixTerrainShape([p1, p2, p3, p4, p1])
                weapon.turret.activeWeapon = null
            }
        })

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
    }
}











export class zapper {
    constructor() {
        this.id = 14
        this.name = 'Zapper'
        this.projectile = null
        this.logoCanvas = Logos.zapper
        this.zapped = false
    }

    reset = () => {
        this.projectile = null
        this.zapped = false
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 60

        ctx.fillStyle = 'rgba(0,230,80,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        if (this.zapped === false) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 0, g: 230, b: 80})
            this.checkCloseToTank(weapon)
            if (this.zapped === false)
                weapon.defaultUpdate(this.projectile)
        }
    }

    checkCloseToTank = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        var dist = Phaser.Math.Distance.Between(oppTank.centre.x, oppTank.centre.y, this.projectile.x, this.projectile.y)
        if (dist < 80) {
            var targetAngle = Phaser.Math.Angle.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) + Math.PI;
            
            var g = weapon.scene.add.rectangle(this.projectile.x, this.projectile.y, 2, dist, 0xffe066, 255)
            g.setOrigin(0, 0)
            g.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Wrap(targetAngle)) - 90)
            weapon.scene.tweens.add({
                targets: g,
                duration: 200,
                loop: 4,
                alpha: 0,
                onComplete: () => {
                    g.destroy(true)
                    weapon.turret.activeWeapon = null
                }
            })

            var vec = new Phaser.Math.Vector2(1,1)
            for (let index = 0; index < 100; index++) {
                var particle = weapon.scene.add.circle(oppTank.centre.x, oppTank.centre.y, 1, 0xffe066, 255) 
                vec.setAngle(Math.PI * 2 * Math.random())
                vec.setLength(Math.random() * 40)
                var t = Math.random() * 400 + 1500
                weapon.scene.tweens.add({
                    targets: particle,
                    duration: t,
                    ease: 'Quad.easeOut',
                    x: particle.x + vec.x,
                    y: particle.y + vec.y
                })    
                weapon.scene.tweens.add({
                    targets: particle,
                    duration: t,
                    ease: 'Quad.easeOut',
                    alpha: 0,
                    onComplete: () => { particle.destroy(true) }
                })            
            }
            //var score = (tank === weapon.tank) ? -40 : 40
            weapon.constantUpdateScore(40)

            this.projectile.destroy()
            weapon.scene.textures.remove(this.projectile.texture.key)
            this.zapped = true
        }   
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.4, color: 'rgba(120,80,0,1)'}, {relativePosition: 1, color: 'rgba(230,160,0,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 40 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd, blowPower: 50}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 40, 40/40)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}












export class napalm {
    constructor() {
        this.id = 15
        this.name = 'Napalm'
        this.projectile = null
        this.logoCanvas = Logos.napalm
        this.particles = []
        this.dissipated = false
    }

    reset = () => {
        this.projectile = null
        this.dissipated = false
        this.particles = []
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

        ctx.fillStyle = 'rgba(0,120,250,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 0
        this.projectile.canvas = canvas
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        if (this.dissipated === false) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 0, g: 120, b: 250}, true)
            weapon.defaultUpdate(this.projectile)
            if (this.projectile !== null)
                this.checkCloseToTerrain(weapon, this.projectile)
        }
        else {
            this.particles.forEach(p => {
                if (p.body !== undefined)
                    weapon.defaultUpdate(p)
            })
        }
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
            this.particleTerrainHit(weapon, obj)
        }
    }

    checkCloseToTerrain = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var maxCount = 20
        
        while (weapon.terrain.getPixel(x, y).alpha === 0) {
            prevX = x
            prevY = y
            x = x + Math.cos(obj.rotation)
            y = y + Math.sin(obj.rotation)

            maxCount--
            if (maxCount === 0) {
                return
            }
        }

        if (x >= weapon.terrain.width - 1 || x <= 0) {
            return
        }

        this.dissipated = true
        this.blast(weapon, this.projectile)
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
       //
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (obj === this.projectile) {
            weapon.turret.activeWeapon = null
        }
        else {
            obj.smokeEmitter.remove()
            this.particles = this.particles.filter(p => { return p === obj })
            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj, blowTank = false) => {
        for (let i = 0; i < 20; i++) {
            var angle = 2 * Math.PI * (i/20 - 0.5)
            this.createParticle(weapon, angle, i)
        }

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')

        weapon.scene.tweens.add({
            targets: this.projectile,
            duration: 600,
            t: 1,
            loop: 7,
            onLoop: () => {
                var points1 = 0
                var points2 = 0
                var temp
                var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
                this.particles.forEach(ele => {
                    temp = Phaser.Math.Distance.BetweenPoints(ele, weapon.tank)
                    points1 += (temp < weapon.tank.hitRadius*2) ? weapon.tank.hitRadius*2/(temp + 1) : 0
                })
                setTimeout(() => {
                    weapon.constantUpdateScore(Math.floor(-points1)) 
                }, 600*Math.random());

                this.particles.forEach(ele => {
                    temp = Phaser.Math.Distance.BetweenPoints(ele, oppTank)
                    points2 += (temp < weapon.tank.hitRadius*2) ? weapon.tank.hitRadius*2/(temp + 1) : 0
                })
                setTimeout(() => {
                    weapon.constantUpdateScore(Math.floor(points2)) 
                }, 600*Math.random());
            },
        })
    }

    createParticle = (weapon, angle, index) => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 20
        canvas.width = 80

        var g = ctx.createLinearGradient(canvas.width/2, 0, canvas.width/2, canvas.height)
        g.addColorStop(0, 'rgba(250,180,50,0)')
        g.addColorStop(0.5, 'rgba(250,180,50,0.1)')
        g.addColorStop(1, 'rgba(250,180,50,0)')

        ctx.fillStyle = 'rgba(250,180,50,0.5)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('particle-' + index, canvas);
        var p = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'particle-' + index)
        p.body.velocity.set(1,1).setLength(80).setAngle(angle)
        p.setGravityY(200)
        p.setDepth(3)
        p.bounceCount = 0
        p.canvas = canvas
        p.tweens = []
        this.projectile.setAlpha(Math.random())
        this.particles.push(p)

        setTimeout(() => {
            weapon.scene.tweens.add({
                targets: p,
                duration: 600,
                loop: 7,
                alpha: 0,
                onComplete: () => {
                    p.destroy(true)
                    p.smokeEmitter.remove()
                    this.particles = this.particles.filter(particle => { return particle === p })
                    if (this.particles.length === 0)
                        weapon.turret.activeWeapon = null
                }
            })
            
            canvas = document.createElement('canvas')
            ctx = canvas.getContext('2d')
            
            canvas.height = 4
            canvas.width = 4

            ctx.fillStyle = 'rgba(250,180,50,1)'
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()

            weapon.scene.textures.addCanvas('smoke', canvas)
            var smokeEmitter = weapon.scene.add.particles('smoke').createEmitter({
                x: p.x,
                y: p.y,
                speed: 20,
                angle: { min: 180, max: 360 },
                scale: { start: 1, end: 3},
                alpha: { start: 0.05, end: 0},
                lifespan: 1500,
                //active: false
            });

            smokeEmitter.reserve(100);
            p.smokeEmitter = smokeEmitter

            weapon.scene.tweens.add({
                targets: smokeEmitter,
                duration: 100,
                t: 1,
                loop: -1,
                onLoop: () => {
                    if (p.body === undefined || p.body.speed === 0) {
                        var beta = Phaser.Math.RadToDeg(weapon.terrain.getSlope(p.x, p.y))
                        smokeEmitter.setAngle({min: beta, max: beta - 180})
                    }
                    else {
                        smokeEmitter.setAngle({min: (360 - p.body.velocity.angle()) - 90, max: (360 - p.body.velocity.angle()) + 90})
                    }
                    smokeEmitter.setPosition(p.x, p.y)
                }
            })
            
        }, Math.random() * 500);
    }

    particleTerrainHit = (weapon, particle) => {
        particle.setVelocity(0)
        particle.stop()
        particle.setGravity(0)
    } 
}
















export class hailstorm {
    constructor() {
        this.id = 16
        this.name = 'Hail Storm'
        this.projectile = null
        this.ballsArray = []
        this.ballsCount = 30
        this.ballRadius = 5
        this.timer = null
        this.logoCanvas = Logos.hailstorm
        this.outOfBoundCount = 0
    }

    reset = () => {
        this.projectile = null
        this.ballsArray = []
        this.timer = null
        this.outOfBoundCount = 0
    }

    create = (weapon) => {
        this.reset()

        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 10
        canvas.width = 80

        ctx.fillStyle = 'rgba(100,255,255,1)'
        ctx.globalAlpha = 1.0
        
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);
        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.canvas = canvas
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }    

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    onTerrainHit = (weapon, obj) => {
        if (this.projectile !== null) {
            var x = this.projectile.x
            var y = this.projectile.y
            var prevX = x, prevY = y;
            var initX = x, initY = y;
            var maxCount = Math.ceil(obj.body.speed / 20);
            var bounce = false

            while (weapon.terrain.getPixel(x, y).alpha !== 0) {
                prevX = x
                prevY = y
                x = x - Math.cos(this.projectile.rotation)
                y = y - Math.sin(this.projectile.rotation)

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
                this.onBounceHit(weapon, this.projectile)
            }
        
            if (!bounce || obj.bounceCount <= 0) {
                this.projectile.setPosition(x, Math.min(y, weapon.terrain.height - 1))
                this.dissociate(weapon)
            }
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (obj === this.projectile)
            weapon.turret.activeWeapon = null
    }

    update = (weapon) =>  {
        if (this.projectile !== null) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 100, g: 255, b: 255})
            weapon.defaultUpdate(this.projectile)
        }
        
        if (this.projectile === null) {
            this.ballsArray.forEach(ball => {
                if (ball.body !== undefined)
                    this.ballUpdate(weapon, ball)
            })
        }
        if (this.outOfBoundCount >= this.ballsCount) {
            this.ballsArray.forEach(e => {
                e.destroy()
                weapon.scene.textures.remove(e.texture.key)
            })
            weapon.turret.activeWeapon = null
        }
    }

    dissociate = (weapon) => {
        for (let index = 0; index < this.ballsCount; index++) {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = this.ballRadius * 2
            canvas.width = this.ballRadius * 2

            var grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, this.ballRadius)
            grd.addColorStop(0, 'rgba(0,220,255,1)')
            grd.addColorStop(0.4, 'rgba(0,220,255,0.5)')
            grd.addColorStop(1, 'rgba(0,220,255,0)')

            ctx.fillStyle = grd
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            weapon.scene.textures.addCanvas('ball-' + index, canvas);
            var ball = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'ball-' + index)
            ball.setPosition(this.projectile.x, this.projectile.y)
            ball.canvas = canvas
            ball.setDepth(3)
            ball.setBounce(1,1)
            ball.visible = false
            ball.body.setSize(this.ballRadius/3, this.ballRadius/3, this.ballRadius/2, this.ballRadius/2)
            this.ballsArray.push(ball)
        }

        this.projectile.destroy()
        weapon.scene.textures.remove(this.projectile.texture.key)
        this.projectile = null

        this.timer = weapon.scene.time.addEvent({delay: 100, callback: this.spawnBall, callbackScope: this, repeat: this.ballsCount});

        weapon.scene.physics.add.collider(this.ballsArray, this.ballsArray)
        
        weapon.scene.tweens.add({
            targets: this.ballsArray,
            loop: 15,
            t: 1,
            duration: 600,
            onLoop: () => {
                var points1 = 0
                var points2 = 0
                var temp
                var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
                this.ballsArray.forEach(ele => {
                    if (ele.visible) {
                        temp = Phaser.Math.Distance.BetweenPoints(ele, weapon.tank)
                        if (temp !== NaN) 
                            points1 += (temp < weapon.tank.hitRadius*2) ? weapon.tank.hitRadius*1.2/(temp + 1) : 0
                    }
                })
                setTimeout(() => {
                    weapon.constantUpdateScore(Math.floor(-points1)) 
                }, 600*Math.random());

                this.ballsArray.forEach(ele => {
                    if (ele.visible) {
                        temp = Phaser.Math.Distance.BetweenPoints(ele, oppTank)
                        if (temp !== NaN) 
                            points2 += (temp < weapon.tank.hitRadius*2) ? weapon.tank.hitRadius*1.2/(temp + 1) : 0
                    }
                })
                setTimeout(() => {
                    weapon.constantUpdateScore(Math.floor(points2)) 
                }, 600*Math.random()); 
            }
        })

        setTimeout(() => {
            this.removeBalls(weapon)
        }, 7000);
    }

    spawnBall = () => {
        var velocities = [5, -10, 3, -8, -16, 9, 3, -7, 4, -2, 6, 17, -3, 12, 8, 6, -19, -4, -7, 14, -2, 6, 7, -13, 2, 18, 12, -7, 5, 8, -1]
        var idx;

        var found = this.ballsArray.find((ball, index) => {
            idx = index
            return ball.visible === false
        })

        if (found) {
            found.visible = true
            found.setGravityY(150)
            found.setVelocityY(-36)
            found.setDragX(0.8)
            found.setVelocityX(velocities[idx])
        }
    }

    removeBalls = (weapon) => {
        var removeBall = () => {
            var found = this.ballsArray.find((ball) => {
                return (ball.visible === true)
            })
    
            if (found) {
                found.visible = false
                found.setGravityY(0)
                found.setVelocity(0)
                found.setDragX(0)
                weapon.scene.textures.remove(found.texture.key)
            }
            else {
                this.ballsArray.forEach(e => { e.destroy() })
                weapon.turret.activeWeapon = null
            }
        } 

        this.timer = weapon.scene.time.addEvent({delay: 100, callback: removeBall, callbackScope: this, repeat: this.ballsCount});
    }
    
    ballUpdate = (weapon, ball) => {
        if (ball.visible === false) return
        
        var rotation = 0
        if (ball.body.velocity.x !== 0) {
            rotation = Math.atan(ball.body.velocity.y / ball.body.velocity.x)
    
            if (ball.body.velocity.x < 0) {
                rotation = rotation + Math.PI
            }
        }
        else {
            if (ball.body.velocity.y < 0) {
                rotation = -Math.PI/2
            }
            if (ball.body.velocity.y >= 0) {
                rotation = Math.PI/2
            }
        }

        var x = ball.x + this.ballRadius/2 * Math.cos(rotation)
        var y = ball.y + this.ballRadius/2 * Math.sin(rotation)
        var initX = x, initY = y;
        var prevX, prevY;
        var limit = 10
        

        if (weapon.terrain.getPixel(x, y).alpha !== 0) {
            while (weapon.terrain.getPixel(x, y).alpha !== 0) {
                prevX = x
                prevY = y
                ball.x = ball.x - Math.cos(rotation)
                ball.y = ball.y - Math.sin(rotation)
                x = ball.x + this.ballRadius * Math.cos(rotation)
                y = ball.y + this.ballRadius * Math.sin(rotation)
                
                limit--
                if (limit === 0) {
                    ball.x = initX
                    ball.y = initY
                    break
                }
            }
            
            var points = weapon.terrain.getNeighbouringPoints(prevX, prevY, 7)
            var angle = weapon.terrain.getSlope(prevX, prevY, 7) + Math.PI/2
            
            ball.setVelocityX(ball.body.velocity.x - Math.cos(angle) * 22)
            ball.setVelocityY((-32 + 6 * Math.random())* Math.sin(angle))

            if (ball.x <= 0 || ball.x >= weapon.scene.terrain.width - 1) {
                this.outOfBoundCount++
                ball.setVisible(false)
            }
        }
    }
}













export class groundhog {
    constructor() {
        this.id = 17
        this.name = 'Ground Hog'
        this.projectile = null
        this.insideTerrain = false
        this.prevState = null
        this.logoCanvas = Logos.groundhog
        this.destroyed = false
    }

    reset = () => {
        this.projectile = null
        this.insideTerrain = false
        this.destroyed = false
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 12
        canvas.width = 60

        ctx.fillStyle = 'rgba(150,100,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 - 2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 + 2, 1.5, 0, Math.PI * 2)
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
        this.prevState = {x: this.projectile.x, y: this.projectile.y}
    }

    update = (weapon) => {
        if (this.insideTerrain === false) {
            weapon.updateTail(this.projectile, 15, 5, 3, {r: 150, g: 100, b: 255})
        }
        else {
            var canvas = this.projectile.canvas
            var ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        weapon.defaultUpdate(this.projectile)
        this.digTerrain(weapon)
        this.checkOutsideTerrain(weapon)
    }

    digTerrain = (weapon) => {
        if (this.projectile !== null)
            weapon.defaultDigTerrain(this.projectile, 3, 0.2)
    }

    onTerrainHit = (weapon) => {
        this.insideTerrain = true
        this.projectile.setGravityY(0)
    }

    onBaseHit = (weapon) => {
        var x = this.projectile.x, y = this.projectile.y;
        while (y >= weapon.terrain.height - 1) {
            x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
            y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
        }
        this.blast(weapon)
    }

    onTankHit = (weapon, obj, tank) => {
        this.blast(weapon)
    }

    onBounceHit = (weapon, obj) => {
        
    }

    checkOutsideTerrain = (weapon) => {
        if (this.insideTerrain === true) {
            var x = this.projectile.x, y = this.projectile.y;
            if (weapon.terrain.getPixel(x, y).alpha === 0) {
                while (weapon.terrain.getPixel(x, y).alpha === 0) {
                    x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
                    y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
                }
                this.blast(weapon)
            }
        }
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    blast = (weapon) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.3, color: 'rgba(150,0,80,1)'}, {relativePosition: 1, color: 'rgba(255,0,100,1)'}]
        if (this.destroyed !== true) {
            this.destroyed = true
            weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 70 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd, blowPower: 100}, true)
            weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 70, 50/70)
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null
        }
    }
}











export class worm {
    constructor() {
        this.id = 18
        this.name = 'Worm'
        this.projectile = null
        this.insideTerrain = false
        this.prevState = null
        this.logoCanvas = Logos.worm
        this.destroyed = false
    }

    reset = () => {
        this.projectile = null
        this.insideTerrain = false
        this.destroyed = false
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 12
        canvas.width = 60

        ctx.fillStyle = 'rgba(150,100,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 - 2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 + 2, 1.5, 0, Math.PI * 2)
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
        this.prevState = {x: this.projectile.x, y: this.projectile.y}
    }

    update = (weapon) => {
        if (this.insideTerrain === false) {
            weapon.updateTail(this.projectile, 15, 5, 3, {r: 150, g: 100, b: 255})
        }
        else {
            var canvas = this.projectile.canvas
            var ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        weapon.defaultUpdate(this.projectile)
        this.digTerrain(weapon)
        this.checkOutsideTerrain(weapon)
    }

    digTerrain = (weapon) => {
        if (this.projectile !== null)
            weapon.defaultDigTerrain(this.projectile, 3, 0.2)
    }

    onTerrainHit = (weapon) => {
        this.insideTerrain = true
        this.projectile.setGravityY(-300)
    }

    onBaseHit = (weapon) => {
        var x = this.projectile.x, y = this.projectile.y;
        while (y >= weapon.terrain.height - 1) {
            x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
            y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
        }
        this.blast(weapon)
    }

    onTankHit = (weapon, obj, tank) => {
        this.blast(weapon)
    }

    onBounceHit = (weapon, obj) => {
        
    }

    checkOutsideTerrain = (weapon) => {
        if (this.insideTerrain === true) {
            var x = this.projectile.x, y = this.projectile.y;
            if (weapon.terrain.getPixel(x, y).alpha === 0) {
                while (weapon.terrain.getPixel(x, y).alpha === 0) {
                    x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
                    y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
                }
                this.blast(weapon)
            }
        }
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    blast = (weapon) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.3, color: 'rgba(0,20,100,1)'}, {relativePosition: 1, color: 'rgba(150,100,255,1)'}]
        if (this.destroyed !== true) {
            this.destroyed = true
            weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 60 - weapon.scene.tank1.hitRadius, {thickness: 12, gradient: grd, blowPower: 100}, true)
            weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 50/60)
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null
        }
    }
}













export class homingworm {
    constructor() {
        this.id = 19
        this.name = 'Homing Worm'
        this.projectile = null
        this.insideTerrain = false
        this.prevState = null
        this.logoCanvas = Logos.homingworm
        this.destroyed = false
    }

    reset = () => {
        this.projectile = null
        this.insideTerrain = false
        this.destroyed = false
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 12
        canvas.width = 60

        ctx.fillStyle = 'rgba(150,100,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 - 2, 1.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2 + 2, 1.5, 0, Math.PI * 2)
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
        this.prevState = {x: this.projectile.x, y: this.projectile.y}
    }

    update = (weapon) => {
        if (this.insideTerrain === false) {
            weapon.updateTail(this.projectile, 15, 5, 3, {r: 150, g: 100, b: 255})
        }
        else {
            var canvas = this.projectile.canvas
            var ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        weapon.defaultUpdate(this.projectile)
        this.digTerrain(weapon)
        this.checkUnderTank(weapon)
        this.checkOutsideTerrain(weapon)
    }

    digTerrain = (weapon) => {
        if (this.projectile !== null)
            weapon.defaultDigTerrain(this.projectile, 3, 0.2)
    }

    onTerrainHit = (weapon) => {
        this.insideTerrain = true
        this.projectile.setGravityY(-300)
    }

    onBaseHit = (weapon) => {
        var x = this.projectile.x, y = this.projectile.y;
        while (y >= weapon.terrain.height - 1) {
            x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
            y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
        }
        this.blast(weapon)
    }

    onTankHit = (weapon, obj, tank) => {
        this.blast(weapon)
    }

    onBounceHit = (weapon, obj) => {
        
    }

    checkUnderTank = (weapon) => {
        if (this.insideTerrain === true && this.destroyed === false) {
            var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
            if (Phaser.Math.Distance.BetweenPoints(oppTank, this.projectile) < 200) {
                if (Math.abs(oppTank.x - this.projectile.x) < 10) {
                    this.projectile.body.velocity.setAngle(-Math.PI/2)
                }
            }
        }
    }

    checkOutsideTerrain = (weapon) => {
        if (this.insideTerrain === true) {
            var x = this.projectile.x, y = this.projectile.y;
            if (weapon.terrain.getPixel(x, y).alpha === 0) {
                while (weapon.terrain.getPixel(x, y).alpha === 0) {
                    x = this.projectile.x = this.projectile.x - Math.cos(this.projectile.rotation)
                    y = this.projectile.y = this.projectile.y - Math.sin(this.projectile.rotation)
                }
                this.blast(weapon)
            }
        }
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
    }

    blast = (weapon) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.3, color: 'rgba(50,0,100,1)'}, {relativePosition: 1, color: 'rgba(100,0,200,1)'}]
        if (this.destroyed !== true) {
            this.destroyed = true
            weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 46 - weapon.scene.tank1.hitRadius, {thickness: 14, gradient: grd, blowPower: 100}, true)
            weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 46, 30/46)
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null
        }
    }
}













export class skipper {
    constructor() {
        this.id = 20
        this.name = 'Skipper'
        this.projectile = null
        this.logoCanvas = Logos.skipper
        this.bounce = 3
    }

    reset = () => {
        this.projectile = null
        this.bounce = 3
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

        ctx.fillStyle = 'rgba(150,220,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        weapon.updateTail(this.projectile, 13, 5, 4, {r: 100, g: 200, b: 250}, false)
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

        if (this.bounce > 0) {
            this.skipperBounce(weapon, obj)
            this.bounce--
            bounce = true
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

    skipperBounce = (weapon, obj) => {
        if (this.bounce < 0) return
            weapon.defaultBounce(obj)
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.3, color: 'rgba(50,50,0,1)'}, {relativePosition: 1, color: 'rgba(240,240,20,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 52 - weapon.scene.tank1.hitRadius, {thickness: 14, gradient: grd, blowPower: 100}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 52, 40/52)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}














export class chainreaction {
    constructor() {
        this.id = 21
        this.name = 'Chain Reaction'
        this.projectile = null
        this.logoCanvas = Logos.chainreaction
        this.emitter1 = null
        this.emitter2 = null
    }

    reset = () => {
        this.projectile = null
        this.emitter1 = null
        this.emitter2 = null
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 10
        canvas.width = 10

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 0.5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 0
        this.projectile.canvas = canvas

        canvas = document.createElement('canvas')
        ctx = canvas.getContext('2d')
        
        canvas.height = 10
        canvas.width = 10

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('chainparticle', canvas);

        this.emitter1 = weapon.scene.add.particles('chainparticle').createEmitter({
            alpha: { start: 0.4, end: 0.1},
            speed: 5,
            scale: 0.8,
            lifespan: 350,
        })

        this.emitter1.reserve(100)
        this.emitter1.startFollow(this.projectile)

        this.emitter2 = weapon.scene.add.particles('chainparticle').createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 2.5 },
            lifespan: 250,
        })

        this.emitter2.reserve(5).setFrequency(100)
        this.emitter2.startFollow(this.projectile)
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        this.updateTail(weapon)
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
        if (this.emitter1 !== null) this.emitter1.stop()
        if (this.emitter2 !== null) this.emitter2.stop()
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    updateTail = (weapon) => {
        
    } 

    blast = (weapon, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.1, color: 'rgba(50,0,0,0)'}, {relativePosition: 0.4, color: 'rgba(100,0,0,1)'}, {relativePosition: 1, color: 'rgba(255,0,0,1)'}]
        var arr = [{x: -2, y: -4}, {x: 20, y: 16}, {x: -42, y: -12}, {x: 30, y: 16}, {x: -52, y: 10}, {x: -50, y: 6}, {x: 12, y: -20}, {x: 32, y: -16}, {x: 18, y: 34},
            {x: -40, y: -12}, {x: -2, y: 36}, {x: 54, y: 20}, {x: -24, y: -14}, {x: 20, y: -10}, {x: 46, y: 26}]

        var i = 0;
        var offx, offy

        offx = arr[i].x
        offy = arr[i].y
        weapon.terrain.blast(1, Math.floor(this.projectile.x) + offx, Math.floor(this.projectile.y) + offy, 46 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 50}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x + offx, this.projectile.y + offy, 46, 20/46)
        i++

        const createBlast = () => {
            offx = arr[i].x
            offy = arr[i].y
            weapon.terrain.blast(1, Math.floor(this.projectile.x) + offx, Math.floor(this.projectile.y) + offy, 46 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 50}, blowTank)
            weapon.defaultUpdateScore(this.projectile.x + offx, this.projectile.y + offy, 46, 20/46)
            i++
        }

        var timer = weapon.scene.time.addEvent({delay: 200, callback: createBlast, callbackScope: this, repeat: arr.length - 2});

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
        if (this.emitter1 !== null) this.emitter1.stop()
        if (this.emitter2 !== null) this.emitter2.stop()
    }
}


















export class pineapple {
    constructor() {
        this.id = 22
        this.name = 'Pineapple'
        this.projectile = null
        this.logoCanvas = Logos.pineapple
        this.particles = []
        this.maxParticles = 20
        this.dissociated = false
    }

    reset = () => {
        this.projectile = null
        this.particles = []
        this.dissociated = false
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

        var g = ctx.createRadialGradient(canvas.width/4, canvas.height/2, 0, canvas.width/4, canvas.height/2, canvas.width)
        g.addColorStop(0, 'rgba(255,255,255,1)')
        g.addColorStop(0.3, 'rgba(240,240,240,1)')
        g.addColorStop(0.6, 'rgba(100,100,100,1)')
        g.addColorStop(1, 'rgba(0,0,0,1)')

        ctx.fillStyle = g
        ctx.arc(canvas.width/2, canvas.height/2, 4, 0, Math.PI * 2)
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
        if (this.dissociated === false) {
            this.checkCloseToTank(weapon)
            if (this.projectile !== null)
                weapon.defaultUpdate(this.projectile)
        }
        else {
            this.particles.forEach(p => {
                weapon.updateTail(p, 15, 5, 2, {r: 0, g: 230, b: 80})
                weapon.defaultUpdate(p)
            })
        }
    }

    checkCloseToTank = (weapon) => {
        if (this.dissociated === true) return
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) < 200) {
            this.dissociate(weapon)
        }
    }

    dissociate = (weapon) => {
        for (let i = 0; i < this.maxParticles; i++) {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = 10
            canvas.width = 40

            ctx.fillStyle = 'rgba(0,230,80,1)'
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
            
            weapon.scene.textures.addCanvas('particle-' + i, canvas);
            var particle = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'particle-' + i)
            particle.setDepth(3)
            particle.bounceCount = 3
            particle.canvas = canvas    
            weapon.defaultShoot(particle, 160, undefined, {x: this.projectile.x, y: this.projectile.y}, Math.PI * 2 * (i / this.maxParticles))

            this.particles.push(particle)
        }

        weapon.scene.textures.remove('projectile')
        this.projectile.destroy()
        this.projectile = null
        this.dissociated = true
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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
        //obj.setPosition(tank.x, tank.y)
        this.blast(weapon, obj, true)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (obj === this.projectile) {
            weapon.turret.activeWeapon = null
        }
        else {
            this.particles = this.particles.filter(ele => { return obj !== ele })
            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj, blowTank = false) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(50,50,0,1)'}, {relativePosition: 0.4, color: 'rgba(100,100,0,1)'}, {relativePosition: 1, color: 'rgba(240,2400,0,1)'}]
        if (obj === this.projectile) {
            weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 80 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd, blowPower: 100}, blowTank)
            weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 80, 40/80)
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
            weapon.turret.activeWeapon = null
        }
        else {
            weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 20 - weapon.scene.tank1.hitRadius, {thickness: 12, gradient: grd, blowPower: 50, optimize: true}, blowTank)
            weapon.defaultUpdateScore(obj.x, obj.y, 20, 30/20)
            this.particles = this.particles.filter(ele => { return obj !== ele })
            obj.destroy()
            weapon.scene.textures.remove(obj.texture.key)
            if (this.particles.length === 0)
                weapon.turret.activeWeapon = null
        }
    }
}

















export class firecracker {
    constructor() {
        this.id = 23
        this.name = 'Firecracker'
        this.projectile = null
        this.logoCanvas = Logos.firecracker
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
        
        canvas.height = 10
        canvas.width = 50

        ctx.fillStyle = 'rgba(240,0,0,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 0
        this.projectile.canvas = canvas
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        weapon.updateTail(this.projectile, 15, 4, 4, {r: 240, g: 0, b: 0})
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
        const totalBlast = 20
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.1, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.4, color: 'rgba(100,30,20,1)'}, {relativePosition: 1, color: 'rgba(255,150,50,1)'}]
        var arrRightX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        var arrRightY = [-1,-2,3,4,-12,2,-4,2,-6,14,-14,2,-8,8,7,-13,2,0,-4,2]

        var arrLeftX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        var arrLeftY = [2,-12,-4,0,7,15,3,-12,-2,6,-4,12,-14,4,8,-1,-13,7,2,-3]

        var i = 0;
        var offx, offy

        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 24 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 50, optimize: true}, false)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 24, 5/24)

        const createBlast = () => {
            offx = -7*i + arrLeftX[i]
            offy = arrLeftY[i]
            console.log(i)
            weapon.terrain.blast(1, Math.floor(this.projectile.x) + offx, Math.floor(this.projectile.y) + offy, 24 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 50, optimize: true}, false)
            weapon.defaultUpdateScore(this.projectile.x + offx, this.projectile.y + offy, 24, 5/24)
            offx = 7*i + arrRightX[i]
            offy = arrRightY[i]
            weapon.terrain.blast(1, Math.floor(this.projectile.x) + offx, Math.floor(this.projectile.y) + offy, 24 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 50, optimize: true}, false)
            weapon.defaultUpdateScore(this.projectile.x + offx, this.projectile.y + offy, 24, 5/24)
            i++
        }

        var timer = weapon.scene.time.addEvent({delay: 100, callback: createBlast, callbackScope: this, repeat: totalBlast - 1});

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}
















export class homingmissile {
    constructor() {
        this.id = 24
        this.name = 'Homing Missile'
        this.projectile = null
        this.logoCanvas = Logos.homingmissile
        this.particles = []
    }

    reset = () => {
        this.projectile = null
        this.particles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 30
        canvas.width = 30

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.moveTo(5, 14)
        ctx.lineTo(15, 13)
        ctx.arc(canvas.width/2, canvas.height/2, 2, -Math.PI/2, Math.PI/2)
        ctx.lineTo(5, 16)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = 'rgba(220,0,0,1)'
        ctx.moveTo(5, 14)
        ctx.lineTo(12, 14)
        ctx.lineTo(5, 9)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(5, 16)
        ctx.lineTo(12, 16)
        ctx.lineTo(5, 21)
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
        //weapon.updateTail(this.projectile, 15, 5, 4, {r: 100, g: 200, b: 250})
        this.checkAboveTank(weapon)
        weapon.defaultUpdate(this.projectile)
    }

    checkAboveTank = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, this.projectile.x, this.projectile.y) < 400) {
            if (Math.abs(oppTank.x - this.projectile.x) < 10) {
                this.projectile.body.velocity.setAngle(Math.PI/2)
            }
        }
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(20,0,100,0.8)'}, {relativePosition: 0.3, color: 'rgba(50,20,150,1)'}, {relativePosition: 0.6, color: 'rgba(100,80,180,1)'}, {relativePosition: 0.9, color: 'rgba(170,170,220,1)'}, {relativePosition: 1, color: 'rgba(200,200,255,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 60 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 80}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 20/60)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}

















export class dirtball {
    constructor() {
        this.id = 25
        this.name = 'Dirtball'
        this.projectile = null
        this.logoCanvas = Logos.dirtball
        this.groundHit = false
    }

    reset = () => {
        this.projectile = null
        this.groundHit = false
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

        ctx.fillStyle = 'rgba(250,220,180,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
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
        if (this.groundHit === false) {
            weapon.updateTail(this.projectile, 15, 5, 4, {r: 250, g: 220, b: 180})
            weapon.defaultUpdate(this.projectile)
        }
    }

    onTerrainHit = (weapon, obj) => {
        this.groundHit = true

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
            this.blast(weapon, obj, true)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
       //
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

    blast = (weapon, obj, blowTank = false) => {
        // var ctx = weapon.terrain.getContext('2d')
        // ctx.globalCompositeOperation = 'destination-over'
        // ctx.fillStyle = 'rgba(230,190,130,1)'
        var x, y;
        var vec = new Phaser.Math.Vector2(1,1)
        var dist = {currentLength: 0}
        var points = []
        var base, diff, finalDiff, pixel;
        const projX = Math.floor(this.projectile.x)
        const projY = Math.floor(this.projectile.y)
        
        weapon.scene.tweens.add({
            targets: dist,
            duration: 1500,
            currentLength: 70,
            t: 1,
            onUpdate: () => {
                vec.setLength(dist.currentLength)
                for (let angle = 0; angle < 2*Math.PI; angle = angle + 0.03) {
                    vec.setAngle(angle);
                    x = Math.floor(projX + vec.x)
                    y = Math.floor(projY + vec.y)
                    if (x <= 0 || x >= weapon.terrain.width - 1) continue
                    if (y < 0 || y >= weapon.terrain.height) continue
                    if (weapon.terrain.getPixel(x, y).alpha < 100) {
                        weapon.terrain.setPixel(x, y, 180, 100, 50, 110 + 2*dist.currentLength)
                        //points.push({x: x, y: y})
                    }
                }
            },
            onComplete: () => {
                weapon.terrain.update()
                for (let i = 0; i < 140; i++) {
                    for (let j = 0; j < 140; j++) {
                        pixel = weapon.terrain.getPixel(projX - 70 + i, projY - 70 + j)
                        if (pixel.alpha >= 100) {
                            pixel = weapon.terrain.getPixel(projX - 70 + i, projY - 70 + j + 1)
                            if (pixel.alpha < 100)
                                points.push({x: projX - 70 + i, y: projY - 70 + j, toRemove: false})
                        }
                    }
                }
                
                const tween = weapon.scene.tweens.add({
                    targets: points,
                    duration: 30,
                    loop: -1,
                    length: 0,
                    t: 1,
                    onLoop: () => {
                        points.forEach(p => {
                            pixel = weapon.terrain.getPixel(p.x, p.y + 1)
                            if (pixel.alpha < 100) {
                                var count = -1
                                pixel = weapon.terrain.getPixel(p.x, p.y)
                                weapon.terrain.setPixel(p.x, p.y + 1, pixel.r, pixel.g, pixel.b, pixel.alpha)
                                while (pixel.alpha !== 0) {
                                    pixel = weapon.terrain.getPixel(p.x, p.y + count)
                                    weapon.terrain.setPixel(p.x, p.y + count + 1, pixel.r, pixel.g, pixel.b, pixel.alpha)
                                    count--
                                }
                                p.y++
                            }
                            else {
                                p.toRemove = true
                            }
                        })
                        points = points.filter(p => { return p.toRemove === false })
                        weapon.terrain.update()
                    },
                })

                var myInterval = setInterval(() => {
                    if (points.length === 0) {
                        tween.stop(0)
                        weapon.turret.activeWeapon = null
                        clearInterval(myInterval)
                    }
                }, 500);
            }
        })

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
    }
}















export class tommygun {
    constructor() {
        this.id = 26
        this.name = 'Tommy Gun'
        this.particles = []
        this.particleCount = 12
        this.logoCanvas = Logos.tommygun
    }

    reset = () => {
        this.particles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        for (let i = 0; i < this.particleCount; i++) {
            this.makeTexture(weapon, i)
        }
    }

    makeTexture = (weapon, index) => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        
        canvas.height = 10
        canvas.width = 40

        ctx.fillStyle = 'rgba(200,220,255,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile-' + index, canvas);
    }

    shoot = (weapon) => {
        const vOffset = [0, 12, -3, 4, -8, 6, 2, 0, -4, -13, 5, -1]
        const aOffset = [0, -3, 4, 6, -1, 0, 2, 5, -3.5, 4.5, -1.5, 2]
        var i = 0;

        var myInterval = setInterval(() => {
            var projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile-' + i)
            projectile.setDepth(3)
            projectile.bounceCount = 3
            projectile.canvas = projectile.texture.canvas
            projectile.index = i
            this.particles.push(projectile)
            weapon.defaultShoot(projectile, weapon.tank.power * weapon.powerFactor + vOffset[i], undefined, undefined, weapon.tank.turret.rotation + Phaser.Math.DegToRad(aOffset[i]))
            i++
            if (i === this.particleCount) {
                clearInterval(myInterval)
            }
        }, 100);
    }

    update = (weapon) => {
        this.particles.forEach(obj => {
            weapon.updateTail(obj, 24, 3, 2, {r: 180, g: 200, b: 255})
        })
        this.particles.forEach(obj => {
            weapon.defaultUpdate(obj)
        })
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
            this.blast(weapon, obj)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        //obj.body.setVelocity(0)
        //obj.body.setGravityY(0)
        this.blast(weapon, obj)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.particles = this.particles.filter((ele) => { return ele.index !== obj.index })
        if (this.particles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, obj) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(50,50,150,1)'}, {relativePosition: 0.6, color: 'rgba(50,50,255,1)'}, {relativePosition: 0.7, color: 'rgba(230,240,255,1)'}, {relativePosition: 1, color: 'rgba(230,240,255,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 16 - weapon.tank.hitRadius, {thickness: 12, gradient: grd, blowPower: 30}, true)
        weapon.defaultUpdateScore(obj.x, obj.y, 16, 20/16)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        this.particles = this.particles.filter((ele) => { return ele.index !== obj.index })
        if (this.particles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }
}












export class mountainmover {
    constructor() {
        this.id = 27
        this.name = 'Mountain Mover'
        this.logoCanvas = Logos.mountainmover
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
        
        weapon.scene.textures.addCanvas('projectile', canvas);
        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.canvas = canvas
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile, 0, 0, undefined, undefined)
        this.blast(weapon)
    }

    update = (weapon) => {
        
    }

    onTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 20);
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
            this.projectile.setPosition(x, Math.min(y, weapon.terrain.height - 1))
            this.blast(weapon)   
        }
        

    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
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
        var grd1 = [{relativePosition: 0, color: 'rgba(100,100,100,1)'}, {relativePosition: 0.5, color: 'rgba(200,200,200,1)'}, {relativePosition: 1, color: 'rgba(250,250,250,1)'}]
        //var grd = []
        //grd.concat(grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1)
        var circles = [grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1, grd1]

        weapon.terrain.blast(3, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 160, {thickness: 10, circles: circles})
        //weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 1)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        setTimeout(() => {
            weapon.turret.activeWeapon = null
        }, 1000);
    }
}












export class scattershot {
    constructor() {
        this.id = 28
        this.name = 'Scatter Shot'
        this.particles = []
        this.destroyed = false
        this.projectile = null
        this.maxParticles = 5
        this.logoCanvas = Logos.scattershot
    }

    reset = () => {
        this.particles = []
        this.destroyed = false
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

        ctx.fillStyle = 'rgba(255,0,100,1)'
        ctx.globalAlpha = 1.0
        
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);
        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.canvas = canvas
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        if (this.destroyed === false) {
            weapon.updateTail(this.projectile, 20, 4, 4, {r: 255, g: 0, b: 100})
            weapon.defaultUpdate(this.projectile)
        }
        else {
            this.particles.forEach((particle) => {
                weapon.updateTail(particle, 30, 4, 2, {r: 255, g: 0, b: 100})
                weapon.defaultUpdate(particle)
            })
        }
    }

    onTerrainHit = (weapon, obj) => {
        if (!this.destroyed) {
            var x = obj.x
            var y = obj.y
            var prevX = x, prevY = y;
            var initX = x, initY = y;
            var maxCount = Math.ceil(obj.body.speed / 20);
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
                this.dissociate(weapon)
                this.destroyed = true
                obj.destroy()
                weapon.scene.textures.remove('projectile')
            }
        }

        else {
            this.particleOnTerrainHit(weapon, obj)
        }
        //weapon.turret.activeWeapon = null
    }

    onBaseHit = (weapon, obj) => {
        if (!this.destroyed) {
            this.onTerrainHit(weapon, obj)
        }
        else {
            this.particleOnTerrainHit(weapon, obj)
        }
    }

    onTankHit = (weapon, obj, tank) => {
        if (!this.destroyed) {
            var x = this.projectile.x
            var y = this.projectile.y
            this.projectile.setVelocity(0, 0)
            this.projectile.setGravityY(0)

            this.projectile.setPosition(x, Math.min(y, weapon.terrain.height - 1))
            
            this.dissociate(weapon)
            this.destroyed = true
            
            this.projectile.destroy()
            weapon.scene.textures.remove('projectile')
        }

        else {
            this.blast(weapon, obj, true)
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    /**
    * @param {Weapon} weapon 
    */
    dissociate = (weapon) => {
        for (let index = 0; index < this.maxParticles; index++) {            
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')

            canvas.height = 10
            canvas.width = 20

            ctx.fillStyle = 'rgba(255,240,30,1)'
            ctx.globalAlpha = 1.0
            
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, 1, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
            
            weapon.scene.textures.addCanvas('projectile-' + index, canvas);
            
            var particle = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'projectile-' + index)
            particle.canvas = canvas
            particle.index = index
            particle.setDepth(3)
            particle.bounceCount = 3
            this.particles.push(particle)

            var spreadAngle = Math.PI/6
            var angle = - (spreadAngle/2)
            var delta = spreadAngle/Math.floor(this.maxParticles)
            weapon.defaultShoot(particle, 250, 300, {x: this.projectile.x, y: this.projectile.y}, angle + index * delta)

        }
    }

    particleOnTerrainHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var prevX = x, prevY = y;
        var initX = x, initY = y;
        var maxCount = Math.ceil(obj.body.speed / 20);
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
            this.blast(weapon, obj, true)
        }
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        if (obj === this.projectile) {
            weapon.turret.activeWeapon = null
        }
        else {
            this.particles = this.particles.filter((ele) => {
                return (ele.index !== obj.index) 
            })
            
            if (this.particles.length === 0) {
                weapon.turret.activeWeapon = null
            }
        }
    }

    blast = (weapon, obj, blowTank) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.1, color: 'rgba(50,0,0,0)'}, {relativePosition: 0.4, color: 'rgba(100,0,0,1)'}, {relativePosition: 1, color: 'rgba(255,0,0,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 36, {thickness: 14, gradient: grd, blowPower: 30}, true)
        weapon.defaultUpdateScore(obj.x, obj.y, 36, 10/36)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key);
        this.particles = this.particles.filter((ele) => {
            return (ele.index !== obj.index) 
        })
        
        if (this.particles.length === 0) {
            weapon.turret.activeWeapon = null
        }
    }
}














export class cruiser {
    constructor() {
        this.id = 29
        this.name = 'Cruiser'
        this.projectile = null
        this.logoCanvas = Logos.cruiser
        this.rolling = false
        this.rollingRight = false
        this.destroyed = false
        this.tail = null
    }

    reset = () => {
        this.projectile = null
        this.rolling = false
        this.rollingRight = false
        this.destroyed = false
        this.tail = null
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

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 0
        this.projectile.canvas = canvas
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        if (this.rolling === false) {
            weapon.updateTail(this.projectile, 12, 5, 4, {r: 240, g: 240, b: 240})
            weapon.defaultUpdate(this.projectile)
        }
        else {
            this.roll(weapon)
        }
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
            if (this.projectile.body.velocity.x > 0) {
                this.rollingRight = true
            }
            obj.stop()
            obj.setVelocity(0)
            obj.setAcceleration(0)
            obj.setGravity(0)
            var base = weapon.terrain.getSurfaceUp(obj.x, obj.y)
            obj.setPosition(base.x, base.y)
            this.rolling = true
            this.makeRollingTexture(weapon)
            
            setTimeout(() => {
                this.blast(weapon, true)
            }, 2000);
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        this.blast(weapon, true)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        weapon.turret.activeWeapon = null
        this.destroyed = true
        if (this.tail !== null) {
            this.tail.destroy()
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    blast = (weapon, blowTank = false) => {
        if (this.destroyed === true) return
        this.destroyed = true
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.1, color: 'rgba(50,0,0,20)'}, {relativePosition: 0.4, color: 'rgba(100,0,40,1)'}, {relativePosition: 1, color: 'rgba(255,0,100,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 80 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd, blowPower: 100}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 80, 60/80)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
        if (this.tail !== null) {
            this.tail.destroy()
        }
    }

    roll = (weapon) => {
        var next, base, delta
        var base = weapon.terrain.getSurfaceUp(this.projectile.x, this.projectile.y)
        this.projectile.setPosition(base.x, base.y)

        if (this.rollingRight === true) {
            next = weapon.terrain.getRightGround(this.projectile.x, this.projectile.y)
            delta = Math.PI/8
            if (next !== null)
                this.projectile.setPosition(next.x, next.y)
        }
        else {
            next = weapon.terrain.getLeftGround(this.projectile.x, this.projectile.y)
            delta = -Math.PI/8
            if (next !== null)
                this.projectile.setPosition(next.x, next.y)
        }

        this.tail.setPosition(this.projectile.x, this.projectile.y)
        var alpha = weapon.terrain.getSlope(this.projectile.x, this.projectile.y)
        var correction = (this.rollingRight === true) ? 0 : Math.PI
        this.tail.setRotation(alpha + correction)
        this.projectile.setRotation(this.projectile.rotation + delta)

        var x = this.projectile.x
        var y = this.projectile.y
        if (x <= 0 || x >= weapon.scene.terrain.width - 1) {
            this.onOutOfBound(weapon, this.projectile)
        }
        
        var tank1 = weapon.scene.tank1
        var tank2 = weapon.scene.tank2
        var dist1 = Math.sqrt(Math.pow((tank1.x - x), 2) + Math.pow((tank1.y - y), 2)) 
        var dist2 = Math.sqrt(Math.pow((tank2.x - x), 2) + Math.pow((tank2.y - y), 2))
        
        if (dist1 < tank1.hitRadius) {
            this.blast(weapon, true)
        }

        else if (dist2 < tank2.hitRadius) {
            this.blast(weapon, true)
        }
    }

    makeRollingTexture = (weapon) => {
        var canvas = this.projectile.texture.canvas
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'rgba(240,240,240,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2 + 2, canvas.height/2, 1.2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.arc(canvas.width/2 - 2, canvas.height/2, 1.2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        canvas = document.createElement('canvas')
        ctx = canvas.getContext('2d')
        canvas.width = 40
        canvas.height = 20

        var grd = ctx.createLinearGradient(canvas.width, canvas.height/2, 0, canvas.width/2)
        grd.addColorStop(0, 'rgba(240,240,240,1)')
        grd.addColorStop(1, 'rgba(240,240,240,0)')

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.ellipse(canvas.width/2 - 8, canvas.height/2, 8, 2, 0, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        
        weapon.scene.textures.addCanvas('cruiser-tail', canvas)
        this.tail = weapon.scene.add.sprite(0, 0, 'cruiser-tail')
    }
}






