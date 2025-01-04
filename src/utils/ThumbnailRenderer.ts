import * as PIXI from 'pixi.js-legacy';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';


class ThumbnailRenderer {
    private renderer: PIXI.Renderer;

    constructor() {
        this.renderer = new PIXI.Renderer({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            resolution: window.devicePixelRatio || 1,
            forceCanvas: true,
            antialias: true,
            backgroundColor: 0xFFFFFF,
        });
    }

    public render(container: PIXI.Container, canvas: HTMLCanvasElement): void {
        const renderTexture = PIXI.RenderTexture.create({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            resolution: window.devicePixelRatio || 1,
        });
        this.renderer.render(container, { renderTexture });
        const tempSprite = new PIXI.Sprite(renderTexture);
        this.renderer.render(tempSprite);
        canvas.getContext('2d')!.drawImage(this.renderer.view as HTMLCanvasElement, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.renderer.clear();
        renderTexture.destroy();
        tempSprite.destroy();
    }
}

export default ThumbnailRenderer;

