import { Scene, GameObjects, BlendModes, Textures } from 'phaser';
import { type1 } from './types/type1';
import { type2 } from './types/type2';
import { type3 } from './types/type3';
import { type4 } from './types/type4';

export class Scene3 extends Scene {
    constructor() {
        super('scene-3');
        this.sceneData = null;
    }



    init = (data) => {
        this.sceneData = data
    }



    preload = () => {
        //this.load.baseURL = 'assets/';
        //this.load.image('tank', 'sprites/tank.png');
    }



    create = () => {
        this.fps = this.add.text(0, 0, this.game.loop.actualFps)

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


        var backbtn = this.add.rectangle(0, this.game.renderer.height, 100, 50, 0x8080F0, 1)
    
        backbtn.setInteractive()
        backbtn.on('pointerdown', () => {
            this.scene.start('scene-2')
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
        type4(this);
    }



    update = (time, delta) => {
        this.fps.setText(this.game.loop.actualFps)
    
    }

}
