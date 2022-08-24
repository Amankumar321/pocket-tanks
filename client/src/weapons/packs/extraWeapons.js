import Phaser, { Physics } from "phaser"
import { Weapon } from "../../classes/Weapon"
import * as Logos from "./Standard/logos"


export class bigshot {
    constructor() {
        this.id = 0
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
        obj.setVelocity(0)
        obj.setGravityY(0)
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





export class pineapple {
    constructor() {
        this.id = 1
        this.name = 'Pineapple'
        this.particles = []
        this.destroyed = false
        this.projectile = null
        this.maxParticles = 6
        this.logoCanvas = Logos.pineapple
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

        ctx.fillStyle = 'rgba(255,240,30,1)'
        ctx.globalAlpha = 1.0
        
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 3, 0, Math.PI * 2)
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
            weapon.updateTail(this.projectile, 20, 5, 6, {r: 255, g: 240, b: 30})
            weapon.defaultUpdate(this.projectile)
        }
        else {
            this.particles.forEach((particle) => {
                weapon.updateTail(particle, 30, 6, 4, {r: 255, g: 240, b: 30})
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
            //this.particleOnTerrainHit(weapon, obj)
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
            ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
            
            weapon.scene.textures.addCanvas('projectile-' + index, canvas);
            
            var particle = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'projectile-' + index)
            particle.canvas = canvas
            particle.index = index
            particle.setDepth(3)
            particle.bounceCount = 3
            this.particles.push(particle)

            weapon.defaultShoot(particle, 200, 300, {x: this.projectile.x, y: this.projectile.y}, this.projectile.rotation + Math.PI + Math.PI/(this.maxParticles*2) + index * Math.PI/this.maxParticles)

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
            obj.setPosition(obj.x, Math.min(obj.y, weapon.terrain.height))
        
            var grd = [{relativePosition: 0, color: 'rgba(255,240,30,0)'}, {relativePosition: 1, color: 'rgba(255,240,30,1)'}]
            weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 20, {thickness: 10, gradient: grd})
            weapon.defaultUpdateScore(obj.x, obj.y, 20, 1)
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
}






export class groundhog {
    constructor() {
        this.id = 2
        this.name = 'Ground Hog'
        this.projectile = null
        this.insideTerrain = false
        this.prevState = null
        this.logoCanvas = Logos.groundhog
    }

    reset = () => {
        this.projectile = null
        this.insideTerrain = false
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

        ctx.fillStyle = 'rgba(0,100,200,1)'
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 4, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
        this.prevState = {x: this.projectile.x, y: this.projectile.y}
    }

    update = (weapon) => {
        weapon.defaultUpdate(this.projectile)
        this.digTerrain(weapon)
        this.checkOutsideTerrain(weapon)

        // this.prevState.x = this.projectile.x
        // this.prevState.y = this.projectile.y
    }

    digTerrain = (weapon) => {
        if (this.projectile !== null)
            weapon.defaultDigTerrain(this.projectile, 2, 0.2)
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
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 1, color: 'rgba(0,200,200,1)'}]
        weapon.terrain.blast(1, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 40, {thickness: 15, gradient: grd})
        weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 40, 1)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}






export class superstar {
    constructor() {
        this.id = 3
        this.name = 'Super Star'
        this.projectile = null
        this.star1 = null
        this.star2 = null
        this.dissociated = false
        this.bulletCount = 0
        this.bullets = []
        this.logoCanvas = Logos.superstar
    }

    reset = () => {
        this.projectile = null
        this.star1 = null
        this.star2 = null
        this.dissociated = false
        this.bulletCount = 0
        this.bullets = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
        var canvas = document.createElement('canvas')

        canvas.height = 16
        canvas.width = 16

        this.drawStar(canvas, canvas.width/2, canvas.height/2, 5, 10, 4)

        weapon.scene.textures.addCanvas('projectile', canvas);

        this.projectile = weapon.scene.physics.add.sprite(0, 0, 'projectile')
        this.projectile.setDepth(3)
        this.projectile.bounceCount = 3
    }
 
