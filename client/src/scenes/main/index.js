import { Scene, GameObjects, BlendModes, Textures, Display } from 'phaser';
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
        this.gameOver = false
    }



    init = (data) => {
        this.sceneData = data
        this.activeTank = 0
        this.gameOver = false
    }



    preload = () => {
        // this.load.baseURL = 'assets/';
        // this.load.image('tank', 'sprites/tank.png');
        this.textures.each((texture) => {
            this.textures.remove(texture)
        })
    }



    create = () => {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.fps = this.add.text(screenCenterX, 30, this.game.loop.actualFps)
        this.fps.setOrigin(0.5)

        this.createBackground()
        this.createBlastLayer()
        this.createPointsLayer()
        this.createTerrain()
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

        this.createHUD()
    }



    update = (time, delta) => {
        this.fps.setText(this.game.loop.actualFps)
    
        this.terrain.updateTerrain()
        this.tank1.update()
        this.tank2.update()
        this.HUD.refresh()

        this.checkSwitchTurn()
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

        this.background = this.textures.addCanvas('background', canvas)
        this.add.image(canvas.width/2, canvas.height/2, 'background').setDepth(-2)
    }




    createBlastLayer = () => {
        var canvas = document.createElement('canvas')
        
        canvas.height = this.renderer.height
        canvas.width = this.renderer.width

        this.blastLayer = this.textures.addCanvas('blast-layer', canvas)
        this.add.image(canvas.width/2, canvas.height/2, 'blast-layer').setDepth(3)
    }



    createPointsLayer = () => {
        var canvas = document.createElement('canvas')
        
        canvas.height = this.renderer.height
        canvas.width = this.renderer.width

        this.blastLayer = this.textures.addCanvas('points-layer', canvas)
        this.add.image(canvas.width/2, canvas.height/2, 'points-layer').setDepth(4)
    }



    createTerrain = () => {
        this.terrain = new Terrain(this);
    }



    createTank1 = () => {
        this.tank1 = new Tank(this, 1);
        this.tank1.setDepth(-1)
    }



    createTank2 = () => {
        this.tank2 = new Tank(this, 2)
        this.tank2.setDepth(-1)
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
            console.log('turn 2')
            if (this.sceneData.gameType === 1) {
                this.cpuHandler.play()
            }
        }
        else if (this.activeTank === 2 && this.tank2.active === false && this.tank2.turret.activeWeapon === null){
            this.activeTank = 1
            this.tank1.active = true
            this.HUD.reset()
            console.log('turn 1')
        }
    }



    showGameOver = () => {
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

        x.setFontSize(50).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)')
        a.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)')
        b.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)')
        y.setFontSize(40).setOrigin(0.5).setVisible(false).setFontFamily('"Days One"').setColor('rgba(240,240,240,1)')

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
