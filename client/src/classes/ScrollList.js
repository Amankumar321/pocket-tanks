import Phaser from "phaser"
import { socket } from "../socket"

export class ScrollList {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Text} selected 
     */
    constructor(scene, selected, selectedDisplay) {
        this.scene = scene
        this.selected = selected
        this.selectedDisplay = selectedDisplay

        this.scrollBox = null
        this.scrollBackground = null
        this.scrollTiles = null
        this.scrollList = null
        this.activeItem = null
        this.toHide = false
        this.toShow = false
        this.visible = false

        this.sw = this.scene.renderer.width
        this.sh = this.scene.renderer.height

        this.create()
    }



    create = () => {
        this.scrollBox = this.scene.add.rectangle(this.selectedDisplay.x, this.selectedDisplay.y - 50, 100, 150, 0x222222, 0).setStrokeStyle(2, 0x000000, 1)
        this.scrollBox.setDepth(9)
        this.scrollBackground = this.scene.add.rectangle(this.selectedDisplay.x, this.selectedDisplay.y - 50, 100, 150, 0x222222, 255)
        this.scrollBackground.setDepth(8)

        this.scrollList = this.scene.add.group()
        this.scrollTiles = this.scene.add.group()
        
        this.selectedDisplay.setInteractive()
        this.selectedDisplay.on('pointerdown', () => {
            this.scene.input.mouse.requestPointerLock()
            this.toShow = true
        })

        this.scene.input.on('pointerdown', () => {
            if (this.scene.input.mouse.locked === true ) {
                if (this.activeItem !== null && this.visible) {
                    this.setActive(this.activeItem)
                    this.scene.input.mouse.releasePointerLock()
                    this.hide()
                    this.activeItem = null
                }
            }
        })

        // socket.on('setWeapon', ({index}) => {
        //     this.setActive(index)
        // })
    }



    setActive = (index) => {
        var tank = this.scene.activeTank === 1 ? this.scene.tank1 : this.scene.tank2
        //var index = this.activeItem
        tank.selectedWeapon = index
        this.selected.setText(tank.weapons[tank.selectedWeapon]?.name)
        this.scrollList.setY(this.sh * 5/6 - index * 50, 50)
        this.scrollTiles.setY(this.sh * 5/6 - index * 50, 50)
        this.scrollList.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)
        this.scrollTiles.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)
        
        // if (this.scene.sceneData.gameType === 3) {
        //     socket.emit('changeWeapon', {index})
        // }
    }



    reset = (tank) => {
        var x, y;
        var weapons = tank.weapons
        this.scrollList.clear(true, true)
        this.scrollTiles.clear(true, true)

        this.toHide = true

        this.selected.setText(weapons[tank.selectedWeapon]?.name)

        weapons.forEach((weapon, index) => {
            x = this.scene.add.text(this.selectedDisplay.x, this.selectedDisplay.y - 50, weapon.name)
            y = this.scene.add.rectangle(this.selectedDisplay.x, this.selectedDisplay.y - 50, 100, 50, 0x660000, 255)
            this.scrollList.add(x)
            this.scrollTiles.add(y)
            y.textContent = x

            var g = this.scene.add.graphics()
            g.fillRect(this.selectedDisplay.x, this.selectedDisplay.y - 50, 100, 150)
            g.setPosition(g.x - 50, g.y - 75)
            var mask = new Phaser.Display.Masks.GeometryMask(this.scene, g)
            y.setMask(mask)
            x.setMask(mask)
            
            x.setOrigin(0.5)
            x.setDepth(8)
            y.setInteractive().setOrigin(0.5)
            y.setDepth(8)    
        });

        this.scrollList.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)
        this.scrollTiles.setY(this.sh * 5/6 - tank.selectedWeapon * 50, 50)

        this.scrollList.setDepth(9)
        this.scrollTiles.setDepth(8)
    }



    hide = () => {
        this.scrollList.setVisible(false)
        this.scrollBox.setVisible(false)
        this.scrollTiles.setVisible(false)
        this.scrollBackground.setVisible(false)
        this.visible = false
    }



    show = () => {
        this.scrollBox.setVisible(true)
        this.scrollList.setVisible(true)
        this.scrollBackground.setVisible(true)
        this.scrollTiles.setVisible(true)
        this.visible = true
    }



    update = () => {
        if (this.scene.input.mouse.locked) {
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

            this.scrollList.incY(this.scene.input.mousePointer.movementY)
            this.scrollTiles.incY(this.scene.input.mousePointer.movementY)

            this.scrollList.setY(Math.min(this.scrollList.getChildren()[0].y, this.selectedDisplay.y - 50), 50)
            this.scrollTiles.setY(Math.min(this.scrollTiles.getChildren()[0].y, this.selectedDisplay.y - 50), 50)

            this.scrollList.setY(Math.max(this.scrollList.getChildren()[0].y, this.selectedDisplay.y - 50 - (this.scrollList.getLength() - 1) * 50), 50)
            this.scrollTiles.setY(Math.max(this.scrollTiles.getChildren()[0].y, this.selectedDisplay.y - 50 - (this.scrollTiles.getLength() - 1) * 50), 50)
        }

        else if (this.visible === true) {
            this.hide()
        }

        if (this.toHide) {
            this.hide()
            this.toHide = false
        }
        if (this.toShow) {
            this.show()
            this.toShow = false
        }
    }
}