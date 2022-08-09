import { Textures } from "phaser";
import { ScrollList } from "./ScrollList";
import { socket } from "../socket";

export class HUD extends Textures.CanvasTexture {

    /**
    * @param {Phaser.Scene} scene 
    */

    constructor (scene) { 
        var width = scene.game.renderer.width
        var height = scene.game.renderer.height
        
        var canvas = document.createElement('canvas');
        canvas.height = height
        canvas.width = width
        scene.textures.addCanvas('hud', canvas);
        scene.add.image(width/2, height/2, 'hud').setDepth(4);

        super(scene.textures, 'hud', canvas, canvas.width, canvas.height)

        this.canvas = canvas
        this.scene = scene
        this.width = canvas.width;
        this.height = canvas.height;
        this.fireButton = null
        this.powerDisplay = null
        this.weaponDisplay = null
        this.weaponName = null
        this.weaponScrollDisplay = null
        this.scoreDisplay1 = null
        this.scoreDisplay2 = null
        this.overlay = null
        
        this.create()
    }



    create = () => {
        var width = this.width
        var height = this.height
    
        var ctx = this.canvas.getContext('2d')

        ctx.fillStyle = 'rgba(40,40,40,1)'
    
        ctx.moveTo(0, height)
        ctx.lineTo(0, height * 2/3)
        ctx.lineTo(width, height * 2/3)
        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()

        this.createFireButton()
        this.createPowerDisplay()
        this.createWeaponDisplay()
        this.createWeaponScrollDisplay()
        this.createOverlay()

        this.scoreDisplay1 = this.scene.add.text(0, 0, this.scene.tank1.name + '\n' + this.scene.tank1.score)
        this.scoreDisplay2 = this.scene.add.text(this.width, 0, this.scene.tank2.name + '\n' + this.scene.tank2.score)
        this.scoreDisplay1.setOrigin(0, 0)
        this.scoreDisplay2.setOrigin(1, 0)
    
        this.update()

        this.scene.input.mouse.onMouseDown = () => {
            if (this.scene.input.mouse.locked)
                this.weaponScrollList.incY(this.scene.input.mousePointer.movementY/10)
        }
    }



    createOverlay = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d')
        canvas.height = this.height * 1/3
        canvas.width = this.width

        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    
        this.scene.textures.addCanvas('hud-overlay', canvas);
        
        this.overlay = this.scene.add.image(this.width/2, this.height * 5/6, 'hud-overlay')
        this.overlay.setDepth(100)
        this.overlay.visible = false
        this.overlay.setInteractive()
    } 

    

    createFireButton = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d')
        canvas.height = 40 
        canvas.width = 100

        ctx.fillStyle = 'rgba(200,0,0,1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    
        this.scene.textures.addCanvas('fireButton', canvas);
        
        this.fireButton = this.scene.add.image(this.width/2, this.height * 5/6, 'fireButton')
        this.fireButton.setDepth(6)
        this.fireButton.setInteractive();

        this.fireButton.on('pointerdown', () => {
            if (this.scene.activeTank === 1) {
                if (this.scene.sceneData.gameType === 3)
                    socket.emit('shoot', {selectedWeapon: this.scene.tank1.selectedWeapon, power: this.scene.tank1.power, rotation: this.scene.tank1.turret.rotation})
                this.scene.tank1.shoot()
            }
            else if (this.scene.activeTank === 2) {
                if (this.scene.sceneData.gameType === 3)
                    socket.emit('shoot', {selectedWeapon: this.scene.tank2.selectedWeapon, power: this.scene.tank2.power, rotation: this.scene.tank2.turret.rotation})
                this.scene.tank2.shoot()
            }
        })
    }



    createPowerDisplay = () => {
        this.powerDisplay = this.scene.add.text(this.width/2 - 200, this.height * 5/6, '')
        this.powerDisplay.setDepth(6)
    }



    createWeaponDisplay = () => {
        this.weaponDisplay = this.scene.add.rectangle(this.width/2 + 200, this.height * 5/6, 100, 50, 0x000000, 0).setStrokeStyle(2, 0x000000, 1)
        this.weaponName = this.scene.add.text(this.width/2 + 200, this.height * 5/6, '')
        this.weaponName.setDepth(7).setOrigin(0.5)
        this.weaponDisplay.setInteractive()
        this.weaponDisplay.setDepth(6)
    }



    createWeaponScrollDisplay = () => {
        this.weaponScrollDisplay = new ScrollList(this.scene, this.weaponName, this.weaponDisplay)
    }


    
    reset = () => {
        if (this.scene.activeTank === 1) {
            this.powerDisplay.setText(this.scene.tank1.power)
            this.weaponName.setText(this.scene.tank1.weapons[this.scene.tank1.selectedWeapon]?.name)
            this.weaponScrollDisplay.reset(this.scene.tank1)
        }
        else if (this.scene.activeTank === 2) {
            this.powerDisplay.setText(this.scene.tank2.power)
            this.weaponName.setText(this.scene.tank2.weapons[this.scene.tank2.selectedWeapon]?.name)
            this.weaponScrollDisplay.reset(this.scene.tank2)
        }
    }



    disable = () => {
        this.overlay.visible = true
    }



    enable = () => {
        this.overlay.visible = false
    }


    refresh = () => {
        if (this.scene.activeTank === 1) {
            this.powerDisplay.setText(this.scene.tank1.power)
        }
        else if (this.scene.activeTank === 2) {
            this.powerDisplay.setText(this.scene.tank2.power)
            
        }

        if ((this.scene.tank1.turret.activeWeapon !== null) || (this.scene.tank2.turret.activeWeapon !== null)) {
            this.disable()
        }
        else {
            if (this.scene.tank1.active === true) {
                this.enable()
            }
            else {
                if (this.scene.sceneData.gameType === 1 || this.scene.sceneData.gameType === 3) {
                    this.disable()
                }
                if (this.scene.sceneData.gameType === 2 || this.scene.sceneData.gameType === 4) {
                    this.enable()
                }
            }
        }

        this.scoreDisplay1.setText(this.scene.tank1.name + '\n' + this.scene.tank1.score)
        this.scoreDisplay2.setText(this.scene.tank2.name + '\n' + this.scene.tank2.score)

        this.weaponScrollDisplay.update()
    }
}