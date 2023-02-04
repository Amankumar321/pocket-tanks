const w = 30
const h = 30

const drawBase = (ctx) => {
    var g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, 'rgba(240,240,240,1)')
    g.addColorStop(0.5, 'rgba(180,180,180,1)')
    g.addColorStop(0.5, 'rgba(100,100,100,1)')
    g.addColorStop(1, 'rgba(100,100,100,1)')

    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(180,180,180,1)'
    ctx.fillRect(w/10, h/10, w - w/5, h - h/5)
}


function drawImageActualSize(ctx, img) {
    ctx.drawImage(img, 0, 0, w, h);
}




export const singleshot = document.createElement('canvas')
singleshot.height = h
singleshot.width = w
const singleshotctx = singleshot.getContext('2d')
const singleshotimg = new Image(30, 30)
singleshotimg.src = '/assets/images/logos/standard/Single_Shot.webp'
singleshotctx.drawImage(singleshotimg, 0, 0)
singleshotimg.addEventListener('load', () => {drawImageActualSize(singleshotctx, singleshotimg)})





export const bigshot = document.createElement('canvas')
bigshot.height = h
bigshot.width = w
const bigshotctx = bigshot.getContext('2d')
const bigshotimg = new Image(30, 30)
bigshotimg.src = '/assets/images/logos/standard/Big_Shot.webp'
bigshotctx.drawImage(bigshotimg, 0, 0)
bigshotimg.addEventListener('load', () => {drawImageActualSize(bigshotctx, bigshotimg)})




export const threeshot = document.createElement('canvas')
threeshot.height = h
threeshot.width = w
const threeshotctx = threeshot.getContext('2d')
const threeshotimg = new Image(30, 30)
threeshotimg.src = '/assets/images/logos/standard/3_Shot.webp'
threeshotctx.drawImage(threeshotimg, 0, 0)
threeshotimg.addEventListener('load', () => {drawImageActualSize(threeshotctx, threeshotimg)})






export const fiveshot = document.createElement('canvas')
fiveshot.height = h
fiveshot.width = w
const fiveshotctx = fiveshot.getContext('2d')
const fiveshotimg = new Image(30, 30)
fiveshotimg.src = '/assets/images/logos/standard/5_Shot.webp'
fiveshotctx.drawImage(fiveshotimg, 0, 0)
fiveshotimg.addEventListener('load', () => {drawImageActualSize(fiveshotctx, fiveshotimg)})





export const jackhammer = document.createElement('canvas')
jackhammer.height = h
jackhammer.width = w
const jackhammerctx = jackhammer.getContext('2d')
const jackhammerimg = new Image(30, 30)
jackhammerimg.src = '/assets/images/logos/standard/Jackhammer.webp'
jackhammerctx.drawImage(jackhammerimg, 0, 0)
jackhammerimg.addEventListener('load', () => {drawImageActualSize(jackhammerctx, jackhammerimg)})




export const heatseeker = document.createElement('canvas')
heatseeker.height = h
heatseeker.width = w
const heatseekerctx = heatseeker.getContext('2d')
const heatseekerimg = new Image(30, 30)
heatseekerimg.src = '/assets/images/logos/standard/Heatseeker.webp'
heatseekerctx.drawImage(heatseekerimg, 0, 0)
heatseekerimg.addEventListener('load', () => {drawImageActualSize(heatseekerctx, heatseekerimg)})




export const tracer = document.createElement('canvas')
tracer.height = h
tracer.width = w
const tracerctx = tracer.getContext('2d')
const tracerimg = new Image(30, 30)
tracerimg.src = '/assets/images/logos/standard/Tracer.webp'
tracerctx.drawImage(tracerimg, 0, 0)
tracerimg.addEventListener('load', () => {drawImageActualSize(tracerctx, tracerimg)})




export const piledriver = document.createElement('canvas')
piledriver.height = h
piledriver.width = w
const piledriverctx = piledriver.getContext('2d')
const piledriverimg = new Image(30, 30)
piledriverimg.src = '/assets/images/logos/standard/Pile_Driver.webp'
piledriverctx.drawImage(piledriverimg, 0, 0)
piledriverimg.addEventListener('load', () => {drawImageActualSize(piledriverctx, piledriverimg)})




export const dirtmover = document.createElement('canvas')
dirtmover.height = h
dirtmover.width = w
const dirtmoverctx = dirtmover.getContext('2d')
const dirtmoverimg = new Image(30, 30)
dirtmoverimg.src = '/assets/images/logos/standard/Dirt_Mover.webp'
dirtmoverctx.drawImage(dirtmoverimg, 0, 0)
dirtmoverimg.addEventListener('load', () => {drawImageActualSize(dirtmoverctx, dirtmoverimg)})




