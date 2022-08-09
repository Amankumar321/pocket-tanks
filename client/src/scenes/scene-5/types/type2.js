import { weaponArray } from "../../../weapons/array";

/**
* @param {Phaser.Scene} scene
*/

export const type2 = (scene) => {
    const totalWeapons = 4

    scene.player1 = scene.sceneData.player1
    scene.player2 = scene.sceneData.player2

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

    var turn = 1
    var pickableArray = []

    const pickWeapon = (pickable) => {
        if (turn === 1) {
            var x = rect1.x - rect1.width/2 + 10
            var y = rect1.y - rect1.height/2 + 10 + scene.player1.weapons.length * 40
            pickable.setPosition(x, y)
            scene.player1.weapons.push({id: pickable.weaponIndex, name: pickable.text})
            turn = 2
        }
        else if (turn === 2) {
            var x = rect3.x - rect3.width/2 + 10
            var y = rect3.y - rect3.height/2 + 10 + scene.player2.weapons.length * 40
            pickable.setPosition(x, y)
            scene.player2.weapons.push({id: pickable.weaponIndex, name: pickable.text})
            turn = 1
        }
    }

    for (let index = 0; index < totalWeapons; index++) {
        var randomWeaponIndex = Math.floor(Math.random() * weaponArray.length)
        pickableArray.push(scene.add.text(rect2.x - rect2.width/2 + 10, rect2.y - rect2.height/2 + 10 + index * 40, weaponArray[randomWeaponIndex].name))
        pickableArray[index].setFontSize(24)
        pickableArray[index].setInteractive()
        pickableArray[index].weaponIndex = weaponArray[randomWeaponIndex].id

        pickableArray[index].on('pointerdown', () => {
            pickWeapon(pickableArray[index])
        })
    }


    const g = scene.add.text(screenCenterX, 700, 'Continue').setFontSize(40).setOrigin(0.5);

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('main-scene', {gameType: 2, player1: scene.player1, player2: scene.player2})
    })
}