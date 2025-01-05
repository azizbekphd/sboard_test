import * as PIXI from 'pixi.js-legacy';
import { Canvas, CanvasKit, Color, Paint } from '../third-party/canvaskit/canvaskit.js';


interface TransformOptions {
    translate: PIXI.Point;
    rotation: number;
    scale: PIXI.Point;
    pivot: PIXI.Point;
}

/**
 * Adapter for rendering PIXI.DisplayObjects to Canvas using Skia.
 */
export default class PixiSkiaAdapter {
    private canvasKit: CanvasKit;
    private paint: Paint;

    constructor(canvasKit: CanvasKit) {
        this.canvasKit = canvasKit;
        this.paint = new this.canvasKit.Paint();
        this.paint.setStrokeJoin(this.canvasKit.StrokeJoin.Round);
    }

    /**
     * Renders a PIXI.DisplayObject to a Canvas using Skia.
     * @param canvas - The canvas to render to.
     * @param object - The PIXI.DisplayObject to render.
     */
    public renderContainer(canvas: Canvas, object: PIXI.DisplayObject): void {
        const transform: TransformOptions = {
            translate: object.position,
            rotation: object.angle,
            scale: object.scale,
            pivot: object.pivot,
        };

        canvas.save();

        canvas.translate(transform.translate.x, transform.translate.y);
        canvas.translate(-transform.pivot.x, -transform.pivot.y);
        canvas.rotate(transform.rotation, transform.pivot.x, transform.pivot.y);
        canvas.scale(transform.scale.x, transform.scale.y);

        if (object instanceof PIXI.Sprite) {
            this.renderSprite(canvas, object);
        } else if (object instanceof PIXI.Graphics) {
            this.renderGraphics(canvas, object);
        } else if (object instanceof PIXI.Container) {
            for (const child of object.children ?? []) {
                this.renderContainer(canvas, child);
            }
        }
        canvas.restore();
    }

    /**
     * Renders a PIXI.Sprite to a Canvas using Skia.
     * @param canvas - The canvas to render to.
     * @param sprite - The PIXI.Sprite to render.
     */
    public renderSprite(canvas: Canvas, sprite: PIXI.Sprite): void {
        if (!sprite.texture.valid) {
            return;
        }

        const baseTexture = sprite.texture.baseTexture;
        const source = baseTexture.getDrawableSource!() as HTMLImageElement | HTMLCanvasElement;

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

        canvas.drawImageRect(
            skImage,
            srcRect,
            destRect,
            this.paint
        );

        skImage.delete();
    }

    /**
     * Renders a PIXI.Graphics to a Canvas using Skia.
     * @param canvas - The canvas to render to.
     * @param graphics - The PIXI.Graphics to render.
     */
    public renderGraphics(canvas: Canvas, graphics: PIXI.Graphics): void {
        const commands = graphics.geometry.graphicsData;
        for (const command of commands) {
            const { fillStyle, lineStyle } = command

            this.paint.setColor(this.convertColor(fillStyle.alpha, fillStyle?.color ?? 0x000000));
            this.paint.setStyle(this.canvasKit.PaintStyle.Fill);
            this._renderShape(canvas, command);

            if (lineStyle.width > 0) {
                this.paint.setColor(this.convertColor(lineStyle.alpha, lineStyle.color));
                this.paint.setStyle(this.canvasKit.PaintStyle.Stroke);
                this.paint.setStrokeWidth(lineStyle.width);
                this._renderShape(canvas, command);
            }
        }
    }

    /**
     * Renders a shape to a Canvas using Skia.
     * @param canvas - The canvas to render to.
     * @param command - The shape to render.
     */
    private _renderShape(canvas: Canvas, command: PIXI.GraphicsData): void {
        const shape = command.shape;
        if (shape instanceof PIXI.Circle) {
            canvas.drawCircle(shape.x, shape.y, shape.radius, this.paint);
        } else if (shape instanceof PIXI.Ellipse) {
            canvas.drawOval(this.canvasKit.XYWHRect(
                shape.x - shape.width,
                shape.y - shape.height,
                shape.width * 2, shape.height * 2
            ), this.paint);
        } else if (shape instanceof PIXI.Polygon) {
            const path = new this.canvasKit.Path();
            path.addPoly(shape.points, shape.closeStroke);
            canvas.drawPath(path, this.paint);
        } else if (shape instanceof PIXI.Rectangle) {
            canvas.drawRect(this.canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height), this.paint);
        } else if (shape instanceof PIXI.RoundedRectangle) {
            canvas.drawRRect(this.canvasKit.RRectXY(
                this.canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
                shape.radius, shape.radius), this.paint);
        }
    }

    /**
     * Converts a color from a PIXI.GraphicsData to a CanvasKit.Color.
     * @param alpha - The alpha value of the color.
     * @param color - The color value.
     * @returns A CanvasKit.Color.
     */
    public convertColor(alpha: number, color: number): Color {
        return this.canvasKit.Color(color >> 16, color >> 8 & 0xFF, color & 0xFF, alpha);
    }
}
