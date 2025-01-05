import * as PIXI from 'pixi.js-legacy';
import { Application } from './Application';
import { PIXEL_RATIO } from '../constants';
import ContainerCloner from '../utils/ContainerCloner';


export class EventManager {
    public shadowPixiApp: PIXI.Application;
    private app: Application;

    constructor(app: Application) {
        this.app = app;
        const skiaCanvas = document.querySelector('#skia-canvas-wrapper canvas')! as HTMLCanvasElement;
        this.shadowPixiApp = new PIXI.Application({
            resizeTo: skiaCanvas,
            resolution: PIXEL_RATIO,
            eventMode: 'dynamic',
        });
    }

    public initButtonClickEvents(): void {
        document.querySelector("#export-as-pdf")!.addEventListener("click", () => {
            this.app.skiaRenderer.exportToPDF(this.app.containersManager.containers);
        });

        document.querySelector("#generate-random-container")!.addEventListener("click", () => {
            this.app.addRandomContainer();
        });
    }

    public initSkiaPointerEvents(): void {
        const skiaCanvas = document.querySelector('#skia-canvas-wrapper canvas')! as HTMLCanvasElement;

        this.shadowPixiApp.renderer.events.setTargetElement(skiaCanvas);
    }

    public refresh(): void {
        this.shadowPixiApp.stage.removeChildren();
        this.shadowPixiApp.stage.addChild(ContainerCloner.cloneContainer(
            this.app.containersManager.getSelectedContainer()!));
    }
}
