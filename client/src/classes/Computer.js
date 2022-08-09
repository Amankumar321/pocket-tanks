export class Computer {
    /**
     * @param {Phaser.Scene} scene 
     */

    constructor(scene, tank, level) {
        this.scene = scene
        this.tank = tank
        this.playerTank = scene.tank1
        this.terrain = scene.terrain
        this.powerFactor = tank.turret.powerFactor
        this.level = level
        this.maxLevel = 8;
        this.factor = this.maxLevel - this.level + 1
    }



    play = () => {
        var diffX = this.playerTank.x - this.tank.x
        var diffY = this.playerTank.y - this.tank.y
        var dist = (diffX*diffX + diffY*diffY)

        var modifier = diffX > 0 ? 0 : Math.PI

        var angle = Math.atan(diffY/diffX) + Math.PI/2 - modifier
        
        if (diffX > 0) {
            var minAngle = 0
            var maxAngle = angle
        }
        else {
            var minAngle = angle
            var maxAngle = 0
        }

        var accelaration = 300
        var cos, sin;
        var newX, newY;
        var v, dist = 10000, temp;
        var k = {angle: 0, v: 0}
        
        for (let theta = minAngle; theta < maxAngle; theta += 0.1 * this.factor) {
            for (v = this.powerFactor; v < 100 * this.powerFactor; v += this.powerFactor * this.factor) {
                sin = Math.sin(theta)
                cos = Math.cos(theta)
                for (let t = 0; t < 5; t += 0.01 * this.factor) {
                    newX = this.tank.turret.x + v * sin * t
                    newY = this.tank.turret.y - v * cos * t + 1/2 * accelaration * t * t
                    if (newY > 0 && newY < this.terrain.height) {
                        if (this.terrain.getPixel(newX, newY).alpha > 0 || newY - this.terrain.height > -1 * this.factor) {
                            temp = Math.sqrt( Math.pow( newX - this.playerTank.x, 2 ) + Math.pow( newY - this.playerTank.y, 2 ) )
                            if (temp < dist) {
                                dist = temp
                                k.angle = theta
                                k.v = v
                            }
                            break;
                        }
                    }
                }
            }
        }

        this.deviate(k)

        this.tank.turret.setRotation(k.angle)
        this.tank.turret.relativeRotation = k.angle - this.tank.rotation
        this.tank.power = Math.floor(k.v / this.powerFactor)
        this.tank.shoot()
    }



    deviate = (config) => {
        var x = Math.random() > 0.5 ? 1 : -1
        var y = Math.random() > 0.5 ? 1 : -1

        config.v += x * config.v * (Math.random()*this.factor)/100
        config.angle += y * config.angle * (Math.random()*this.factor)/100
    }
}