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
    ctx.fillRect(0, 0, Math.max(Math.ceil(width * percentage/100), 1), height)
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
    var powerDisplay = hud.scene.add.container(hud.width * 3/4, hud.height * 10.8/12)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawPowerDisplay(ctx, canvas.width, canvas.height)
    if (hud.scene.textures.exists('power-display')) hud.scene.textures.remove('power-display')
    hud.scene.textures.addCanvas('power-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, 0)
    if (hud.scene.textures.exists('power-display-right')) hud.scene.textures.remove('power-display-right')
    hud.scene.textures.addCanvas('power-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, Math.PI)
    if (hud.scene.textures.exists('power-display-left')) hud.scene.textures.remove('power-display-left')
    hud.scene.textures.addCanvas('power-display-left', canvas);
    
    var powerBtn = hud.scene.add.image(0, 0, 'power-display')
    powerDisplay.add(powerBtn)
    powerDisplay.setDepth(6)
    powerBtn.setInteractive();

    const releasePointer = (e) => {
        if (powerBtn.getData('active') === true) {
            if (powerBtn.getData('allowHide') === false) {
                powerBtn.setData('allowHide', true)
                //hud.mouseLocked = false
            }
            else {
                hud.scene.sound.play('click', {volume: 0.3})
                powerBtn.setData('active', false)
                hud.mouseLocked = false
                hud.scene.input.off('pointerdown', releasePointer)
            }
        }
    }

    powerBtn.on('pointerdown', (e) => {
        if (hud.mouseLocked === true) return
        if (powerBtn.getData('active') === true) return
        hud.mouseLocked = true
        hud.scene.sound.play('click', {volume: 0.3})
        hud.scene.hideTurnPointer()
        //console.log(e.position, hud)
        powerBtn.setData('active', true)
        powerBtn.setData('allowHide', false)
        hud.scene.input.on('pointerdown', releasePointer)
    })
    

    var powerRightBtn = hud.scene.add.image(w/2, 0, 'power-display-right')
    powerDisplay.add(powerRightBtn)
    powerRightBtn.setInteractive().setOrigin(1,0);

    powerRightBtn.on('pointerdown', () => {
        if (hud.mouseLocked === true) return
        hud.scene.sound.play('click', {volume: 0.3})

        hud.scene.hideTurnPointer()
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.setPower(hud.scene.tank1.power + 1)
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.setPower(hud.scene.tank2.power + 1)
        }
    })

    var powerLeftBtn = hud.scene.add.image(-w/2 + w * 2/5, 0, 'power-display-left')
    powerDisplay.add(powerLeftBtn)
    powerLeftBtn.setInteractive().setOrigin(0,0);

    powerLeftBtn.on('pointerdown', () => {
        if (hud.mouseLocked === true) return

        hud.scene.sound.play('click', {volume: 0.3})
        hud.scene.hideTurnPointer()
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.setPower(hud.scene.tank1.power - 1)
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.setPower(hud.scene.tank2.power - 1)
        }
    })

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = h * 3/12
    canvas.width = w * 19/20
    drawPowerMeter(ctx, canvas.width, canvas.height, 0)

    if (hud.scene.textures.exists('power-display-meter')) hud.scene.textures.remove('power-display-meter')
    hud.scene.textures.addCanvas('power-display-meter', canvas);
    hud.powerMeter = hud.scene.add.image(0, -h/4, 'power-display-meter')
    powerDisplay.add(hud.powerMeter)

    hud.powerMeter.refresh = () => {
        var curr = hud.scene.input.mousePointer
        var prev = hud.scene.input.mousePointer.prev ? hud.scene.input.mousePointer.prev : hud.scene.input.mousePointer.prevPosition
        var delX = (curr.x - prev.x)/2

        if (delX > 0) {
            delX = Math.ceil(delX)
        }
        else {
            delX = Math.floor(delX)
        }

        if (hud.scene.activeTank === 1) {
            if (powerBtn.getData('active') === true) {
                hud.scene.tank1.setPower(hud.scene.tank1.power + delX)
                hud.scene.input.mousePointer.movementX = 0
            }
            drawPowerMeter(ctx, canvas.width, canvas.height, hud.scene.tank1.power)
        }
        else if (hud.scene.activeTank === 2) {
            if (powerBtn.getData('active') === true) {
                hud.scene.tank2.setPower(hud.scene.tank2.power + delX)
                hud.scene.input.mousePointer.movementX = 0
            }
            drawPowerMeter(ctx, canvas.width, canvas.height, hud.scene.tank2.power)
        }
    }

    hud.powerDisplayText = hud.scene.add.text(-w/2 + w * 2/5 + w * 3/10, h * 1/5, '').setOrigin(0.5).setFont('20px Geneva')
    powerDisplay.add(hud.powerDisplayText)
}

