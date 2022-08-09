import { Scene, GameObjects, BlendModes, Textures } from 'phaser';

export class Scene2 extends Scene {
    constructor() {
        super('scene-2');
        
    }



    preload = () => {
        //this.load.baseURL = 'assets/';
        //this.load.image('tank', 'sprites/tank.png');
    }



    create = () => {
        this.fps = this.add.text(0, 0, this.game.loop.actualFps)

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const a = this.add.text(screenCenterX, screenCenterY - 200, 'One player');
        const b = this.add.text(screenCenterX, screenCenterY - 100, 'Two players');
        const c = this.add.text(screenCenterX, screenCenterY - 0, 'Play online');
        const d = this.add.text(screenCenterX, screenCenterY + 100, 'Target practice');

        a.setOrigin(0.5).setFontSize(40)
        b.setOrigin(0.5).setFontSize(40)
        c.setOrigin(0.5).setFontSize(40)
        d.setOrigin(0.5).setFontSize(40)

        var backbtn = this.add.rectangle(0, this.game.renderer.height, 100, 50, 0x8080F0, 1)
        
        backbtn.setInteractive()
        backbtn.on('pointerdown', () => {
            this.scene.start('scene-1')
        })

        a.setInteractive()
        b.setInteractive()
        c.setInteractive()
        d.setInteractive()

        a.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 1})
        })
        b.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 2})
        })
        c.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 3})
        })
        d.on('pointerdown', () => {
            this.scene.start('scene-3', {gameType: 4})
        })
    }



    update = (time, delta) => {
        this.fps.setText(this.game.loop.actualFps)
    
    }

}

