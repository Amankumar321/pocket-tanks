/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawFireFrame = (ctx, width, height, scene) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 4
    var g = ctx.createLinearGradient(width/2, 0, width/2, height)
    g.addColorStop(0, 'rgba(255,0,0,1)')
    g.addColorStop(1, 'rgba(255,255,0,1)')

    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.fillStyle = g
    ctx.textAlign = 'center'
    ctx.font = 'italic 600 50px Verdana'
    if (!scene.game.device.os.desktop){
        ctx.font = 'italic 600 60px Verdana'
    }
    ctx.strokeText('Fire', width/2, height/2 + 18)
    ctx.fillText('Fire', width/2, height/2 + 18)
}


export const createFireButton = (hud) => {
    const socket = window.socket

    var x = hud.height * 9/12
    var y = hud.width * 1/2

    var h = 60
    var w = 160
    
    var fireButton = drawFireBtn(hud.scene, x, y, h, w)[0]

    const fire = () => {
        if (hud.mouseLocked === true) return
        if (hud.scene.sceneData.gameType === 3 && hud.scene.activeTank === 2) return
        hud.scene.sound.play('click', {volume: 0.3})
        hud.scene.hideTurnPointer()
       
        if (hud.scene.activeTank === 1) {
            if (hud.scene.sceneData.gameType === 3)
                socket.emit('shoot', {selectedWeapon: hud.scene.tank1.selectedWeapon, power: hud.scene.tank1.power,
                    rotation: hud.scene.tank1.turret.relativeRotation, rotation1: hud.scene.tank1.rotation, rotation2: hud.scene.tank2.rotation,
                    position1: {x: hud.scene.tank1.x, y: hud.scene.tank1.y}, position2: {x: hud.scene.tank2.x, y: hud.scene.tank2.y}})
            hud.scene.tank1.shoot()
        }
        else if (hud.scene.activeTank === 2) {
            if (hud.scene.sceneData.gameType === 3)
                socket.emit('shoot', {selectedWeapon: hud.scene.tank2.selectedWeapon, power: hud.scene.tank2.power,
                    rotation: hud.scene.tank2.turret.relativeRotation, rotation1: hud.scene.tank1.rotation, rotation2: hud.scene.tank2.rotation,
                    position1: {x: hud.scene.tank1.x, y: hud.scene.tank1.y}, position2: {x: hud.scene.tank2.x, y: hud.scene.tank2.y}})
            hud.scene.tank2.shoot()
        }
    }

    hud.scene.input.keyboard.on('keydown-SPACE', fire)
    fireButton.on('pointerdown', fire)
}

export const drawFireBtn = (scene, x, y, h = 60, w = 160) => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    if (!scene.game.device.os.desktop) {
        h = h * 1.3
        w = w * 1.3
    }

    canvas.height = h
    canvas.width = w

    drawFireFrame(ctx, canvas.width, canvas.height, scene)

    if (scene.textures.exists('fireButton')) scene.textures.remove('fireButton')
    scene.textures.addCanvas('fireButton', canvas);
    
    var fireButton = scene.add.image(x, y, 'fireButton')
    fireButton.setDepth(6)
    fireButton.setInteractive();
    
    return [fireButton]
}