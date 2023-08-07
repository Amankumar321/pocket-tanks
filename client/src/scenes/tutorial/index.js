import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';
import YoutubePlayer from 'phaser3-rex-plugins/plugins/youtubeplayer.js';

export class TutorialScene extends Scene {
    constructor() {
        super('tutorial-scene');

        
    }

    preload = () => {
        this.load.crossOrigin = 'anonymous';
        this.load.baseURL = 'https://www.google.com.br/';
    }


    create = () => {
        this.sound.stopByKey('intro')

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

        var w = this.game.renderer.width
        var h = this.game.renderer.height

        var youtubePlayer = new YoutubePlayer(this, 0, 0, w * 2/3, h * 2/3, { videoId: '4eRV5R78Iz0', autoPlay: true})
        youtubePlayer.setOrigin(0.5, 0.5).setVisible(false)

        var alertText = this.add.text(w/2, h/2, 'Loading Video...')
        alertText.setOrigin(0.5, 0.5).setFontSize(46).setFontFamily('"Days one"').setColor('rgba(240,240,240,1)')
        strokeText(alertText, 6)


        this.add.existing(youtubePlayer)
        .on('ready', function () {
            youtubePlayer.setPosition(w/2, h/2).setVisible(true);
            alertText.setVisible(false)
        })
        .on('statechange', function (player) {
            //console.log(player.videoStateString);
        })
        
        youtubePlayer.setPlaybackTime(196);
        //youtubePlayer.setMute(true)
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
