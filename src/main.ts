import './style.css'
import mainContainer from './exampleContainer'
import { Application } from './core/Application'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
        <menu>
            <button>Generate random container</button>
            <button>Export as PDF</button>
        </menu>
        <div id="canvases">
            <div>
                <h3>PixiJS</h3>
                <div id="pixi-canvas-wrapper" class="canvas"></div>
            </div>
            <div>
                <h3>Skia</h3>
                <div id="skia-canvas-wrapper" class="canvas"></div>
            </div>
        </div>
    </div>
`

const app = new Application({
    pixi: document.getElementById('pixi-canvas-wrapper')!,
    skia: document.getElementById('skia-canvas-wrapper')!,
})
app.init().then(() => {
    app.renderContainer(mainContainer)
})
