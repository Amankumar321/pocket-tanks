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
    // ctx.textAlign = 'center'
    // ctx.fillStyle = 'rgba(255,255,255,1)'
    // ctx.font = '16px Arial'
    // ctx.fillText('o', width/2, height * 3/4)
    ctx.fillStyle = 'rgba(240,240,240,1)'
    ctx.moveTo(width/2, height * 2/5)
    ctx.lineTo(width/2 - width/20, height/8)
    ctx.arcTo(width/2, 0, width/2 + width/20, height/8, height/16)
    ctx.closePath()
    ctx.fill()

    ctx.moveTo(width * 3/5 - 1, height/2)
    ctx.lineTo(width * 7/8, height/2 - height/20)
    ctx.arcTo(width, height/2, width * 7/8, height/2 + height/20, width/16)
    ctx.closePath()
    ctx.fill()

    ctx.moveTo(width/2, height * 3/5)
    ctx.lineTo(width/2 - width/20, height * 7/8)
    ctx.arcTo(width/2, height, width/2 + width/20, height * 7/8, height/16)
    ctx.closePath()
    ctx.fill()

    ctx.moveTo(width * 2/5 + 1, height/2)
    ctx.lineTo(width * 1/8, height/2 - height/20)
    ctx.arcTo(0, height/2, width * 1/8, height/2 + height/20, width/16)
    ctx.closePath()
    ctx.fill()
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
    if (hud.scene.textures.exists('angle-display')) hud.scene.textures.remove('angle-display')
    hud.scene.textures.addCanvas('angle-display', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, 0)
    if (hud.scene.textures.exists('angle-display-right')) hud.scene.textures.remove('angle-display-right')
    hud.scene.textures.addCanvas('angle-display-right', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawArrow(ctx, canvas.width, canvas.height, Math.PI)
    if (hud.scene.textures.exists('angle-display-left')) hud.scene.textures.remove('angle-display-left')
    hud.scene.textures.addCanvas('angle-display-left', canvas);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.height = 30 
    canvas.width = 30
    drawCrossair(ctx, canvas.width, canvas.height, Math.PI)
    if (hud.scene.textures.exists('angle-aim-display')) hud.scene.textures.remove('angle-aim-display')
    hud.scene.textures.addCanvas('angle-aim-display', canvas);

    const crossAirRadius = 80
    hud.crossAir = hud.scene.add.image(0, 0, 'angle-aim-display')
    hud.crossAir.setDepth(7).setVisible(false)
    hud.crossAir.setData('toShow', false)
    
    var angleBtn = hud.scene.add.image(0, 0, 'angle-display')
    angleDisplay.add(angleBtn)
    angleDisplay.setDepth(6)
    angleBtn.setInteractive();

    const releasePointer = () => {
        if (hud.crossAir.getData('toShow') === true) {
            if (hud.crossAir.getData('allowHide') === false) {
                hud.crossAir.setData('allowHide', true)
                //hud.mouseLocked = false
            }
            else {
                hud.scene.sound.play('click', {volume: 0.3})
                hud.crossAir.setVisible(false)
                hud.crossAir.setData('toShow', false)
                hud.mouseLocked = false
                hud.scene.input.off('pointerdown', releasePointer)
            }
        }
    }

    angleBtn.on('pointerdown', (e) => {
        if (hud.mouseLocked === true) return
        if (hud.crossAir.getData('toShow') === true) return
        hud.mouseLocked = true

        hud.scene.sound.play('click', {volume: 0.3})
        hud.scene.hideTurnPointer()

        if (hud.scene.activeTank === 1) {
            hud.scene.input.on('pointerdown', releasePointer)
            hud.crossAir.setVisible(true)
            hud.crossAir.setData('allowHide', false)
            hud.crossAir.setData('toShow', true)
            var alpha = hud.scene.tank1.turret.rotation
            hud.crossAir.setPosition(hud.scene.tank1.turret.x + crossAirRadius * Math.sin(alpha), hud.scene.tank1.turret.y - crossAirRadius * Math.cos(alpha))
            
        }
        else if (hud.scene.activeTank === 2) {
            hud.scene.input.on('pointerdown', releasePointer)
            hud.crossAir.setVisible(true)
            hud.crossAir.setData('toShow', true)
            hud.crossAir.setData('allowHide', false)
            var alpha = hud.scene.tank2.turret.rotation
            hud.crossAir.setPosition(hud.scene.tank2.turret.x + crossAirRadius * Math.sin(alpha), hud.scene.tank2.turret.y - crossAirRadius * Math.cos(alpha))
            
        }
    })


    hud.crossAir.refresh = () => {
        // if (hud.scene.input.mousePointer.locked === false) {
        //     hud.crossAir.setVisible(false)
        //     return
        // }
        if (hud.crossAir.visibleTime && hud.crossAir.visibleTime > 0) {
            hud.crossAir.setVisible(true)
            hud.crossAir.visibleTime--
        }
        else {
            hud.crossAir.setVisible(false)
        }
        
        if (hud.crossAir.getData('toShow') === true) {
            hud.crossAir.setVisible(true)
        }
        // else {
        //     hud.crossAir.setVisible(false)
        //     return
        // }

        if (hud.scene.activeTank === 1 && hud.crossAir.getData('toShow')) {
            var prevX, prevY, currX, currY, vec1, vec2, angle, sign;
            prevX = hud.crossAir.x
            prevY = hud.crossAir.y

            var delX = hud.scene.input.mousePointer.x - hud.scene.input.mousePointer.prevPosition.x
            var delY = hud.scene.input.mousePointer.y - hud.scene.input.mousePointer.prevPosition.y

            hud.crossAir.setPosition(hud.crossAir.x + delX, hud.crossAir.y + delY)
            Phaser.Actions.RotateAroundDistance([hud.crossAir], {x: hud.scene.tank1.turret.x, y: hud.scene.tank1.turret.y}, 0, crossAirRadius)

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

        else if (hud.scene.activeTank === 2 && hud.crossAir.getData('toShow')) {
            var prevX, prevY, currX, currY, vec1, vec2, angle;
            prevX = hud.crossAir.x
            prevY = hud.crossAir.y

            var delX = hud.scene.input.mousePointer.x - hud.scene.input.mousePointer.prevPosition.x
            var delY = hud.scene.input.mousePointer.y - hud.scene.input.mousePointer.prevPosition.y

            hud.crossAir.setPosition(hud.crossAir.x + delX, hud.crossAir.y + delY)
            Phaser.Actions.RotateAroundDistance([hud.crossAir], {x: hud.scene.tank2.turret.x, y: hud.scene.tank2.turret.y}, 0, crossAirRadius)

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

       // hud.scene.input.mousePointer.movementX = 0
        //hud.scene.input.mousePointer.movementY = 0
    }


    var angleRightBtn = hud.scene.add.image(w/2, h/2, 'angle-display-right')
    angleDisplay.add(angleRightBtn)
    angleRightBtn.setInteractive().setOrigin(1,1);

    angleRightBtn.on('pointerdown', () => {
        if (hud.mouseLocked === true) return
        hud.scene.sound.play('click', {volume: 0.3})

        hud.scene.hideTurnPointer()
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
        if (hud.mouseLocked === true) return

        hud.scene.sound.play('click', {volume: 0.3})
        hud.scene.hideTurnPointer()
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

