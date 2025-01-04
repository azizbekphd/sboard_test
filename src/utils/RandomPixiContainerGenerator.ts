import * as PIXI from 'pixi.js-legacy';

type Texture = PIXI.Texture;

export default class RandomPixiContainerGenerator {
    private textures: Texture[];

    constructor(textures: Texture[]) {
        this.textures = textures;
    }

    /**
     * Generates a random PixiJS container with subcontainers, graphics, and sprites.
     * @param maxDepth - Maximum depth of subcontainers
     * @param maxChildren - Maximum number of children per container
     * @returns A randomly generated PIXI.Container
     */
    generateContainer(maxDepth: number = 3, maxChildren: number = 7): PIXI.Container {
        const container = new PIXI.Container();
        this.populateContainer(container, maxDepth, maxChildren);
        return container;
    }

    /**
     * Populates a container with random children: graphics, sprites, or subcontainers.
     */
    private populateContainer(container: PIXI.Container, depth: number, maxChildren: number) {
        if (depth === 0) return;

        const childrenCount = Math.floor(Math.random() * maxChildren) + 5;

        for (let i = 0; i < childrenCount; i++) {
            const childType = Math.floor(Math.random() * 3); // 0: Graphics, 1: Sprite, 2: Subcontainer

            switch (childType) {
                case 0:
                    container.addChild(this.createRandomGraphics());
                    break;
                case 1:
                    container.addChild(this.createRandomSprite());
                    break;
                case 2:
                    const subContainer = new PIXI.Container();
                    this.applyRandomTransformations(subContainer);
                    this.populateContainer(subContainer, depth - 1, maxChildren);
                    container.addChild(subContainer);
                    break;
            }
        }
    }

    /**
     * Creates a random PIXI.Graphics object.
     */
    private createRandomGraphics(): PIXI.Graphics {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(this.getRandomColor());
        const shapeType = Math.floor(Math.random() * 5); // 0: Rectangle, 1: Circle, 2: Polygon, 3: Ellipse

        switch (shapeType) {
            case 0: // Rectangle
                graphics.drawRect(
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 200,
                    Math.random() * 200
                );
                break;
            case 1: // Circle
                graphics.drawCircle(
                    Math.random() * 200,
                    Math.random() * 200,
                    Math.random() * 100
                );
                break;
            case 2: // Polygon
                graphics.drawPolygon([
                    Math.random() * 200, Math.random() * 200,
                    Math.random() * 200, Math.random() * 200,
                    Math.random() * 200, Math.random() * 200
                ]);
                break;
            case 3: // Ellipse
                graphics.drawEllipse(
                    Math.random() * 200,
                    Math.random() * 200,
                    Math.random() * 100,
                    Math.random() * 50
                );
                break;
            case 4: // Arc
                graphics.arc(
                    Math.random() * 200,
                    Math.random() * 200,
                    Math.random() * 50,
                    0,
                    Math.PI * Math.random() * 2
                );
                break;
        }

        graphics.endFill();
        this.applyRandomTransformations(graphics);
        return graphics;
    }

    /**
     * Creates a random PIXI.Sprite object from the provided textures.
     */
    private createRandomSprite(): PIXI.Sprite {
        const randomTexture = this.textures[
            Math.floor(Math.random() * this.textures.length)
        ];
        const sprite = new PIXI.Sprite(randomTexture);
        sprite.anchor.set(0.5);
        sprite.position.set(Math.random() * 400, Math.random() * 400);
        sprite.rotation = Math.random() * Math.PI * 2;
        sprite.scale.set(Math.random() * 2, Math.random() * 2);
        return sprite;
    }

    /**
     * Applies random transformations (position, rotation, scale) to a DisplayObject.
     */
    private applyRandomTransformations(obj: PIXI.DisplayObject) {
        obj.position.set(Math.random() * 400, Math.random() * 400);
        obj.rotation = Math.random() * Math.PI * 2;
        (obj as PIXI.Container | PIXI.Sprite).scale?.set(Math.random() * 2 + 0.5);
    }

    /**
     * Generates a random hexadecimal color.
     */
    private getRandomColor(): number {
        return Math.floor(Math.random() * 0xFFFFFF);
    }
}