    drawStar = (canvas, cx, cy, spikes, outerRadius, innerRadius) => {
        var rot = Math.PI / 2*3;
        var x = cx;
        var y = cy;
        var i;
        var step = Math.PI/spikes;
        var ctx = canvas.getContext('2d')

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius)
        
        for(i = 0; i < spikes;  i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }

    shoot = (weapon) => {
        weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        if (this.projectile !== null) {
            weapon.defaultUpdate(this.projectile)
            this.isCloseToTank(weapon)
        }
        if (this.dissociated === true) {
            this.childUpdate(weapon, this.star1)
            this.childUpdate(weapon, this.star2)
            if (this.star1 !== null) {
                weapon.defaultDigTerrain(this.star1, 8, 0.05)
                weapon.defaultUpdate(this.star1)
            }
            if (this.star2 !== null) {
                weapon.defaultDigTerrain(this.star2, 8, 0.05)
                weapon.defaultUpdate(this.star2)
            }
        }
        this.bulletsUpdate(weapon)
    }

    onTerrainHit = (weapon, obj) => {
        if (obj === this.projectile) {
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
                this.projectile.setPosition(x, Math.min(y, weapon.terrain.height - 1))
                this.blast(weapon, this.projectile)
            }

        }
    }

    onBaseHit = (weapon, obj) => {
        var x = obj.x
        var y = obj.y
        var initX = x, initY = y, maxCount = Math.ceil(obj.body.speed / 20);
        
        obj.setVelocity(0)
        obj.setGravityY(0)

        while (y >= weapon.terrain.height - 1) {
            x = obj.x = obj.x - Math.cos(obj.rotation)
            y = obj.y = obj.y - Math.sin(obj.rotation)
            maxCount--
            if (maxCount <= 0) {
                x = initX
                y = initY
                break
            }
        }

        obj.setPosition(x, Math.min(y, weapon.terrain.height - 1))
        if (obj === this.projectile || obj === this.star1 || obj === this.star2)
            this.blast(weapon, obj)
        else
            this.blastGun(weapon, obj)
    }

    onOutOfBound = (weapon, obj) => {
        obj.destroy() 
        weapon.scene.textures.remove(obj.texture.key)
        if (obj === this.projectile) {
            this.projectile = null
            if (this.star1 === null && this.star2 === null) {
                weapon.turret.activeWeapon = null
            }
        }
        else if (obj === this.star1) {
            this.star1 = null
            if (this.star2 === null) {
                weapon.turret.activeWeapon = null
            }
        }
        else if (obj === this.star2) {
            this.star2 = null
            if (this.star1 === null) {
                weapon.turret.activeWeapon = null
            }
        }
        else {
            obj.active = false
        }
    }

    onTankHit = (weapon, obj, tank) => {
        if (obj === this.star1) {
            this.blast(weapon, obj)
        }
        else if (obj === this.star2) {
            this.blast(weapon, obj)
        }
        else if (obj === this.projectile) {
            this.blast(weapon, obj)
        }
        else {
            this.blastGun(weapon, obj)
        }
    }

    onBounceHit = (weapon, obj) => {
        obj.bounceCount--
        if (obj.bounceCount < 0) return
        weapon.defaultBounce(obj)
    }

    isCloseToTank = (weapon) => {
        if (this.dissociated === true || this.projectile === null) return
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        var dist;
        
        dist = Math.sqrt( Math.pow(oppTank.x - this.projectile.x, 2) + Math.pow(oppTank.y - this.projectile.y, 2))
        
        if (dist < 60) {
            var canvas = document.createElement('canvas')
            canvas.height = 16
            canvas.width = 16
            this.drawStar(canvas, canvas.width/2, canvas.height/2, 5, 10, 4)
            weapon.scene.textures.addCanvas('projectile-1', canvas);
            this.star1 = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'projectile-1')

            var canvas = document.createElement('canvas')
            canvas.height = 16
            canvas.width = 16
            this.drawStar(canvas, canvas.width/2, canvas.height/2, 5, 10, 4)
            weapon.scene.textures.addCanvas('projectile-2', canvas);
            this.star2 = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'projectile-2')

            var stars = [this.star1, this.star2]
            var slope = (this.projectile.y - oppTank.y) / (this.projectile.x - oppTank.x)
            
            stars.forEach((star, index) => {
                var curve = new Phaser.Curves.Ellipse(oppTank.x, oppTank.y, 90, 60);
                var angle = Math.atan(slope) + ((this.projectile.x - oppTank.x) > 0 ? 0 : Math.PI)
                //var angle = new Phaser.Math.Angle.Between(this.projectile.x, this.projectile.y, oppTank.x, oppTank.y)

                star.setDepth(3)
                star.curve = curve
                curve.setRotation(angle)
                star.path = { t: 0, vec: new Phaser.Math.Vector2() };

                if (index === 0) {
                    star.curve.setClockwise(true)
                    star.curve.setXRadius(80)
                    star.curve.setYRadius(50)
                    star.shootTimer = 0
                } 
                if (index === 1) {
                    star.curve.setClockwise(false)
                    star.shootTimer = 0.5
                }
    
                weapon.scene.tweens.add({
                    targets: star.path,
                    t: 1,
                    ease: 'Linear',
                    duration: 2000,
                    repeat: -1
                });
            })

            this.projectile.setGravity(0)
            weapon.scene.physics.moveTo(this.projectile, oppTank.centre.x, oppTank.centre.y, 200)
            this.projectile.setRotation(Math.atan(slope) + (this.projectile.x - oppTank.x > 0) ? 0 :0)
            this.dissociated = true
        }
    }

    blast = (weapon, obj, thickness = 18, outerR = 32) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,50,255,0)'}, {relativePosition: 0.2, color: 'rgba(0,50,255,0.6)'}, {relativePosition: 1, color: 'rgba(0,50,255,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), outerR, {thickness: thickness, gradient: grd})
        weapon.defaultUpdateScore(obj.x, obj.y, outerR, 1)
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        
        if (obj === this.star1) {
            this.star1 = null
        }
        else if (obj === this.star2) {
            this.star2 = null
        }
        else if (obj === this.projectile) {
            this.projectile = null
        }

        if (this.star1 === null && this.star2 === null) {
            weapon.turret.activeWeapon = null
        }
    }

    blastGun = (weapon, obj) => {
        var grd = [{relativePosition: 0, color: 'rgba(0,0,0,0)'}, {relativePosition: 0.1, color: 'rgba(0,0,200,1)'}, {relativePosition: 1, color: 'rgba(0,0,255,1)'}]
        weapon.terrain.blast(1, Math.floor(obj.x), Math.floor(obj.y), 4, {thickness: 4, gradient: grd})
        obj.destroy()
        weapon.scene.textures.remove(obj.texture.key)
        obj.active = false
    }

    shootBullet = (weapon, star, oppTank) => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.height = 5
        canvas.width = 30
        ctx.fillStyle = 'rgba(255,255,50,1)'
        ctx.globalAlpha = 1.0
        
        ctx.fillRect(canvas.width/2 - 10, 2, 10, 2)
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 2, 0, Math.PI/2)
        
        weapon.scene.textures.addCanvas('bullet-' + this.bulletCount, canvas);
        
        var particle = weapon.scene.physics.add.sprite(star.x, star.y, 'bullet-' + this.bulletCount)
        particle.canvas = canvas
        particle.active = true
        particle.setDepth(3)
        this.bullets.push(particle)

        var slope = (star.y - oppTank.y) / (star.x - oppTank.x)
        particle.setGravity(0)
        weapon.scene.physics.moveTo(particle, oppTank.centre.x, oppTank.centre.y, 200)

        this.bulletCount++
    }

    childUpdate = (weapon, star) => {
        if (star !== null) {
            var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
            
            if (this.bulletCount >= 20) {
                if (this.star1 !== null) {
                    weapon.scene.physics.moveTo(this.star1, oppTank.centre.x, oppTank.centre.y, 200)
                }
                if (this.star2 !== null) {
                    weapon.scene.physics.moveTo(this.star2, oppTank.centre.x, oppTank.centre.y, 200)
                }
                return
            }

            star.curve.x = oppTank.x
            star.curve.y = oppTank.y
            star.curve.getPoint(star.path.t, star.path.vec);

            var slope = (star.path.vec.y - star.curve.y) / (star.path.vec.x - star.curve.x)
            var modifier = (star.path.vec.x - star.curve.x) < 0 ? Math.PI : 0
            star.setRotation(Math.atan(slope) + modifier)

            star.setPosition(star.path.vec.x, star.path.vec.y)
            if (star === this.star1) {
                star.curve.setRotation(star.curve.rotation + 0.01)
            }
            if (star === this.star2) {
                star.curve.setRotation(star.curve.rotation - 0.01)
            }

            star.shootTimer += 0.03
            if (star.shootTimer > 1) {
                this.shootBullet(weapon, star, oppTank)
                star.shootTimer = 0
            }
        }
    }

    bulletsUpdate = (weapon) => {
        var oppTank = weapon.tank === weapon.scene.tank1 ? weapon.scene.tank2 : weapon.scene.tank1
        this.bullets.forEach((bullet) => {
            if (bullet.active === true) {
                weapon.updateTail(bullet, 4, 0, 3, {r: 255, g: 255, b: 50})
                weapon.scene.physics.moveTo(bullet, oppTank.centre.x, oppTank.centre.y, 200)
                weapon.defaultUpdate(bullet)
                bullet.setRotation(bullet.rotation + Math.PI)
                if (Phaser.Math.Distance.Between(oppTank.x, oppTank.y, bullet.x, bullet.y) < oppTank.hitRadius) {
                    this.blastGun(weapon, bullet)
                    weapon.constantUpdateScore(2)
                }
            }
        })
    }
}






