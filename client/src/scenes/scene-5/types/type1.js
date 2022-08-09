import { weaponArray } from "../../../weapons/array";

/**
* @param {Phaser.Scene} scene
*/

export const type1 = (scene) => {
    const totalWeapons = 4

    scene.player1 = scene.sceneData.player1
    scene.cpu1 = scene.sceneData.cpu1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX / 2 - 50, 50, scene.player1.name);
    const b = scene.add.text(screenCenterX * 3/2 + 50, 50, scene.cpu1.name);

    a.setOrigin(0.5).setFontSize(30)
    b.setOrigin(0.5).setFontSize(30)

    var rect1 = scene.add.rectangle(screenCenterX / 2 - 50, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect1.setStrokeStyle(6, scene.player1.color)
    
    var rect2 = scene.add.rectangle(screenCenterX, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect2.setStrokeStyle(6, 0xFFFFFF)

    var rect3 = scene.add.rectangle(screenCenterX * 3/2 + 50, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    rect3.setStrokeStyle(6, scene.cpu1.color)

    scene.player1.weapons = []
    scene.cpu1.weapons = []

    var turn = 1
    var pickableArray = []
    var remainingArray = []


    const pickWeapon = (pickable) => {
        if (turn === 1) {
            var x = rect1.x - rect1.width/2 + 10
            var y = rect1.y - rect1.height/2 + 10 + scene.player1.weapons.length * 40
            pickable.setPosition(x, y)
            pickable.removeInteractive()
            remainingArray = remainingArray.filter((ele) => { return ele !== pickable.arrayIndex })
            scene.player1.weapons.push({id: pickable.weaponIndex, name: pickable.text})
            turn = 2

            //CPU pick
            setTimeout(() => {
                var randomIndex = Math.floor(Math.random() * remainingArray.length)
                var cpuPick = pickableArray[remainingArray[randomIndex]]

                var x = rect3.x - rect3.width/2 + 10
                var y = rect3.y - rect3.height/2 + 10 + scene.cpu1.weapons.length * 40
                cpuPick.setPosition(x, y)
                cpuPick.removeInteractive()
                remainingArray = remainingArray.filter((ele) => { return ele !== cpuPick.arrayIndex })
                scene.cpu1.weapons.push({id: cpuPick.weaponIndex, name: cpuPick.text})
                turn = 1
            }, 1000);
        }
    }

    for (let index = 0; index < totalWeapons; index++) {
        var randomWeaponIndex = Math.floor(Math.random() * weaponArray.length)
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


    const g = scene.add.text(screenCenterX, 700, 'Continue').setFontSize(40).setOrigin(0.5);

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('main-scene', {gameType: 1, player1: scene.player1, cpu1: scene.cpu1})
    })
}