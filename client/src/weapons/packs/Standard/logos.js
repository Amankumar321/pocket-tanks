const w = 30
const h = 30

export const singleshot = document.createElement('canvas')
singleshot.height = h
singleshot.width = w
const singleshotctx = singleshot.getContext('2d')
singleshotctx.fillStyle = 'rgba(0,255,0,1)'
singleshotctx.fillRect(0, 0, singleshot.width, singleshot.height)


export const bigshot = document.createElement('canvas')
bigshot.height = h
bigshot.width = w
const bigshotctx = bigshot.getContext('2d')
bigshotctx.fillStyle = 'rgba(0,255,0,1)'
bigshotctx.fillRect(0, 0, bigshot.width, bigshot.height)

export const threeshot = document.createElement('canvas')
threeshot.height = h
threeshot.width = w
const threeshotctx = threeshot.getContext('2d')
threeshotctx.fillStyle = 'rgba(0,255,0,1)'
threeshotctx.fillRect(0, 0, threeshot.width, threeshot.height)