export class earthmover {
    constructor() {
        this.id = 4
        this.name = 'Earth Mover'
        this.logoCanvas = Logos.earthmover
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

        ctx.fillStyle = 'rgba(100,255,100,1)'
        ctx.globalAlpha = 1.0
        
        ctx.beginPath()
        ctx.arc(canvas.width/2, canvas.height/2, 3, 0, Math.PI * 2)
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
        if (this.projectile !== null) {
            weapon.updateTail(this.projectile, 20, 5, 6, {r: 100, g: 255, b: 100})
            weapon.defaultUpdate(this.projectile)
        }
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
        obj.setVelocity(0)
        obj.setGravityY(0)
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
        var grd1 = [{relativePosition: 0, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(0,0,255,1)'}, {relativePosition: 1, color: 'rgba(0,0,0,1)'}]
        var grd2 = [{relativePosition: 0, color: 'rgba(0,0,0,1)'}, {relativePosition: 0.5, color: 'rgba(0,255,0,1)'}, {relativePosition: 1, color: 'rgba(0,0,0,1)'}]
        var grd = []
        grd.concat(grd1, grd1, grd1, grd2, grd2, grd2, grd2, grd2, grd2, grd1, grd1)
        var circles = [grd1, grd1, grd1, grd2, grd2, grd2, grd2, grd2, grd2, grd1, grd1]

        weapon.terrain.blast(2, Math.floor(this.projectile.x), Math.floor(this.projectile.y), 200, {thickness: 15, circles: circles})
        //weapon.defaultUpdateScore(this.projectile.x, this.projectile.y, 60, 1)
        this.projectile.destroy()
        weapon.scene.textures.remove('projectile')
        weapon.turret.activeWeapon = null
    }
}





export class island {
    constructor() {
        this.id = 5
        this.name = 'Island'
        this.circles = []
        this.circlesLeft = 24
        this.maxCircles = 24
        this.distance = 60
        this.logoCanvas = Logos.island
    }

    reset = () => {
        this.circlesLeft = 24;
        this.circles = []
    }

    /**
    * @param {Weapon} weapon 
    */
    create = (weapon) => {
        this.reset()
    }

    shoot = (weapon) => {
        //weapon.defaultShoot(this.projectile)
    }

    update = (weapon) => {
        if (this.circlesLeft > 0) {
            var modifier = (this.maxCircles - Math.abs(2 * this.circlesLeft - this.maxCircles)) / this.maxCircles 
            var timeGap = 0.015
            timeGap = timeGap + modifier / 100
        }
        if (this.circlesLeft > 0 && (this.circlesLeft === this.maxCircles || this.circles[this.circles.length - 1].path.t > timeGap)) {
            var outerRadius = (this.maxCircles - Math.abs(2 * this.circlesLeft - this.maxCircles)) * 1.2 + 4
            var radius = outerRadius
            var change = 0
            var thickness = 8
            var grd1, grd2;

            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            canvas.width = radius * 2
            canvas.height = radius * 2
            
            ctx.globalCompositeOperation = 'source-over'

            while (radius > 0) {
                grd1 = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.max(radius - thickness, 0), canvas.width/2, canvas.height/2, radius)
                grd1.addColorStop(0, 'rgba(0,0,255,1)')
                grd1.addColorStop(0.4, 'rgba(0,0,100,1)')
                grd1.addColorStop(1, 'rgba(0,0,100,1)')
                
                grd2 = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.max(radius - thickness, 0), canvas.width/2, canvas.height/2, radius)
                grd2.addColorStop(0, 'rgba(0,0,100,1)')
                grd2.addColorStop(0.4, 'rgba(0,0,200,1)')
                grd2.addColorStop(1, 'rgba(0,0,255,1)')

                if (change === 0) {
                    ctx.fillStyle = grd2
                    change = 1
                }
                else if (change === 1) {
                    ctx.fillStyle = grd1
                    change = 0
                }

                ctx.beginPath()
                ctx.arc(canvas.width/2, canvas.height/2, radius, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()

                radius = radius - thickness
            }

            weapon.scene.textures.addCanvas('circle-' + this.circlesLeft, canvas)
            var circle = weapon.scene.add.sprite(weapon.tank.x, weapon.tank.y - this.distance, 'circle-' + this.circlesLeft)
            var curve = new Phaser.Curves.Ellipse(weapon.tank.x, weapon.tank.y, this.distance, this.distance);
            curve.setRotation(-Math.PI/2)
            circle.curve = curve
            circle.path = { t: 0, vec: new Phaser.Math.Vector2() };
            circle.setDepth(this.circlesLeft + 5)
            circle.radius = outerRadius

            weapon.scene.tweens.add({
                targets: circle.path,
                t: 1,
                ease: 'Linear',
                duration: 2000,
                repeat: 0
            });

            this.circles.push(circle)
            this.circlesLeft--
        }

        this.circles.forEach((circle) => {
            circle.curve.getPoint(circle.path.t, circle.path.vec)
            circle.setPosition(circle.path.vec.x, circle.path.vec.y)
            this.clearTerrain(weapon, circle)
            if (circle.path.t === 1) {
                circle.visible = false
            }
        })

        weapon.terrain.update()

        var temp = this.circles.filter((circle) => {
            return circle.visible === true
        })

        if (temp.length === 0) {
            this.circles.forEach((circle) => {
                circle.destroy()
                weapon.scene.textures.remove(circle.texture.key)
            })
            weapon.turret.activeWeapon = null
        }
    }

    clearTerrain = (weapon, circle) => {
        var ctx = weapon.terrain.getContext('2d')
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = 'rgba(0,0,0,1)'

        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.globalCompositeOperation = 'source-atop'
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.lineWidth = 8

        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.stroke()
    }
}





export class bouncydirt {
    constructor() {
        this.id = 6
        this.name = 'Bouncy Dirt'
        this.projectile = null
        this.ballsArray = []
        this.ballsCount = 16
        this.ballRadius = 4
        this.timer = null
        this.logoCanvas = Logos.bouncydirt
    }

