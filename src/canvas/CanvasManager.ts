import { ToolManager, ToolType } from '../tools/ToolManager';
import { HistoryManager } from '../history/HistoryManager';
import { Canvas, CanvasPointerEvent, Point } from './Canvas';

export class CanvasManager {
  private canvasWrapper: Canvas;
  private ctx: CanvasRenderingContext2D;
  private toolManager: ToolManager;
  private historyManager: HistoryManager;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private snapshot: ImageData | null = null;
  private currentPath: Point[] = [];

  constructor(
    canvasElement: HTMLCanvasElement,
    toolManager: ToolManager,
    historyManager: HistoryManager
  ) {
    this.toolManager = toolManager;
    this.historyManager = historyManager;

    // Initialize Canvas wrapper with high-DPI and performance optimizations
    this.canvasWrapper = new Canvas(canvasElement, {
      enableHighDPI: true,
      lineCap: 'round',
      lineJoin: 'round',
    });

    this.ctx = this.canvasWrapper.getContext();
    this.setupEventListeners();
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    this.ctx.strokeStyle = this.toolManager.getColor();
    this.ctx.lineWidth = this.toolManager.getBrushSize();
    this.ctx.fillStyle = '#ffffff';
    
    // Fill with white background
    const { width, height } = this.canvasWrapper.getSize();
    this.ctx.fillRect(0, 0, width, height);
    
    // Save initial state
    this.historyManager.saveState();
  }

  private setupEventListeners(): void {
    // Subscribe to Canvas pointer events
    this.canvasWrapper.on('pointerdown', this.handlePointerDown.bind(this));
    this.canvasWrapper.on('pointermove', this.handlePointerMove.bind(this));
    this.canvasWrapper.on('pointerup', this.handlePointerUp.bind(this));
    this.canvasWrapper.on('resize', this.handleResize.bind(this));
  }

  private handlePointerDown(event: CanvasPointerEvent): void {
    this.isDrawing = true;
    this.startX = event.x;
    this.startY = event.y;
    this.currentPath = [{ x: event.x, y: event.y }];

    // Save snapshot for shape preview
    this.snapshot = this.canvasWrapper.getImageData();

    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush' || tool === 'eraser') {
      this.ctx.beginPath();
      this.ctx.moveTo(event.x, event.y);
      
      // Draw initial dot for single clicks
      this.ctx.save();
      if (tool === 'eraser') {
        this.ctx.globalCompositeOperation = 'destination-out';
      }
      this.ctx.arc(event.x, event.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  private handlePointerMove(event: CanvasPointerEvent): void {
    if (!this.isDrawing) return;

    this.currentPath.push({ x: event.x, y: event.y });
    
    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush') {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.lineTo(event.x, event.y);
      this.ctx.stroke();
    } else if (tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineTo(event.x, event.y);
      this.ctx.stroke();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      // Restore snapshot for shape preview
      if (this.snapshot) {
        this.canvasWrapper.putImageData(this.snapshot);
      }
      this.drawShape(tool, this.startX, this.startY, event.x, event.y);
    }
  }

  private handlePointerUp(event: CanvasPointerEvent): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const tool = this.toolManager.getCurrentTool();

    if (tool === 'brush' || tool === 'eraser') {
      this.ctx.closePath();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      // Finalize shape drawing
      if (this.snapshot) {
        this.canvasWrapper.putImageData(this.snapshot);
      }
      this.drawShape(tool, this.startX, this.startY, event.x, event.y);
    }

    this.ctx.globalCompositeOperation = 'source-over';
    this.historyManager.saveState();
    this.currentPath = [];
  }

  private handleResize(): void {
    // Canvas wrapper handles resize internally
    // We may want to re-center or scale content here in the future
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
    this.ctx.fillStyle = color;
  }

  setBrushSize(size: number): void {
    this.toolManager.setBrushSize(size);
    this.ctx.lineWidth = size;
  }

  clear(): void {
    const { width, height } = this.canvasWrapper.getSize();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillRect(0, 0, width, height);
    this.historyManager.saveState();
  }

  download(filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvasWrapper.toDataURL('image/png');
    link.click();
  }

  /**
   * Get cursor position for status bar updates
   */
  getCursorPosition(): { x: number; y: number } | null {
    const lastPoint = this.canvasWrapper.getLastPoint();
    return lastPoint;
  }

  /**
   * Check if currently drawing
   */
  isCurrentlyDrawing(): boolean {
    return this.isDrawing;
  }

  /**
   * Get canvas dimensions
   */
  getCanvasSize(): { width: number; height: number } {
    return this.canvasWrapper.getSize();
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.canvasWrapper.dispose();
  }
}

export default CanvasManager;
