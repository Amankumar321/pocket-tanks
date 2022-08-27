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
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 46 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
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
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 90 - weapon.scene.tank1.hitRadius, {thickness: 16, gradient: grd}, true)
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
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 46 - weapon.tank.hitRadius, {thickness: 16, gradient: grd}, true)
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
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 46 - weapon.tank.hitRadius, {thickness: 16, gradient: grd}, true)
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
        ctx.arc(canvas.width/2, canvas.height/2, diameter/2, 0, Math.PI * 2)
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
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 26 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 26, 10/30)
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
        ctx.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI * 2)
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
        if (Math.abs(this.projectile.x - oppTank.x) < 20) {
            weapon.scene.physics.moveTo(this.projectile, oppTank.centre.x, oppTank.centre.y, this.projectile.body.speed)
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
        var grd = [{relativePosition: 0, color: 'rgba(255,51,153,0)'}, {relativePosition: 1, color: 'rgba(230,0,115,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 46 - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 46, 60/46)
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
        //obj.body.setVelocity(0)
        //obj.body.setGravityY(0)
        //this.blast(weapon, obj)
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
        // var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.01, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(100,30,0,1)'}, {relativePosition: 1, color: 'rgba(255,100,20,1)'}]
        // weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 46 - weapon.tank.hitRadius, {thickness: 16, gradient: grd}, true)
        // weapon.defaultUpdateScore(obj.x, obj.y, 46, 20/46)
        // var ctx = obj.canvas.getContext('2d')
        // ctx.fillStyle = 'rgba(255,255,255,1)'
        // ctx.fontStyle = '80px Geneva'
        // ctx.fillText(obj.relativeAngle.toString(), obj.canvas.width/2, obj.canvas.height/4)
        var sign = obj.relativeAngle > 0 ? '+' : ''
        var angleText = weapon.scene.add.text(obj.x, obj.y + 10, sign + obj.relativeAngle + String.fromCharCode(176))
        angleText.setOrigin(0.5, 0).setFont('14px Geneva')

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
            this.blast(weapon)
        }
    }

    onBaseHit = (weapon, obj) => {
        this.onTerrainHit(weapon, obj)
    }

    onTankHit = (weapon, obj, tank) => {
        obj.body.setVelocity(0)
        obj.body.setGravityY(0)
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
        
        for (let i = 0; i < this.blastCount; i++) {
            var blastRadius = (60) * (1 - i/this.blastCount)
            var x = Math.floor(this.projectile.x)
            var y = Math.floor(this.projectile.y) + i * 18
            weapon.terrain.blast(1, x, y, blastRadius - weapon.scene.tank1.hitRadius, {thickness: 15, gradient: grd}, blowTank)
            weapon.defaultUpdateScore(this.projectile.x, this.projectile.y + i * blastRadius/10, blastRadius, 30/blastRadius)
        }

        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}
