import CanvasKitInit, { Canvas, CanvasKit, Surface } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';
import PixiSkiaAdapter from '../features/PixiSkiaAdapter';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';


abstract class Renderer<T> {
    protected parentElement: HTMLElement;
    protected app!: T;

    constructor(parentElement: HTMLElement) {
        this.parentElement = parentElement;
    }

    public abstract init(): Promise<T>;
    public abstract renderContainer(container: PIXI.Container): void;
    public abstract clear(): void;
}


export class PixiRenderer extends Renderer<PIXI.Application> {
    public async init(): Promise<PIXI.Application> {
        const pixelRatio = window.devicePixelRatio || 1
        const app = new PIXI.Application({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            eventMode: 'dynamic',
            forceCanvas: true,
            backgroundColor: 0xFFFFFF,
            resolution: pixelRatio,
        });
        this.parentElement.appendChild(app.view);
        this.app = app;
        return app;
    }

    public renderContainer(container: PIXI.Container): void {
        this.app.stage.addChild(container);
    }

    public clear(): void {
        this.app.stage.removeChildren();
    }
}


export class SkiaRenderer extends Renderer<CanvasKit> {
    private canvasKit!: CanvasKit;
    private pixiAdapter!: PixiSkiaAdapter;
    private surface!: Surface | null;
    private skCanvas!: Canvas;

    public async init(): Promise<CanvasKit> {
        const canvasElement = document.createElement('canvas')
        const pixelRatio = window.devicePixelRatio || 1
        canvasElement.width = CANVAS_WIDTH * pixelRatio
        canvasElement.height = CANVAS_HEIGHT * pixelRatio
        canvasElement.id = 'skia-canvas'
        this.parentElement.appendChild(canvasElement)

        this.canvasKit = await CanvasKitInit({locateFile: (file: string) => `https://unpkg.com/canvaskit-wasm@0.39.1/bin/${file}`})

        this.surface = this.canvasKit.MakeSWCanvasSurface('skia-canvas');
        if (!this.surface) {
          throw new Error('Could not create surface');
        }

        this.skCanvas = this.surface.getCanvas();
        this.skCanvas.scale(pixelRatio, pixelRatio);

        this.pixiAdapter = new PixiSkiaAdapter(this.skCanvas, this.canvasKit, this.surface);
        this.app = this.canvasKit;
        return this.canvasKit;
    }

    public renderContainer(container: PIXI.Container): void {
        this.clear();
        this.pixiAdapter.renderContainer(container);
    }

    public clear(): void {
        this.skCanvas.clear(this.canvasKit.WHITE);
    }
}
