import { Scene, GameObjects, BlendModes, Textures } from 'phaser';

export class Scene1 extends Scene {
    constructor() {
        super('scene-1');
        this.fps = null
        this.playbtn = null
    }



    preload = () => {
        //this.load.baseURL = 'assets/';
        //this.load.image('tank', 'sprites/tank.png');
    }



    create = () => {
        this.fps = this.add.text(0, 0, this.game.loop.actualFps)

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const a = this.add.text(screenCenterX, screenCenterY - 200, 'Pocket');
        const b = this.add.text(screenCenterX, screenCenterY - 50, 'Tanks');

        a.setOrigin(0.5).setFontSize(200)
        b.setOrigin(0.5).setFontSize(200)
        
        this.createPlayBtn()
    }

    createPlayBtn = () => {
        var width = 260
        var height = 120
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //this.playbtn = this.add.rectangle(screenCenterX, screenCenterY + 200, 100, 50, 0x8080F0, 1)
        this.playbtn = this.add.graphics()
        this.playbtn.fillStyle(0xffff00, 1);
        this.playbtn.fillRoundedRect(screenCenterX - width/2, screenCenterY + 200, width, height, height/2);

        this.playbtn.setInteractive()
        this.playbtn.on('pointerdown', () => {
            this.scene.start('scene-2')
        })
    }



    update = (time, delta) => {
        this.fps.setText(this.game.loop.actualFps)
    
    }

}
