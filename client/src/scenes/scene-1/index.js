import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import WebFontFile from '../../classes/WebFontFile';
import Phaser from 'phaser';
import assetLoader from '../../weapons/sounds'
import { createPlayButton } from '../../graphics/play-btn';
import { Tween } from '../../classes/Tween';
import { Collider } from '../../classes/Collider';

export class Scene1 extends Scene {
    constructor() {
        super('scene-1');
        this.fps = null
        this.playbtn = null
        this.k = null
        //this.clicktext = null
    }



    preload = () => {
        //
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
        //this.fps = this.add.text(0, 0, this.game.loop.actualFps)
        //this.clicktext = this.add.text(0, 0, "click").setFontFamily('Verdana').setVisible(false).setFontSize(14)

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //const a = this.add.text(screenCenterX, screenCenterY - 200, 'Pocket');
        //const b = this.add.text(screenCenterX, screenCenterY - 50, 'Tanks');

        var cover = this.physics.add.image(screenCenterX, screenCenterY - 500, 'cover').setScale(1.01)

        this.tweens.add({
            targets: cover,
            y: cover.y + 400,
            ease: 'Bounce.Out',
            duration: 2200
        })

        //a.setOrigin(0.5).setFontSize(200)
        //b.setOrigin(0.5).setFontSize(200)
        this.createPlayBtn()
        this.sound.stopAll()

        // var intro = this.sound.add('intro', {loop: true})
        // intro.play()
        this.sound.stopByKey('winner')
        this.sound.play('intro', {loop: true})

        //this.sound.add('click')

        this.input.on('pointerdown', () => {
            if (window.game.sound.mute === true) {
                window.game.sound.mute = false
            }
        })

        const w = this.cameras.main.width

        var [contactOption, contactBox] = this.createOption('address-book-regular', 'Guide', w * 5/7, screenCenterY * 5/3 - 50)
        contactOption.setDisplaySize(80, 60)
        this.addClickable(contactOption)

        var [aboutOption, aboutsBox] = this.createOption('question-solid', 'About', w * 2/7, screenCenterY * 5/3 - 50)
        aboutOption.setDisplaySize(60, 80)
        this.addClickable(aboutOption)

        var [controlsOption, controlsBox] = this.createOption('keyboard-regular', 'Controls', w * 1/7, screenCenterY * 5/3 - 50)
        controlsOption.setDisplaySize(100, 80)
        this.addClickable(controlsOption)

        var [tutorialOption, tutorialBox] = this.createOption('youtube', 'Tutorial', w * 6/7, screenCenterY * 5/3 - 50)
        tutorialOption.setDisplaySize(100, 80)
        this.addClickable(tutorialOption)

        //

        var canvas = document.createElement('canvas')
        canvas.width = 40
        canvas.height = 40
        var ctx = canvas.getContext('2d')
        ctx.fillStyle = 'rgba(0,255,0,1)'
        ctx.beginPath()
        ctx.arc(20, 20, 20, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        //
        // var fullscreen = this.add.rectangle(screenCenterX + 400,screenCenterY * 1.7,200,200,0xff0000)
        // fullscreen.setInteractive({draggable: true})
        // fullscreen.on('pointerdown', this.toggleFullscreen)
        // fullscreen.setVisible(false)
        //fullscreen.on('dragend', () => {alert()})
        //this.k = new WeaponShopScroll(this)
        //this.k.reset([{name: 'abd', id: 1}, {name: 'd', id: 2}, {name: 'ad', id: 3}, {name: 'sd', id: 4}, {name: 'td', id: 5}])
    }

    createPlayBtn = () => {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        var canvas = createPlayButton()

        var playtxt = this.add.text(screenCenterX, screenCenterY * 5/3 - 50, 'play', {font: '400 Cabin'})
        playtxt.setDepth(20)
        playtxt.setColor('rgba(240,240,240,1)')
        playtxt.setStroke('rgba(155,155,155,1)', 4)
        playtxt.setFontSize(75)
        playtxt.setOrigin(0.5, 0.55)

        var playtexture = this.textures.addCanvas('play-btn', canvas, true)
        this.playbtn = this.add.image(screenCenterX, screenCenterY * 5/3 - 50, playtexture)

       this.clicktext = this.add.text(0, 0, "click").setFontFamily('Verdana').setVisible(false).setFontSize(14).setDepth(20).setStroke('rgba(80,80,80,1)', 4)


        this.playbtn.setInteractive()
        this.playbtn.on('pointerdown', () => {
            this.sound.play('click', {volume: 0.3})
            this.scene.start('scene-2')
        })

        //this.addClickable(this.playbtn)
    }


    addClickable = (btn) => {
        return
        btn.on('pointermove', () => {
            //this.clicktext.setPosition(this.input.mousePointer.x, this.input.mousePointer.y + 32)
        })

        btn.on('pointerover', () => {
            //this.clicktext.setPosition(this.input.mousePointer.x, this.input.mousePointer.y + 32)
            //this.clicktext.setVisible(true)
        })

        btn.on('pointerout', () => {
            //this.clicktext.setVisible(false)
        })
    }

    createOption = (image, text, x, y) => {
        var option = this.add.image(x, y - 15, image).setAlpha(0.8).setOrigin(0.5, 0.5)
        var box = this.add.rectangle(x, y, 120, 120).setStrokeStyle(2, 0xcccccc, 0)
        box.setInteractive()
        box.on('pointerover', () => {
            box.setStrokeStyle(2, 0xcccccc, 1)
        })
        box.on('pointerout', () => {
            box.setStrokeStyle(2, 0xcccccc, 0)
        })
        this.add.text(x, y + 40, text).setOrigin(0.5, 0.5).setFontFamily('Verdana')
        option.setInteractive()
        return [option, box]
    }


    update = (time, delta) => {
        //this.collider.update()
    }

}
