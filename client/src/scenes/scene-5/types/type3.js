import { weaponArray } from "../../../weapons/array";
import Phaser from "phaser";

/**
* @param {Phaser.Scene} scene
*/

export const type3 = (scene) => {
    const socket = window.socket
    socket.removeAllListeners()
    const totalWeapons = 4

    scene.player1 = scene.sceneData.player1
    scene.player2 = scene.sceneData.player2
    scene.hostId = scene.sceneData.hostId

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX / 2 - 50, 50, scene.player1.name);
    const b = scene.add.text(screenCenterX * 3/2 + 50, 50, scene.player2.name);

    a.setOrigin(0.5).setFontSize(30)
    b.setOrigin(0.5).setFontSize(30)

    var rect1 = scene.add.rectangle(screenCenterX / 2 - 50, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect1.setStrokeStyle(6, scene.player1.color)
    
    var rect2 = scene.add.rectangle(screenCenterX, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect2.setStrokeStyle(6, 0xFFFFFF)

    var rect3 = scene.add.rectangle(screenCenterX * 3/2 + 50, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect3.setStrokeStyle(6, scene.player2.color)

    scene.player1.weapons = []
    scene.player2.weapons = []

    var turn = socket.id === scene.hostId ? 1 : 2
    var pickableArray = []
    var remainingArray = []


    socket.on('opponentWeaponPick', ({arrayIndex}) => {
        var oppPick = pickableArray[arrayIndex]
        var x = rect3.x - rect3.width/2 + 10
        var y = rect3.y - rect3.height/2 + 10 + scene.player2.weapons.length * 40
        oppPick.setPosition(x, y)
        oppPick.removeInteractive()
        scene.player2.weapons.push({id: oppPick.weaponIndex, name: oppPick.text})
        turn = 1
    })

    const pickWeapon = (pickable) => {
        if (turn === 1) {
            var x = rect1.x - rect1.width/2 + 10
            var y = rect1.y - rect1.height/2 + 10 + scene.player1.weapons.length * 40
            pickable.setPosition(x, y)
            pickable.removeInteractive()
            remainingArray = remainingArray.filter((ele) => { return ele !== pickable.arrayIndex })
            scene.player1.weapons.push({id: pickable.weaponIndex, name: pickable.text})
            socket.emit('weaponPick', {arrayIndex: pickable.arrayIndex})
            turn = 2
        }
    }


    socket.once('setWeaponArray', ({randomArray}) => {
        for (let index = 0; index < randomArray.length; index++) {
            var randomWeaponIndex = randomArray[index]
            var pickable = scene.add.text(rect2.x - rect2.width/2 + 10, rect2.y - rect2.height/2 + 10 + index * 40, weaponArray[randomWeaponIndex].name)
            pickableArray.push(pickable)
            pickable.setFontSize(24)
            pickable.setInteractive()
            pickable.weaponIndex =  weaponArray[randomWeaponIndex].id
            pickable.arrayIndex = index
            remainingArray.push(index)

            pickable.on('pointerdown', () => {
                pickWeapon(pickableArray[index])
            })
        }
    })

    if (socket.id === scene.hostId) {
        socket.emit('createWeaponArray', {count: totalWeapons})
    }

    socket.emit('getWeaponArray', {})

    socket.once('startGame', () => {
        scene.scene.start('main-scene', {gameType: 3, player1: scene.player1, player2: scene.player2, hostId: scene.hostId})
    })

    
    const g = scene.add.text(screenCenterX, 700, 'Continue').setFontSize(40).setOrigin(0.5);
    const m = scene.add.text(screenCenterX, screenCenterY, 'Opponent left')
    const n = scene.add.text(screenCenterX, screenCenterY + 60, 'Exit')
    const overlay = scene.add.rectangle(screenCenterX, screenCenterY, scene.renderer.width, scene.renderer.height, 0x000000)

    m.setFontSize(40).setOrigin(0.5).setVisible(false).setDepth(20).setVisible(false)
    n.setFontSize(30).setOrigin(0.5).setVisible(false).setDepth(20).setVisible(false)
    overlay.setVisible(false).setAlpha(0.8).setDepth(19)

    n.setInteractive()
    
    n.on('pointerdown', () => {
        scene.scene.start('scene-4', {gameType: scene.sceneData.gameType, player1: scene.player1})
    })
    
    socket.once('opponentLeft', () => {
        m.setVisible(true)
        n.setVisible(true)
        overlay.setVisible(true)
        overlay.setInteractive()
    })

    g.setInteractive()
    g.on('pointerdown', () => {
        socket.emit('ready', {})
        g.setText('Waiting for opponent...')
        g.disableInteractive()
    })

}