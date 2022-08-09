import { Display } from "phaser"

/**
* @param {Phaser.Scene} scene
*/

export const type3 = (scene) => {
    const socket = window.socket
    socket.removeAllListeners()

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;

    var player1 = scene.sceneData.player1
    var player2 = scene.sceneData.player2
    var hostId = scene.sceneData.hostId
    
    scene.tank1.weapons = player1.weapons
    scene.tank2.weapons = player2.weapons
    
    
    if (socket.id === hostId) {
        scene.terrain.create()
        scene.tank1.create(int2rgba(player1.color), player1.name)
        scene.tank2.create(int2rgba(player2.color), player2.name)
        
        socket.emit('terrainPath', {path: scene.terrain.path, hostPos: {x: scene.tank1.x, y: scene.tank1.y}, playerPos: {x: scene.tank2.x, y: scene.tank2.y}})
    }
    else {
        socket.once('setTerrainPath', ({path, hostPos, playerPos}) => {
            scene.terrain.setPath(path)
            scene.tank1.create(int2rgba(player1.color), player1.name)
            scene.tank2.create(int2rgba(player2.color), player2.name)

            scene.tank1.setPosition(playerPos.x, playerPos.y)
            scene.tank2.setPosition(hostPos.x, hostPos.y)
        })
    
        socket.emit('getTerrainPath', {})
    }

    if (socket.id === hostId) {
        scene.tank1.active = true
        scene.activeTank = 1
    }
    else {
        scene.tank2.active = true
        scene.activeTank = 2
    }

    socket.once('playAgain', () => {
        scene.scene.start('scene-5', scene.sceneData)
    })


    const m = scene.add.text(screenCenterX, screenCenterY, 'Opponent left')
    const n = scene.add.text(screenCenterX, screenCenterY + 60, 'Exit')
    const overlay = scene.add.rectangle(screenCenterX, screenCenterY, scene.renderer.width, scene.renderer.height, 0x000000)

    m.setFontSize(40).setOrigin(0.5).setVisible(false).setDepth(20).setVisible(false)
    n.setFontSize(30).setOrigin(0.5).setVisible(false).setDepth(20).setVisible(false)
    overlay.setVisible(false).setAlpha(0.8).setDepth(19)

    n.setInteractive()
    
    n.on('pointerdown', () => {
        scene.scene.start('scene-4', {gameType: scene.sceneData.gameType, player1: player1})
    })
    
    socket.once('opponentLeft', () => {
        m.setVisible(true)
        n.setVisible(true)
        overlay.setVisible(true)
        overlay.setInteractive()
    })
}




const int2rgba = (colorInt) => {
    var rgba = new Display.Color.IntegerToRGB(colorInt)
    var rgbaString = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')'
    return rgbaString
}