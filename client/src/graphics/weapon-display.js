import { HUD } from "../classes/HUD"
import { ScrollList } from "../classes/ScrollList"
import { weaponArray } from "../weapons/array"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
const drawWeaponBox = (ctx, width, height, scene) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'

    ctx.moveTo(0, height/4)
    ctx.lineTo(width * 3/10, height/4)
    ctx.arcTo(width * 3/10, 0, width/2, 0, height/8)
    ctx.arcTo(width * 7/10, 0, width * 7/10, height/4, height/8)
    ctx.lineTo(width * 7/10, height/4)
    ctx.lineTo(width, height/4)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '500 18px Arial'
    if (!scene.game.device.os.desktop){
        ctx.font = '500 26px Arial'
    }
    ctx.fillText('Weapon', width/2, height/4)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawWeaponScrollBox = (ctx, width, height, scene) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'

    ctx.moveTo(0, height/12)
    ctx.lineTo(width * 3/10, height/12)
    ctx.arcTo(width * 3/10, 0, width/2, 0, height/24)
    ctx.arcTo(width * 7/10, 0, width * 7/10, height/12, height/24)
    ctx.lineTo(width * 7/10, height/12)
    ctx.lineTo(width, height/12)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    if (!scene.game.device.os.desktop){
        ctx.font = '26px Arial'
    }
    ctx.fillText('Weapon', width/2, height/12)
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawArrow = (ctx, width, height, angle) => {
    
}


/**
 * @param {HUD} hud 
 */

export const createWeaponDisplay = (hud) => {
    var w = 220
    var h = 80
    
    var [weaponBox, weaponName, weaponLogo, weaponDisplayBackground] = drawWeaponDisplay(hud.scene, hud.width * 1/4, hud.height * 10.6/12, w, h)
    hud.weaponBox = weaponBox
    hud.weaponName = weaponName

    createWeaponScrollDisplay(hud, weaponLogo)
}

const createWeaponScrollDisplay = (hud, weaponLogo) => {
    var w = 220
    var h = 80 * 3

    if (!hud.scene.game.device.os.desktop) {
        w = w * 1.3
        h = h * 1.3
    }

    hud.weaponScrollDisplay = new ScrollList(hud.scene, hud.weaponName, hud.weaponBox, weaponLogo)

    var scrollContainer = hud.scene.add.container(hud.width * 1/4, hud.height * 11/12 - h * 1/3)
    scrollContainer.setDepth(20)

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawWeaponScrollBox(ctx, canvas.width, canvas.height, hud.scene)
    if (hud.scene.textures.exists('weapon-scroll-box')) hud.scene.textures.remove('weapon-scroll-box')
    hud.scene.textures.addCanvas('weapon-scroll-box', canvas);

    hud.weaponScrollDisplay.scrollBox = hud.scene.add.image(0, 0, 'weapon-scroll-box').setOrigin(0.5)
    scrollContainer.add(hud.weaponScrollDisplay.scrollBox)

    hud.weaponScrollDisplay.scrollBackground = hud.scene.add.rectangle(0, h/24, w - w/12, h - h/6, 0x000000)
    scrollContainer.add(hud.weaponScrollDisplay.scrollBackground)

    hud.weaponScrollDisplay.tileHeight = h/3 - h/6

    hud.weaponScrollDisplay.create()
}


export const drawWeaponDisplay = (scene, x, y, w = 220, h = 80) => {
    var weaponContainer = scene.add.container(x, y)
    weaponContainer.setDepth(6)

    if (!scene.game.device.os.desktop) {
        h = h * 1.3
        w = w * 1.3
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')

    canvas.height = h
    canvas.width = w

    drawWeaponBox(ctx, canvas.width, canvas.height, scene)
    if (scene.textures.exists('weapon-box')) scene.textures.remove('weapon-box')
    scene.textures.addCanvas('weapon-box', canvas);

    var weaponBox = scene.add.image(0, 0, 'weapon-box')
    weaponContainer.add(weaponBox)

    var innerW = w - w/12
    var innerH = h - h/2
    var weaponDisplay = scene.add.container(0, h/8)
    var key = Math.random().toString(32).slice(3,7)
    var logoCanvas = weaponArray[0].logoCanvas;

    if (scene.activeTank === 1) {
        logoCanvas = weaponArray[scene.tank1.selectedWeapon].logoCanvas
    }
    else if (scene.activeTank === 2) {
        logoCanvas = weaponArray[scene.tank2.selectedWeapon].logoCanvas
    }
    
    if (scene.textures.exists(key)) scene.textures.remove(key)
    scene.textures.addCanvas(key, logoCanvas)
    
    var margin = (innerH - logoCanvas.height * ((innerH/logoCanvas.height) * 0.9))/2
    var weaponLogo = scene.add.image(-(w - w/12)/2 + margin, 0, key)
    weaponLogo.setOrigin(0, 0.5).setScale(innerH/weaponLogo.height * 0.9, innerH/weaponLogo.height * 0.9)

    var weaponDisplayBackground = scene.add.rectangle(0, 0, w - w/12, h - h/2, 0x000000).setOrigin(0.5)
    weaponDisplay.add(weaponDisplayBackground)
    weaponDisplay.setDepth(15)

    weaponDisplay.add(weaponLogo)

    var textWidth = innerW - weaponLogo.width + margin * 2
    var weaponName = scene.add.text(-innerW/2 + weaponLogo.width + margin * 2 + textWidth/2, 0, 'Single Shot').setFontFamily('Geneva').setFontSize(18)
    if (!scene.game.device.os.desktop){
        weaponName.setFontSize(26)
    }
    weaponName.setOrigin(0.5)
    weaponDisplay.add(weaponName)

    weaponContainer.add(weaponDisplay)

    weaponBox.setInteractive()

    return [weaponBox, weaponName, weaponLogo, weaponDisplayBackground]
}