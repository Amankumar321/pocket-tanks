import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';

export class ScreenshotScene extends Scene {
    constructor() {
        super('screenshot-scene');

        
    }

    preload = () => {
        //this.load.crossOrigin = 'anonymous';
        //this.load.baseURL = 'https://www.google.com.br/';
    }


    create = () => {
        this.sound.stopByKey('intro')

        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = 150
        canvas.height = 100

        drawBackBtn(ctx, canvas.width, canvas.height)
        var backtexture = this.textures.addCanvas('back-btn', canvas, true)
        var backbtn = this.add.image(100, this.game.renderer.height - 100, backtexture)
        backbtn.setDepth(10)
        
        backbtn.setInteractive()
        backbtn.on('pointerdown', () => {
            this.sound.play('click', {volume: 0.3})
            this.scene.start('scene-1')
        })

        var w = this.renderer.width
        var h = this.renderer.height

        var img1 = this.add.image(w/2, h/2, 'ptss1').setOrigin(0.5, 0.5).setAlpha(0)
        var img2 = this.add.image(w/2, h/2, 'ptss2').setOrigin(0.5, 0.5).setAlpha(0)
        var img3 = this.add.image(w/2, h/2, 'ptss3').setOrigin(0.5, 0.5).setAlpha(0)
        var img4 = this.add.image(w/2, h/2, 'ptss4').setOrigin(0.5, 0.5).setAlpha(0)

        var arr = [img1, img2, img3, img4]
        var currentIndex = 0;

        this.tweens.add({
            targets: arr[currentIndex],
            alpha: 1,
            duration: 500
        })

        setInterval(() => {
            this.tweens.add({
                targets: arr[currentIndex],
                alpha: 0,
                duration: 500
            })
            currentIndex++;
            currentIndex = currentIndex % 4
            
            setTimeout(() => {
                this.tweens.add({
                    targets: arr[currentIndex],
                    alpha: 1,
                    duration: 500
                })
            }, 500);

        }, 3000);
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
