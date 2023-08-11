import { Display } from "phaser";

/**
 * @param {Phaser.Scene} scene
 */

export const type3 = (scene) => {
    const totalWeapons = 4
    const socket = window.socket
    socket.removeAllListeners()

    //console.log(scene.roomList)

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

    const noRoom = scene.add.container(scene.renderer.width/2, scene.renderer.height/2).setVisible(false)
    noRoom.add(scene.add.image(0, -50, 'face-frown-regular').setDisplaySize(200, 200).setAlpha(0.8))
    noRoom.add(scene.add.text(0, 100, 'No online rooms')
    .setFontFamily('Verdana').setFontSize(32).setOrigin(0.5, 0.5).setAlign('center').setFontStyle('bold'))
    noRoom.add(scene.add.text(0, 140, 'Create your own room and invite friends.')
    .setFontFamily('Verdana').setFontSize(22).setOrigin(0.5, 0.5).setAlign('center'))

    const serverError = scene.add.container(scene.renderer.width/2, scene.renderer.height/2).setVisible(false)
    serverError.add(scene.add.image(0, -50, 'face-frown-regular').setDisplaySize(200, 200).setAlpha(0.8))
    serverError.add(scene.add.text(0, 100, 'Server Error')
    .setFontFamily('Verdana').setFontSize(32).setOrigin(0.5, 0.5).setAlign('center').setFontStyle('bold'))
    serverError.add(scene.add.text(0, 140, 'Please try again later or refresh.')
    .setFontFamily('Verdana').setFontSize(22).setOrigin(0.5, 0.5).setAlign('center'))

    if (scene.roomList === undefined)
        scene.roomList = []

    const updateRooms = () => {
        serverError.setVisible(false)

        scene.roomList.forEach((room, index) => {
            if (index > 4) return
            //room.x = scene.add.rectangle(screenCenterX - 300, 150 + (index + 1) * 80, 50, 50, room.host.color, 255);
            var name = (room.host.name.length < 12) ? room.host.name : (room.host.name.slice(0,10) + "...")
            room.x = scene.add.text(screenCenterX - 350, 150 + (index + 1) * 80, index + 1).setFontSize(26);
            room.y = scene.add.text(screenCenterX - 300, 150 + (index + 1) * 80, name).setFontSize(26);
            room.z = scene.add.text(screenCenterX + 280, 150 + (index + 1) * 80, 'Play').setFontSize(26);
            room.x.setColor('rgba(180,180,180,1)')
            room.z.setColor('rgba(240,240,240,1)')
            room.y.setColor(int2rgba(room.host.color))
            //room.x.setOrigin(0.5)
            room.x.setOrigin(0, 0.4).setFontSize(40).setFontFamily('"Days One"')
            room.y.setOrigin(0, 0.4).setFontSize(40).setFontFamily('"Days One"')
            room.z.setOrigin(0.5, 0.4).setFontSize(40).setFontFamily('"Days One"')
            strokeText(room.x, 6)
            strokeText(room.y, 6)
            strokeText(room.z, 6)
            room.z.setInteractive()
        
            if (room.host.socketId === socket.id) {
                room.y.setText(room.y.text + " (You)")
            }

            room.z.on('pointerdown', () => {
                scene.sound.play('click', {volume: 0.3})
                socket.emit('joinRoom', {roomId: room.roomId, name: scene.player1.name, color: scene.player1.color})
            })
        });

        if (scene.roomList.length === 0) {
            noRoom.setVisible(true)
        }
        else {
            noRoom.setVisible(false)
        }
    }

    const clearRooms = () => {
        scene.roomList.forEach((room, index) => {
            //console.log(index + " removed")
            room.x.destroy(true)
            room.y.destroy(true)
            room.z.destroy(true)
        });
        scene.roomList = []
    }

    scene.clearRooms = clearRooms
    clearRooms()

    socket.on('setRooms', ({rooms}) => {
        clearRooms()
        //console.log('setRooms ', rooms.length)
        rooms.forEach((room) => { scene.roomList.push(room) })
        updateRooms()
    })

    if (socket.connected) {
        //console.log('connected')
        socket.emit('getRooms', {})
    }
    else {
        serverError.setVisible(true)
    }

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
        if (socket.connected === false) {
            serverError.setVisible(true)
            noRoom.setVisible(false)
            return
        }
        serverError.setVisible(false)

        scene.sound.play('click', {volume: 0.3})
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

