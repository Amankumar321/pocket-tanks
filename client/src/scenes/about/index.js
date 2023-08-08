import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { drawBackBtn } from '../../graphics/back-btn';

export class AboutScene extends Scene {
    constructor() {
        super('about-scene');

        
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

        var header = '"The Ultimate One-on-One Artillery Game"'

        var aboutText1 = `
        The fastest game of artillery you\'ll ever play. Pocket Tanks is designed to be easy to
        learn, and fun to master. All the excitement of lobbing projectiles over a mound of dirt
        without all the complicated details found in most artillery games. Select your angle,
        power, and fire over 30 distinct weapons at your opponent. There is an innovative
        weapon shop to keep the game moving fast and a target practice mode for
        experimenting with all the weapons "no holds barred!"`
        
        var aboutText2 = `This is a remake of famous game Pocket Tanks from 2001 which is available on windows, Mac, iOS and
        android with over 500k download on play store. You would find a lot of videos on YouTube of
        gameplay. This is a web version of the game and it allows online multiplayer which means you can
        invite your friends to play against you. Just select Online Multiplayer mode, create your room and
        ask you friend to join it. You can play against CPU level 8 when you have mastered the game and
        want to test your skills !`

        var w = this.game.renderer.width
        var h = this.game.renderer.height

        this.add.text(w/2, h/5, header).setFontFamily('Verdana').setOrigin(0.5, 0.5).setFontSize(32)
        this.add.text(w/2, h/2.6, aboutText1).setFontFamily('Verdana').setOrigin(0.5, 0.5).setFontSize(21).setAlign('center')
        //this.add.text(w/2, h/2, aboutText2).setFontFamily('Verdana').setWordWrapWidth(400)
        
        var pt1 = this.add.image(w/2 - 10, h/1.4, 'pt_4')
        var pt2 = this.add.image(w/2 + 10, h/1.4, 'pt_5')
      
        pt1.setOrigin(1, 0.5)
        pt2.setOrigin(0, 0.5)

    }
}