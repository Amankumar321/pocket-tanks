/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawFireBtn = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,0,0,1)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 4
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '30px Arial'
    ctx.fillText('FIRE', width/2, height/2 + 12)
}


export const createFireButton = (hud) => {
    const socket = window.socket
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = 40 
    canvas.width = 100

    drawFireBtn(ctx, canvas.width, canvas.height)

    hud.scene.textures.addCanvas('fireButton', canvas);
    
    hud.fireButton = hud.scene.add.image(hud.width/2, hud.height * 9/12, 'fireButton')
    hud.fireButton.setDepth(6)
    hud.fireButton.setInteractive();

    hud.fireButton.on('pointerdown', () => {
        if (hud.scene.activeTank === 1) {
            if (hud.scene.sceneData.gameType === 3)
                socket.emit('shoot', {selectedWeapon: hud.scene.tank1.selectedWeapon, power: hud.scene.tank1.power, rotation: hud.scene.tank1.turret.rotation})
            hud.scene.tank1.shoot()
        }
        else if (hud.scene.activeTank === 2) {
            if (hud.scene.sceneData.gameType === 3)
                socket.emit('shoot', {selectedWeapon: hud.scene.tank2.selectedWeapon, power: hud.scene.tank2.power, rotation: hud.scene.tank2.turret.rotation})
            hud.scene.tank2.shoot()
        }
    })
}