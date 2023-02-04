import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';
import WebFontFile from '../../classes/WebFontFile';

export class Scene2 extends Scene {
    constructor() {
        super('scene-2');
        
    }



    preload = () => {
        //this.load.baseURL = 'assets/';
        //this.load.image('tank', 'sprites/tank.png');
        this.load.addFile(new WebFontFile(this.load, ['Audiowide', 'Exo 2:600', 'Bungee', 'Righteous', 'Days One', 'Iceland']))
    }



    create = () => {
        //this.fps = this.add.text(0, 0, this.game.loop.actualFps)

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const h = this.game.renderer.height

        const a = this.add.text(screenCenterX, h/12 * 3, 'ONE PLAYER');
        const b = this.add.text(screenCenterX, h/12 * 5, 'TWO PLAYERS');
        const c = this.add.text(screenCenterX, h/12 * 7, 'PLAY ONLINE');
        const d = this.add.text(screenCenterX, h/12 * 9, 'TARGET PRACTICE');
        const font = '"Days One"'

        a.setOrigin(0.5).setFontSize(50).setFontFamily(font).setColor('rgba(102,255,51,1)')
        b.setOrigin(0.5).setFontSize(50).setFontFamily(font).setColor('rgba(255,255,0,1)')
        c.setOrigin(0.5).setFontSize(50).setFontFamily(font).setColor('rgba(255,153,51,1)')
        d.setOrigin(0.5).setFontSize(50).setFontFamily(font).setColor('rgba(255,51,0,1)')

        strokeText(a, 6)
        strokeText(b, 6)
        strokeText(c, 6)
        strokeText(d, 6)

        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = 150
        canvas.height = 100
        drawBackBtn(ctx, canvas.width, canvas.height)
        this.textures.addCanvas('back-btn', canvas)
        var backbtn = this.add.image(125, this.game.renderer.height - 100, 'back-btn')
        backbtn.setDepth(10)
        
        backbtn.setInteractive()
        backbtn.on('pointerdown', () => {
            this.scene.start('scene-1')
        })

        a.setInteractive()
        b.setInteractive()
        c.setInteractive()
        d.setInteractive()

        a.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 1})
        })
        b.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 2})
        })
        c.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 3})
        })
        d.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 4})
        })
    }



    update = (time, delta) => {
        //this.fps.setText(this.game.loop.actualFps)
    
    }

}


const strokeText = (txt, thickness) => {
    var re = /rgba\((\d+),(\d+),(\d+),(\d+)\)/
    var match = new RegExp(re).exec(txt.style.color)
    var r, g, b, a, k = 0.7;
    r = parseInt(match[1])
    g = parseInt(match[2])
    b = parseInt(match[3])
    a = parseInt(match[4])

    r = Math.ceil(r * k)
    g = Math.ceil(g * k)
    b = Math.ceil(b * k)

    txt.setStroke('rgba(' + r + ',' + g + ',' + b + ',' + a + ')', thickness)
}
