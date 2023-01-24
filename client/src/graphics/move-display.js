import { HUD } from "../classes/HUD"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawMoveDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height * 4/9)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, height * 4/9, width, height)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Move', width/2, height * 2/7)
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

    if (angle === Math.PI) {
        ctx.moveTo(width, 0)
        ctx.ellipse(width, height/2, width/2, width/2, 0, -Math.PI/2, Math.PI * 1/2, true)
    }
    if (angle === 0) {
        ctx.moveTo(0, 0)
        ctx.ellipse(0, height/2, width/2, width/2, 0, -Math.PI/2, Math.PI/2)
    }
    ctx.closePath()
    ctx.fill()
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.font = '18px Arial'

    if (angle === Math.PI) {
        ctx.fillText(txt, width * 9/12, height * 5/8)
    }
    if (angle === 0) {
        ctx.fillText(txt, width * 3/12, height * 5/8)
    }
}


/**
 * @param {HUD} hud 
 */

export const createMoveDisplay = (hud) => {
    var w = 60
    var h = 60
    var moveDisplay = hud.scene.add.container(hud.width * 1/4, hud.height * 9/12)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawMoveDisplay(ctx, canvas.width, canvas.height)
    if (hud.scene.textures.exists('move-display')) hud.scene.textures.remove('move-display')
    hud.scene.textures.addCanvas('move-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = h
    canvas.width = w
    drawArrow(ctx, canvas.width, canvas.height, 0)
    if (hud.scene.textures.exists('move-display-right')) hud.scene.textures.remove('move-display-right')
    hud.scene.textures.addCanvas('move-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = h
    canvas.width = w
    drawArrow(ctx, canvas.width, canvas.height, Math.PI)
    if (hud.scene.textures.exists('move-display-left')) hud.scene.textures.remove('move-display-left')
    hud.scene.textures.addCanvas('move-display-left', canvas);
    
    var moveBtn = hud.scene.add.image(0, 0, 'move-display')
    moveDisplay.add(moveBtn)
    moveDisplay.setDepth(6)
    moveBtn.setInteractive();

    var moveRightBtn = hud.scene.add.image(w/2, 0, 'move-display-right')
    moveDisplay.add(moveRightBtn)
    moveRightBtn.setInteractive().setOrigin(0, 0.5);

    moveRightBtn.on('pointerdown', () => {
        hud.scene.hideTurnPointer()
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.stepRight()
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.stepRight()
        }
    })

    var moveLeftBtn = hud.scene.add.image(-w/2, 0, 'move-display-left')
    moveDisplay.add(moveLeftBtn)
    moveLeftBtn.setInteractive().setOrigin(1,0.5);

    moveLeftBtn.on('pointerdown', () => {
        hud.scene.hideTurnPointer()
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.stepLeft()
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.stepLeft()
        }
    })

    hud.moveDisplayText = hud.scene.add.text(0, -h/2 + h * 4/9 + h * 5/18, '4').setOrigin(0.5).setFont('26px Geneva')
    moveDisplay.add(hud.moveDisplayText)
}
