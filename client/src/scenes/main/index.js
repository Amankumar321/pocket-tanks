import Phaser ,{ Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
import { HUD } from '../../classes/HUD';
import { Tank } from '../../classes/Tank';
import { Terrain } from '../../classes/Terrain';
import { type1 } from './types/type1';
import { type2 } from './types/type2';
import { type3 } from './types/type3';
import { type4 } from './types/type4';

export class MainScene extends Scene {
    constructor() {
        super('main-scene');
        this.tank1 = null
        this.tank2 = null
        this.terrain = null
        this.HUD = null
        this.x = 0;
        this.y = 0;
        this.fps = null
        this.activeTank = 0
        this.background = null
        this.blastLayer = null
        this.pointsLayer = null
        this.cpuHandler = null
        this.sceneData = null
        this.turnPointer = null
        this.winnerBlastInterval = null
        this.gameOver = false
    }



    init = (data) => {
        this.sceneData = data
        this.activeTank = 0
        this.gameOver = false
    }



    preload = () => {
        this.load.audio('background', ['assets/sounds/background.mp3'])
        this.load.image('wall', 'assets/images/wall.png');
    }



    create = () => {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //this.fps = this.add.text(screenCenterX, 30, this.game.loop.actualFps)
        //this.fps.setOrigin(0.5)

        if (this.winnerBlastInterval !== null) {
            clearInterval(this.winnerBlastInterval)
            this.winnerBlastInterval = null
        }
        this.events.once('terrain-finished', () => {
            if (this.activeTank === 2) {
                this.terrain.save()
            }
        })

        this.createBackground()
        this.createBlastLayer()
        this.createPointsLayer()
        this.createTerrain()
        this.createBoundWalls()
        this.createTank1()
        this.createTank2()
       
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

        this.showTurnPointer()

        this.createHUD()

        this.sound.stopAll()
        var bg = this.sound.add('background', {loop: true})
        bg.play()

        this.terrain.multiplayerPoints = []

        var socket = window.socket
        
        socket.on('recieveTurn', ({terrainData, pos1, pos2, rotation1, rotation2}) => {
            if (this.terrain.animate === true) return
            if (this.terrain.blastArray.length !== 0) return
            if (this.tank1.settled === false) return
            if (this.tank2.settled === false) return

            if (this.activeTank === 2 && this.tank2.active === false && this.tank2.turret.activeWeapon === null){
                this.activeTank = 1
                this.tank1.active = true
                this.HUD.reset()
                this.terrain.frameCount = -1
                this.terrain.multiplayerCorrection(terrainData)

                this.tank1.setPosition(pos2.x, pos2.y)
                this.tank2.setPosition(pos1.x, pos1.y)
                this.tank1.setRotation(rotation2)
                this.tank2.setRotation(rotation1)
                
                this.terrain.multiplayerPoints = []
                this.terrain.addPixels = []
                console.log('turn 1')
                this.showTurnPointer()
            }
        })

        socket.on('opponentRequestTurn', () => {
            if (this.terrain.animate === true) return
            if (this.terrain.blastArray.length !== 0) return
            if (this.tank1.settled === false) return
            if (this.tank2.settled === false) return

            if (this.activeTank === 2 && this.tank2.active === true && this.tank2.turret.activeWeapon === null) {
                socket.emit('giveTurn', {terrainData: this.terrain.multiplayerPoints, pos1: {x: this.tank1.x, y: this.tank1.y}, pos2: {x: this.tank2.x, y: this.tank2.y}, rotation1: this.tank1.rotation, rotation2: this.tank2.rotation})
                this.terrain.save()
            }
        })
    }



    update = (time, delta) => {
        //this.fps.setText(this.game.loop.actualFps)
    
        this.terrain.updateTerrain()
        this.tank1.update()
        this.tank2.update()
        this.HUD.refresh()

        this.checkSwitchTurn()
    }



    createBoundWalls = () => {
        this.rightWall = this.physics.add.image(this.renderer.width, this.renderer.height, 'wall')
        this.leftWall = this.physics.add.image(0, this.renderer.height, 'wall')
        this.rightWall.setScale(1, this.renderer.height * 4)
        this.leftWall.setScale(1, this.renderer.height * 4)
        this.leftWall.setImmovable(true).setAlpha(0)
        this.rightWall.setImmovable(true).setAlpha(0)
    }



    createBackground = () => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')

        canvas.height = this.renderer.height
        canvas.width = this.renderer.width

        var grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
        grd.addColorStop(0, 'rgba(0,0,0,1)')
        grd.addColorStop(0.30, 'rgba(30,10,40,1)')
        grd.addColorStop(0.40, 'rgba(50,20,70,1)')
        grd.addColorStop(0.5, 'rgba(90,30,130,1)')
        grd.addColorStop(1, 'rgba(200,40,255,1)')

        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (this.textures.exists('background')) this.textures.remove('background')
        this.background = this.textures.addCanvas('background', canvas)
        this.add.image(canvas.width/2, canvas.height/2, 'background').setDepth(-3)
    }




    createBlastLayer = () => {
        var canvas = document.createElement('canvas')
        
        canvas.height = this.renderer.height
        canvas.width = this.renderer.width

        if (this.textures.exists('blast-layer')) this.textures.remove('blast-layer')
        this.textures.addCanvas('blast-layer', canvas)
        this.blastLayer = this.add.image(canvas.width/2, canvas.height/2, 'blast-layer').setDepth(3)
    }



    createPointsLayer = () => {
        var canvas = document.createElement('canvas')
        
        canvas.height = this.renderer.height
        canvas.width = this.renderer.width

        if (this.textures.exists('points-layer')) this.textures.remove('points-layer')
        this.blastLayer = this.textures.addCanvas('points-layer', canvas)
        this.add.image(canvas.width/2, canvas.height/2, 'points-layer').setDepth(4)
    }



    createTerrain = () => {
        this.terrain = new Terrain(this);
    }



    createTank1 = () => {
        this.tank1 = new Tank(this, 1);
        //this.tank1.setBlendMode(Phaser.BlendModes.SOFT_LIGHT)
        this.tank1.setDepth(-2)
    }



    createTank2 = () => {
        this.tank2 = new Tank(this, 2)
        //this.tank2.setBlendMode(Phaser.BlendModes.SOFT_LIGHT)
        this.tank2.setDepth(-2)
    }



    createHUD = () => {
        this.HUD = new HUD(this)
        this.HUD.reset()
    }


    checkSwitchTurn = () => {
        if (this.terrain.animate === true) return
        if (this.terrain.blastArray.length !== 0) return
        if (this.tank1.settled === false) return
        if (this.tank2.settled === false) return
        if (this.gameOver === true) return
        var socket

        if (this.tank1.weapons.length === 0 && this.tank2.weapons.length === 0) {
            if (this.tank1.turret.activeWeapon === null && this.tank2.turret.activeWeapon === null) {
                this.showGameOver()
                this.tank1.active = false
                this.tank2.active = false
                this.activeTank = 0
            }
        }

        else if (this.activeTank === 1 && this.tank1.active === false && this.tank1.turret.activeWeapon === null) {
            this.activeTank = 2
            this.tank2.active = true
            this.HUD.reset()
            if (this.sceneData.gameType === 3) {
                socket = window.socket
                socket.emit('giveTurn', {terrainData: this.terrain.multiplayerPoints, pos1: {x: this.tank1.x, y: this.tank1.y}, pos2: {x: this.tank2.x, y: this.tank2.y}, rotation1: this.tank1.rotation, rotation2: this.tank2.rotation})
                this.terrain.save()
            }
            console.log('turn 2')
            this.showTurnPointer()
            if (this.sceneData.gameType === 1) {
                this.cpuHandler.play()
            }
        }
        else if (this.activeTank === 2 && this.tank2.active === false && this.tank2.turret.activeWeapon === null){
            if (this.sceneData.gameType !== 3) {
                this.activeTank = 1
                this.tank1.active = true
                this.HUD.reset()
                console.log('turn 1')
                this.showTurnPointer()
            }
            else {
                socket = window.socket
                socket.emit('requestTurn', {})
            }
        }
    }



    showTurnPointer = () => {
        var tank = null
        if (this.activeTank === 1) tank = this.tank1
        if (this.activeTank === 2) tank = this.tank2

        if (tank !== null) {
            this.hideTurnPointer()
            var canvas = document.createElement('canvas')
            canvas.width = 18
            canvas.height = 20
            var w = 18
            var h = 20
            var ctx = canvas.getContext('2d')

            ctx.fillStyle = tank.color
            ctx.moveTo(w/3, 0)
            ctx.lineTo(w * (2/3), 0)
            ctx.lineTo(w * (2/3), h * (1/2))
            ctx.lineTo(w, h * (1/2))
            ctx.lineTo(w/2, h)
            ctx.lineTo(0, h * (1/2))
            ctx.lineTo(w * (1/3), h * (1/2))
            ctx.lineTo(w/3, 0)
            ctx.closePath()
            ctx.fill()
            
            if (this.textures.exists('turn-pointer')) this.textures.remove('turn-pointer')
            this.textures.addCanvas('turn-pointer', canvas)
            this.turnPointer = this.add.image(tank.x, tank.y - 45, 'turn-pointer')
            this.turnPointer.setDepth(10)

            this.tweens.add({
                targets: this.turnPointer,
                y: this.turnPointer.y - 10,
                repeat: -1,
                yoyo: true,
                duration: 300,
            })

            this.turnPointer.setVisible(true)
        }
    }



    hideTurnPointer = () => {
        if (this.turnPointer !== null) {
            this.turnPointer.setVisible(false)
            this.turnPointer = null
        }
    }



    showGameOver = () => {
        this.showWinner()
        const socket = window.socket
        this.gameOver = true

        const screenCenterX = this.terrain.width/2
        const screenCenterY = this.terrain.height/2

        this.tank1.active = false
        this.tank2.active = false
        this.activeTank = 0

        var x = this.add.text(screenCenterX, screenCenterY, 'PLAY AGAIN ?')
        var a = this.add.text(screenCenterX - 80, screenCenterY + 50, 'YES')
        var y = this.add.text(screenCenterX, screenCenterY + 50, '/')
        var b = this.add.text(screenCenterX + 80, screenCenterY + 50, 'NO')

        x.setFontSize(50).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)').setDepth(100)
        a.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)').setDepth(100)
        b.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)').setDepth(100)
        y.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)').setDepth(100)

        strokeText(x, 4)
        strokeText(a, 4)
        strokeText(b, 4)
        strokeText(y, 4)

        a.setInteractive()
        b.setInteractive()


        a.on('pointerdown', () => {
            if (this.sceneData.gameType === 3) {
                socket.emit('playAgainRequest', {})
                a.disableInteractive()
                a.setText('')
                b.setText('')
                y.setText('')
                x.setText('Waiting for opponent...')
            }
            else {
                this.scene.start('scene-5', this.sceneData)
            }
        })
        b.on('pointerdown', () => {
            this.scene.start('scene-1')
            if (this.sceneData.gameType === 3) {
                const socket = window.socket
                socket.emit('leaveRoom', {})
            }
        })
        
        setTimeout(() => {
            x.setVisible(true)
            a.setVisible(true)
            b.setVisible(true)
            y.setVisible(true)
        }, 2000);
    }



    showWinner = () => {
        var tank = null

        if (this.tank1.score > this.tank2.score) {
            tank = this.tank1
        }
        else if (this.tank1.score < this.tank2.score) {
            tank = this.tank2
        }
        else return

        var height = 60
        var w1 = this.add.text(tank.x - 38, tank.y - height - 11, 'W')
        var i1 = this.add.text(tank.x - 19, tank.y - height - 7, 'i')
        var n1 = this.add.text(tank.x - 6, tank.y - height - 1, 'n')
        var n2 = this.add.text(tank.x + 11, tank.y - height + 7, 'n')
        var e1 = this.add.text(tank.x + 28, tank.y - height + 11, 'e')
        var r1 = this.add.text(tank.x + 42, tank.y - height + 7, 'r')

        var letters = [w1, i1, n1, n2, e1, r1]

        letters.forEach((l, i) => {
            l.setFontSize(30).setOrigin(0.5).setColor('rgba(240,240,240,1)').setFontFamily('Arial').setDepth(10)
            if (i < 4) l.movement = 1
            else l.movement = -1

            this.tweens.add({
                targets: l,
                loop: -1,
                onLoop: () => {
                    if (l.movement === 1 && l.y > tank.y - height + 12) {
                        l.movement = -1
                    }
                    else if (l.movement === - 1 && l.y < tank.y - height - 12) {
                        l.movement = 1
                    }
                    l.y = l.y + 0.8 * l.movement
                }
            })
        })

        this.winnerBlastInterval = setInterval(() => {
            var fillColor = Math.floor(Math.random() * 0xffffff)
            var vec = new Phaser.Math.Vector2(1,1)
            var posX = tank.x + (0.5 - Math.random()) * 120
            var posY = tank.y + (0.5 - Math.random()) * 60 - height

            for (let index = 0; index < 100; index++) {
                var particle = this.add.circle(posX, posY, 1, fillColor, 255) 

                vec.setAngle(Math.PI * 2 * Math.random())
                vec.setLength(Math.pow(Math.random(), 2) * 60)

                var t = Math.random() * 1000 + 800
                this.tweens.add({
                    targets: particle,
                    duration: t,
                    ease: 'Quad.easeOut',
                    x: particle.x + vec.x,
                    y: particle.y + vec.y
                })    
                this.tweens.add({
                    targets: particle,
                    duration: t,
                    ease: 'Quad.easeOut',
                    alpha: 0,
                    onComplete: () => { particle.destroy(true) }
                })
            }
        }, 300);
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
        type4(this)
    }
}


const strokeText = (txt, thickness) => {
    var re = /rgba\((\d+),(\d+),(\d+),(\d+)\)/
    var match = new RegExp(re).exec(txt.style.color)
    var r, g, b, a, k = 0.7;
    r = parseInt(match[1])
    g = parseInt(match[2])
    b = parseInt(match[3])
    a = parseInt(match[4])

    r = Math.ceil(r * k)
    g = Math.ceil(g * k)
    b = Math.ceil(b * k)

    txt.setStroke('rgba(' + r + ',' + g + ',' + b + ',' + a + ')', thickness)
}

const int2rgba = (colorInt) => {
    var rgba = new Display.Color.IntegerToRGB(colorInt)
    var rgbaString = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')'
    return rgbaString
}
