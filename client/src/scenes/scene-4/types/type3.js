import { Display } from "phaser";

/**
 * @param {Phaser.Scene} scene
 */

export const type3 = (scene) => {
    const totalWeapons = 4
    const socket = window.socket
    socket.removeAllListeners()

    scene.player1 = scene.sceneData.player1

    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    const a = scene.add.text(screenCenterX, 100, 'CHOOSE').setFontSize(50);
    a.setColor('rgba(240,240,240,1)')
    a.setOrigin(0.5, 0)
    a.setFontFamily('"Days One"')
    strokeText(a, 6)

    var colors = []
    var colorValues = [0xFF0000, 0xFF9900, 0xFFFF00, 0x66FF33, 0x00FFFF, 0x0000FF, 0x9933FF, 0xCC0099]
    var selectedColor
    
    // set random color
    var selectedColor = (new Date()).getSeconds() % 8
    //

    scene.roomList = []

    const updateRooms = () => {
        scene.roomList.forEach((room, index) => {
            if (index > 4) return
            room.x = scene.add.rectangle(screenCenterX - 300, 150 + (index + 1) * 80, 50, 50, room.host.color, 255);
            room.y = scene.add.text(screenCenterX - 250, 150 + (index + 1) * 80, room.host.name).setFontSize(26);
            room.z = scene.add.text(screenCenterX + 250, 150 + (index + 1) * 80, 'Play').setFontSize(26);
            room.z.setColor('rgba(240,240,240,1)')
            room.y.setColor('rgba(180,180,180,1)')
            room.x.setOrigin(0.5)
            room.y.setOrigin(0, 0.4).setFontSize(40).setFontFamily('"Days One"')
            room.z.setOrigin(0.5, 0.4).setFontSize(40).setFontFamily('"Days One"')
            strokeText(room.y, 6)
            strokeText(room.z, 6)
            room.z.setInteractive()
            room.z.on('pointerdown', () => {
                socket.emit('joinRoom', {roomId: room.roomId, name: scene.player1.name, color: scene.player1.color})
            })
        });
    }

    const clearRooms = () => {
        scene.roomList.forEach((room, index) => {
            if (index > 4) return
            room.x.destroy(true)
            room.y.destroy(true)
            room.z.destroy(true)
        });
        scene.roomList = []
    }

    socket.on('setRooms', ({rooms}) => {
        clearRooms()
        rooms.forEach((room) => { scene.roomList.push(room) })
        updateRooms()
    })

    socket.emit('getRooms', {})

    socket.on('startPick', ({host, player}) => {
        if (socket.id === host.socketId)
            scene.scene.start('scene-5', {gameType: 3, player1: scene.player1, player2: player, hostId: host.socketId})
        else
            scene.scene.start('scene-5', {gameType: 3, player1: scene.player1, player2: host, hostId: host.socketId})
    })

    const g = scene.add.text(screenCenterX, 700, 'CREATE ROOM').setFontSize(50);
    var gtype = 0
    g.setFontFamily('"Days One"')
    g.setOrigin(0.5)
    g.setColor('rgba(255,255,0,1)')
    strokeText(g, 6)

    g.setInteractive()
    
    const myRoom = () => {
        if (gtype === 0) {
            socket.emit('createRoom', {player: scene.player1})
            g.setText('DELETE ROOM')
            gtype = 1
        }
        else if (gtype === 1) {
            socket.emit('deleteRoom', {})
            g.setText('CREATE ROOM')
            gtype = 0
        }
    }

    g.on('pointerdown', myRoom)
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

