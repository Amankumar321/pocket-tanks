import Phaser from "phaser"
import { socket } from "../socket"

export class WeaponShopScroll {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Text} selected 
     */
    constructor(scene) {
        this.scene = scene

        this.scrollBox = null
        this.scrollBackground = null
        this.scrollTiles = null
        this.scrollList = null
        this.activeItem = null
        this.visible = true
        this.dragY = 0
        this.previousDragY = 0
        this.scrollY = 0
        this.list = []

        this.sw = this.scene.renderer.width
        this.sh = this.scene.renderer.height

        this.create()
    }



    create = () => {
        this.scrollBox = this.scene.add.rectangle(this.sw/2 + 200, this.sh * 5/6, 100, 150, 0x222222, 0).setStrokeStyle(2, 0x000000, 1)
        this.scrollBox.setDepth(9)
        this.scrollBackground = this.scene.add.rectangle(this.sw/2 + 200, this.sh * 5/6, 100, 150, 0x222222, 255)
        this.scrollBackground.setDepth(8)

        this.scrollList = this.scene.add.group()
        this.scrollTiles = this.scene.add.group()
        
        // this.scrollBox.on('pointerdown', () => {
        //     if (this.activeItem !== null && this.visible) {
        //         this.list.splice(this.activeItem, 1)
        //         this.reset(this.list)
        //         //this.setActive(this.activeItem)
        //         this.activeItem = null
        //     }
        // })
        
        this.scrollBox.setInteractive({draggable: true})
        
        this.scrollBox.on('dragstart', (pointer, dragX, dragY) => {
            this.previousDragY = pointer.downY
            this.dragY = pointer.downY
        })

        this.scrollBox.on('drag', (pointer, dragX, dragY) => {
            this.previousDragY = this.dragY 
            this.dragY = pointer.y
            this.scrollY = -this.dragY + this.previousDragY
        })

        this.scrollBox.on('dragend', (pointer, dragX, dragY) => {
            this.dragY = pointer.upY
            this.scrollY = -this.dragY + this.previousDragY
        })

        this.scrollBox.on('wheel', (pointer, scrollX, scrollY) => {
            this.allowScroll = true
            this.scrollY = scrollY
        })
    }



    setActive = (index) => {
        // this.selected.setText(tank.weapons[tank.selectedWeapon]?.name)
        this.scrollList.setY(this.sh * 5/6 - index * 50, 50)
        this.scrollTiles.setY(this.sh * 5/6 - index * 50, 50)
        // this.scrollList.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)
        // this.scrollTiles.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)
        
        // if (this.scene.sceneData.gameType === 3) {
        //     socket.emit('changeWeapon', {index})
        // }
    }



    reset = (w) => {
        var x, y;
        this.list = w
        var weapons = w
        this.scrollList.clear(true, true)
        this.scrollTiles.clear(true, true)

        weapons.forEach((weapon, index) => {
            x = this.scene.add.text(this.sw/2 + 200, this.sh * 5/6, weapon.name).setFontSize(40)
            y = this.scene.add.rectangle(this.sw/2 + 200, this.sh * 5/6, 100, 50, 0x660000, 255)
            this.scrollList.add(x)
            this.scrollTiles.add(y)
            y.textContent = x

            var g = this.scene.add.graphics()
            g.fillRect(this.sw/2 + 200, this.sh * 5/6, 100, 150)
            g.setPosition(g.x - 50, g.y - 75)
            var mask = new Phaser.Display.Masks.GeometryMask(this.scene, g)
            y.setMask(mask)
            x.setMask(mask)
            
            x.setOrigin(0.5)
            x.setDepth(8)
            y.setInteractive().setOrigin(0.5)
            y.setDepth(8)    
        });

        this.scrollList.setDepth(9)
        this.scrollTiles.setDepth(8)

        this.scrollList.setY(this.sh * 5/6, 50)
        this.scrollTiles.setY(this.sh * 5/6, 50)
    }

    update = () => {
        if (true) {
            this.scrollTiles.children.each((child, index) => {
                var x = child.x
                var y = child.y
                var centreX = this.scrollBox.x
                var centreY = this.scrollBox.y
                var dist = Math.sqrt( Math.pow(x - centreX, 2) + Math.pow(y - centreY, 2) )
                if (dist < 25) {
                    child.textContent.setColor('yellow')
                    this.activeItem = index
                }
                else {
                    child.textContent.setColor('white')
                }
            })

            this.scrollList.incY(-this.scrollY)
            this.scrollTiles.incY(-this.scrollY)
            //this.scrollList.incY(this.dragY - this.previousDragY, 50)
            //this.scrollTiles.incY(this.dragY - this.previousDragY, 50)

            this.scrollY = 0
            //this.previousDragY = this.dragY

            this.scrollList.setY(Math.min(this.scrollList.getChildren()[0].y, this.sh * 5/6), 50)
            this.scrollTiles.setY(Math.min(this.scrollTiles.getChildren()[0].y, this.sh * 5/6), 50)
            //this.scrollList.setY(Math.min(this.scrollY, this.sh * 5/6), 50)
            //this.scrollTiles.setY(Math.min(this.scrollY, this.sh * 5/6), 50)
            

            this.scrollList.setY(Math.max(this.scrollList.getChildren()[0].y, this.sh * 5/6 - (this.scrollList.getLength() - 1) * 50), 50)
            this.scrollTiles.setY(Math.max(this.scrollTiles.getChildren()[0].y, this.sh * 5/6 - (this.scrollTiles.getLength() - 1) * 50), 50)
        }
    }
}