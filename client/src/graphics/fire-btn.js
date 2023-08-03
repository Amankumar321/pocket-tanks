/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawFireBtn = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 2
    var g = ctx.createLinearGradient(width/2, 0, width/2, height)
    g.addColorStop(0, 'rgba(255,0,0,1)')
    g.addColorStop(1, 'rgba(255,255,0,1)')

    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.fillStyle = g
    ctx.textAlign = 'center'
    ctx.font = 'italic 700 50px Verdana'
    ctx.fillText('Fire', width/2, height/2 + 18)
    ctx.strokeText('Fire', width/2, height/2 + 18)
}


export const createFireButton = (hud) => {
    const socket = window.socket
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = 60 
    canvas.width = 160

    drawFireBtn(ctx, canvas.width, canvas.height)

    if (hud.scene.textures.exists('fireButton')) hud.scene.textures.remove('fireButton')
    hud.scene.textures.addCanvas('fireButton', canvas);
    
    hud.fireButton = hud.scene.add.image(hud.width/2, hud.height * 9/12, 'fireButton')
    hud.fireButton.setDepth(6)
    hud.fireButton.setInteractive();

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
    hud.fireButton.on('pointerdown', fire)
}