export const crazyivan = document.createElement('canvas')
crazyivan.height = h
crazyivan.width = w
const crazyivanctx = crazyivan.getContext('2d')
drawBase(crazyivanctx)
const crazyivanimg = new Image(30, 30)
crazyivanimg.src = '/assets/images/logos/standard/Crazy_Ivan.webp'
crazyivanctx.drawImage(crazyivanimg, 0, 0)
crazyivanimg.addEventListener('load', () => {drawImageActualSize(crazyivanctx, crazyivanimg)})



export const spider = document.createElement('canvas')
spider.height = h
spider.width = w
const spiderctx = spider.getContext('2d')
const spiderimg = new Image(30, 30)
spiderimg.src = '/assets/images/logos/standard/Spider.webp'
spiderctx.drawImage(spiderimg, 0, 0)
spiderimg.addEventListener('load', () => {drawImageActualSize(spiderctx, spiderimg)})



export const sniperrifle = document.createElement('canvas')
sniperrifle.height = h
sniperrifle.width = w
const sniperriflectx = sniperrifle.getContext('2d')
var sniperrifleimg = new Image(30, 30)
sniperrifleimg.src = '/assets/images/logos/standard/Sniper_Rifle.webp'
sniperriflectx.drawImage(sniperrifleimg, 0, 0)
sniperrifleimg.addEventListener('load', () => {drawImageActualSize(sniperriflectx, sniperrifleimg)})



export const magicwall = document.createElement('canvas')
magicwall.height = h
magicwall.width = w
const magicwallctx = magicwall.getContext('2d')
const magicwallimg = new Image(30, 30)
magicwallimg.src = '/assets/images/logos/standard/Magic_Wall.webp'
magicwallctx.drawImage(magicwallimg, 0, 0)
magicwallimg.addEventListener('load', () => {drawImageActualSize(magicwallctx, magicwallimg)})




export const dirtslinger = document.createElement('canvas')
dirtslinger.height = h
dirtslinger.width = w
const dirtslingerctx = dirtslinger.getContext('2d')
const dirtslingerimg = new Image(30, 30)
dirtslingerimg.src = '/assets/images/logos/standard/Dirt_Slinger.webp'
dirtslingerctx.drawImage(dirtslingerimg, 0, 0)
dirtslingerimg.addEventListener('load', () => {drawImageActualSize(dirtslingerctx, dirtslingerimg)})




export const zapper = document.createElement('canvas')
zapper.height = h
zapper.width = w
const zapperctx = zapper.getContext('2d')
const zapperimg = new Image(30, 30)
zapperimg.src = '/assets/images/logos/standard/Zapper.webp'
zapperctx.drawImage(zapperimg, 0, 0)
zapperimg.addEventListener('load', () => {drawImageActualSize(zapperctx, zapperimg)})




export const napalm = document.createElement('canvas')
napalm.height = h
napalm.width = w
const napalmctx = napalm.getContext('2d')
const napalmimg = new Image(30, 30)
napalmimg.src = '/assets/images/logos/standard/Napalm.webp'
napalmctx.drawImage(napalmimg, 0, 0)
napalmimg.addEventListener('load', () => {drawImageActualSize(napalmctx, napalmimg)})




export const hailstorm = document.createElement('canvas')
hailstorm.height = h
hailstorm.width = w
const hailstormctx = hailstorm.getContext('2d')
const hailstormimg = new Image(30, 30)
hailstormimg.src = '/assets/images/logos/standard/Hail_Storm.webp'
hailstormctx.drawImage(hailstormimg, 0, 0)
hailstormimg.addEventListener('load', () => {drawImageActualSize(hailstormctx, hailstormimg)})




export const groundhog = document.createElement('canvas')
groundhog.height = h
groundhog.width = w
const groundhogctx = groundhog.getContext('2d')
const groundhogimg = new Image(30, 30)
groundhogimg.src = '/assets/images/logos/standard/Ground_Hog.webp'
groundhogctx.drawImage(groundhogimg, 0, 0)
groundhogimg.addEventListener('load', () => {drawImageActualSize(groundhogctx, groundhogimg)})




export const worm = document.createElement('canvas')
worm.height = h
worm.width = w
const wormctx = worm.getContext('2d')
const wormimg = new Image(30, 30)
wormimg.src = '/assets/images/logos/standard/Worm.webp'
wormctx.drawImage(wormimg, 0, 0)
wormimg.addEventListener('load', () => {drawImageActualSize(wormctx, wormimg)})




export const homingworm = document.createElement('canvas')
homingworm.height = h
homingworm.width = w
const homingwormctx = homingworm.getContext('2d')
const homingwormimg = new Image(30, 30)
homingwormimg.src = '/assets/images/logos/standard/Homing_Worm.webp'
homingwormctx.drawImage(homingwormimg, 0, 0)
homingwormimg.addEventListener('load', () => {drawImageActualSize(homingwormctx, homingwormimg)})




