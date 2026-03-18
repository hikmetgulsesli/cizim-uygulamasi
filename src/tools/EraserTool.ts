import { BaseTool } from './Tool';

export class EraserTool extends BaseTool {
  readonly name = 'Silgi';
  readonly type = 'eraser';
  private backgroundColor: string = '#ffffff';

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  onPointerDown(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.isDrawing = true;
    // Use destination-out to erase (make transparent)
    // Then we'll draw background color behind
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Draw initial erase dot
    ctx.save();
    ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  onPointerMove(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.isDrawing) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = this.size;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onPointerUp(ctx: CanvasRenderingContext2D, _x: number, _y: number): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    ctx.closePath();
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }
}
