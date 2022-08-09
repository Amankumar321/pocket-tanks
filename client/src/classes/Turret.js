import { GameObjects, Physics } from "phaser";
import { Weapon } from "./Weapon";

export class Turret extends GameObjects.Sprite {
    /**
    * @param {Phaser.Scene} scene
    */

    constructor (scene, tank, id) {
        var canvas = document.createElement('canvas');
        canvas.height = 32 // turret height
        canvas.width = 2  // turret width
        
        scene.textures.addCanvas('turret' + id, canvas);
        super(scene, 0, 0, 'turret' + id)
        scene.add.existing(this)

        this.tank = tank
        this.canvas = canvas
        this.scene = scene
        this.setDepth(-2)
        this.rotationDelta = 0.05
        this.relativeRotation = 0
        this.activeWeapon = null
        this.id = id
        this.powerFactor = 8

        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');
        
        this.create()
    }



    create = () => {
        var ctx = this.canvas.getContext('2d')

        ctx.fillStyle = 'rgba(200,200,200,1)'

        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height/2)

        //this.createProjectile()
    }

    update = () => {
        var x = this.tank.x + (this.tank.height/2) * Math.sin(this.tank.rotation)
        var y = this.tank.y - (this.tank.height/2) * Math.cos(this.tank.rotation)
        this.setPosition(x, y)

        if (this.keyQ?.isDown) {
            if (this.tank.active)
                this.relativeRotation -= this.rotationDelta
        }
        if (this.keyE?.isDown) {
            if (this.tank.active)
                this.relativeRotation += this.rotationDelta
        }

        this.setRotation(this.relativeRotation + this.tank.rotation)

        if (this.activeWeapon !== null) {
            this.activeWeapon.update()
        }
    }



    shoot = (selectedWeapon) => {
        this.activeWeapon = new Weapon(this.scene, this.tank, selectedWeapon) 
    }

}