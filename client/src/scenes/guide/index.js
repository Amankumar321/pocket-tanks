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
        var backbtn = this.add.image(100, this.game.renderer.height - 100, backtexture)
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
        var w = this.game.renderer.width
        var h = this.game.renderer.height

        var mainTextObject = this.add.text(w/2, h/6, mainText).setFontFamily('"Days One"').setFontSize(50)
        mainTextObject.setColor('rgba(240,240,240,1)').setOrigin(0.5, 0.5)
        mainTextObject.setWordWrapWidth(900).setAlign('center')
        strokeText(mainTextObject, 6)

        if (this.game.device.os.desktop) {
            this.createDesktopDisplay()
        }
        else {
            this.createMobileDisplay()
        }
    }





    createDesktopDisplay = () => {
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
        var padding1 = 90, padding2 = 110, wrapWidth = 500
        
        for (let key in buttons) {
            keyObject = this.add.text(0, 0, key).setPadding(0,0,0,20).setFontFamily('Verdana').setFontSize(20)
            hyphenObject = this.add.text(0, 0, '-').setPadding(padding1,0,0,20).setFontFamily('Verdana').setFontSize(16)
            valueObject = this.add.text(0, 0, buttons[key]).setPadding(padding2,0,0,20).setFontFamily('Verdana').setFontSize(16)

            keyObject.setColor('rgba(140,140,140,1)')
            hyphenObject.setColor('rgba(240,240,240,1)')
            valueObject.setColor('rgba(240,240,240,1)').setWordWrapWidth(wrapWidth)

            keyGroup.push(keyObject)
            hyphenGroup.push(hyphenObject)
            valueGroup.push(valueObject)

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

        drawAngleDisplay(this, w/1.3, keyGroup[0].y + keyGroup[0].displayHeight/2)
        drawFireBtn(this, w/1.3, keyGroup[1].y + keyGroup[1].displayHeight/2)
        drawMoveDisplay(this, w/1.3, keyGroup[2].y + keyGroup[2].displayHeight/2)
        drawPowerDisplay(this, w/1.3, keyGroup[3].y + keyGroup[3].displayHeight/2)
        drawWeaponDisplay(this, w/1.3, keyGroup[4].y + keyGroup[4].displayHeight/2)
    }





    createMobileDisplay = () => {
        const buttons = {
            'Angle': 'Tap on the dome and a crosshair will appear over the tank. Dragging left and right on screen will change the angle to fire in. Removing touch will select that angle.',
            'Fire': 'Fires the weapon based on the angle and power that were selected. Some specialty weapons like the Dirt Mover, Well Digger, Laser, etc... only use angle, power, or neither, so be aware that there are exceptions to the rule.',
            'Move': 'Move the tank a small distance, only 4 moves per game, you still get to shoot after moving',
            'Power': 'Tap the red power bar and power will flash continously. Drag left and right to change the amount of power that will be used to launch the bullet. Removing touch will select that power.',
            'Weapon': 'Tap on the weapon name for a weapon selection pop-up. Dragging up and down with change the selected weapon, which will be flashing yellow.'
        }

        var w = this.game.renderer.width
        var h = this.game.renderer.height

        const keyGroup = []
        const hyphenGroup = []
        const valueGroup = []

        var keyObject, valueObject, hyphenObject;
        var currentIndex = 0;
        var wrapWidth = 660
        var padding1 = 140
        var padding2 = 170
        
        var angleDisplay = drawAngleDisplay(this, w/2, h/1.5)
        var fireDisplay = drawFireBtn(this, w/2, h/1.5)
        var moveDisplay = drawMoveDisplay(this, w/2, h/1.5)
        var powerDisplay = drawPowerDisplay(this, w/2, h/1.5)
        var weaponDisplay = drawWeaponDisplay(this, w/2, h/1.5)
        var displayGroup = [angleDisplay, fireDisplay, moveDisplay, powerDisplay, weaponDisplay]

        for (let key in buttons) {
            keyObject = this.add.text(0, 0, key).setFontFamily('Verdana').setFontSize(34).setAlpha(0)
            hyphenObject = this.add.text(0, 0, '-').setFontFamily('Verdana').setFontSize(30).setAlpha(0)
            valueObject = this.add.text(0, 0, buttons[key]).setFontFamily('Verdana').setFontSize(30).setAlpha(0)

            keyObject.setColor('rgba(140,140,140,1)')
            hyphenObject.setColor('rgba(240,240,240,1)')
            valueObject.setColor('rgba(240,240,240,1)').setWordWrapWidth(wrapWidth)
            valueObject.width = 600

            keyGroup.push(keyObject)
            hyphenGroup.push(hyphenObject)
            valueGroup.push(valueObject)

            keyObject.setY(h/3)
            hyphenObject.setY(h/3)
            valueObject.setY(h/3)
        }

        for (let i = 0; i < keyGroup.length; i++) {
            displayGroup[i].forEach((gameObject) => {
                gameObject.setAlpha(0)
            })

            keyObject = keyGroup[i]
            hyphenObject = hyphenGroup[i]
            valueObject = valueGroup[i]

            var totalWidth = keyObject.displayWidth + hyphenObject.displayWidth + valueObject.displayWidth

            keyObject.setX(w/2 - totalWidth/2)
            hyphenObject.setX(w/2 - totalWidth/2 + keyObject.displayWidth + 15)
            valueObject.setX(w/2 - totalWidth/2 + keyObject.displayWidth + hyphenObject.displayWidth + 30)
        }

        this.tweens.add({
            targets: [keyGroup[currentIndex], hyphenGroup[currentIndex], valueGroup[currentIndex]],
            alpha: 1,
            duration: 500
        })
        this.tweens.add({
            targets: displayGroup[currentIndex],
            alpha: 1,
            duration: 500
        })

        var previousTimeout, previousInterval;

        const resetInterval = () => {
            if (previousInterval !== null) {
                clearInterval(previousInterval)
            }
            previousInterval = setInterval(() => {
                goToNext((currentIndex + 1) % 5)
            }, 3000);
        }

        resetInterval()

        const goToNext = (next) => {
            if (previousTimeout !== null) {
                clearTimeout(previousTimeout)
            }

            resetInterval()

            this.tweens.add({
                targets: [keyGroup[currentIndex], hyphenGroup[currentIndex], valueGroup[currentIndex]],
                alpha: 0,
                duration: 500,
            })
            this.tweens.add({
                targets: displayGroup[currentIndex],
                alpha: 0,
                duration: 500,
            })

            currentIndex = next;
            
            previousTimeout = setTimeout(() => {
                this.tweens.add({
                    targets: [keyGroup[next], hyphenGroup[next], valueGroup[next]],
                    alpha: 1,
                    duration: 500
                })

                this.tweens.add({
                    targets: displayGroup[next],
                    alpha: 1,
                    duration: 500
                })
            }, 500);
        }


        var previousArrow = this.add.text(w/12, h/2, String.fromCharCode(0x25C0)).setFontSize(50).setFontFamily('"Days One').setColor('rgba(240,240,240,1)').setPadding(20,20,20,20)
        var nextArrow = this.add.text(w * 11/12, h/2, String.fromCharCode(0x25B6)).setFontSize(50).setFontFamily('"Days One').setColor('rgba(240,240,240,1)').setPadding(20,20,20,20)
        strokeText(previousArrow, 6)
        strokeText(nextArrow, 6)

        previousArrow.setInteractive()
        nextArrow.setInteractive()
        previousArrow.on('pointerdown', () => {this.sound.play('click', {volume: 0.3}); var next = currentIndex < 1 ? 4 : (currentIndex - 1); goToNext(next);})
        nextArrow.on('pointerdown', () => {this.sound.play('click', {volume: 0.3}); var next = (currentIndex + 1) % 5; goToNext(next);})
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