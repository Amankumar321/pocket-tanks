import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';

export class ControlsScene extends Scene {
    constructor() {
        super('controls-scene');
    }

    create = () => {
        const controls = {
            'Touch': 'Tap and Swipe',
            'Esc': 'Exit Match',
            'W': 'Increase Power',
            'S': 'Decrease Power',
            'A': 'Move Left',
            'D': 'Move Right',
            'Q': 'Angle Rotate Left',
            'E': 'Angle Rotate Right',
            'Space': 'Fire',
            'Mouse': 'Click buttons'
        }

        const keyGroup = this.add.group()
        const valueGroup = this.add.group()

        var maxKeyWidth = 0
        var maxValueWidth = 0
        var totalHeight = 0
        var keyObject, valueObject;
        var stepY = 56
        
        for (let key in controls) {
            keyObject = this.add.text(0, 0, key).setPadding(0,0,0,0).setFontFamily('Verdana').setFontSize(36)
            valueObject= this.add.text(0, 0, controls[key]).setPadding(60,0,0,0).setFontFamily('Verdana').setFontSize(36)
            keyObject.setColor('rgba(140,140,140,1)')
            valueObject.setColor('rgba(240,240,240,1)')
            strokeText(keyObject, 4)
            strokeText(valueObject, 4)

            keyGroup.add(keyObject)
            valueGroup.add(valueObject)
            
            totalHeight = totalHeight + stepY
            if (maxKeyWidth < keyObject.width) maxKeyWidth = keyObject.width
            if (maxValueWidth < valueObject.width) maxValueWidth = valueObject.width 
        }

        var delX = (maxKeyWidth + maxValueWidth)/2
        var delY = (totalHeight)/2

        var w = this.game.renderer.width
        var h = this.game.renderer.height
        
        keyGroup.setXY(this.game.renderer.width/2 - delX, this.game.renderer.height/2 - delY, 0, stepY)
        valueGroup.setXY(this.game.renderer.width/2 - delX + maxKeyWidth, this.game.renderer.height/2 - delY, 0, stepY)


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
