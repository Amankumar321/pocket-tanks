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
    const a = scene.add.text(screenCenterX, 100, 'Choose').setFontSize(40);

    var colors = []
    var colorValues = [0xFF0000, 0xFF9900, 0xFFFF00, 0x66FF33, 0x00FFFF, 0x0000FF, 0x9933FF, 0xCC0099]
    var selectedColor
    
    // set random color
    var selectedColor = (new Date()).getSeconds() % 8
    //

    scene.roomList = []

    const updateRooms = () => {
        scene.roomList.forEach((room, index) => {
            room.x = scene.add.rectangle(screenCenterX - 100, 100 + (index + 1) * 80, 50, 50, room.host.color, 255);
            room.y = scene.add.text(screenCenterX, 100 + (index + 1) * 80, room.host.name).setFontSize(26);
            room.z = scene.add.text(screenCenterX + 300, 100 + (index + 1) * 80, 'Play').setFontSize(26);
            room.z.setInteractive()
            room.z.on('pointerdown', () => {
                socket.emit('joinRoom', {roomId: room.roomId, name: scene.player1.name, color: scene.player1.color})
            })
        });
    }

    const clearRooms = () => {
        scene.roomList.forEach((room) => {
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

    const g = scene.add.text(screenCenterX, 700, 'Create Room').setFontSize(40);

    g.setInteractive()
    g.on('pointerdown', () => {
        socket.emit('createRoom', {player: scene.player1})
    })
}
