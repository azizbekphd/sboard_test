import * as PIXI from 'pixi.js-legacy';
import { PixiRenderer, SkiaRenderer } from "./Renderer";
import { EventManager } from './EventManager';

export class Application {
    private pixiRenderer: PixiRenderer;
    private skiaRenderer: SkiaRenderer;
    private eventManager: EventManager;

    constructor(parentElements: { pixi: HTMLElement, skia: HTMLElement }) {
        this.pixiRenderer = new PixiRenderer(parentElements.pixi);
        this.skiaRenderer = new SkiaRenderer(parentElements.skia);
        this.eventManager = new EventManager();
    }

    public async init(): Promise<void> {
        try {
            await Promise.all([
                this.pixiRenderer.init(),
                this.skiaRenderer.init(),
            ]);
            this.eventManager.init(this.pixiRenderer, this.skiaRenderer);
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    public renderContainer(container: PIXI.Container): void {
        this.pixiRenderer.renderContainer(container);
        this.skiaRenderer.renderContainer(container);
    }

    public clear(): void {
        this.pixiRenderer.clear();
        this.skiaRenderer.clear();
    }
}