    reset = () => {
        this.projectile = null
        this.ballsArray = []
        this.timer = null
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
            weapon.updateTail(this.projectile, 20, 5, 4, {r: 100, g: 255, b: 255}, true)
            weapon.defaultUpdate(this.projectile)
        }

        this.ballsArray.forEach(ball => {
            this.ballUpdate(weapon, ball)
        })
    }

    dissociate = (weapon) => {
        for (let index = 0; index < this.ballsCount; index++) {
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            
            canvas.height = this.ballRadius * 2
            canvas.width = this.ballRadius * 2

            var grd = ctx.createRadialGradient(canvas.width/4, canvas.height/4, 0, canvas.width/2, canvas.height/2, this.ballRadius)
            grd.addColorStop(0, 'rgba(255,150,255,1)')
            grd.addColorStop(0.6, 'rgba(230,0,230,1)')
            grd.addColorStop(1, 'rgba(230,0,230,1)')

            ctx.fillStyle = grd
            ctx.globalAlpha = 1.0
            
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, this.ballRadius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()

            weapon.scene.textures.addCanvas('ball-' + index, canvas);

            var ball = weapon.scene.physics.add.sprite(this.projectile.x, this.projectile.y, 'ball-' + index)
            ball.canvas = canvas
            ball.setDepth(3)
            ball.visible = false
            this.ballsArray.push(ball)
        }

        this.projectile.destroy()
        weapon.scene.textures.remove(this.projectile.texture.key)
        this.projectile = null

        this.timer = weapon.scene.time.addEvent({delay: 200, callback: this.spawnBall, callbackScope: this, repeat: this.ballsCount});
        setTimeout(() => {
            this.removeBalls(weapon)
        }, 6000);
    }

