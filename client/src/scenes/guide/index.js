import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';
import { drawAngleDisplay } from '../../graphics/angle-display';
import { drawFireBtn } from '../../graphics/fire-btn';
import { drawMoveDisplay } from '../../graphics/move-display';
import { drawPowerDisplay } from '../../graphics/power-display';
import { drawWeaponDisplay } from '../../graphics/weapon-display';

export class GuideScene extends Scene {
    constructor() {
        super('guide-scene');

        
    }

    create = () => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = 150
        canvas.height = 100

        drawBackBtn(ctx, canvas.width, canvas.height)
        var backtexture = this.textures.addCanvas('back-btn', canvas, true)
        var backbtn = this.add.image(125, this.game.renderer.height - 100, backtexture)
        backbtn.setDepth(10)
        
        backbtn.setInteractive()
        backbtn.on('pointerdown', () => {
            this.sound.play('click', {volume: 0.3})
            this.scene.start('scene-1')
        })

        // const mainText = `
        // Each game has 10 volleys. A volley is when player 1 gets a chance to shoot, and
        // player 2 has the opportunity to return a shot. Each player starts out with
        // 10 weapons, and they are used up as the game continues. To exit the
        // game at any point, hit the ESC 'Escape' key.` 

        const mainText = 'Buttons'

        
        const buttons = {
            'Angle': 'Click on the dome and a crosshair will appear over the tank. Moving the mouse left and right will change the angle to fire in. Clicking the mouse again will select that angle.',
            'Fire': 'Fires the weapon based on the angle and power that were selected. Some specialty weapons like the Dirt Mover, Well Digger, Laser, etc... only use angle, power, or neither, so be aware that there are exceptions to the rule.',
            'Move': 'Move the tank a small distance, only 4 moves per game, you still get to shoot after moving',
            'Power': 'Click the red power bar and move the mouse left and right to change the amount of power that will be used to launch the bullet.',
            'Weapon': 'Click on the weapon name for a weapon selection pop-up. Moving the mouse up and down with change the selected weapon, which will be flashing yellow.',
        }

        const keyGroup = []
        const hyphenGroup = []
        const valueGroup = []

        var totalHeight = 0
        var keyObject, valueObject, hyphenObject;
        var stepY = 0
        var padding1 = 80, padding2 = 100, wrapWidth = 500
        
        for (let key in buttons) {
            keyObject = this.add.text(0, 0, key).setPadding(0,0,0,20).setFontFamily('Verdana').setFontSize(16)
            hyphenObject = this.add.text(0, 0, '-').setPadding(padding1,0,0,20).setFontFamily('Verdana').setFontSize(16)
            valueObject = this.add.text(0, 0, buttons[key]).setPadding(padding2,0,0,20).setFontFamily('Verdana').setFontSize(16)

            keyObject.setColor('rgba(140,140,140,1)')
            hyphenObject.setColor('rgba(240,240,240,1)')
            valueObject.setColor('rgba(240,240,240,1)').setWordWrapWidth(wrapWidth)

            keyGroup.push(keyObject)
            hyphenGroup.push(hyphenObject)
            valueGroup.push(valueObject)

            //stepY = Math.max(keyObject.displayHeight, valueObject.displayHeight)
            stepY = 100

            keyObject.setY(totalHeight)
            hyphenObject.setY(totalHeight)
            valueObject.setY(totalHeight)

            totalHeight = totalHeight + stepY
        }

        var w = this.game.renderer.width
        var h = this.game.renderer.height

        for (let i = 0; i < keyGroup.length; i++) {
            keyObject = keyGroup[i]
            hyphenObject = hyphenGroup[i]
            valueObject = valueGroup[i]

            keyObject.setY(keyObject.y + (h/1.7 - totalHeight/2))
            hyphenObject.setY(hyphenObject.y + (h/1.7 - totalHeight/2))
            valueObject.setY(valueObject.y + (h/1.7 - totalHeight/2))
        
            keyObject.setX(keyObject.x + (w/2.4 - (padding2 + wrapWidth)/2))
            hyphenObject.setX(hyphenObject.x + (w/2.4 - (padding2 + wrapWidth)/2))
            valueObject.setX(valueObject.x + (w/2.4 - (padding2 + wrapWidth)/2))
        }

        var mainTextObject = this.add.text(w/2, h/6, mainText).setFontFamily('Verdana').setFontSize(30)
        mainTextObject.setColor('rgba(240,240,240,1)').setOrigin(0.5, 0.5)
        mainTextObject.setWordWrapWidth(900).setAlign('center')

        strokeText(mainTextObject, 4)


        drawAngleDisplay(this, w/1.3, keyGroup[0].y + keyGroup[0].displayHeight/2)
        drawFireBtn(this, w/1.3, keyGroup[1].y + keyGroup[1].displayHeight/2)
        drawMoveDisplay(this, w/1.3, keyGroup[2].y + keyGroup[2].displayHeight/2)
        drawPowerDisplay(this, w/1.3, keyGroup[3].y + keyGroup[3].displayHeight/2)
        drawWeaponDisplay(this, w/1.3, keyGroup[4].y + keyGroup[4].displayHeight/2)
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