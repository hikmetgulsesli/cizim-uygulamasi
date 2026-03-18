/**
 * Canvas.ts - HTML5 Canvas 2D API Wrapper
 * 
 * Provides a robust wrapper around HTML5 Canvas with:
 * - Pointer events (mouse + touch) support
 * - Responsive canvas with window resize handling
 * - Smooth line interpolation for free drawing
 * - High-DPI (Retina) display support
 * - 60fps optimized rendering
 */

export interface Point {
  x: number;
  y: number;
}

export interface CanvasConfig {
  width?: number;
  height?: number;
  backgroundColor?: string;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  enableHighDPI?: boolean;
}

export type CanvasEventType = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointerleave' | 'resize';

export type CanvasEventHandler = (event: CanvasPointerEvent) => void;

export interface CanvasPointerEvent {
  type: CanvasEventType;
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  pressure: number;
  pointerId: number;
  pointerType: string;
  isPrimary: boolean;
  buttons: number;
  originalEvent: PointerEvent;
}

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private rectCache: DOMRect | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private targetFrameTime: number = 1000 / 60; // 60fps = ~16.67ms
  
  private eventHandlers: Map<CanvasEventType, Set<CanvasEventHandler>> = new Map();
  private isDrawing: boolean = false;
  private lastPoint: Point | null = null;
  private pointsBuffer: Point[] = [];
  
  // Smooth drawing settings
  private smoothingEnabled: boolean = true;

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true, // Hint for reduced latency
    });
    
    if (!ctx) {
      throw new Error('Canvas: Could not get 2D context');
    }
    
    this.ctx = ctx;
    this.dpr = config.enableHighDPI !== false ? window.devicePixelRatio || 1 : 1;
    
    this.setupCanvas(config);
    this.setupEventListeners();
    this.setupResizeHandling();
  }

  private setupCanvas(config: CanvasConfig): void {
    // Set canvas display size
    const parent = this.canvas.parentElement;
    const width = config.width || (parent ? parent.clientWidth : 800);
    const height = config.height || (parent ? parent.clientHeight : 600);
    
    this.setSize(width, height);
    
    // Configure drawing context
    this.ctx.lineCap = config.lineCap || 'round';
    this.ctx.lineJoin = config.lineJoin || 'round';
    
    // Fill with background
    if (config.backgroundColor !== 'transparent') {
      this.clear(config.backgroundColor || '#ffffff');
    }
  }

  private setupEventListeners(): void {
    // Pointer events for unified mouse/touch handling
    this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this), { passive: false });
    this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: false });
    this.canvas.addEventListener('pointerup', this.handlePointerUp.bind(this), { passive: false });
    this.canvas.addEventListener('pointerleave', this.handlePointerUp.bind(this), { passive: false });
    this.canvas.addEventListener('pointercancel', this.handlePointerUp.bind(this), { passive: false });
    
    // Prevent default touch behaviors that interfere with drawing
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
    
    // Cache invalidation on scroll
    window.addEventListener('scroll', () => {
      this.rectCache = null;
    }, { passive: true });
  }

  private setupResizeHandling(): void {
    // Use ResizeObserver for efficient resize detection
    if (typeof ResizeObserver !== 'undefined' && this.canvas.parentElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          this.setSize(width, height);
          this.emit('resize', {
            type: 'resize',
            x: 0,
            y: 0,
            rawX: 0,
            rawY: 0,
            pressure: 0,
            pointerId: 0,
            pointerType: '',
            isPrimary: false,
            buttons: 0,
            originalEvent: new PointerEvent('resize'),
          });
        }
      });
      this.resizeObserver.observe(this.canvas.parentElement);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', () => {
        this.rectCache = null;
        const parent = this.canvas.parentElement;
        if (parent) {
          this.setSize(parent.clientWidth, parent.clientHeight);
        }
      });
    }
  }

  private getPointerPos(e: PointerEvent): { x: number; y: number } {
    // Cache rect to avoid repeated layout calculations
    if (!this.rectCache) {
      this.rectCache = this.canvas.getBoundingClientRect();
    }
    const rect = this.rectCache;
    
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width / this.dpr),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height / this.dpr),
    };
  }

  private handlePointerDown(e: PointerEvent): void {
    e.preventDefault();
    this.isDrawing = true;
    this.canvas.setPointerCapture(e.pointerId);
    
    const pos = this.getPointerPos(e);
    this.lastPoint = pos;
    this.pointsBuffer = [pos];
    
    const event = this.createCanvasEvent('pointerdown', pos, e);
    this.emit('pointerdown', event);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDrawing) {
      // Update rect cache for cursor tracking even when not drawing
      this.rectCache = null;
      return;
    }
    
    e.preventDefault();
    const pos = this.getPointerPos(e);
    
    // Add point to buffer for smoothing
    this.pointsBuffer.push(pos);
    
    // Use requestAnimationFrame for 60fps rendering
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame((timestamp) => {
        this.rafId = null;
        this.renderSmoothLine(timestamp);
      });
    }
    
    const event = this.createCanvasEvent('pointermove', pos, e);
    this.emit('pointermove', event);
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isDrawing) return;
    
    e.preventDefault();
    this.isDrawing = false;
    this.canvas.releasePointerCapture(e.pointerId);
    
    const pos = this.getPointerPos(e);
    this.pointsBuffer.push(pos);
    
    // Flush remaining points
    this.renderSmoothLine(performance.now(), true);
    
    this.lastPoint = null;
    this.pointsBuffer = [];
    
    const event = this.createCanvasEvent('pointerup', pos, e);
    this.emit('pointerup', event);
  }

  private createCanvasEvent(type: CanvasEventType, pos: Point, original: PointerEvent): CanvasPointerEvent {
    return {
      type,
      x: pos.x,
      y: pos.y,
      rawX: original.clientX,
      rawY: original.clientY,
      pressure: original.pressure || 0.5,
      pointerId: original.pointerId,
      pointerType: original.pointerType,
      isPrimary: original.isPrimary,
      buttons: original.buttons,
      originalEvent: original,
    };
  }

  /**
   * Smooth line rendering using quadratic Bezier curves
   * Creates fluid, natural-looking lines from input points
   */
  private renderSmoothLine(timestamp: number, flush: boolean = false): void {
    // Frame timing for 60fps
    const deltaTime = timestamp - this.lastFrameTime;
    if (!flush && deltaTime < this.targetFrameTime) {
      return;
    }
    this.lastFrameTime = timestamp;
    
    if (this.pointsBuffer.length < 2) return;
    
    if (!this.smoothingEnabled || this.pointsBuffer.length < 3) {
      // Simple line drawing for low point counts
      this.drawSimpleLines();
    } else {
      // Quadratic Bezier smoothing
      this.drawSmoothLines();
    }
  }

  private drawSimpleLines(): void {
    this.ctx.beginPath();
    
    if (this.lastPoint) {
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    }
    
    for (let i = 0; i < this.pointsBuffer.length; i++) {
      this.ctx.lineTo(this.pointsBuffer[i].x, this.pointsBuffer[i].y);
    }
    
    this.ctx.stroke();
    
    // Update last point
    this.lastPoint = this.pointsBuffer[this.pointsBuffer.length - 1];
    this.pointsBuffer = this.lastPoint ? [this.lastPoint] : [];
  }

  private drawSmoothLines(): void {
    if (!this.lastPoint) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    
    // Use quadratic Bezier curves for smooth interpolation
    for (let i = 1; i < this.pointsBuffer.length - 1; i++) {
      const p1 = this.pointsBuffer[i];
      const p2 = this.pointsBuffer[i + 1];
      
      // Calculate control point (midpoint)
      const cpX = (p1.x + p2.x) / 2;
      const cpY = (p1.y + p2.y) / 2;
      
      // Quadratic curve to midpoint
      this.ctx.quadraticCurveTo(p1.x, p1.y, cpX, cpY);
    }
    
    // Connect to last point
    const lastPoint = this.pointsBuffer[this.pointsBuffer.length - 1];
    this.ctx.lineTo(lastPoint.x, lastPoint.y);
    
    this.ctx.stroke();
    
    // Keep last point for continuity
    this.lastPoint = lastPoint;
    this.pointsBuffer = [this.lastPoint];
  }

  private emit(type: CanvasEventType, event: CanvasPointerEvent): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error('Canvas event handler error:', err);
        }
      });
    }
  }

  /**
   * Set canvas size accounting for device pixel ratio
   */
  setSize(width: number, height: number): void {
    // Set actual canvas size (scaled for DPR)
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    
    // Set display size via CSS
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    // Scale context for high-DPI displays
    this.ctx.scale(this.dpr, this.dpr);
    
    // Invalidate rect cache
    this.rectCache = null;
  }

  /**
   * Get current canvas dimensions
   */
  getSize(): { width: number; height: number } {
    return {
      width: this.canvas.width / this.dpr,
      height: this.canvas.height / this.dpr,
    };
  }

  /**
   * Get the 2D rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get the underlying canvas element
   */
  getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Clear the canvas with optional background color
   */
  clear(color?: string): void {
    const { width, height } = this.getSize();
    
    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, width, height);
    } else {
      this.ctx.clearRect(0, 0, width, height);
    }
  }

  /**
   * Register an event handler
   */
  on(event: CanvasEventType, handler: CanvasEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Remove event handler
   */
  off(event: CanvasEventType, handler: CanvasEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  /**
   * Enable/disable line smoothing
   */
  setSmoothing(enabled: boolean): void {
    this.smoothingEnabled = enabled;
  }

  /**
   * Set minimum distance between points (reserved for future use)
   */
  setMinDistance(_distance: number): void {
    // Reserved for future point filtering implementation
  }

  /**
   * Get current drawing state
   */
  isCurrentlyDrawing(): boolean {
    return this.isDrawing;
  }

  /**
   * Get the last cursor position
   */
  getLastPoint(): Point | null {
    return this.lastPoint;
  }

  /**
   * Get ImageData for saving state
   */
  getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Restore ImageData
   */
  putImageData(imageData: ImageData): void {
    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Convert to data URL
   */
  toDataURL(type?: string, quality?: number): string {
    return this.canvas.toDataURL(type, quality);
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    this.eventHandlers.clear();
  }
}

export default Canvas;
