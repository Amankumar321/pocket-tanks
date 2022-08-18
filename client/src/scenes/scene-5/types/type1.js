import { weaponArray } from "../../../weapons/array";
import { Display } from "phaser";

/**
* @param {Phaser.Scene} scene
*/

export const type1 = (scene) => {
    const totalWeapons = 20

    scene.player1 = scene.sceneData.player1
    scene.cpu1 = scene.sceneData.cpu1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX / 2 - 150, 170, scene.player1.name);
    const b = scene.add.text(screenCenterX * 3/2 + 150, 170, scene.cpu1.name);
    a.setFontFamily('"Days One"')
    b.setFontFamily('"Days One"')
    a.setColor(int2rgba(scene.player1.color))
    b.setColor(int2rgba(scene.cpu1.color))

    const c = scene.add.text(screenCenterX, 100, 'WEAPON SHOP').setFontSize(50);
    c.setColor('rgba(240,240,240,1)')
    c.setOrigin(0.5, 0.5)
    c.setFontFamily('"Days One"')
    strokeText(c, 6)

    a.setOrigin(0.5).setFontSize(30)
    b.setOrigin(0.5).setFontSize(30)

    var rect1 = scene.add.rectangle(screenCenterX / 2 - 150, screenCenterY, scene.renderer.width/4 - 100, scene.renderer.height/2)
    rect1.setStrokeStyle(4, scene.player1.color)
    
    var rect2 = scene.add.rectangle(screenCenterX, screenCenterY, scene.renderer.width/3 - 100, scene.renderer.height/2)
    //rect2.setStrokeStyle(6, 0xFFFFFF)

    var rect3 = scene.add.rectangle(screenCenterX * 3/2 + 150, screenCenterY, scene.renderer.width/4 - 100, scene.renderer.height/2)
    rect3.setStrokeStyle(4, scene.cpu1.color)

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

    for (let index = 0; index < totalWeapons/2; index++) {
        var randomWeaponIndex = Math.floor(Math.random() * weaponArray.length)
        var pickable = scene.add.container(rect2.x - rect2.width/2 - 50, rect2.y - rect2.height/2 + 10 + index * 40)
        var txt = scene.add.text(30,5,weaponArray[randomWeaponIndex].name).setDepth(10)
        var img = scene.add.image(10,15, scene.textures.addCanvas(Math.random().toString(32).slice(3,7), weaponArray[randomWeaponIndex].logoCanvas)).setDepth(10)
        var rect = scene.add.rectangle(80,15,250,30).setDepth(2)
        //rect.setStrokeStyle(2, 0xff0000)
        pickable.add(txt)
        pickable.text = weaponArray[randomWeaponIndex].name
        pickable.add(rect)
        pickable.add(img)
        pickableArray.push(pickable)
        txt.setFontSize(20)
        txt.setFontFamily('"Andale Mono"')
        pickable.weaponIndex =  weaponArray[randomWeaponIndex].id
        pickable.arrayIndex = index
        remainingArray.push(index)

        rect.setInteractive()
        rect.on('pointerdown', () => {
            pickWeapon(pickableArray[index])
        })
    }

    for (let index = 0; index < totalWeapons/2; index++) {
        var randomWeaponIndex = Math.floor(Math.random() * weaponArray.length)
        var pickable = scene.add.container(rect2.x - rect2.width/2 + 280, rect2.y - rect2.height/2 + 10 + index * 40)
        var txt = scene.add.text(30,5,weaponArray[randomWeaponIndex].name).setDepth(10)
        var img = scene.add.image(10,15, scene.textures.addCanvas(Math.random().toString(32).slice(3,7), weaponArray[randomWeaponIndex].logoCanvas)).setDepth(10)
        var rect = scene.add.rectangle(80,15,250,30).setDepth(2)
        //rect.setStrokeStyle(2, 0xff0000)
        pickable.add(txt)
        pickable.text = weaponArray[randomWeaponIndex].name
        pickable.add(rect)
        pickable.add(img)
        pickableArray.push(pickable)
        txt.setFontSize(20)
        txt.setFontFamily('"Andale Mono"')
        pickable.weaponIndex =  weaponArray[randomWeaponIndex].id
        pickable.arrayIndex = index + totalWeapons/2
        remainingArray.push(index + totalWeapons/2)

        rect.setInteractive()
        rect.on('pointerdown', () => {
            pickWeapon(pickableArray[index + totalWeapons/2])
        })
    }


    const g = scene.add.text(screenCenterX, 700, 'CONTINUE').setFontSize(50).setOrigin(0.5);
    g.setFontFamily('"Days One"')
    g.setOrigin(0.5)
    g.setColor('rgba(255,255,0,1)')
    strokeText(g, 6)

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('main-scene', {gameType: 1, player1: scene.player1, cpu1: scene.cpu1})
    })
}


const int2rgba = (colorInt) => {
    var rgba = new Display.Color.IntegerToRGB(colorInt)
    var rgbaString = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')'
    return rgbaString
}

const strokeText = (txt, thickness) => {
    var re = /rgba\((\d+),(\d+),(\d+),(\d+)\)/
    var match = new RegExp(re).exec(txt.style.color)
    var r, g, b, a, k = 0.7;
    r = parseInt(match[1])
    g = parseInt(match[2])
    b = parseInt(match[3])
    a = parseInt(match[4])

    r = Math.ceil(r * k)
    g = Math.ceil(g * k)
    b = Math.ceil(b * k)

    txt.setStroke('rgba(' + r + ',' + g + ',' + b + ',' + a + ')', thickness)
}
