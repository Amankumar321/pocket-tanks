var rooms = []
// room : {roomId, 
//          host: {name, color, socketId, pos, isReady, playAgain},
//          player: {name, color, socketId, pos, isReady, playAgain},
//          randomArray, 
//          terrainPath
//         }

const mainsocket = (io) => {
    return io.on("connection", (client) => {
        client.roomId = null
        client.name = ""
        client.color = 0
        client.isHost = false


        client.on('disconnect', () => {
            if (client.roomId !== null) {
                client.leave(client.roomId)
                rooms = rooms.filter((room) => { 
                    return (room.roomId !== client.roomId)
                })
                io.sockets.in(client.roomId).emit('opponentLeft', {})
                io.emit('setRooms', {rooms: rooms})
                io.socketsLeave(client.roomId);
                client.roomId = null
                client.isHost = false
            }
        })



        client.on('leaveRoom', () => {
            if (client.roomId !== null) {
                client.leave(client.roomId)
                rooms = rooms.filter((room) => { 
                    return (room.roomId !== client.roomId)
                })
                io.sockets.in(client.roomId).emit('opponentLeft', {})
                io.emit('setRooms', {rooms: rooms})
                io.socketsLeave(client.roomId);
                client.roomId = null
                client.isHost = false
            }
        })



        client.on('deleteRoom', () => {
            if (client.roomId !== null) {
                client.leave(client.roomId)
                rooms = rooms.filter((room) => { 
                    return (room.roomId !== client.roomId)
                })
                io.sockets.in(client.roomId).emit('opponentLeft', {})
                io.emit('setRooms', {rooms: rooms})
                io.socketsLeave(client.roomId);
                client.roomId = null
                client.isHost = false
            }
        })
        


        client.on('joinRoom', ({roomId, name, color}) => {
            if (client.roomId === roomId) return
            if (client.roomId !== null) {
                client.leave(client.roomId)
                rooms = rooms.filter((room) => { 
                    return (room.roomId !== client.roomId)
                })
                io.emit('setRooms', {rooms: rooms})
            }

            client.join(roomId)
            client.roomId = roomId
            client.isHost = false
            client.name = name
            client.color = color

            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            room.player = {name: name, color: color, socketId: client.id, isReady: false, playAgain: false}

            io.sockets.in(client.roomId).emit('startPick', {host: room.host, player: room.player})
        })
        


        client.on('getRooms', () => {
            client.emit('setRooms', {rooms: rooms})
        })



        client.on('createRoom', ({player}) => {
            if (client.roomId !== null) {
                client.leave(client.roomId)
                rooms = rooms.filter((room) => { 
                    return (room.roomId !== client.roomId)
                })
            }

            const roomId = Math.random().toString(32).slice(2,8)
            client.join(roomId)
            client.roomId = roomId
            client.isHost = true
            var host = {name: player.name, color: player.color, socketId: client.id, isReady: false, playAgain: false}
            rooms.unshift({roomId: roomId, host: host})
            io.emit('setRooms', {rooms: rooms})
        })



        client.on('ready', () => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            if (client.isHost === true) {
                room.host.isReady = true
                if (room.player.isReady === true) {
                    io.sockets.in(client.roomId).emit('startGame', {})
                    room.player.isReady = false
                    room.host.isReady = false
                }
            }
            else {
                room.player.isReady = true
                if (room.host.isReady === true) {
                    io.sockets.in(client.roomId).emit('startGame', {})
                    room.player.isReady = false
                    room.host.isReady = false
                }
            }
        })



        client.on('weaponPick', ({arrayIndex}) => {
            client.broadcast.emit('opponentWeaponPick', {arrayIndex})
        })



        client.on('getWeaponArray', () => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            if (room.randomArray !== undefined && room.randomArray !== null)
                client.emit('setWeaponArray', ({randomArray: room.randomArray}))
        })



        client.on('createWeaponArray', ({count}) => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })

            // weapon array
            var x, randomArray = []
            for (let index = 0; index < count; index++) {
                x = Math.floor(Math.random() * count)
                randomArray.push(x)
            }
            room.randomArray = randomArray
            io.sockets.in(client.roomId).emit('setWeaponArray', {randomArray: room.randomArray})
        })



        client.on('shoot', ({selectedWeapon, power, rotation}) => {
            client.broadcast.emit('opponentShoot', {selectedWeapon, power, rotation})
        })

        
        
        // client.on('changeWeapon', ({index}) => {
        //     client.broadcast.emit('setWeapon', {index})
        // })



        client.on('terrainPath', ({path, hostPos, playerPos}) => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            room.terrainPath = [...path]
            room.host.pos = {...hostPos}
            room.player.pos = {...playerPos}
            client.broadcast.emit('setTerrainPath', {path: room.terrainPath, hostPos: room.host.pos, playerPos: room.player.pos})
        })



        client.on('getTerrainPath', () => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            if (room.terrainPath !== undefined && rooms.terrainPath !== null)
                client.emit('setTerrainPath', {path: room.terrainPath})
        })



        client.on('playAgainRequest', () => {
            var room = rooms.find(ele => { return ele.roomId === client.roomId })
            if (client.isHost === true) {
                room.host.playAgain = true
                if (room.player.playAgain === true) {
                    delete room.randomArray
                    delete room.terrainPath
                    io.sockets.in(client.roomId).emit('playAgain', {})
                    room.player.playAgain = false
                    room.host.playAgain = false
                }
            }
            else {
                room.player.playAgain = true
                if (room.host.playAgain === true) {
                    delete room.randomArray
                    delete room.terrainPath
                    io.sockets.in(client.roomId).emit('playAgain', {})
                    room.player.playAgain = false
                    room.host.playAgain = false
                }
            }
        })
    })
}

export default mainsocket