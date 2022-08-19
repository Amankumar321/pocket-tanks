import { Display } from "phaser"
import { Computer } from "../../../classes/Computer"

/**
* @param {Phaser.Scene} scene
*/

export const type1 = (scene) => {
    scene.terrain.create()

    var player1 = scene.sceneData.player1
    var cpu1 = scene.sceneData.cpu1

    scene.cpuHandler = new Computer(scene, scene.tank2, cpu1.level)
    
    scene.tank1.weapons = player1.weapons
    scene.tank2.weapons = cpu1.weapons

    scene.tank1.create(int2rgba(player1.color), player1.name)
    scene.tank2.create(int2rgba(cpu1.color), cpu1.name)

    scene.tank1.active = true
    scene.activeTank = 1
        
}




const int2rgba = (colorInt) => {
    var rgba = new Display.Color.IntegerToRGB(colorInt)
    var rgbaString = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')'
    return rgbaString
}