import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Canvas } from './Canvas';

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
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 100,
    height: 100,
  })),
  putImageData: vi.fn(),
});

describe('Canvas', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    mockContext = createMockContext();
    
    mockCanvas = {
      width: 0,
      height: 0,
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct dimensions', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });

      const size = canvas.getSize();
      expect(size.width).toBe(800);
      expect(size.height).toBe(600);
      
      canvas.dispose();
    });

    it('should set canvas display size via CSS', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });

      expect(mockCanvas.style.width).toBe('800px');
      expect(mockCanvas.style.height).toBe('600px');
      
      canvas.dispose();
    });

    it('should configure drawing context', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        lineCap: 'round',
        lineJoin: 'round',
        enableHighDPI: false,
      });

      expect(mockContext.lineCap).toBe('round');
      expect(mockContext.lineJoin).toBe('round');
      
      canvas.dispose();
    });

    it('should clear canvas with background color on init', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 100,
        height: 100,
        backgroundColor: '#ffffff',
        enableHighDPI: false,
      });

      expect(mockContext.fillStyle).toBe('#ffffff');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
      
      canvas.dispose();
    });
  });

  describe('Pointer Events', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('should handle pointerdown events', () => {
      const handler = vi.fn();
      canvas.on('pointerdown', handler);

      // Get the registered handler and call it
      const pointerDownHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerdown')?.[1] as Function;
      
      expect(pointerDownHandler).toBeDefined();

      const mockEvent = {
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent;

      pointerDownHandler(mockEvent);

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].x).toBeDefined();
      expect(handler.mock.calls[0][0].y).toBeDefined();
      expect(handler.mock.calls[0][0].type).toBe('pointerdown');
    });

    it('should handle pointerup events', () => {
      const handler = vi.fn();
      canvas.on('pointerup', handler);

      const pointerUpHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerup')?.[1] as Function;

      expect(pointerUpHandler).toBeDefined();

      // First trigger pointerdown
      const pointerDownHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerdown')?.[1] as Function;
      
      pointerDownHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      // Then trigger pointerup
      pointerUpHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(handler).toHaveBeenCalled();
    });

    it('should track drawing state correctly', () => {
      const pointerDownHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerdown')?.[1] as Function;
      const pointerUpHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerup')?.[1] as Function;

      expect(canvas.isCurrentlyDrawing()).toBe(false);

      pointerDownHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(canvas.isCurrentlyDrawing()).toBe(true);

      pointerUpHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(canvas.isCurrentlyDrawing()).toBe(false);
    });
  });

  describe('Responsive Canvas', () => {
    it('should update size when setSize is called', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });

      canvas.setSize(1024, 768);

      const size = canvas.getSize();
      expect(size.width).toBe(1024);
      expect(size.height).toBe(768);
      
      canvas.dispose();
    });

    it('should update canvas dimensions with DPR scaling', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: true,
      });

      // With DPR=1 (mocked), internal size should match logical size
      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(600);
      
      canvas.dispose();
    });
  });

  describe('Drawing Operations', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('should clear canvas with color', () => {
      canvas.clear('#ff0000');

      expect(mockContext.fillStyle).toBe('#ff0000');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should get and put image data', () => {
      const imageData = canvas.getImageData();
      expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 800, 600);
      expect(imageData).toBeDefined();

      canvas.putImageData(imageData);
      expect(mockContext.putImageData).toHaveBeenCalledWith(imageData, 0, 0);
    });

    it('should export to data URL', () => {
      const dataUrl = canvas.toDataURL('image/png');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', undefined);
      expect(dataUrl).toBe('data:image/png;base64,test');
    });
  });

  describe('Event Subscription', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('should allow unsubscribing from events', () => {
      const handler = vi.fn();
      const unsubscribe = canvas.on('pointerdown', handler);

      const pointerDownHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerdown')?.[1] as Function;

      pointerDownHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      pointerDownHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(handler).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should support multiple event handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      canvas.on('pointerdown', handler1);
      canvas.on('pointerdown', handler2);

      const pointerDownHandler = (mockCanvas.addEventListener as ReturnType<typeof vi.fn>).mock.calls
        .find((call: unknown[]) => call[0] === 'pointerdown')?.[1] as Function;

      pointerDownHandler({
        clientX: 100,
        clientY: 100,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        pressure: 0.5,
        buttons: 1,
        preventDefault: vi.fn(),
      } as unknown as PointerEvent);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Canvas Export', () => {
    it('should expose underlying elements', () => {
      const canvas = new Canvas(mockCanvas, {
        width: 800,
        height: 600,
        enableHighDPI: false,
      });

      expect(canvas.getElement()).toBe(mockCanvas);
      expect(canvas.getContext()).toBe(mockContext);
      
      canvas.dispose();
    });
  });
});