export const skipper = document.createElement('canvas')
skipper.height = h
skipper.width = w
const skipperctx = skipper.getContext('2d')
const skipperimg = new Image(30, 30)
skipperimg.src = '/assets/images/logos/standard/Skipper.webp'
skipperctx.drawImage(skipperimg, 0, 0)
skipperimg.addEventListener('load', () => {drawImageActualSize(skipperctx, skipperimg)})




export const chainreaction = document.createElement('canvas')
chainreaction.height = h
chainreaction.width = w
const chainreactionctx = chainreaction.getContext('2d')
const chainreactionimg = new Image(30, 30)
chainreactionimg.src = '/assets/images/logos/standard/Chain_Reaction.webp'
chainreactionctx.drawImage(chainreactionimg, 0, 0)
chainreactionimg.addEventListener('load', () => {drawImageActualSize(chainreactionctx, chainreactionimg)})




export const pineapple = document.createElement('canvas')
pineapple.height = h
pineapple.width = w
const pineapplectx = pineapple.getContext('2d')
const pineappleimg = new Image(30, 30)
pineappleimg.src = '/assets/images/logos/standard/Pineapple.webp'
pineapplectx.drawImage(pineappleimg, 0, 0)
pineappleimg.addEventListener('load', () => {drawImageActualSize(pineapplectx, pineappleimg)})




export const firecracker = document.createElement('canvas')
firecracker.height = h
firecracker.width = w
const firecrackerctx = firecracker.getContext('2d')
const firecrackerimg = new Image(30, 30)
firecrackerimg.src = '/assets/images/logos/standard/Firecracker.webp'
firecrackerctx.drawImage(firecrackerimg, 0, 0)
firecrackerimg.addEventListener('load', () => {drawImageActualSize(firecrackerctx, firecrackerimg)})




export const homingmissile = document.createElement('canvas')
homingmissile.height = h
homingmissile.width = w
const homingmissilectx = homingmissile.getContext('2d')
const homingmissileimg = new Image(30, 30)
homingmissileimg.src = '/assets/images/logos/standard/Homing_Missile.webp'
homingmissilectx.drawImage(homingmissileimg, 0, 0)
homingmissileimg.addEventListener('load', () => {drawImageActualSize(homingmissilectx, homingmissileimg)})




export const dirtball = document.createElement('canvas')
dirtball.height = h
dirtball.width = w
const dirtballctx = dirtball.getContext('2d')
const dirtballimg = new Image(30, 30)
dirtballimg.src = '/assets/images/logos/standard/Dirtball.webp'
dirtballctx.drawImage(dirtballimg, 0, 0)
dirtballimg.addEventListener('load', () => {drawImageActualSize(dirtballctx, dirtballimg)})




export const tommygun = document.createElement('canvas')
tommygun.height = h
tommygun.width = w
const tommygunctx = tommygun.getContext('2d')
const tommygunimg = new Image(30, 30)
tommygunimg.src = '/assets/images/logos/standard/Tommy_Gun.webp'
tommygunctx.drawImage(tommygunimg, 0, 0)
tommygunimg.addEventListener('load', () => {drawImageActualSize(tommygunctx, tommygunimg)})




export const mountainmover = document.createElement('canvas')
mountainmover.height = h
mountainmover.width = w
const mountainmoverctx = mountainmover.getContext('2d')
const mountainmoverimg = new Image(30, 30)
mountainmoverimg.src = '/assets/images/logos/standard/Mountain_Mover.webp'
mountainmoverctx.drawImage(mountainmoverimg, 0, 0)
mountainmoverimg.addEventListener('load', () => {drawImageActualSize(mountainmoverctx, mountainmoverimg)})




export const scattershot = document.createElement('canvas')
scattershot.height = h
scattershot.width = w
const scattershotctx = scattershot.getContext('2d')
const scattershotimg = new Image(30, 30)
scattershotimg.src = '/assets/images/logos/standard/Scatter_Shot.webp'
scattershotctx.drawImage(scattershotimg, 0, 0)
scattershotimg.addEventListener('load', () => {drawImageActualSize(scattershotctx, scattershotimg)})




export const cruiser = document.createElement('canvas')
cruiser.height = h
cruiser.width = w
const cruiserctx = cruiser.getContext('2d')
const cruiserimg = new Image(30, 30)
cruiserimg.src = '/assets/images/logos/standard/Cruiser.webp'
cruiserctx.drawImage(cruiserimg, 0, 0)
cruiserimg.addEventListener('load', () => {drawImageActualSize(cruiserctx, cruiserimg)})