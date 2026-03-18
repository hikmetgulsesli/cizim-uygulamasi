import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ShapeTool } from './ShapeTool';
import { Canvas } from '../canvas/Canvas';

// Mock canvas context
const createMockContext = () => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  globalCompositeOperation: 'source-over',
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  rect: vi.fn(),
  quadraticCurveTo: vi.fn(),
  scale: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 100,
    height: 100,
  })),
  putImageData: vi.fn(),
});

describe('ShapeTool', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: ReturnType<typeof createMockContext>;
  let canvas: Canvas;
  let shapeTool: ShapeTool;

  beforeEach(() => {
    mockContext = createMockContext();
    
    mockCanvas = {
      width: 800,
      height: 600,
      style: {},
      parentElement: {
        clientWidth: 800,
        clientHeight: 600,
      },
      getContext: vi.fn(() => mockContext),
      getBoundingClientRect: vi.fn(() => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
      toDataURL: vi.fn(() => 'data:image/png;base64,test'),
      dispatchEvent: vi.fn(),
    } as unknown as HTMLCanvasElement;

    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((_callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    canvas = new Canvas(mockCanvas, {
      width: 800,
      height: 600,
      enableHighDPI: false,
    });

    shapeTool = new ShapeTool(canvas);
  });

  afterEach(() => {
    canvas.dispose();
    vi.clearAllMocks();
  });

  describe('Tool Selection', () => {
    it('should default to rectangle tool', () => {
      expect(shapeTool.getCurrentShape()).toBe('rectangle');
    });

    it('should set and get circle tool', () => {
      shapeTool.setShape('circle');
      expect(shapeTool.getCurrentShape()).toBe('circle');
    });

    it('should set and get line tool', () => {
      shapeTool.setShape('line');
      expect(shapeTool.getCurrentShape()).toBe('line');
    });

    it('should set and get rectangle tool', () => {
      shapeTool.setShape('line');
      shapeTool.setShape('rectangle');
      expect(shapeTool.getCurrentShape()).toBe('rectangle');
    });
  });

  describe('Rectangle Drawing', () => {
    it('should draw rectangle via drag', () => {
      shapeTool.setShape('rectangle');
      shapeTool.startDrawing(100, 100);
      shapeTool.finishDrawing(200, 150, '#ff0000', 5);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.rect).toHaveBeenCalledWith(100, 100, 100, 50);
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should use current color and brush size for rectangle', () => {
      shapeTool.setShape('rectangle');
      shapeTool.startDrawing(50, 50);
      shapeTool.finishDrawing(150, 150, '#2563eb', 10);

      expect(mockContext.strokeStyle).toBe('#2563eb');
      expect(mockContext.lineWidth).toBe(10);
    });

    it('should draw rectangle with negative dimensions (dragging up-left)', () => {
      shapeTool.setShape('rectangle');
      shapeTool.startDrawing(200, 200);
      shapeTool.finishDrawing(100, 100, '#000000', 2);

      expect(mockContext.rect).toHaveBeenCalledWith(200, 200, -100, -100);
    });
  });

  describe('Circle Drawing', () => {
    it('should draw circle via drag', () => {
      shapeTool.setShape('circle');
      shapeTool.startDrawing(150, 150);
      shapeTool.finishDrawing(200, 150, '#00ff00', 3);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(150, 150, 50, 0, Math.PI * 2);
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should calculate circle radius from drag distance', () => {
      shapeTool.setShape('circle');
      shapeTool.startDrawing(100, 100);
      // Drag to (150, 150) - diagonal distance should be ~70.7
      shapeTool.finishDrawing(150, 150, '#ff0000', 5);

      const expectedRadius = Math.sqrt(50 * 50 + 50 * 50);
      expect(mockContext.arc).toHaveBeenCalledWith(100, 100, expectedRadius, 0, Math.PI * 2);
    });

    it('should use current color and brush size for circle', () => {
      shapeTool.setShape('circle');
      shapeTool.startDrawing(100, 100);
      shapeTool.finishDrawing(200, 200, '#9333ea', 8);

      expect(mockContext.strokeStyle).toBe('#9333ea');
      expect(mockContext.lineWidth).toBe(8);
    });
  });

  describe('Line Drawing', () => {
    it('should draw straight line via drag', () => {
      shapeTool.setShape('line');
      shapeTool.startDrawing(100, 100);
      shapeTool.finishDrawing(300, 200, '#0000ff', 4);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.lineTo).toHaveBeenCalledWith(300, 200);
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should use current color and brush size for line', () => {
      shapeTool.setShape('line');
      shapeTool.startDrawing(50, 50);
      shapeTool.finishDrawing(250, 250, '#f97316', 6);

      expect(mockContext.strokeStyle).toBe('#f97316');
      expect(mockContext.lineWidth).toBe(6);
    });

    it('should draw horizontal line', () => {
      shapeTool.setShape('line');
      shapeTool.startDrawing(100, 150);
      shapeTool.finishDrawing(300, 150, '#000000', 2);

      expect(mockContext.moveTo).toHaveBeenCalledWith(100, 150);
      expect(mockContext.lineTo).toHaveBeenCalledWith(300, 150);
    });

    it('should draw vertical line', () => {
      shapeTool.setShape('line');
      shapeTool.startDrawing(200, 100);
      shapeTool.finishDrawing(200, 300, '#000000', 2);

      expect(mockContext.moveTo).toHaveBeenCalledWith(200, 100);
      expect(mockContext.lineTo).toHaveBeenCalledWith(200, 300);
    });
  });

  describe('Drawing State', () => {
    it('should track drawing state during shape creation', () => {
      expect(shapeTool.isCurrentlyDrawing()).toBe(false);
      
      shapeTool.startDrawing(100, 100);
      expect(shapeTool.isCurrentlyDrawing()).toBe(true);
      
      shapeTool.finishDrawing(200, 200, '#000000', 2);
      expect(shapeTool.isCurrentlyDrawing()).toBe(false);
    });

    it('should store start position', () => {
      shapeTool.startDrawing(150, 250);
      const pos = shapeTool.getStartPosition();
      
      expect(pos.x).toBe(150);
      expect(pos.y).toBe(250);
    });

    it('should cancel drawing and restore snapshot', () => {
      shapeTool.startDrawing(100, 100);
      expect(shapeTool.isCurrentlyDrawing()).toBe(true);
      
      shapeTool.cancelDrawing();
      
      expect(shapeTool.isCurrentlyDrawing()).toBe(false);
      expect(mockContext.putImageData).toHaveBeenCalled();
    });
  });

  describe('Preview Drawing', () => {
    it('should restore snapshot before drawing preview', () => {
      shapeTool.setShape('rectangle');
      shapeTool.startDrawing(100, 100);
      shapeTool.drawPreview(150, 150, '#ff0000', 5);

      expect(mockContext.putImageData).toHaveBeenCalled();
    });

    it('should not draw preview if not in drawing state', () => {
      shapeTool.setShape('rectangle');
      // Don't call startDrawing
      shapeTool.drawPreview(150, 150, '#ff0000', 5);

      expect(mockContext.rect).not.toHaveBeenCalled();
    });
  });

  describe('Context Settings', () => {
    it('should set lineCap and lineJoin to round', () => {
      shapeTool.setShape('line');
      shapeTool.startDrawing(0, 0);
      shapeTool.finishDrawing(100, 100, '#000000', 1);

      expect(mockContext.lineCap).toBe('round');
      expect(mockContext.lineJoin).toBe('round');
    });

    it('should use source-over composite operation', () => {
      shapeTool.setShape('circle');
      shapeTool.startDrawing(100, 100);
      shapeTool.finishDrawing(200, 200, '#ff0000', 5);

      expect(mockContext.globalCompositeOperation).toBe('source-over');
    });
  });
});
