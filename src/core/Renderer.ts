import CanvasKitInit, { Canvas, CanvasKit, Surface } from '../third-party/canvaskit/canvaskit.js';
import * as PIXI from 'pixi.js-legacy';
import PixiSkiaAdapter from './PixiSkiaAdapter';
import { CANVAS_HEIGHT, CANVAS_WIDTH, PIXEL_RATIO } from '../constants';


/**
 * Abstract class for renderers.
 */
abstract class Renderer<T> {
    /**
     * Core element of the renderer (PIXI.Application or CanvasKit).
     */
    public app!: T;
    /**
     * Parent element to append the canvas to.
     */
    protected parentElement: HTMLElement;

    constructor(parentElement: HTMLElement) {
        this.parentElement = parentElement;
    }

    /**
     * Initializes the renderer.
     */
    public abstract init(): Promise<T>;

    /**
     * Renders a container to the renderer.
     * @param container - The container to render.
     */
    public abstract renderContainer(container: PIXI.Container): void;

    /**
     * Cleans the renderer.
     */
    public abstract clean(): void;
}


/**
 * Renderer for PIXI.Application.
 */
export class PixiRenderer extends Renderer<PIXI.Application> {
    public async init(): Promise<PIXI.Application> {
        const app = new PIXI.Application({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            eventMode: 'dynamic',
            forceCanvas: true,
            backgroundColor: 0xFFFFFF,
            resolution: PIXEL_RATIO,
            powerPreference: 'high-performance',
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


/**
 * Renderer for CanvasKit.
 */
export class SkiaRenderer extends Renderer<CanvasKit> {
    public skCanvas!: Canvas;
    private pixiAdapter!: PixiSkiaAdapter;
    private surface!: Surface | null;

    public async init(): Promise<CanvasKit> {
        const canvasElement = document.createElement('canvas')
        canvasElement.width = CANVAS_WIDTH * PIXEL_RATIO
        canvasElement.height = CANVAS_HEIGHT * PIXEL_RATIO
        canvasElement.id = 'skia-canvas'
        this.parentElement.appendChild(canvasElement)

        this.app = await CanvasKitInit({locateFile: (file: string) => `./${file}`})

        this.surface = this.app.MakeSWCanvasSurface('skia-canvas');
        if (!this.surface) {
          throw new Error('Could not create surface');
        }

        this.skCanvas = this.surface.getCanvas();
        this.skCanvas.scale(PIXEL_RATIO, PIXEL_RATIO);

        this.pixiAdapter = new PixiSkiaAdapter(this.app);
        this.app = this.app;
        return this.app;
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
        this.skCanvas.clear(this.app.WHITE);
    }

    /**
     * Exports the renderer to a PDF file.
     * @param containers - The containers to export.
     */
    public exportToPDF(containers: Array<PIXI.Container>): void {
        const stream = new this.app.SkWStream();
        const pdfDoc = new this.app.SkPDFDocument(stream);

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
