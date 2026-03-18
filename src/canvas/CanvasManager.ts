import { ToolManager, ToolType } from '../tools/ToolManager';
import { HistoryManager } from '../history/HistoryManager';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private toolManager: ToolManager;
  private historyManager: HistoryManager;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private snapshot: ImageData | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    toolManager: ToolManager,
    historyManager: HistoryManager
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.toolManager = toolManager;
    this.historyManager = historyManager;

    this.setupEventListeners();
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.historyManager.saveState();
  }

  private setupEventListeners(): void {
    // Pointer events for both mouse and touch
    this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.canvas.addEventListener('pointerleave', this.handlePointerUp.bind(this));

    // Prevent default touch behaviors
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  private getPointerPos(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isDrawing = true;
    const pos = this.getPointerPos(e);
    this.startX = pos.x;
    this.startY = pos.y;

    // Save snapshot for shape preview
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush' || tool === 'eraser') {
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }

    this.canvas.setPointerCapture(e.pointerId);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDrawing) return;

    const pos = this.getPointerPos(e);
    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush') {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    } else if (tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      // Restore snapshot for shape preview
      if (this.snapshot) {
        this.ctx.putImageData(this.snapshot, 0, 0);
      }
      this.drawShape(tool, this.startX, this.startY, pos.x, pos.y);
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush' || tool === 'eraser') {
      this.ctx.closePath();
    }

    this.ctx.globalCompositeOperation = 'source-over';
    this.historyManager.saveState();
    this.canvas.releasePointerCapture(e.pointerId);
  }

  private drawShape(
    tool: ToolType,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    this.ctx.beginPath();

    switch (tool) {
      case 'rectangle':
        this.ctx.rect(startX, startY, endX - startX, endY - startY);
        this.ctx.stroke();
        break;
      case 'circle': {
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        this.ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      }
      case 'line':
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        break;
    }

    this.ctx.closePath();
  }

  setTool(tool: ToolType): void {
    this.toolManager.setTool(tool);
  }

  setColor(color: string): void {
    this.toolManager.setColor(color);
    this.ctx.strokeStyle = color;
  }

  setBrushSize(size: number): void {
    this.toolManager.setBrushSize(size);
    this.ctx.lineWidth = size;
  }

  clear(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.historyManager.reset();
  }

  download(filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
