import { HUD } from "../classes/HUD"
import { ScrollList } from "../classes/ScrollList"

/**
 * @param {CanvasRenderingContext2D} ctx 
 */

const drawWeaponDisplay = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(200,200,200,1)'
    ctx.fillRect(0, 0, width, height/2)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, height/2, width, height)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.textAlign = 'center'
    ctx.font = '18px Arial'
    ctx.fillText('Power', width/2, height/4)
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
    hud.weaponDisplay = hud.scene.add.rectangle(hud.width * 1/4, hud.height * 11/12, 100, 50, 0x000000, 0).setStrokeStyle(2, 0x000000, 1)
    hud.weaponName = hud.scene.add.text(hud.weaponDisplay.x, hud.weaponDisplay.y, '')
    hud.weaponName.setDepth(7).setOrigin(0.5)
    hud.weaponDisplay.setInteractive()
    hud.weaponDisplay.setDepth(6)

    weaponScrollDisplay(hud)
}

const weaponScrollDisplay = (hud) => {
    hud.weaponScrollDisplay = new ScrollList(hud.scene, hud.weaponName, hud.weaponDisplay)
}

