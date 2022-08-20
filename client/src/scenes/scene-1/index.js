import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import { WeaponShopScroll } from '../../classes/WeaponShopScroll';
import WebFontFile from '../../classes/WebFontFile';

export class Scene1 extends Scene {
    constructor() {
        super('scene-1');
        this.fps = null
        this.playbtn = null
        this.k = null
    }



    preload = () => {
        //this.load.image('cover', 'assets/images/c.png')
        this.load.addFile(new WebFontFile(this.load, ['Cabin:600i,600,400', 'Russo One']))
    }

    toggleFullscreen = () => {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
            // On stop fulll screen
        } else {
            this.scale.startFullscreen();
            // On start fulll screen
        }
    }


    create = () => {
        this.fps = this.add.text(0, 0, this.game.loop.actualFps)

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //const a = this.add.text(screenCenterX, screenCenterY - 200, 'Pocket');
        //const b = this.add.text(screenCenterX, screenCenterY - 50, 'Tanks');

       //this.add.image(screenCenterX, screenCenterY - 100, 'cover')

        //a.setOrigin(0.5).setFontSize(200)
        //b.setOrigin(0.5).setFontSize(200)
        
        this.createPlayBtn()

        var fullscreen = this.add.rectangle(screenCenterX + 400,screenCenterY * 1.7,200,200,0xff0000)
        fullscreen.setInteractive({draggable: true})
        fullscreen.on('pointerdown', this.toggleFullscreen)
        //fullscreen.on('dragend', () => {alert()})
        //this.k = new WeaponShopScroll(this)
        //this.k.reset([{name: 'abd', id: 1}, {name: 'd', id: 2}, {name: 'ad', id: 3}, {name: 'sd', id: 4}, {name: 'td', id: 5}])
    }

    createPlayBtn = () => {
        var width = 180
        var height = 140
        var margin1 = 5
        var margin2 = 10
        var r = height/2
        
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')

        canvas.width = width + 2*r
        canvas.height = height

        ctx.fillStyle = 'rgba(165,165,165,1)'
        ctx.beginPath()
        ctx.arc(r, height/2, r, Math.PI/2, Math.PI/2 * 3)
        ctx.lineTo(r + width, 0)
        ctx.arc(r + width, height/2, r, -Math.PI/2, Math.PI/2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(220,220,220,1)'
        ctx.beginPath()
        ctx.arc(r, height/2, r - margin1, Math.PI/2, Math.PI/2 * 3)
        ctx.lineTo(r + width - margin1*2, margin1)
        ctx.arc(r + width, height/2, r - margin1, -Math.PI/2, Math.PI/2)
        ctx.closePath()
        ctx.fill()

        var g = ctx.createRadialGradient(r, height/2, 0, r, height/2, r - margin2)
        g.addColorStop(0, 'rgba(80,180,240,1)')
        g.addColorStop(0.2, 'rgba(80,180,240,1)')
        g.addColorStop(1, 'rgba(50,120,200,1)')
        ctx.fillStyle = g
        
        ctx.beginPath()
        ctx.arc(r, height/2, r - margin2, Math.PI/2, Math.PI/2 * 3)
        ctx.closePath()
        ctx.fill()

        g = ctx.createRadialGradient(r + width, height/2, 0, r + width, height/2, r - margin2)
        g.addColorStop(0, 'rgba(80,180,240,1)')
        g.addColorStop(0.2, 'rgba(80,180,240,1)')
        g.addColorStop(1, 'rgba(50,120,200,1)')
        ctx.fillStyle = g

        ctx.beginPath()
        ctx.arc(r + width, height/2, r - margin2, -Math.PI/2, Math.PI/2)
        ctx.closePath()
        ctx.fill()

        g = ctx.createLinearGradient(width/2 + r, margin2, width/2 + r, height - margin2)
        g.addColorStop(0, 'rgba(50,120,200,1)')
        g.addColorStop(0.4, 'rgba(80,180,240,1)')
        g.addColorStop(0.6, 'rgba(80,180,240,1)')
        g.addColorStop(1, 'rgba(50,120,200,1)')
        ctx.fillStyle = g

        ctx.fillRect(r, margin2, width, height - margin2*2)

        var playtxt = this.add.text(screenCenterX, screenCenterY * 5/3, 'play', {font: '600 Cabin'})
        playtxt.setDepth(20)
        playtxt.setColor('rgba(240,240,240,1)')
        playtxt.setStroke('rgba(155,155,155,1)', 4)
        playtxt.setFontSize(75)
        playtxt.setOrigin(0.5, 0.55)

        this.textures.addCanvas('play-btn', canvas)
        this.playbtn = this.add.image(screenCenterX, screenCenterY * 5/3, 'play-btn')

        this.playbtn.setInteractive()
        this.playbtn.on('pointerdown', () => {
            this.scene.start('scene-2')
        })
    }



    update = (time, delta) => {
        this.fps.setText(this.game.loop.actualFps)
        //this.k.update()
    }

}
