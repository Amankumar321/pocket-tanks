import { weaponArray } from "../../../weapons/array";

/**
* @param {Phaser.Scene} scene
*/

export const type4 = (scene) => {
    scene.player1 = scene.sceneData.player1
    scene.player2 = scene.sceneData.player2

    scene.player1.weapons = []
    scene.player2.weapons = []

    weaponArray.forEach((weapon) => {
        scene.player1.weapons.push({id: weapon.id, name: weapon.name})  
        scene.player2.weapons.push({id: weapon.id, name: weapon.name})
    })

    scene.scene.start('main-scene', {gameType: 4, player1: scene.player1, player2: scene.player2})
}