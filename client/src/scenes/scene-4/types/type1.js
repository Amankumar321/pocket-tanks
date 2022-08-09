/**
* @param {Phaser.Scene} scene
*/

export const type1 = (scene) => {
    scene.player1 = scene.sceneData.player1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX, 100, 'Computer').setFontSize(40).setOrigin(0.5);

    const e = scene.add.text(screenCenterX, 300, 'Difficulty: ').setFontSize(40).setOrigin(0.5);

    var levels = []
    var colors = [0x3366ff, 0x6666ff,0x9999ff, 0xccccff, 0xffcccc, 0xff9999, 0xff6666, 0xff3333]
    var textColors = ['#3366ff', '#6666ff', '#9999ff', '#ccccff', '#ffcccc', '#ff9999', '#ff6666', '#ff3333']
    var tankColorValues = [0xFF0000, 0xFF9900, 0xFFFF00, 0x66FF33, 0x00FFFF, 0x0000FF, 0x9933FF, 0xCC0099]
    var cpuColor

    var selectedLevel = 5
    
    levels.push({ value: 1, box: scene.add.rectangle(screenCenterX - 350, 500, 100, 100)})
    levels.push({ value: 2, box: scene.add.rectangle(screenCenterX - 250, 500, 100, 100)})
    levels.push({ value: 3, box: scene.add.rectangle(screenCenterX - 150, 500, 100, 100)})
    levels.push({ value: 4, box: scene.add.rectangle(screenCenterX - 50, 500, 100, 100)})
    levels.push({ value: 5, box: scene.add.rectangle(screenCenterX + 50, 500, 100, 100)})
    levels.push({ value: 6, box: scene.add.rectangle(screenCenterX + 150, 500, 100, 100)})
    levels.push({ value: 7, box: scene.add.rectangle(screenCenterX + 250, 500, 100, 100)})
    levels.push({ value: 8, box: scene.add.rectangle(screenCenterX + 350, 500, 100, 100)})

    levels.forEach((level, index) => {
        level.box.setStrokeStyle(2, colors[index])
        level.box.setInteractive()
        level.box.setOrigin(0.5)
        level.box.input.alwaysEnabled = true
        level.box.setAlpha(0)
        scene.add.text(level.box.x, level.box.y, level.value).setOrigin(0.5).setFontSize(48).setColor(textColors[index])

        level.box.on('pointerdown', () => {
            levels[selectedLevel - 1].box.setAlpha(0) 
            level.box.setAlpha(1)
            selectedLevel = level.value
        })
    })

    levels[4].box.setAlpha(1)

    // set random color
    cpuColor = tankColorValues[(new Date()).getSeconds() % 8]

    const easy = scene.add.text(screenCenterX - 350, 600, 'Easy').setOrigin(0.5).setFontSize(48).setColor(textColors[0])
    const hard = scene.add.text(screenCenterX + 350, 600, 'Hard').setOrigin(0.5).setFontSize(48).setColor(textColors[textColors.length - 1])

    const g = scene.add.text(screenCenterX, 700, 'Continue').setFontSize(40).setOrigin(0.5);

    g.setInteractive()
    g.on('pointerdown', () => {
        scene.scene.start('scene-5', {gameType: 1, player1: scene.player1, cpu1: {name: "CPU " + selectedLevel, level: selectedLevel, color: cpuColor}})
    })
}