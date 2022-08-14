import { Display } from "phaser";

/**
* @param {Phaser.Scene} scene
*/

export const type2 = (scene) => {
    scene.player1 = scene.sceneData.player1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX, 100, 'Player 2').setFontSize(40);

    const b = scene.add.text(screenCenterX - 100, 200, 'Name: ').setFontSize(40);
    const c = scene.add.text(screenCenterX + 50, 200, 'Champion').setFontSize(40);
    const d = scene.add.text(screenCenterX + 50, 200, '_').setFontSize(40);

    const e = scene.add.text(screenCenterX - 100, 300, 'Color: ').setFontSize(40);
    const f = scene.add.text(screenCenterX + 50, 300, '').setFontSize(40);


    d.setX(c.x + c.width)

    scene.input.keyboard.on('keydown', (e) => {
        if (e.key === "Backspace") {
            c.setText(c.text.slice(0, c.text.length - 1))
            d.setX(c.x + c.width)

        }
        else {
            c.setText(c.text + e.key)
            d.setX(c.x + c.width)
        }
    })

    setInterval(() => {
        d.visible === true ? d.setVisible(false) : d.setVisible(true)
    }, 500);

    var colors = []
    var colorValues = [0xFF0000, 0xFF9900, 0xFFFF00, 0x66FF33, 0x00FFFF, 0x0000FF, 0x9933FF, 0xCC0099]
    var selectedColor
    
    colors.push({ name: 'Red', box: scene.add.rectangle(screenCenterX - 350, 500, 100, 100)})
    colors.push({ name: 'Orange', box: scene.add.rectangle(screenCenterX - 250, 500, 100, 100)})
    colors.push({ name: 'Yellow', box: scene.add.rectangle(screenCenterX - 150, 500, 100, 100)})
    colors.push({ name: 'Green', box: scene.add.rectangle(screenCenterX - 50, 500, 100, 100)})
    colors.push({ name: 'Cyan', box: scene.add.rectangle(screenCenterX + 50, 500, 100, 100)})
    colors.push({ name: 'Blue', box: scene.add.rectangle(screenCenterX + 150, 500, 100, 100)})
    colors.push({ name: 'Violet', box: scene.add.rectangle(screenCenterX + 250, 500, 100, 100)})
    colors.push({ name: 'Magenta', box: scene.add.rectangle(screenCenterX + 350, 500, 100, 100)})

    colors.forEach((color, index) => {
        color.box.setInteractive()
        color.box.setFillStyle(colorValues[index], 1)
        color.box.on('pointerdown', () => {
            f.setText(color.name)
            selectedColor = index
        })
    })

    // set random color
    selectedColor = (new Date()).getSeconds() % 8
    f.setText(colors[selectedColor].name)

    //
    const g = scene.add.text(screenCenterX, 700, 'Continue').setFontSize(40);

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('scene-5', {gameType: 2, player1: scene.player1, player2: {name: c.text, color: colorValues[selectedColor]}})
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