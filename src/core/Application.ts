import * as PIXI from 'pixi.js-legacy';
import { PixiRenderer, SkiaRenderer } from "./Renderer";

export class Application {
    private pixiRenderer: PixiRenderer;
    private skiaRenderer: SkiaRenderer;

    constructor(parentElements: { pixi: HTMLElement, skia: HTMLElement }) {
        this.pixiRenderer = new PixiRenderer(parentElements.pixi);
        this.skiaRenderer = new SkiaRenderer(parentElements.skia);
    }

    public async init(): Promise<void> {
        try {
            await Promise.all([
                this.pixiRenderer.init(),
                this.skiaRenderer.init(),
            ]);
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    public renderContainer(container: PIXI.Container): void {
        this.pixiRenderer.renderContainer(container);
        setTimeout(() => {
            this.skiaRenderer.renderContainer(container);
        }, 0);
    }

    public clear(): void {
        this.pixiRenderer.clear();
        this.skiaRenderer.clear();
    }
}
