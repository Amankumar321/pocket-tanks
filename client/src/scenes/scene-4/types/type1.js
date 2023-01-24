import { Display } from "phaser";

/**
* @param {Phaser.Scene} scene
*/

export const type1 = (scene) => {
    scene.player1 = scene.sceneData.player1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX, 100, 'COMPUTER\nPLAYER').setFontSize(50).setOrigin(0.5, 0);
    a.setAlign('center')
    a.setFontFamily('"Days One"')

    const e = scene.add.text(screenCenterX, 320, 'DIFFICULTY :').setFontSize(50).setOrigin(0.5);
    e.setFontFamily('"Days One"')

    a.setColor('rgba(240,240,240,1)')
    strokeText(a, 6)
    e.setColor('rgba(180,180,180,1)')
    strokeText(e, 6)

    var levels = []
    var colors = [0x3366ff, 0x6666ff,0x9999ff, 0xccccff, 0xffcccc, 0xff9999, 0xff6666, 0xff3333]
    var textColors = ['#3366ff', '#6666ff', '#9999ff', '#ccccff', '#ffcccc', '#ff9999', '#ff6666', '#ff3333']
    var tankColorValues = [0xFF0000, 0xFF9900, 0xFFFF00, 0x66FF33, 0x00FFFF, 0x0000FF, 0x9933FF, 0xCC0099]
    var cpuColor

    var selectedLevel = 5
    
    levels.push({ value: 1, box: scene.add.rectangle(screenCenterX - 350, 440, 100, 100)})
    levels.push({ value: 2, box: scene.add.rectangle(screenCenterX - 250, 440, 100, 100)})
    levels.push({ value: 3, box: scene.add.rectangle(screenCenterX - 150, 440, 100, 100)})
    levels.push({ value: 4, box: scene.add.rectangle(screenCenterX - 50, 440, 100, 100)})
    levels.push({ value: 5, box: scene.add.rectangle(screenCenterX + 50, 440, 100, 100)})
    levels.push({ value: 6, box: scene.add.rectangle(screenCenterX + 150, 440, 100, 100)})
    levels.push({ value: 7, box: scene.add.rectangle(screenCenterX + 250, 440, 100, 100)})
    levels.push({ value: 8, box: scene.add.rectangle(screenCenterX + 350, 440, 100, 100)})

    levels.forEach((level, index) => {
        level.box.setStrokeStyle(2, colors[index])
        level.box.setInteractive()
        level.box.setOrigin(0.5)
        level.box.input.alwaysEnabled = true
        level.box.setAlpha(0)
        var levelTxt = scene.add.text(level.box.x, level.box.y, level.value).setOrigin(0.5).setFontSize(42)
        levelTxt.setColor(int2rgba(colors[index]))
        levelTxt.setFontFamily('"Days One"')
        strokeText(levelTxt, 6)

        level.box.on('pointerdown', () => {
            levels[selectedLevel - 1].box.setAlpha(0) 
            level.box.setAlpha(1)
            selectedLevel = level.value
        })
    })

    levels[4].box.setAlpha(1)

    // set random color
    cpuColor = tankColorValues[(new Date()).getSeconds() % 8]

    const easy = scene.add.text(screenCenterX - 350, 540, 'EASY').setOrigin(0.5).setFontSize(50).setColor(int2rgba(colors[0]))
    const hard = scene.add.text(screenCenterX + 350, 540, 'HARD').setOrigin(0.5).setFontSize(50).setColor(int2rgba(colors[colors.length - 1]))
    easy.setFontFamily('"Days One"')
    hard.setFontFamily('"Days One"')
    strokeText(easy, 6)
    strokeText(hard, 6)

    const g = scene.add.text(screenCenterX, 700, 'CONTINUE').setFontSize(50).setOrigin(0.5);
    g.setFontFamily('"Days One"')
    g.setOrigin(0.5)
    g.setColor('rgba(255,255,0,1)')
    strokeText(g, 6)

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('scene-5', {gameType: 1, player1: scene.player1, cpu1: {name: "CPU " + selectedLevel, level: selectedLevel, color: cpuColor}})
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