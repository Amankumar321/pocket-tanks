import { HUD } from "../classes/HUD"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawAngleDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height/2)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, height/2, width, height)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Angle', width/2, height/4)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

 const drawArrow = (ctx, width, height, angle) => {
    
}


/**
 * @param {HUD} hud 
 */

export const createAngleDisplay = (hud) => {
    var angleDisplay = hud.scene.add.container(hud.width * 3/4, hud.height * 9/12)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = 80 
    canvas.width = 100

    drawAngleDisplay(ctx, canvas.width, canvas.height)
    hud.scene.textures.addCanvas('angle-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 20 
    canvas.width = 20
    drawArrow(ctx, canvas.width, canvas.height, 0)
    hud.scene.textures.addCanvas('angle-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 20 
    canvas.width = 20
    drawArrow(ctx, canvas.width, canvas.height, Math.PI/2)
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

    hud.angleDisplayText = hud.scene.add.text(0, 20, '').setOrigin(0.5)
    angleDisplay.add(hud.angleDisplayText)
}

