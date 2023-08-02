export const createPlayButton = () => {
    var width = 180
    var height = 140
    var margin1 = 5
    var margin2 = 10
    var r = height/2

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    canvas.width = width + 2*r
    canvas.height = height

    ctx.fillStyle = 'rgba(165,165,165,1)'
    ctx.beginPath()
    ctx.arc(r, height/2, r, Math.PI/2, Math.PI/2 * 3)
    ctx.lineTo(r + width, 0)
    ctx.arc(r + width, height/2, r, -Math.PI/2, Math.PI/2)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(220,220,220,1)'
    ctx.beginPath()
    ctx.arc(r, height/2, r - margin1, Math.PI/2, Math.PI/2 * 3)
    ctx.lineTo(r + width - margin1*2, margin1)
    ctx.arc(r + width, height/2, r - margin1, -Math.PI/2, Math.PI/2)
    ctx.closePath()
    ctx.fill()

    var g = ctx.createRadialGradient(r, height/2, 0, r, height/2, r - margin2)
    g.addColorStop(0, 'rgba(80,180,240,1)')
    g.addColorStop(0.2, 'rgba(80,180,240,1)')
    g.addColorStop(1, 'rgba(50,120,200,1)')
    ctx.fillStyle = g
    
    ctx.beginPath()
    ctx.arc(r, height/2, r - margin2, Math.PI/2, Math.PI/2 * 3)
    ctx.closePath()
    ctx.fill()

    g = ctx.createRadialGradient(r + width, height/2, 0, r + width, height/2, r - margin2)
    g.addColorStop(0, 'rgba(80,180,240,1)')
    g.addColorStop(0.2, 'rgba(80,180,240,1)')
    g.addColorStop(1, 'rgba(50,120,200,1)')
    ctx.fillStyle = g

    ctx.beginPath()
    ctx.arc(r + width, height/2, r - margin2, -Math.PI/2, Math.PI/2)
    ctx.closePath()
    ctx.fill()

    g = ctx.createLinearGradient(width/2 + r, margin2, width/2 + r, height - margin2)
    g.addColorStop(0, 'rgba(50,120,200,1)')
    g.addColorStop(0.4, 'rgba(80,180,240,1)')
    g.addColorStop(0.6, 'rgba(80,180,240,1)')
    g.addColorStop(1, 'rgba(50,120,200,1)')
    ctx.fillStyle = g

    ctx.fillRect(r, margin2, width, height - margin2*2)

    return canvas
}