import Phaser from "phaser"

export class Blast {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} type 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius
     * @param {boolean} blowTank
     */
    constructor(scene, type, x, y, radius, data, blowTank) {
        this.type = type 
        this.data = data
        this.scene = scene
        
        this.canvas = document.createElement('canvas')
        this.canvas.width = scene.renderer.width
        this.canvas.height = scene.renderer.height
        this.textureId = Math.random().toString(36).slice(2, 7)
        scene.textures.addCanvas(this.textureId, this.canvas)
        this.image = this.scene.add.image(this.canvas.width/2, this.canvas.height/2, this.textureId)
        
        this.terrain = scene.terrain
        this.maxRadius = radius
        this.outerRadius = 0
        this.innerRadius = 0
        this.thickness = 0
        this.gradient = null
        this.circles = []
        this.x = x
        this.y = y
        this.toRemove = false
        this.blowTank = blowTank

        this.init()
    }


    init = () => {
        if (this.type === 1) {
            this.gradient = this.data.gradient
            this.thickness = this.data.thickness
        }
        if (this.type === 2) {
            this.circles = this.data.circles
            this.thickness = this.data.thickness
        }
    }


    update = () => {
        if (this.type === 1) {
            this.updateType1()
        }
        if (this.type === 2) {
            this.updateType2()
        }
    }




    updateType1 = () => {
        this.outerRadius++
        if (this.maxRadius > this.innerRadius) {
            this.animateHole1()
            var dist1 = Phaser.Math.Distance.Between(this.x, this.y, this.scene.tank1.x, this.scene.tank1.y)
            var dist2 = Phaser.Math.Distance.Between(this.x, this.y, this.scene.tank2.x, this.scene.tank2.y)
            var angle = 0, vec;
            if (this.blowTank && (this.innerRadius + 4*this.scene.tank1.hitRadius > dist1)) {
                angle = Math.atan((this.scene.tank1.centre.y - this.y) / (this.scene.tank1.centre.x - this.x))
                angle = angle + ((this.scene.tank1.centre.x - this.x) > 0 ? 0 : -Math.PI)
                this.scene.tank1.body.setVelocity(300 * Math.cos(angle), 300 * Math.sin(angle) - 300)
                this.scene.tank1.body.setGravityY(300)
                this.blowTank = false
            }
            if (this.blowTank && (this.innerRadius + 4*this.scene.tank2.hitRadius > dist2)) {
                angle = Math.atan((this.scene.tank2.centre.y - this.y) / (this.scene.tank2.centre.x - this.x))
                //vec = new Phaser.Math.Vector2(1,1).setAngle(angle).setLength(400)
                //alert(vec.x)
                angle = angle + ((this.scene.tank2.centre.x - this.x) > 0 ? 0 : -Math.PI)
                this.scene.tank2.body.setVelocity(300 * Math.cos(angle), 300 * Math.sin(angle) - 300)
                this.scene.tank2.body.setGravityY(300)
                this.blowTank = false
            }
        }
        else {
            this.innerRadius = this.maxRadius
            this.terrain.fixTerrain(this.x, this.y, this.maxRadius)
            this.toRemove = true
            this.image.destroy(true)
            this.scene.textures.remove(this.textureId)
        }
    }


    animateHole1 = () => {
        var ctx = this.terrain.canvas.getContext('2d')
        ctx.globalCompositeOperation = 'destination-out'

        ctx.fillStyle = 'rgba(0,0,0,1)'
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, Math.min(this.outerRadius, this.maxRadius), 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        this.terrain.update()

        var canvas = this.canvas
        var ctx2 = canvas.getContext('2d')

        ctx2.globalCompositeOperation = 'destination-out'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()
        
        ctx2.globalCompositeOperation = 'source-over'

        this.innerRadius = Math.max(this.outerRadius - this.thickness, 0)

        var grd = ctx2.createRadialGradient(this.x, this.y, this.innerRadius, this.x, this.y, this.outerRadius)

        this.gradient.forEach((ele) => {
            grd.addColorStop(ele.relativePosition, ele.color)
        });
        
        ctx2.fillStyle = grd
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()
        
        ctx2.globalCompositeOperation = 'destination-in'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.maxRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()
    }





    updateType2 = () => {
        this.outerRadius++
        if (this.maxRadius > this.innerRadius) {
            this.animateHole2()
        }
        else {
            this.innerRadius = this.maxRadius
            this.terrain.fixTerrain(this.x, this.y, this.maxRadius)
            this.toRemove = true
            this.image.destroy(true)
            this.scene.textures.remove(this.textureId)
        }
    }


    animateHole2 = () => {
        var ctx = this.terrain.canvas.getContext('2d')
        ctx.globalCompositeOperation = 'destination-out'

        ctx.fillStyle = 'rgba(0,0,0,1)'
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, Math.min(this.outerRadius, this.maxRadius), 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        this.terrain.update()

        var canvas = this.canvas
        var ctx2 = canvas.getContext('2d')

        ctx2.globalCompositeOperation = 'destination-out'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()
        
        ctx2.globalCompositeOperation = 'source-over'

        for (var i = 0; i < this.circles.length; i++) {
            this.innerRadius = Math.max(this.outerRadius - this.thickness * (i + 1), 0)
    
            var grd = ctx2.createRadialGradient(this.x, this.y, this.innerRadius, this.x, this.y, Math.min(this.outerRadius, this.innerRadius + this.thickness))
            var gradient = this.circles[i]

            gradient.forEach((ele) => {
                grd.addColorStop(ele.relativePosition, ele.color)
            });
      
            ctx2.fillStyle = grd
            ctx2.beginPath()
            ctx2.arc(this.x, this.y, Math.min(this.maxRadius, this.outerRadius, this.innerRadius + this.thickness), 0, Math.PI * 2)
            ctx2.closePath()
            ctx2.fill()

            if (this.innerRadius === 0) {
                break
            }
        }
   
        ctx2.globalCompositeOperation = 'destination-in'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.maxRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()

        ctx2.globalCompositeOperation = 'destination-out'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, Math.max(this.innerRadius + 1, 0), 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()
    }
}