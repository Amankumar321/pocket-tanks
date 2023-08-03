import { GameObjects, Physics } from "phaser";
import { Weapon } from "./Weapon";
import Phaser from "phaser";

export class Turret extends GameObjects.Sprite {
    /**
    * @param {Phaser.Scene} scene
    */

    constructor (scene, tank, id) {
        var canvas = document.createElement('canvas');
        canvas.height = 32 // turret height
        canvas.width = 2  // turret width
        
        if (scene.textures.exists('turret' + id)) scene.textures.remove('turret' + id)
        scene.textures.addCanvas('turret' + id, canvas);
        super(scene, 0, 0, 'turret' + id)
        scene.add.existing(this)

        this.tank = tank
        this.canvas = canvas
        this.scene = scene
        this.setDepth(-3)
        this.rotationDelta = 0.05
        this.relativeRotation = 0
        this.activeWeapon = null
        this.id = id
        this.powerFactor = 8
        this.gameType = this.scene.sceneData.gameType

        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');
        
        this.create()
    }



    create = () => {
        var ctx = this.canvas.getContext('2d')

        ctx.fillStyle = 'rgba(200,200,200,1)'

        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height/2)

        //this.createProjectile()
        const callback = () => {
            if (this.activeWeapon !== null) {
                this.activeWeapon.update()
            }
        }

        this.scene.physics.world.on('worldstep', callback, this)
    }

    update = () => {
        const crossAirRadius = 80
        var x = this.tank.body.x + (this.tank.height/2) * Math.sin(this.tank.rotation)
        var y = this.tank.body.y - (this.tank.height/2) * Math.cos(this.tank.rotation)
        this.setPosition(x, y)

        if (this.keyQ?.isDown) {
            if (this.tank.active) {
                if ((this.gameType === 3 && this.tank === this.scene.tank1) || this.gameType !== 3){
                    this.relativeRotation -= this.rotationDelta
                    this.setRotation(this.relativeRotation + this.tank.rotation)
                    const alpha = this.rotation
                    this.scene.HUD.crossAir.setPosition(this.x + crossAirRadius * Math.sin(alpha), this.y - crossAirRadius * Math.cos(alpha))
                    this.scene.HUD.crossAir.visibleTime = 40
                }
            }
        }
        if (this.keyE?.isDown) {
            if (this.tank.active) {
                if ((this.gameType === 3 && this.tank === this.scene.tank1) || this.gameType !== 3){
                    this.relativeRotation += this.rotationDelta
                    this.setRotation(this.relativeRotation + this.tank.rotation)
                    const alpha = this.rotation
                    this.scene.HUD.crossAir.setPosition(this.x + crossAirRadius * Math.sin(alpha), this.y - crossAirRadius * Math.cos(alpha))
                    this.scene.HUD.crossAir.visibleTime = 40
                }
            }
        }

        this.setRotation(this.relativeRotation + this.tank.rotation)
    }



    shoot = (selectedWeapon) => {
        this.activeWeapon = new Weapon(this.scene, this.tank, selectedWeapon) 
    }


    setRelativeRotation = (r) => {
        this.relativeRotation = r
        this.setRotation(this.relativeRotation + this.tank.rotation)
    }
}