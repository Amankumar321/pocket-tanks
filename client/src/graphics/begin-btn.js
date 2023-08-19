/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawBeginBtn = (ctx, width, height, scene) => {
    ctx.fillStyle = 'rgba(160,160,160,1)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 6
    var border = 4

    ctx.fillStyle = 'rgba(190,190,190,1)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(border, border)
    ctx.lineTo(width - border, border)
    ctx.lineTo(width, 0)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(220,220,220,1)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(border, border)
    ctx.lineTo(border, height - border)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(80,80,80,1)'
    ctx.beginPath()
    ctx.moveTo(0, height)
    ctx.lineTo(border,  height - border)
    ctx.lineTo(width - border, height - border)
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(100,100,100,1)'
    ctx.beginPath()
    ctx.moveTo(width, 0)
    ctx.lineTo(width - border, border)
    ctx.lineTo(width - border, height - border)
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.fillStyle = 'rgba(240,240,240,1)'
    ctx.strokeStyle = 'rgba(40,40,40,1)'
    ctx.textAlign = 'center'
    ctx.font = '400 20px Verdana'

    if (!scene.game.device.os.desktop) {
        ctx.font = '600 32px Verdana'
        ctx.lineWidth = 8
    }

    ctx.strokeText('Begin Game', width/2, height/2 + 6)
    ctx.fillText('Begin Game', width/2, height/2 + 6)
}


export const createBeginButton = (scene) => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = 50 
    canvas.width = 160

    if (!scene.game.device.os.desktop) {
        canvas.height = canvas.height * 1.5
        canvas.width = canvas.width * 1.5
    }

    drawBeginBtn(ctx, canvas.width, canvas.height, scene)

    return canvas
}