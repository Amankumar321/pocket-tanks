import { HUD } from "../classes/HUD"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawAngleDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.moveTo(0, height * 2/3)
    ctx.ellipse(width/2, height * 2/3, width/2 + 1, width/2.5, 0, -Math.PI, 0)
    //ctx.arcTo(width/2, 0, width, height * 2/3, 75)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, height * 2/3, width, height/3)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Angle', width/2, height * 1/2)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawArrow = (ctx, width, height, angle) => {
    var txt = "->"
    //var strokeThickness = 4
    if (angle === Math.PI) txt = "<-" 
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

export const createAngleDisplay = (hud) => {
    var angleDisplay = hud.scene.add.container(hud.width * 3/4, hud.height * 9/12)
    var h = 90, w = 100

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawAngleDisplay(ctx, canvas.width, canvas.height)
    hud.scene.textures.addCanvas('angle-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, 0)
    hud.scene.textures.addCanvas('angle-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, Math.PI)
    hud.scene.textures.addCanvas('angle-display-left', canvas);
    
    var angleBtn = hud.scene.add.image(0, 0, 'angle-display')
    angleDisplay.add(angleBtn)
    angleDisplay.setDepth(6)
    angleBtn.setInteractive();

    angleBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            
        }
        else if (hud.scene.activeTank === 2) {
            
        }
    })

    var angleRightBtn = hud.scene.add.image(w/2, h/2, 'angle-display-right')
    angleDisplay.add(angleRightBtn)
    angleRightBtn.setInteractive().setOrigin(1,1);

    angleRightBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.turret.relativeRotation += Math.PI/180
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.turret.relativeRotation += Math.PI/180
        }
    })

    var angleLeftBtn = hud.scene.add.image(-w/2, h/2, 'angle-display-left')
    angleDisplay.add(angleLeftBtn)
    angleLeftBtn.setInteractive().setOrigin(0,1);

    angleLeftBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            hud.scene.tank1.turret.relativeRotation -= Math.PI/180
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.tank2.turret.relativeRotation -= Math.PI/180
        }
    })

    hud.angleDisplayText = hud.scene.add.text(0, h/3, '').setOrigin(0.5)
    angleDisplay.add(hud.angleDisplayText)
}

