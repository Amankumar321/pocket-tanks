const w = 30
const h = 30


export const pineapple = document.createElement('canvas')
pineapple.height = h
pineapple.width = w
const pineapplectx = pineapple.getContext('2d')
pineapplectx.fillStyle = 'rgba(255,255,0,1)'
pineapplectx.fillRect(0, 0, pineapple.width, pineapple.height)


export const groundhog = document.createElement('canvas')
groundhog.height = h
groundhog.width = w
const groundhogctx = groundhog.getContext('2d')
groundhogctx.fillStyle = 'rgba(0,255,255,1)'
groundhogctx.fillRect(0, 0, groundhog.width, groundhog.height)



export const superstar = document.createElement('canvas')
superstar.height = h
superstar.width = w
const superstarctx = superstar.getContext('2d')
superstarctx.fillStyle = 'rgba(0,0,255,1)'
superstarctx.fillRect(0, 0, superstar.width, superstar.height)



export const earthmover = document.createElement('canvas')
earthmover.height = h
earthmover.width = w
const earthmoverctx = earthmover.getContext('2d')
earthmoverctx.fillStyle = 'rgba(255,0,0,1)'
earthmoverctx.fillRect(0, 0, earthmover.width, earthmover.height)



export const bouncydirt = document.createElement('canvas')
bouncydirt.height = h
bouncydirt.width = w
const bouncydirtctx = bouncydirt.getContext('2d')
bouncydirtctx.fillStyle = 'rgba(255,255,255,1)'
bouncydirtctx.fillRect(0, 0, bouncydirt.width, bouncydirt.height)



export const island = document.createElement('canvas')
island.height = h
island.width = w
const islandctx = island.getContext('2d')
islandctx.fillStyle = 'rgba(255,0,255,1)'
islandctx.fillRect(0, 0, island.width, island.height)
