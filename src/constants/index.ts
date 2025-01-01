export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 300;
export const DEFAULT_LINE_WIDTH = 2;
export const DEFAULT_FILL_COLOR = 0xFFFFFF;
export const DEFAULT_LINE_COLOR = 0x000000;

export const PDF_OPTIONS = {
  defaultWidth: 595, // A4 width in points
  defaultHeight: 842, // A4 height in points
  margin: 40,
};

export const SUPPORTED_MIME_TYPES = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
};

export const ERROR_MESSAGES = {
  UNSUPPORTED_OBJECT: 'Unsupported PIXI display object type',
  CANVAS_INIT_FAILED: 'Failed to initialize canvas',
  PDF_EXPORT_FAILED: 'Failed to export PDF',
  SKIA_INIT_FAILED: 'Failed to initialize Skia',
};
