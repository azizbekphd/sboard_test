import * as PIXI from 'pixi.js-legacy';

export interface TransformOptions {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface SkiaWrapperOptions {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

export interface PDFExportOptions {
  filename: string;
  pageWidth: number;
  pageHeight: number;
}

export type SupportedPixiObjects = PIXI.Graphics | PIXI.Sprite;

export interface EventHandlers {
  pointerdown?: (event: PointerEvent) => void;
  pointerup?: (event: PointerEvent) => void;
}
