import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import { type1 } from './types/type1';
import { type2 } from './types/type2';
import { type3 } from './types/type3';
import { type4 } from './types/type4';
import { drawBackBtn } from '../../graphics/back-btn';

export class Scene4 extends Scene {
    constructor() {
        super('scene-4');
        this.sceneData = null
    }



    init = (data) => {
        this.sceneData = data
    }



    preload = () => {
        //this.sound.add('click')
        //this.load.baseURL = 'assets/';
        //this.load.image('tank', 'sprites/tank.png');
    }



    create = () => {
        //this.fps = this.add.text(0, 0, this.game.loop.actualFps)

        if (this.sceneData.gameType === 1) {
            this.handleType1()
        }
        else if (this.sceneData.gameType === 2) {
            this.handleType2()
        }
        else if (this.sceneData.gameType === 3) {
            this.handleType3()
        }
        else if (this.sceneData.gameType === 4) {
            this.handleType4()
        }


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
            this.sound.play('click', {volume: 0.3})
            if (this.sceneData.gameType === 3) {
                const socket = window.socket
                socket.emit('leaveRoom', {})
            }
            this.scene.start('scene-3', {gameType: this.sceneData.gameType})
        })
    }



    handleType1 = () => {
        type1(this)
    }



    handleType2 = () => {
        type2(this)
    }



    handleType3 = () => {
        type3(this)
    }



    handleType4 = () => {
        type4(this)
    }



    update = (time, delta) => {
        //this.fps.setText(this.game.loop.actualFps)
    }

}

