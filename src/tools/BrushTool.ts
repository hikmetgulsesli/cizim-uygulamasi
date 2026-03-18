import { BaseTool } from './Tool';

export class BrushTool extends BaseTool {
  readonly name = 'Fırça';
  readonly type = 'brush';

  onPointerDown(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.isDrawing = true;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Draw initial dot for single clicks
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  onPointerMove(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.isDrawing) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onPointerUp(ctx: CanvasRenderingContext2D, _x: number, _y: number): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    ctx.closePath();
  }
}
