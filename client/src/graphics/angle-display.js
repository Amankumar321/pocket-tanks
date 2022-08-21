import { HUD } from "../classes/HUD"
import Phaser from "phaser"

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

 const drawCrossair = (ctx, width, height) => {
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.font = '16px Arial'
    ctx.fillText('o', width/2, height * 3/4)
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
    ctx.font = '16px Arial'
    ctx.fillText(txt, width/2, height * 3/4)
}


/**
 * @param {HUD} hud 
 */

export const createAngleDisplay = (hud) => {
    var angleDisplay = hud.scene.add.container(hud.width * 3/4, hud.height * 9/12)
    var h = 90, w = 120

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

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawCrossair(ctx, canvas.width, canvas.height, Math.PI)
    hud.scene.textures.addCanvas('angle-aim-display', canvas);

    hud.crossAir = hud.scene.add.image(0, 0, 'angle-aim-display')
    hud.crossAir.setDepth(7).setVisible(false)
    
    var angleBtn = hud.scene.add.image(0, 0, 'angle-display')
    angleDisplay.add(angleBtn)
    angleDisplay.setDepth(6)
    angleBtn.setInteractive();

    angleBtn.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            hud.scene.input.mouse.requestPointerLock()
            hud.crossAir.setVisible(true)
            var alpha = hud.scene.tank1.turret.rotation
            hud.crossAir.setPosition(hud.scene.tank1.turret.x + 50 * Math.sin(alpha), hud.scene.tank1.turret.y - 50 * Math.cos(alpha))
            
            hud.scene.input.once('pointerdown', () => {
                if (hud.scene.input.mouse.locked === true) {
                    hud.scene.input.mouse.releasePointerLock()
                    hud.crossAir.setVisible(false)
                }
            })
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.input.mouse.requestPointerLock()
            hud.crossAir.setVisible(true)
            var alpha = hud.scene.tank2.turret.rotation
            hud.crossAir.setPosition(hud.scene.tank2.turret.x + 50 * Math.sin(alpha), hud.scene.tank2.turret.y - 50 * Math.cos(alpha))
            
            hud.scene.input.once('pointerdown', () => {
                if (hud.scene.input.mouse.locked === true) {
                    hud.scene.input.mouse.releasePointerLock()
                    hud.crossAir.setVisible(false)
                }
            })
        }
    })


    hud.crossAir.refresh = () => {
        if (hud.scene.input.mouse.locked === false) return
        if (hud.scene.activeTank === 1) {
            var prevX, prevY, currX, currY, vec1, vec2, angle, sign;
            prevX = hud.crossAir.x
            prevY = hud.crossAir.y

            hud.crossAir.setPosition(hud.crossAir.x + hud.scene.input.mousePointer.movementX, hud.crossAir.y + hud.scene.input.mousePointer.movementY)
            Phaser.Actions.RotateAroundDistance([hud.crossAir], {x: hud.scene.tank1.turret.x, y: hud.scene.tank1.turret.y}, 0, 50)

            currX = hud.crossAir.x
            currY = hud.crossAir.y
            vec1 = new Phaser.Math.Vector2(currX - hud.scene.tank1.turret.x, currY - hud.scene.tank1.turret.y)
            vec2 = new Phaser.Math.Vector2(prevX - hud.scene.tank1.turret.x, prevY - hud.scene.tank1.turret.y)
            angle = Math.acos(vec1.dot(vec2) / (vec1.length()*vec2.length()))
            if (isNaN(angle)) return
            sign = vec1.cross(vec2)
            angle = sign >= 0 ? -angle : angle 
            
            hud.scene.tank1.turret.relativeRotation += angle
        }

        else if (hud.scene.activeTank === 2) {
            var prevX, prevY, currX, currY, vec1, vec2, angle;
            prevX = hud.crossAir.x
            prevY = hud.crossAir.y

            hud.crossAir.setPosition(hud.crossAir.x + hud.scene.input.mousePointer.movementX, hud.crossAir.y + hud.scene.input.mousePointer.movementY)
            Phaser.Actions.RotateAroundDistance([hud.crossAir], {x: hud.scene.tank2.turret.x, y: hud.scene.tank2.turret.y}, 0, 50)

            currX = hud.crossAir.x
            currY = hud.crossAir.y

            vec1 = new Phaser.Math.Vector2(currX - hud.scene.tank2.turret.x, currY - hud.scene.tank2.turret.y)
            vec2 = new Phaser.Math.Vector2(prevX - hud.scene.tank2.turret.x, prevY - hud.scene.tank2.turret.y)

            angle = Math.acos(vec1.dot(vec2) / (vec1.length()*vec2.length()))
            if (isNaN(angle)) return
            sign = vec1.cross(vec2)
            angle = sign >= 0 ? -angle : angle
            
            hud.scene.tank2.turret.relativeRotation += angle
        }

        hud.scene.input.mousePointer.movementX = 0
        hud.scene.input.mousePointer.movementY = 0
    }


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

    hud.angleDisplayText = hud.scene.add.text(0, h/3, '').setOrigin(0.5).setFont('18px Geneva')
    angleDisplay.add(hud.angleDisplayText)
}

