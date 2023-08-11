import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import WebFontFile from '../../classes/WebFontFile';
import Phaser from 'phaser';
import assetLoader from '../../weapons/sounds'
import { createBeginButton } from '../../graphics/begin-btn';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
        this.fps = null
        this.playbtn = null
        this.k = null
        //this.clicktext = null
    }


    preload = () => {
        if (window.sdk === 'crazygames') {
            window.CrazyGames.SDK.game.sdkGameLoadingStart();
        }
        this.load.image('logo', 'assets/images/logo.png');
    }


    create = () => {

        this.sound.stopAll()

        // this.input.on('pointerdown', () => {
        //     if (window.game.sound.mute === true) {
        //         window.game.sound.mute = false
        //     }
        // })

        window.game.sound.mute = false

        this.load.image('cover', 'assets/images/c.png')
        this.load.image('pt_3', 'assets/images/pt_3.png')
        this.load.image('pt_4', 'assets/images/pt_4.png')
        this.load.image('pt_5', 'assets/images/pt_5.png')
        this.load.svg('clapperboard', 'assets/images/clapperboard.svg')
        this.load.svg('face-frown-regular', 'assets/images/face-frown-regular.svg')
        this.load.svg('address-book-regular', 'assets/images/address-book-regular.svg')
        this.load.svg('question-solid', 'assets/images/question-solid.svg')
        this.load.svg('keyboard-regular', 'assets/images/keyboard-regular.svg')
        this.load.svg('youtube', 'assets/images/youtube.svg')
        this.load.image('wall', 'assets/images/wall.png');
        this.load.audio('intro', ['assets/sounds/intro.mp3'])
        this.load.audio('background', ['assets/sounds/background.mp3'])
        this.load.audio('click', ['assets/sounds/click.wav'])
        this.load.addFile(new WebFontFile(this.load, ['Cabin:400', 'Days One']))

        this.load.audio('rocks_1', ['assets/sounds/others/rocks_1.wav'])
        this.load.audio('rocks_2', ['assets/sounds/others/rocks_2.wav'])
        this.load.audio('rocks_3', ['assets/sounds/others/rocks_3.wav'])
        this.load.audio('rocks_4', ['assets/sounds/others/rocks_4.wav'])
        this.load.audio('rocks_5', ['assets/sounds/others/rocks_5.wav'])
        this.load.audio('rocks_6', ['assets/sounds/others/rocks_6.wav'])

        this.load.audio('winner', ['assets/sounds/winner.mp3'])

        assetLoader(this)

        var w = this.renderer.width
        var h = this.renderer.height

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        this.add.image(w/2, h * 4/10, 'logo').setOrigin(0.5, 0.5)

        var loadingText = this.make.text({x: w / 2, y: h * 4/5, text: 'Loading',
            style: {
                fill: '#cccccc',
            }
        });

        //this.add.rectangle(0, 0, this.renderer.width, this.renderer.height, 0x000000).setOrigin(0, 0).setDepth(-5)

        loadingText.setOrigin(0.5, 1).setFontSize(36).setFontFamily('Verdana').setFontStyle('bold');

        //var beginbtn = this.add.rectangle(w / 2, h * 4/5, 200, 50, 0x444444).setOrigin(0.5, 0.5).setVisible(false)
       // var begintext = this.add.text(w/2, h * 4/5, "Begin Game", {fill: '#eeeeee'}).setFontFamily('Verdana').setFontStyle('bold').setFontSize(24).setOrigin(0.5,0.5).setVisible(false)

       var beginbtnctx = createBeginButton()
       var texture = this.textures.addCanvas('begin-btn', beginbtnctx, true)
       var beginbtn = this.add.image(w/2, h * 4/5, texture).setVisible(false)
       //this.clicktext = this.add.text(0, 0, "click").setFontFamily('Verdana').setVisible(false).setFontSize(14).setStroke('rgba(80,80,80,1)', 4)

        beginbtn.setInteractive()
        beginbtn.on('pointerdown', () => {
            if (window.sdk === 'gdsdk') {
                var gdsdk = window.gdsdk
                if (typeof gdsdk !== undefined && gdsdk.showAd !== undefined) {
                    gdsdk.showAd()
                    this.scene.start('scene-1')
                }
            }
            else {
                this.scene.start('scene-1')
            }
            //this.displayAd()
        })

        progressBox.lineStyle(2, 0xcccccc)
        progressBox.strokeRect(w/2 - 160, h * 4/5 + 15, 320, 40);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xeeeeee, 1);
            progressBar.fillRect(w/2 - 150, h * 4/5 + 20, 300 * value, 30);
        });
    
        this.load.on('complete', function () {
            progressBar.destroy(true)
            progressBox.destroy(true)
            loadingText.destroy(true)
            beginbtn.setVisible(true)

            if (window.sdk === 'crazygames') {
                window.CrazyGames.SDK.game.sdkGameLoadingStop();
            }
            //begintext.setVisible(true)
        });

        this.load.start()
    }


    update = () => {
       
    }
}