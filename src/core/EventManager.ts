import * as PIXI from 'pixi.js-legacy';
import { SkiaRenderer } from './Renderer';


export class EventManager {
    private pointerDownHandler?: (event: PointerEvent) => void;
    private pointerUpHandler?: (event: PointerEvent) => void;

    public registerEvents(
        pixiStage: PIXI.Container,
        skiaRenderer: SkiaRenderer
    ): void {
        this.pointerDownHandler = (event: PointerEvent) => {
            skiaRenderer.renderContainer(pixiStage);
        };

        this.pointerUpHandler = (event: PointerEvent) => {
            skiaRenderer.renderContainer(pixiStage);
        };

        pixiStage.on('pointerdown', this.pointerDownHandler);
        pixiStage.on('pointerup', this.pointerUpHandler);
    }

    public unregisterEvents(): void {
        this.pointerDownHandler = undefined;
        this.pointerUpHandler = undefined;
    }
}
