import { HUD } from "../classes/HUD"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawMoveDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height/2)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, height/2, width, height)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Move', width/2, height/4)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

 const drawArrow = (ctx, width, height, angle) => {
    
}


/**
 * @param {HUD} hud 
 */

export const createMoveDisplay = (hud) => {
    var moveDisplay = hud.scene.add.container(hud.width * 1/4, hud.height * 9/12)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = 80 
    canvas.width = 100

    drawMoveDisplay(ctx, canvas.width, canvas.height)
    hud.scene.textures.addCanvas('move-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 20 
    canvas.width = 20
    drawArrow(ctx, canvas.width, canvas.height, 0)
    hud.scene.textures.addCanvas('move-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 20 
    canvas.width = 20
    drawArrow(ctx, canvas.width, canvas.height, Math.PI/2)
    hud.scene.textures.addCanvas('move-display-left', canvas);
    
    var moveBtn = hud.scene.add.image(0, 0, 'move-display')
    moveDisplay.add(moveBtn)
    moveDisplay.setDepth(6)
    moveBtn.setInteractive();

    moveBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            
        }
        else if (hud.scene.activeTank === 2) {
            
        }
    })

    hud.moveDisplayText = hud.scene.add.text(0, 20, '4').setOrigin(0.5)
    moveDisplay.add(hud.moveDisplayText)
}
