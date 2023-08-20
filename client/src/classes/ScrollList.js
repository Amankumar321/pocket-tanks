import Phaser, { Time } from "phaser"
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
        this.scrollStartPos = null;
        this.scrollCurrentPos = null;
        this.scrollEndPos = null;
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
        
        this.tileWidth = this.scrollBackground.width

        this.x = this.scrollBackground.parentContainer.x + this.scrollBackground.x
        this.y = this.scrollBackground.parentContainer.y + this.scrollBackground.y

        this.scrollList = this.scene.add.group()

        const releasePointer = () => {
            if (this.visible === true ) {
                if (this.activeItem !== null) {
                    this.scene.sound.play('click', {volume: 0.3})
                    this.setActive(this.activeItem)
                    this.hide()
                    this.activeItem = null
                }
                this.scene.HUD.mouseLocked = false
                this.scene.input.off('pointerdown', scrollStart)
                //this.scrollBox.off('pointerdown', scrollStart)
                this.scene.input.off('pointerup', scrollEnd)
            }
        }

        var initialScroll; 

        const scrollStart = () => {
            this.scrollStartPos = this.scene.input.activePointer.position.clone()
            this.scrollCurrentPos = this.scrollStartPos.clone()
            this.scene.input.on('pointerup', scrollEnd)
        }

        const scrollEnd = () => {
            this.scrollCurrentPos = null
            if (initialScroll === true) {
                initialScroll = false;
                return;
            }
            this.scrollEndPos = this.scene.input.activePointer.position.clone()
            
            if (this.scrollStartPos.clone().subtract(this.scrollEndPos).length() < 2) {
                releasePointer()
            }
            this.scene.input.off('pointerup', scrollEnd)
        }
        
        this.selectedDisplay.setInteractive()
        this.selectedDisplay.on('pointerdown', () => {
            if (this.scene.HUD.mouseLocked === true) return
            this.scene.HUD.mouseLocked = true

            this.scene.sound.play('click', {volume: 0.3})
            this.scene.hideTurnPointer()
            //this.scene.input.mouse.requestPointerLock()
            this.toShow = true
            initialScroll = true;
            this.scene.input.on('pointerdown', scrollStart)
            //this.scrollBox.on('pointerdown', scrollStart)
        })


        this.scrollBox.setInteractive()

        socket.on('opponentWeaponChange', ({index}) => {
            var tank = this.scene.activeTank === 1 ? this.scene.tank1 : this.scene.tank2
            if (tank.active && tank === this.scene.tank2) {
                this.setActive(index)
            }
        })
    }



    setActive = (index) => {
        var tank = this.scene.activeTank === 1 ? this.scene.tank1 : this.scene.tank2
        tank.selectedWeapon = index
        this.selected.setText(tank.weapons[tank.selectedWeapon]?.name)
        
        if (this.scene.sceneData.gameType === 3 && tank === this.scene.tank1 && tank.active) {
            socket.emit('weaponChange', {index})
        }

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
            if (!this.scene.game.device.os.desktop) {
                name.setFontSize(26) 
            }
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
        if (this.visible) {
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

            //var curr = this.scene.input.mousePointer
            //var prev = this.scene.input.mousePointer.prev ? this.scene.input.mousePointer.prev : this.scene.input.mousePointer.prevPosition
            //var delY = (curr.y - prev.y)/2

            //if (this.scene.game.input.)
            this.scrollList.incY(-this.scene.input.activePointer.deltaY)

            if (this.scrollCurrentPos !== null && this.scene.input.activePointer.isDown) {
                this.scrollList.incY(this.scene.input.activePointer.position.clone().subtract(this.scrollCurrentPos).y)
                this.scrollCurrentPos = this.scene.input.activePointer.position.clone()
            }
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