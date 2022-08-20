import { HUD } from "../classes/HUD"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawPowerDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height/2)
    //ctx.fillStyle = 'rgba(0,0,0,1)'
    //ctx.fillRect(0, height/2, width, height)
    ctx.moveTo(0, height/2)
    ctx.ellipse(width/5, height/2, width/5, width/7, 0, 0, Math.PI)
    ctx.fill()
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(width * 2/5, height/2, width * 3/5, 30)
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Power', width/5, height * 6/9)
}

const drawPowerMeter = (ctx, width, height, percentage = 0) => {
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(230,0,0,1)'
    ctx.fillRect(0, 0, width * percentage/100, height)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawArrow = (ctx, width, height, angle) => {
    var txt =  String.fromCharCode(0x25B6)
    //var strokeThickness = 4
    if (angle === Math.PI) txt = String.fromCharCode(0x25C0)
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.strokeStyle = 'rgba(160,160,160,1)'

    ctx.fillRect(0, 0, width, height)
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.font = '18px Arial'
    ctx.fillText(txt, width/2, height * 3/4)
}


/**
 * @param {HUD} hud 
 */

export const createPowerDisplay = (hud) => {
    var w = 200
    var h = 80
    var powerDisplay = hud.scene.add.container(hud.width * 3/4, hud.height * 11/12)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawPowerDisplay(ctx, canvas.width, canvas.height)
    hud.scene.textures.addCanvas('power-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, 0)
    hud.scene.textures.addCanvas('power-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, Math.PI)
    hud.scene.textures.addCanvas('power-display-left', canvas);
    
    var powerBtn = hud.scene.add.image(0, 0, 'power-display')
    powerDisplay.add(powerBtn)
    powerDisplay.setDepth(6)
    powerBtn.setInteractive();

    powerBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            
        }
        else if (hud.scene.activeTank === 2) {
            
        }
    })

    var powerRightBtn = hud.scene.add.image(w/2, 0, 'power-display-right')
    powerDisplay.add(powerRightBtn)
    powerRightBtn.setInteractive().setOrigin(1,0);

    powerRightBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.power++
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.power++
        }
    })

    var powerLeftBtn = hud.scene.add.image(-w/2 + w * 2/5, 0, 'power-display-left')
    powerDisplay.add(powerLeftBtn)
    powerLeftBtn.setInteractive().setOrigin(0,0);

    powerLeftBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.power--
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.power--
        }
    })

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = h * 3/12
    canvas.width = w * 19/20
    drawPowerMeter(ctx, canvas.width, canvas.height, 0)
    hud.scene.textures.addCanvas('power-display-meter', canvas);
    hud.powerMeter = hud.scene.add.image(0, -h/4, 'power-display-meter')
    powerDisplay.add(hud.powerMeter)
    hud.powerMeter.refresh = () => {
        if (hud.scene.activeTank === 1) {
            drawPowerMeter(ctx, canvas.width, canvas.height, hud.scene.tank1.power)
        }
        else if (hud.scene.activeTank === 2) {
            drawPowerMeter(ctx, canvas.width, canvas.height, hud.scene.tank2.power)
        }
    }

    hud.powerDisplayText = hud.scene.add.text(-w/2 + w * 2/5 + w * 3/10, h * 1/5, '').setOrigin(0.5).setFont('20px Geneva')
    powerDisplay.add(hud.powerDisplayText)
}

