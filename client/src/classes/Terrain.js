import { Textures } from "phaser";
import { drawTerrain, setTerrain } from "../graphics/terrain";
import { Blast } from "./Blast";
import { Tank } from "./Tank";

export class Terrain extends Textures.CanvasTexture {
    /**
    * @param {Phaser.Scene} scene
    */
    constructor (scene) { 
        var width = scene.game.renderer.width
        var height = scene.game.renderer.height
        
        var canvas = document.createElement('canvas');
        canvas.height = height * 2/3
        canvas.width = width
        scene.textures.addCanvas('terrain', canvas);
        scene.add.image(width/2, height/3, 'terrain');

        super(scene.textures, 'terrain', canvas, canvas.width, canvas.height)

        this.canvas = canvas
        this.scene = scene
        this.background = this.scene.background
        this.width = canvas.width;
        this.height = canvas.height;
        this.matrix = [];
        this.animate = false
        this.blastArray = [];
        this.path = []
    }



    create = () => {
        var width = this.width
        var height = this.height
        var ctx = this.canvas.getContext('2d')

        this.path = drawTerrain(ctx, width, height)
        this.update()
    }



    setPath = (path) => {
        this.path = path
        var width = this.width
        var height = this.height
        var ctx = this.canvas.getContext('2d')

        setTerrain(ctx, width, height, path)
        this.update()
    }



    updateTerrain = () => {  
        if (this.blastArray.length !== 0) {
            this.blastArray.forEach((hole) => {
                hole.update()
            })
    
            this.blastArray = this.blastArray.filter((hole) => {
                return (hole.toRemove === false)
            })
        }

        if (this.matrix.length === 0) {
            this.animate = false
            return
        }
        else {
            this.matrix = this.matrix.filter((ele) => {
                return (ele.base < ele.ground)
            })
    
            this.matrix.forEach((ele) => {
                try {
                    var data = this.context.getImageData(ele.x, ele.top, 1, ele.base - ele.top)
                    this.context.putImageData(data, ele.x, ele.top + 1)
                    ele.top = ele.top + 1
                    ele.base = ele.base + 1
                } 
                catch {}
            })
            this.update()
        }
    }



    blast = (type, x, y, radius, data, blowTank) => {
        this.animate = true
        var hole = new Blast(this.scene, type, x, y, radius, data, blowTank)
        this.blastArray.push(hole)
    }



    fixTerrain = (x, y, r) => {
        if (y > this.height) return;
        
        var radius = r
        this.update()
    
        var left = x - radius
        var right = x + radius
        var do_break = false
        var duplicate = false
        var base, top, ground, duplicateIndex, i, j;

        for (i = left; i <= right; i++) {
            duplicate = false
            do_break = false
        
            // find base
            for (j = y; j >= 1; j--) {
                if (this.getPixel(i, j).alpha > 100) {
                    do_break = true;
                }
                if (do_break) {
                    break;
                }
            }
            base = j;
            do_break = false;
        
            // find top
            for (; j >= 1; j--) {
                if (this.getPixel(i, j).alpha === 0) {
                    do_break = true;
                }
                if (do_break) {
                    break;
                }
            }
            top = j;
            do_break = false

            // find ground
            for (j = y; j <= this.height; j++) {
                if (this.getPixel(i, j).alpha > 100) {
                    do_break = true;
                }
                if (do_break) {
                    break;
                }
            }
            ground = j;
            do_break = false;
            
            if (base !== 0 && top !== 0) {
                this.matrix.forEach((ele, index) => {
                    if (ele.x === i) {
                        duplicate = true
                        duplicateIndex = index
                    } 
                })

                if (duplicate) {
                    this.matrix[duplicateIndex].x = i
                    this.matrix[duplicateIndex].base = base
                    this.matrix[duplicateIndex].top = top
                    this.matrix[duplicateIndex].ground = ground
                }
                else
                    this.matrix.push({x: i, base, top, ground})
            }
        }
        console.log(this.matrix)
        this.animate = true
    }



