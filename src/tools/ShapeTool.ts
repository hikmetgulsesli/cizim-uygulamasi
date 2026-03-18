
import { Canvas } from '../canvas/Canvas';

export type ShapeType = 'rectangle' | 'circle' | 'line';

export interface ShapeDrawOptions {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  brushSize: number;
}

export class ShapeTool {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private currentShape: ShapeType = 'rectangle';
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private snapshot: ImageData | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext();
  }

  setShape(shape: ShapeType): void {
    this.currentShape = shape;
  }

  getCurrentShape(): ShapeType {
    return this.currentShape;
  }

  startDrawing(x: number, y: number): void {
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
    this.snapshot = this.canvas.getImageData();
  }

  drawPreview(endX: number, endY: number, color: string, brushSize: number): void {
    if (!this.isDrawing || !this.snapshot) return;

    // Restore snapshot to clear previous preview
    this.canvas.putImageData(this.snapshot);

    // Draw the shape with current settings
    this.drawShape(this.currentShape, this.startX, this.startY, endX, endY, color, brushSize);
  }

  finishDrawing(endX: number, endY: number, color: string, brushSize: number): void {
    if (!this.isDrawing) return;

    this.isDrawing = false;

    // Restore snapshot and draw final shape
    if (this.snapshot) {
      this.canvas.putImageData(this.snapshot);
    }

    this.drawShape(this.currentShape, this.startX, this.startY, endX, endY, color, brushSize);
    this.snapshot = null;
  }

  private drawShape(
    shape: ShapeType,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    brushSize: number
  ): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.beginPath();

    switch (shape) {
      case 'rectangle':
        this.drawRectangle(startX, startY, endX, endY);
        break;
      case 'circle':
        this.drawCircle(startX, startY, endX, endY);
        break;
      case 'line':
        this.drawLine(startX, startY, endX, endY);
        break;
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawRectangle(startX: number, startY: number, endX: number, endY: number): void {
    const width = endX - startX;
    const height = endY - startY;
    this.ctx.rect(startX, startY, width, height);
  }

  private drawCircle(startX: number, startY: number, endX: number, endY: number): void {
    const radiusX = Math.abs(endX - startX);
    const radiusY = Math.abs(endY - startY);
    const radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY);

    this.ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  }

  private drawLine(startX: number, startY: number, endX: number, endY: number): void {
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
  }

  isCurrentlyDrawing(): boolean {
    return this.isDrawing;
  }

  getStartPosition(): { x: number; y: number } {
    return { x: this.startX, y: this.startY };
  }

  cancelDrawing(): void {
    if (this.isDrawing && this.snapshot) {
      this.canvas.putImageData(this.snapshot);
    }
    this.isDrawing = false;
    this.snapshot = null;
  }
}

export default ShapeTool;
