import { Display } from "phaser"

/**
* @param {Phaser.Scene} scene
*/

export const type2 = (scene) => {
    scene.terrain.create()
    
    var player1 = scene.sceneData.player1
    var player2 = scene.sceneData.player2

    scene.tank1.weapons = player1.weapons
    scene.tank2.weapons = player2.weapons

    scene.tank1.create(int2rgba(player1.color), player1.name)
    scene.tank2.create(int2rgba(player2.color), player2.name)


    if (Math.random() > 0.5) {
        scene.tank1.active = true
        scene.activeTank = 1
    }
    else {
        scene.tank2.active = true
        scene.activeTank = 2
    }
}




const int2rgba = (colorInt) => {
    var rgba = new Display.Color.IntegerToRGB(colorInt)
    var rgbaString = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')'
    return rgbaString
}