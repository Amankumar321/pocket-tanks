import Phaser from "phaser"
import { socket } from "../socket"
import { weaponArray } from "../weapons/array"

export class ScrollList {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Text} selected 
     */
    constructor(scene, selected, selectedDisplay, weaponLogo) {
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
        this.weaponLogo = weaponLogo

        this.tileHeight = 0
        this.tileWidth = 0

        this.x = 0
        this.y = 0

        this.logoCanvas = null

        this.sw = this.scene.renderer.width
        this.sh = this.scene.renderer.height

        //this.create()
    }



    create = () => {
        //this.scrollBox = this.scene.add.rectangle(this.x, this.y - 50, 100, 150, 0x222222, 0).setStrokeStyle(2, 0x000000, 1)
        //this.scrollBox.setDepth(9)
        //this.scrollBackground = this.scene.add.rectangle(this.x, this.y - 50, 100, 150, 0x222222, 255)
        //this.scrollBackground.setDepth(8)
        //this.tileHeight = this.scrollBackground.height/4
        this.tileWidth = this.scrollBackground.width

        this.x = this.scrollBackground.parentContainer.x + this.scrollBackground.x
        this.y = this.scrollBackground.parentContainer.y + this.scrollBackground.y

        this.scrollList = this.scene.add.group()
        //this.scrollTiles = this.scene.add.group()
        
        this.selectedDisplay.setInteractive()
        this.selectedDisplay.on('pointerdown', () => {
            this.scene.sound.play('click', {volume: 0.3})
            this.scene.hideTurnPointer()
            this.scene.input.mouse.requestPointerLock()
            this.toShow = true
        })

        this.scene.input.on('pointerdown', () => {
            if (this.scene.input.mouse.locked === true ) {
                if (this.activeItem !== null && this.visible) {
                    //this.scene.sound.play('click', {volume: 0.3})
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
        // this.scrollList.setY(this.sh * 5/6 - index * this.tileHeight, this.tileHeight)
        // this.scrollTiles.setY(this.sh * 5/6 - index * this.tileHeight, this.tileHeight)
        // this.scrollList.setY(this.sh * 5/6 - tank.selectedWeapon * this.tileHeight, this.tileHeight)
        // this.scrollTiles.setY(this.sh * 5/6 - tank.selectedWeapon * this.tileHeight, this.tileHeight)
        
        // if (this.scene.sceneData.gameType === 3) {
        //     socket.emit('changeWeapon', {index})
        // }

        var key = Math.random().toString(32).slice(3,7)
        var logoCanvas = weaponArray[tank.weapons[tank.selectedWeapon].id].logoCanvas
        if (this.scene.textures.exists(key)) this.scene.textures.remove(key)
        this.scene.textures.addCanvas(key, logoCanvas)
        this.weaponLogo.setTexture(key)
    }



    reset = (tank) => {
        var container, logoCanvas, txt, key, weaponLogo, margin, name;
        var weapons = tank.weapons
        this.scrollList.clear(true, true)
        //this.scrollTiles.clear(true, true)

        this.toHide = true

        this.selected.setText(weapons[tank.selectedWeapon]?.name)

        weapons.forEach((weapon, index) => {
            var w = this.tileWidth
            container = this.scene.add.container(this.x, this.y)
            key = Math.random().toString(32).slice(3,7)
            logoCanvas = weaponArray[weapon.id].logoCanvas
            if (this.scene.textures.exists(key)) this.scene.textures.remove(key)
            this.scene.textures.addCanvas(key, logoCanvas)
            margin = (this.tileHeight - logoCanvas.height * ((this.tileHeight/logoCanvas.height) * 0.9))/2
            weaponLogo = this.scene.add.image(-w/2 + margin, 0, key)
            weaponLogo.setOrigin(0, 0.5).setScale(this.tileHeight/weaponLogo.height * 0.9, this.tileHeight/weaponLogo.height * 0.9)

            var textWidth = this.tileWidth - weaponLogo.width + margin * 2
            name = this.scene.add.text(-this.tileWidth/2 + weaponLogo.width + margin * 2 + textWidth/2, 0, weapon.name).setFont('18px Geneva')
            name.setOrigin(0.5)

            container.add(weaponLogo)
            container.add(name)
            container.setData('textContent', name)

            this.scrollList.add(container)

            var g = this.scene.add.graphics()
            var gX = this.scrollBackground.parentContainer.x + this.scrollBackground.x
            var gY = this.scrollBackground.parentContainer.y + this.scrollBackground.y
            g.fillRect(gX - this.tileWidth/2, gY - this.scrollBackground.height/2, this.tileWidth, this.scrollBackground.height)
            var mask = new Phaser.Display.Masks.GeometryMask(this.scene, g)
            container.setMask(mask)
            
            //container.setInteractive(new Phaser.Geom.Rectangle(this.x - this.tileWidth/2, this.y - this.tileHeight/2, this.tileWidth, this.tileHeight))    
        });

        // this.scrollList.setY(this.sh * 5/6 - tank.selectedWeapon * this.tileHeight, this.tileHeight)
        // this.scrollTiles.setY(this.sh * 5/6 - tank.selectedWeapon * this.tileHeight, this.tileHeight)

        this.scrollList.setDepth(32)
        this.setActive(tank.selectedWeapon)


        var y = this.y - (tank.selectedWeapon) * this.tileHeight
        this.scrollList.setY(y, this.tileHeight)
        //this.scrollTiles.setDepth(30)
    }



    hide = () => {
        this.scrollList.setVisible(false)
        this.scrollBox.setVisible(false)
        //this.scrollTiles.setVisible(false)
        this.scrollBackground.setVisible(false)
        this.visible = false
    }



    show = () => {
        this.scrollBox.setVisible(true)
        this.scrollList.setVisible(true)
        this.scrollBackground.setVisible(true)
        //this.scrollTiles.setVisible(true)
        this.visible = true
    }



    update = () => {
        if (this.scene.input.mouse.locked && this.visible) {
            this.scrollList.children.each((child, index) => {
                var x = child.x
                var y = child.y
                var centreX = this.x
                var centreY = this.y
                var dist = Math.sqrt( Math.pow(x - centreX, 2) + Math.pow(y - centreY, 2) )
                if (dist < this.tileHeight/2) {
                    child.getData('textContent').setColor('yellow')
                    this.activeItem = index
                }
                else {
                    child.getData('textContent').setColor('white')
                }
            })

            this.scrollList.incY(this.scene.input.mousePointer.movementY)
            //this.scrollTiles.incY(this.scene.input.mousePointer.movementY)

            this.scrollList.setY(Math.min(this.scrollList.getChildren()[0].y, this.y), this.tileHeight)
            //this.scrollTiles.setY(Math.min(this.scrollTiles.getChildren()[0].y, this.y), this.tileHeight)

            this.scrollList.setY(Math.max(this.scrollList.getChildren()[0].y, this.y - (this.scrollList.getLength() - 1) * this.tileHeight), this.tileHeight)
            //this.scrollTiles.setY(Math.max(this.scrollTiles.getChildren()[0].y, this.y - (this.scrollTiles.getLength() - 1) * this.tileHeight), this.tileHeight)
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