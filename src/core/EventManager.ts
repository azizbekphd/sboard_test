import * as PIXI from 'pixi.js-legacy';
import { PixiRenderer, SkiaRenderer } from './Renderer';
import mainContainer from '../exampleContainer';


export class EventManager {
    public init(pixiRenderer: PixiRenderer, skiaRenderer: SkiaRenderer): void {
        document.querySelector("#export-as-pdf")!.addEventListener("click", () => {
            skiaRenderer.exportToPDF(mainContainer);
        });
    }
}
