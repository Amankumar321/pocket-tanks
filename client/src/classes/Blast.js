export class Blast {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} type 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius
     */
    constructor(scene, type, x, y, radius, data) {
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
        }
        else {
            this.innerRadius = this.maxRadius
            var i, j, a, b, c, radius = this.maxRadius, x = this.x, y = this.y;
            // for (i = x - radius; i <= x + radius; i++) {
            //     for (j = y - radius; j <= y + radius; j++) {
            //         a = i - x;
            //         b = j - y;
            //         c = Math.sqrt( a*a + b*b )
            //         if (c < this.maxRadius) {
            //             if (this.terrain.getPixel().alpha > 0)
            //                 this.terrain.setPixel(i, j, 255, 0, 0, 255)
            //         }
            //     }   
            // }
            // for (let r = this.maxRadius - 4; r < this.maxRadius + 4; r = r + 0.5) {
            //     for (let theta = 0; theta < Math.PI * 2; theta = theta + 0.001) {
            //         this.terrain.setPixel(r * Math.cos(theta), r * Math.sin(theta), 0, 0, 0, 0)
            //     }
            // }
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
        
        //this.canvas.update()
        //this.texture.update()
        //this.texture.refresh()
        
        ctx2.globalCompositeOperation = 'destination-in'

        ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        ctx2.beginPath()
        ctx2.arc(this.x, this.y, this.maxRadius, 0, Math.PI * 2)
        ctx2.closePath()
        ctx2.fill()

        // ctx2.globalCompositeOperation = 'destination-out'

        // ctx2.fillStyle = 'rgba(0,0,0,1)'
        
        // ctx2.beginPath()
        // ctx2.arc(this.x, this.y, Math.max(this.innerRadius + 1, 0), 0, Math.PI * 2)
        // ctx2.closePath()
        // ctx2.fill()
    }





    updateType2 = () => {
        this.outerRadius++
        if (this.maxRadius > this.innerRadius) {
            this.animateHole2()
        }
        else {
            this.innerRadius = this.maxRadius
            var i, j, a, b, c, radius = this.maxRadius, x = this.x, y = this.y;
            // for (i = x - radius; i <= x + radius; i++) {
            //     for (j = y - radius; j <= y + radius; j++) {
            //         a = i - x;
            //         b = j - y;
            //         c = Math.sqrt( a*a + b*b )
            //         if (c < this.maxRadius) {
            //             this.terrain.setPixel(i, j, 0, 0, 0, 0)
            //         }
            //     }   
            // }
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
        
        //this.canvas.update()
        //this.texture.update()

        
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