    getNeighbouringPoints = (x, y, count = 5) => {
        return this.getSlope(x, y, count, true)
    }



    getSlope = (x, y, pointsCount = 5, returnPoints = false) => {
        var points = []
        var maxPoints = pointsCount
        var left = {x: x, y: y}, right = {x: x, y: y}, counter = Math.floor(maxPoints/2 - 1);
        points[Math.floor(maxPoints/2)] = {x: x, y: y}

        left = this.getLeftGround(x, y) ?? left

        while (left !== null && counter !== -1) {
            left = this.getLeftGround(left.x, left.y) ?? left
            points[counter] = {...left}
            counter--
        }
        
        right = this.getRightGround(x, y) ?? right
        counter = Math.ceil(maxPoints/2)
        
        while (right !== null && counter !== maxPoints) {
            right = this.getRightGround(right.x, right.y) ?? right
            points[counter] = {...right}
            counter++
        }

        if (right.x - left.x !== 0) {
            var slope = (right.y - left.y) / (right.x - left.x)
            var angle = Math.atan(slope) + ((right.x - left.x) > 0 ? 0 : Math.PI)
        }
        else {
            var angle = undefined
        }

        if (returnPoints === true)
            return points
        else
            return angle
   }



    getRightGround = (x, y) => {
        var pos = [{x: x, y: y + 1}, {x: x + 1, y: y + 1}, {x: x + 1, y: y}, {x: x + 1, y: y - 1}, {x: x, y: y - 1}, {x: x - 1, y: y + 1}, {x: x - 1, y: y}, {x: x - 1, y: y - 1}]
        var checkPos = [{x: x + 1, y: y + 1}, {x: x + 1, y: y}, {x: x + 1, y: y - 1}, {x: x, y: y - 1}, {x: x - 1, y: y - 1}, {x: x, y: y + 1}, {x: x - 1, y: y + 1}, {x: x - 1, y: y}]
        var k = null

        for (let index = 0; index < pos.length; index++) {
            if (this.getPixel(pos[index].x, pos[index].y).alpha > 0) {
                if (this.getPixel(checkPos[index].x, checkPos[index].y).alpha === 0) {
                    k = pos[index]
                }
            }
        }
        if (x >= this.width)
            k = null
        
        return k;
    }



    getLeftGround = (x, y) => {
        var pos = [{x: x, y: y + 1}, {x: x - 1, y: y + 1}, {x: x - 1, y: y}, {x: x - 1, y: y - 1}, {x: x, y: y - 1}, {x: x + 1, y: y + 1}, {x: x + 1, y: y}, {x: x + 1, y: y - 1}]
        var checkPos = [{x: x - 1, y: y + 1}, {x: x - 1, y: y}, {x: x - 1, y: y - 1}, {x: x, y: y - 1}, {x: x + 1, y: y - 1}, {x: x, y: y + 1}, {x: x + 1, y: y + 1}, {x: x + 1, y: y}]
        var k = null

        for (let index = 0; index < pos.length; index++) {
            if (this.getPixel(pos[index].x, pos[index].y).alpha > 0) {
                if (this.getPixel(checkPos[index].x, checkPos[index].y).alpha === 0) {
                    k = pos[index]
                }
            }
        }
        if (x <= 0)
            k = null

        return k;
    }



    getSurface = (x, y, angle) => {
        if (this.getPixel(x - 1 * Math.sin(angle), y + 1 * Math.cos(angle)).alpha === 0) return null

        var newX = null, newY = null
        for (let i = 0; i < 100; i = i + 3) {
            newX = x - i * Math.sin(angle)
            newY = y + i * Math.cos(angle)
            if (this.getPixel(newX, newY).alpha === 0) {
                this.scene.blastLayer.setPixel(newX, newY, 0, 0, 0, 255)
                return {x: newX, y: newY}
            }
            this.scene.blastLayer.setPixel(newX, newY, 255, 0, 0, 255)
        }

        return null
    }
}