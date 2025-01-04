import CanvasKitInit, { Canvas, CanvasKit, Surface } from '../third-party/canvaskit/canvaskit.js';
import * as PIXI from 'pixi.js-legacy';
import PixiSkiaAdapter from './PixiSkiaAdapter';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';


abstract class Renderer<T> {
    public app!: T;
    protected parentElement: HTMLElement;

    constructor(parentElement: HTMLElement) {
        this.parentElement = parentElement;
    }

    public abstract init(): Promise<T>;
    public abstract renderContainer(container: PIXI.Container): void;
    public abstract clean(): void;
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
        this.parentElement.appendChild(app.view as HTMLCanvasElement);
        this.app = app;
        return app;
    }

    public renderContainer(container: PIXI.Container): void {
        this.clean();
        this.app.stage.addChild(container);
    }

    public clean(): void {
        this.app.stage.removeChildren();
    }
}


export class SkiaRenderer extends Renderer<CanvasKit> {
    public skCanvas!: Canvas;
    private canvasKit!: CanvasKit;
    private pixiAdapter!: PixiSkiaAdapter;
    private surface!: Surface | null;

    public async init(): Promise<CanvasKit> {
        const canvasElement = document.createElement('canvas')
        const pixelRatio = window.devicePixelRatio || 1
        canvasElement.width = CANVAS_WIDTH * pixelRatio
        canvasElement.height = CANVAS_HEIGHT * pixelRatio
        canvasElement.id = 'skia-canvas'
        this.parentElement.appendChild(canvasElement)

        this.canvasKit = await CanvasKitInit({locateFile: (file: string) => `/${file}`})

        this.surface = this.canvasKit.MakeSWCanvasSurface('skia-canvas');
        if (!this.surface) {
          throw new Error('Could not create surface');
        }

        this.skCanvas = this.surface.getCanvas();
        this.skCanvas.scale(pixelRatio, pixelRatio);

        this.pixiAdapter = new PixiSkiaAdapter(this.canvasKit);
        this.app = this.canvasKit;
        return this.canvasKit;
    }

    public renderContainer(container: PIXI.Container): void {
        this.clean();
        this.pixiAdapter.renderContainer(this.skCanvas, container);

        const queue: Array<PIXI.DisplayObject> = [];
        for (const child of container.children ?? []) {
            queue.push(child);
        }
        while (queue.length > 0) {
            const child = queue.shift()!;

            if (child instanceof PIXI.Container) {
                for (const grandChild of child.children ?? []) {
                    queue.push(grandChild);
                }
            }
        }
        this.surface!.flush();
    }

    public clean(): void {
        this.skCanvas.clear(this.canvasKit.WHITE);
    }

    public exportToPDF(containers: Array<PIXI.Container>): void {
        const stream = new this.canvasKit.SkWStream();
        const pdfDoc = new this.canvasKit.SkPDFDocument(stream);

        for (const container of containers) {
            const canvas = pdfDoc.beginPage(CANVAS_WIDTH, CANVAS_HEIGHT);

            this.pixiAdapter.renderContainer(canvas, container);

            pdfDoc.endPage();
        }

        pdfDoc.close();

        const buffer = stream.getBuffer();
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.pdf';
        a.click();
        URL.revokeObjectURL(url);
    }
}
