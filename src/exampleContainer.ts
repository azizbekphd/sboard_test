import * as PIXI from 'pixi.js-legacy'


const mainContainer = new PIXI.Container()
const subContainer = new PIXI.Container()
const g1 = new PIXI.Graphics()
const g2 = new PIXI.Graphics()
const g3 = new PIXI.Graphics()
const g4 = new PIXI.Graphics()
const g5 = new PIXI.Graphics()

g1.beginFill('#ff0000').drawEllipse(0, 0, 200, 100).endFill()
g1.position.set(200, 100)
g1.angle = 30
g1.on('pointerdown', () => {
    console.log('g1 pointerdown!')
})

g2.beginFill('#0000ff').drawRect(-50, -75, 100, 150).endFill()
g2.position.set(120, 60)
g2.angle = 15
g2.on('pointerup', () => {
    console.log('g2 pointerup!')
})

g3.lineStyle(10, '#000000', 5)
  .moveTo(0, 0).lineTo(150, 100).finishPoly()
g3.angle = -20

g4.lineStyle(10, '#ffff00', 5)
  .moveTo(0, 70).lineTo(150, -30).finishPoly()
g4.angle = 20

g5.beginFill('#00ff00').drawCircle(0, 0, 100).endFill()
g5.position.set(200, 200)

const sprite = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png')
sprite.position.set(200, 200)
sprite.scale.set(3)
sprite.anchor.set(0.5, 0.5)
sprite.angle = 20

subContainer.pivot.set(-100, -100)
subContainer.position.set(75, 50)
subContainer.rotation = Math.PI / 4
subContainer.addChild(g3, g4, g5, sprite)
mainContainer.addChild(g1, g2, subContainer)

export default mainContainer
