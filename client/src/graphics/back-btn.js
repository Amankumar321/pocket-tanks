/**
 * @param {CanvasRenderingContext2D} ctx 
 */

export const drawBackBtn = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(240,240,240,1)'
    ctx.strokeStyle = 'rgba(200,200,200,1)'
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.moveTo(width * (1/3), height * (5/6))
    ctx.quadraticCurveTo(width * (3/4), height * (4/7), width* 1/3, height/2)
    ctx.lineTo(width * (1/3) + 2, height/2 + 12)
    ctx.lineTo(0, height * (5/16) + 2)
    ctx.lineTo(width * 1/3 + 8, 8)
    ctx.lineTo(width * 1/3 + 4, 20)
    ctx.quadraticCurveTo(width, height * (5/10), width * 5/14, height * 8/9)
    ctx.quadraticCurveTo(width * (3/10), height * (7/8), width * (1/3), height * (5/6))
    //ctx.closePath()
    ctx.fill()
    ctx.stroke()
}