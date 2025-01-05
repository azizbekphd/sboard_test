import './style.css'
import { Application } from './core/Application'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <menu>
        <button id="generate-random-container">Generate random container</button>
        <button id="export-as-pdf">Export as PDF</button>
    </menu>
    <div>
        <aside id="thumbnails">
            <h3>Thumbnails</h3>
            <ul></ul>
        </aside>
        <main>
            <div class="canvases">
                <div class="main-canvases">
                    <div>
                        <h3>PixiJS</h3>
                        <div id="pixi-canvas-wrapper" class="canvas"></div>
                    </div>
                    <div>
                        <h3>Skia</h3>
                        <div id="skia-canvas-wrapper" class="canvas"></div>
                    </div>
                </div>
                <div class="comparison">
                    <h3>Difference highlight</h3>
                    <div class="comparison-canvases">
                        <canvas id="comparison-canvas1" class="canvas"></canvas>
                        <canvas id="comparison-canvas2" class="canvas"></canvas>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <div id="snackbars"></div>
`

const app = new Application({
    pixi: document.getElementById('pixi-canvas-wrapper')!,
    skia: document.getElementById('skia-canvas-wrapper')!,
})
app.init().then(() => {
    app.addRandomContainer();
})
