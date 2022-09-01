const w = 30
const h = 30

export const singleshot = document.createElement('canvas')
singleshot.height = h
singleshot.width = w
const singleshotctx = singleshot.getContext('2d')
singleshotctx.fillStyle = 'rgba(0,255,255,1)'
singleshotctx.fillRect(0, 0, singleshot.width, singleshot.height)

export const bigshot = document.createElement('canvas')
bigshot.height = h
bigshot.width = w
const bigshotctx = bigshot.getContext('2d')
bigshotctx.fillStyle = 'rgba(255,255,0,1)'
bigshotctx.fillRect(0, 0, bigshot.width, bigshot.height)

export const threeshot = document.createElement('canvas')
threeshot.height = h
threeshot.width = w
const threeshotctx = threeshot.getContext('2d')
threeshotctx.fillStyle = 'rgba(0,255,0,1)'
threeshotctx.fillRect(0, 0, threeshot.width, threeshot.height)

export const fiveshot = document.createElement('canvas')
fiveshot.height = h
fiveshot.width = w
const fiveshotctx = fiveshot.getContext('2d')
fiveshotctx.fillStyle = 'rgba(50,50,200,1)'
fiveshotctx.fillRect(0, 0, fiveshot.width, fiveshot.height)

export const jackhammer = document.createElement('canvas')
jackhammer.height = h
jackhammer.width = w
const jackhammerctx = jackhammer.getContext('2d')
jackhammerctx.fillStyle = 'rgba(200,50,100,1)'
jackhammerctx.fillRect(0, 0, jackhammer.width, jackhammer.height)

export const heatseeker = document.createElement('canvas')
heatseeker.height = h
heatseeker.width = w
const heatseekerctx = heatseeker.getContext('2d')
heatseekerctx.fillStyle = 'rgba(100,250,10,1)'
heatseekerctx.fillRect(0, 0, heatseeker.width, heatseeker.height)

export const tracer = document.createElement('canvas')
tracer.height = h
tracer.width = w
const tracerctx = tracer.getContext('2d')
tracerctx.fillStyle = 'rgba(150,150,100,1)'
tracerctx.fillRect(0, 0, tracer.width, tracer.height)

export const piledriver = document.createElement('canvas')
piledriver.height = h
piledriver.width = w
const piledriverctx = piledriver.getContext('2d')
piledriverctx.fillStyle = 'rgba(10,150,200,1)'
piledriverctx.fillRect(0, 0, piledriver.width, piledriver.height)

export const dirtmover = document.createElement('canvas')
dirtmover.height = h
dirtmover.width = w
const dirtmoverctx = dirtmover.getContext('2d')
dirtmoverctx.fillStyle = 'rgba(200,50,200,1)'
dirtmoverctx.fillRect(0, 0, dirtmover.width, dirtmover.height)