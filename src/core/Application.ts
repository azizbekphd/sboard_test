import * as PIXI from 'pixi.js-legacy';
import { PixiRenderer, SkiaRenderer } from "./Renderer";
import { EventManager } from './EventManager';
import ContainersManager from './ContainersManager';
import RandomPixiContainerGenerator from '../utils/RandomPixiContainerGenerator';
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_CONTAINERS } from '../constants';
import ThumbnailRenderer from '../utils/ThumbnailRenderer';

export class Application {
    public pixiRenderer: PixiRenderer;
    public skiaRenderer: SkiaRenderer;
    public containersManager: ContainersManager;
    public containerGenerator: RandomPixiContainerGenerator;
    private eventManager: EventManager;
    private thumbnailRenderer: ThumbnailRenderer;

    constructor(parentElements: { pixi: HTMLElement, skia: HTMLElement }) {
        this.pixiRenderer = new PixiRenderer(parentElements.pixi);
        this.skiaRenderer = new SkiaRenderer(parentElements.skia);
        this.containersManager = new ContainersManager();
        this.containerGenerator = new RandomPixiContainerGenerator(
            [
                PIXI.Texture.from('/sprites/sprite1.png'),
                PIXI.Texture.from('/sprites/sprite2.png'),
            ]
        );
        this.eventManager = new EventManager(this);
        this.thumbnailRenderer = new ThumbnailRenderer();
    }

    public async init(): Promise<void> {
        try {
            await Promise.all([
                this.pixiRenderer.init(),
                this.skiaRenderer.init(),
            ]);
            this.eventManager.initButtonClickEvents();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    public addRandomContainer(): void {
        const container = this.containerGenerator.generateContainer();
        this.addContainer(container);
    }

    public addContainer(container: PIXI.Container): void {
        this.containersManager.addContainer(container);
        this.containersManager.setSelectedContainerToLast()
        this.clean();
        this.renderSelectedContainer();
        this.checkContainersLimit();
        this.refreshThumbnails();
    }

    private checkContainersLimit(): void {
        const generateButton = document.getElementById('generate-random-container')! as HTMLButtonElement;
        if (this.containersManager.containers.length >= MAX_CONTAINERS) {
            generateButton.disabled = true;
            generateButton.classList.add('disabled');
        } else {
            generateButton.disabled = false;
            generateButton.classList.remove('disabled');
        }
    }

    private renderSelectedContainer(): void {
        this.pixiRenderer.renderContainer(this.containersManager.getSelectedContainer()!);
        this.skiaRenderer.renderContainer(this.containersManager.getSelectedContainer()!);
        this.renderComparisonContainers();
    }

    private renderComparisonContainers(): void {
        const pixiCanvas = document.querySelector('#pixi-canvas-wrapper canvas')! as HTMLCanvasElement;
        const skiaCanvas = document.querySelector('#skia-canvas-wrapper canvas')! as HTMLCanvasElement;
        const comparisonCanvas1 = document.getElementById('comparison-canvas1')! as HTMLCanvasElement;
        const comparisonCanvas2 = document.getElementById('comparison-canvas2')! as HTMLCanvasElement;

        comparisonCanvas1.width = CANVAS_WIDTH;
        comparisonCanvas1.height = CANVAS_HEIGHT;
        comparisonCanvas2.width = CANVAS_WIDTH;
        comparisonCanvas2.height = CANVAS_HEIGHT;

        setTimeout(() => {
            comparisonCanvas1.getContext('2d')!.drawImage(pixiCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            comparisonCanvas2.getContext('2d')!.drawImage(skiaCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }, 0);
    }

    private clean(): void {
        this.pixiRenderer.clean();
        this.skiaRenderer.clean();
    }

    private refreshThumbnails(): void {
        const thumbnails = document.querySelector('#thumbnails ul')!;
        const scrollTop = thumbnails.scrollTop;

        thumbnails.innerHTML = '';
        for (let i = 0; i < this.containersManager.containers.length; i++) {
            const li = document.createElement('li');

            if (i === this.containersManager.selectedContainer) {
                li.classList.add('selected');
            }

            const thumbnailCanvas = document.createElement('canvas');

            thumbnailCanvas.width = CANVAS_WIDTH;
            thumbnailCanvas.height = CANVAS_HEIGHT;
            this.thumbnailRenderer.render(this.containersManager.containers[i], thumbnailCanvas);

            li.appendChild(thumbnailCanvas);
            thumbnails.appendChild(li);

            li.addEventListener('click', () => {
                this.containersManager.setSelectedContainer(i);
                this.renderSelectedContainer();
                this.refreshThumbnails();
            });

            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'x';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.containersManager.removeContainer(i);
                if (this.containersManager.containers.length === 0) {
                    this.addRandomContainer();
                    return;
                }
                if (this.containersManager.selectedContainer === this.containersManager.containers.length) {
                    this.containersManager.setSelectedContainerToLast();
                }
                this.renderSelectedContainer();
                this.refreshThumbnails();
            });
            li.appendChild(removeButton);

            this.skiaRenderer
        }

        thumbnails.scrollTop = scrollTop;
    }
}
