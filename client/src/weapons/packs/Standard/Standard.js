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
        this.logoCanvas = Logos.singleshot
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(120,0,0,1)'}, {relativePosition: 1, color: 'rgba(230,0,0,1)'}]
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

        console.log(Phaser.Math.Distance.Between(this.ix, this.iy, p1.x, p1.y))
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





