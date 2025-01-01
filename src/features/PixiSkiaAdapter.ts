import * as PIXI from 'pixi.js-legacy';
import { Canvas, CanvasKit, Color, Paint, Surface } from 'canvaskit-wasm';


interface TransformOptions {
    translate: PIXI.Point;
    rotation: number;
    scale: PIXI.Point;
    pivot: PIXI.Point;
}

export default class PixiSkiaAdapter {
    private canvas: Canvas;
    private canvasKit: CanvasKit;
    private surface: Surface;
    private paint: Paint;

    constructor(canvas: Canvas, canvasKit: CanvasKit, surface: Surface) {
        this.canvas = canvas;
        this.canvasKit = canvasKit;
        this.surface = surface;
        this.paint = new this.canvasKit.Paint();
    }

    public renderContainer(object: PIXI.DisplayObject): void {
        const transform: TransformOptions = {
            translate: object.position,
            rotation: object.angle,
            scale: object.scale,
            pivot: object.pivot,
        };

        this.canvas.save();
        if (transform) {
            this.canvas.translate(transform.translate.x, transform.translate.y);
            this.canvas.translate(-transform.pivot.x, -transform.pivot.y);
            this.canvas.rotate(transform.rotation, transform.pivot.x, transform.pivot.y);
            this.canvas.scale(transform.scale.x, transform.scale.y);
        }
        if (object instanceof PIXI.Sprite) {
            this.renderSprite(object);
        } else if (object instanceof PIXI.Graphics) {
            this.renderGraphics(object);
        } else if (object instanceof PIXI.Container) {
            for (const child of object.children ?? []) {
                this.renderContainer(child);
            }
        }
        this.canvas.restore();
        this.surface.flush();
    }

    public renderSprite(sprite: PIXI.Sprite): void {
        if (!sprite.texture.valid) {
            return;
        }

        const baseTexture = sprite.texture.baseTexture;
        const source = baseTexture.resource?.source as HTMLImageElement | HTMLCanvasElement;

        if (!source) {
            console.warn('Sprite source is not available for rendering.');
            return;
        }

        const skImage = this.canvasKit.MakeImageFromCanvasImageSource(source);
        if (!skImage) {
            console.warn('Failed to create Skia Image from sprite source.');
            return;
        }

        const frame = sprite.texture.frame;
        const srcRect = this.canvasKit.XYWHRect(
            frame.x,
            frame.y,
            frame.width,
            frame.height
        );

        const destRect = this.canvasKit.XYWHRect(
            -sprite.anchor.x * frame.width,
            -sprite.anchor.y * frame.height,
            frame.width,
            frame.height
        );

        this.canvas.drawImageRect(
            skImage,
            srcRect,
            destRect,
            this.paint
        );

        skImage.delete();
    }

    public renderGraphics(graphics: PIXI.Graphics): void {
        const commands = graphics.geometry.graphicsData;
        for (const command of commands) {
            const { fillStyle, lineStyle } = command

            this.paint.setColor(this.convertColor(fillStyle.alpha, fillStyle?.color ?? 0x000000));
            this.paint.setStyle(this.canvasKit.PaintStyle.Fill);
            this._renderShape(command);

            if (lineStyle.width > 0) {
                this.paint.setColor(this.convertColor(lineStyle.alpha, lineStyle.color));
                this.paint.setStyle(this.canvasKit.PaintStyle.Stroke);
                this.paint.setStrokeWidth(lineStyle.width);
                this._renderShape(command);
            }
        }
    }

    private _renderShape(command: PIXI.GraphicsData): void {
        const shape = command.shape;
        if (shape instanceof PIXI.Circle) {
            this.canvas.drawCircle(shape.x, shape.y, shape.radius, this.paint);
        } else if (shape instanceof PIXI.Ellipse) {
            this.canvas.drawOval(this.canvasKit.XYWHRect(
                shape.x - shape.width,
                shape.y - shape.height,
                shape.width * 2, shape.height * 2
            ), this.paint);
        } else if (shape instanceof PIXI.Polygon) {
            const path = new this.canvasKit.Path();
            path.addPoly(shape.points, shape.closeStroke);
            this.canvas.drawPath(path, this.paint);
        } else if (shape instanceof PIXI.Rectangle) {
            this.canvas.drawRect(this.canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height), this.paint);
        } else if (shape instanceof PIXI.RoundedRectangle) {
            this.canvas.drawRRect(this.canvasKit.RRectXY(this.canvasKit.LTRBRect(shape.x, shape.y, shape.width, shape.height), shape.radius, shape.radius), this.paint);
        }
    }

    public convertColor(alpha: number, color: number): Color {
        return this.canvasKit.Color(color >> 16, color >> 8 & 0xFF, color & 0xFF, alpha);
    }
}
