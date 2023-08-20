import io from 'socket.io-client'

var local = 'http://localhost:5001'
var url = 'https://pocket-tanks.onrender.com'

export const socket = io(url)