    spawnBall = () => {
        var velocities = [5, -10, 3, -8, -6, 9, 0, -7, 4, -2, 6, 7, -3, 2, 8]
        var idx;

        var found = this.ballsArray.find((ball, index) => {
            idx = index
            return ball.visible === false
        })

        if (found) {
            found.visible = true
            found.setGravityY(180)
            found.setVelocityY(-36)
            found.setDragX(0.9)
            found.setVelocityX(velocities[idx])
        }
    }

    removeBalls = (weapon) => {
        var removeBall = () => {
            var found = this.ballsArray.find((ball) => {
                return ball.visible === true
            })
    
            if (found) {
                found.visible = false
                found.setGravityY(0)
                found.setVelocity(0)
                found.setDragX(0)
                weapon.scene.textures.remove(found.texture.key)
            }
            else {
                weapon.terrain.update()
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

        var x = ball.x + this.ballRadius * Math.cos(rotation)
        var y = ball.y + this.ballRadius * Math.sin(rotation)
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
            
            this.strokeColor(weapon, points, angle)
            
            ball.setVelocityX(ball.body.velocity.x - Math.cos(angle) * 12)
            ball.setVelocityY(-36 * Math.sin(angle))
        }
    }

    strokeColor = (weapon, points, angle) => {
        for (let index = 1; index < points.length; index++) {
            var diffX = points[index].x - points[index - 1].x
            var diffY = points[index].y - points[index - 1].y

            var deltaX = diffX/3
            var deltaY = diffY/3

            var x, y;

            for (let i = 0; i < 4; i++) {
                x = points[index - 1].x + i * deltaX
                y = points[index - 1].y + i * deltaY
                if (weapon.terrain.getPixel(x + 0.9, y + 0.9).alpha > 0) {
                    weapon.terrain.setPixel(x + 0.9, y + 0.9, 230, 0, 230, 255)
                }
                if (weapon.terrain.getPixel(x + 0.9 + Math.cos(angle), y + 0.9 + Math.sin(angle)).alpha > 0) {
                    weapon.terrain.setPixel(x + 0.9 + Math.cos(angle), y + 0.9 + Math.sin(angle), 230, 0, 230, 255)
                }
            }
        }
    }
}