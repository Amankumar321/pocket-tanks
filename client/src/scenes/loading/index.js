import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import WebFontFile from '../../classes/WebFontFile';
import Phaser from 'phaser';
import assetLoader from '../../weapons/sounds'
import { createBeginButton } from '../../graphics/begin-btn';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
        this.fps = null
        this.checkResize = null
    }


    preload = () => {
        if (window.sdk === 'crazygames') {
            window.CrazyGames.SDK.game.sdkGameLoadingStart();
        }
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('compress', 'assets/images/compress.png')
        this.load.image('expand', 'assets/images/expand.png')
    }


    create = () => {
        this.sound.stopAll()

        window.game.sound.mute = false

        this.load.image('cover', 'assets/images/c.png')
        this.load.image('pt_3', 'assets/images/pt_3.png')
        this.load.image('pt_4', 'assets/images/pt_4.png')
        this.load.image('pt_5', 'assets/images/pt_5.png')

        this.load.image('ptss1', 'assets/images/ptss1.png')
        this.load.image('ptss2', 'assets/images/ptss2.png')
        this.load.image('ptss3', 'assets/images/ptss3.png')
        this.load.image('ptss4', 'assets/images/ptss4.png')
       
        this.load.image('clapperboard', 'assets/images/clapperboard.png')
        this.load.image('exit', 'assets/images/exit.png')
        this.load.image('face-frown-regular', 'assets/images/face-frown-regular.png')
        this.load.image('address-book-regular', 'assets/images/address-book-regular.png')
        this.load.image('question-solid', 'assets/images/question-solid.png')
        this.load.image('keyboard-regular', 'assets/images/keyboard-regular.png')
        this.load.image('youtube', 'assets/images/youtube.png')
        this.load.image('screenshot', 'assets/images/screenshot.png')
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

        loadingText.setOrigin(0.5, 1).setFontSize(36).setFontFamily('Verdana').setFontStyle('bold');

        var beginbtn = this.addBeginButton()
        this.addScreenResize()

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




    addBeginButton = () => {
        var w = this.renderer.width
        var h = this.renderer.height

        var beginbtnctx = createBeginButton(this)
        var texture = this.textures.addCanvas('begin-btn', beginbtnctx, true)
        var beginbtn = this.add.image(w/2, h * 4/5, texture).setVisible(false)

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
        })

        return beginbtn
    }



    addScreenResize = () =>{
        var w = this.renderer.width
        
        var resizeScreenContainer = this.add.container(w - 30, 30)
        var resizeScreenText = this.add.text(0, 0, 'Fullscreen').setOrigin(1, 0).setFontFamily('Verdana').setFontSize(18).setPadding(0,0,10,0).setColor('rgba(240,240,240,1)')
        var expandScreenIcon = this.add.image(0, 0, 'expand').setOrigin(1, 0).setDisplaySize(20, 20).setAlpha(0.8)
        var compressScreenIcon = this.add.image(0, 0, 'compress').setOrigin(1, 0).setDisplaySize(20, 20).setVisible(false).setAlpha(0.8)

        if (!this.game.device.os.desktop) {
            resizeScreenText.setFontSize(30)
            expandScreenIcon.setDisplaySize(30, 30)
            compressScreenIcon.setDisplaySize(30, 30)
        }

        resizeScreenText.setX(resizeScreenText.x - expandScreenIcon.displayWidth)
        resizeScreenContainer.add([resizeScreenText, expandScreenIcon, compressScreenIcon])

        const onClickResize = () => {
            if (this.game.scale.isFullscreen === true) {
                this.game.scale.stopFullscreen()
            }
            else {
                this.game.scale.startFullscreen()
            }
        }

        resizeScreenText.setInteractive()
        expandScreenIcon.setInteractive()
        compressScreenIcon.setInteractive()
        resizeScreenText.on('pointerup', onClickResize)
        expandScreenIcon.on('pointerup', onClickResize)
        compressScreenIcon.on('pointerup', onClickResize)

        this.checkResize = () => {
            if (this.game.scale.isFullscreen === false) {
                resizeScreenText.setText('Fullscreen')
                compressScreenIcon.setVisible(false)
                expandScreenIcon.setVisible(true)
            }
            else {
                resizeScreenText.setText('Minimise')
                compressScreenIcon.setVisible(true)
                expandScreenIcon.setVisible(false)
            }
        }
    }




    update = () => {
        if (this.checkResize !== null) {
            this.checkResize()
        }
    }
}
