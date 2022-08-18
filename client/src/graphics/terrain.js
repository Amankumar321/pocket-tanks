import { Terrain } from "../classes/Terrain";

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Terrain} terrain
 */

export const drawTerrain = (ctx, width, height) => {
    var img1 = new Image();
    img1.onload = start;
    img1.src="./assets/images/6.png";
    function start(){
        var pattern1 = ctx.createPattern(img1, 'repeat');
        ctx.fillStyle = pattern1
        //ctx.fillStyle = 'rgba(0,100,50,1)'
    
        var x, y, prevX, prevY, radius, angle, factor, path = [];
        x = -200
        y = height
        ctx.moveTo(x, y)
        y = height * Math.random() + height/10
        ctx.lineTo(x, y)
        prevX = x
        prevY = y
        path.push({x, y})
        
        while (x != width + 200) {
            factor = Math.floor(Math.random() * 1)
            radius = Math.floor(Math.random() * 30 + 10)
            angle = getAngle(prevX, prevY, width, height)
            
            // if (Math.abs(prevAngle - angle) > 0.2) {
            //     radius = Math.floor(Math.random() * 10 + 1)
            // }

            x = prevX + radius * Math.cos(angle)
            y = prevY + radius * Math.sin(angle)

            if (x > width + 200) {
                x = width + 200
            }
            if (y > height) {
                y = height
            } 
            if (y < height/5) {
                y = prevY - radius * Math.sin(angle)
            }

            if (factor === 0) {
                if (Math.random() < 0.2) {
                    x = prevX + radius
                    y = prevY
                }
                ctx.lineTo(x, y)
                path.push({x, y})
            }

            prevX = x
            prevY = y
        }

        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()

        createLayers(ctx, path)

        return path
    }
}



const getAngle = (x, y, width, height) => {
    var angle = Math.random() * Math.PI - Math.PI/2
    if (y > height/2) {
        angle = (angle - Math.PI/2 * Math.random()) / 2
    }
    if (y < height/2) {
        angle = (angle + Math.PI/2 * Math.random()) / 2
    }
    if (x < width/2) {
        angle = (angle - Math.PI/2 * Math.random()) / 2
    }
    if (x > width/2) {
        angle = (angle + Math.PI/2 * Math.random()) / 2
    }
    return angle
}



const createLayers = (ctx, path) => {
    ctx.lineJoin = 'round'
    var angle, img, pattern;
    img = [new Image(), new Image(), new Image(), new Image(), new Image()]
    pattern = [null, null, null, null, null]
    var layers = [{color: 'rgba(0,190,0,1)', width: 10}, {color: 'rgba(0,180,0,1)', width: 30}, {color: 'rgba(0,160,30,1)', width: 70}, {color: 'rgba(0,140,50,1)', width: 130}, {color: 'rgba(0,120,50,1)', width: 200}]

    //layers.reverse()

    const makeLayer = (layer, index) => {
        ctx.beginPath()
        console.log(index)

        angle = Math.atan((path[1].y - path[0].y) / (path[1].x - path[0].x))
        ctx.moveTo(path[0].x - 5000 * Math.cos(angle), path[0].y - 5000 * Math.sin(angle))

        for (let index = 0; index < path.length; index++) {
            ctx.lineTo(path[index].x, path[index].y)
        }

        angle = Math.atan((path[path.length - 1].y - path[path.length - 2].y) / (path[path.length - 1].x - path[path.length - 2].x))
        ctx.lineTo(path[path.length - 1].x + 5000 * Math.cos(angle), path[path.length - 1].y + 5000 * Math.sin(angle))

        img[index] = new Image();
        img[index].onload = start;
        img[index].src = `./assets/images/${index + 1}.png`;
        function start(){
            console.log(index)
            pattern[index] = ctx.createPattern(img[index], 'repeat');
            ctx.fillStyle = pattern[index]
            ctx.lineWidth = layer.width
            ctx.strokeStyle = pattern[index]
            ctx.globalCompositeOperation = 'source-atop'
            ctx.stroke()
            if (index === 0)
                return
            makeLayer(layers[index - 1], index - 1)
        }

    }
    makeLayer(layers[4], 4)
}



export const setTerrain = (ctx, width, height, path) => {
    ctx.fillStyle = 'rgba(0,100,50,1)'
    ctx.beginPath()
    ctx.moveTo(-200, height)
    ctx.lineTo(path[0].x, path[0].y)

    for (let index = 1; index < path.length; index++) {
        ctx.lineTo(path[index].x, path[index].y)
    }
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    createLayers(ctx, path)
}