import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CanvasManager } from './CanvasManager';
import { ToolManager } from '../tools/ToolManager';
import { HistoryManager } from '../history/HistoryManager';

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
  putImageData: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 100,
    height: 100,
  })),
  scale: vi.fn(),
});

describe('CanvasManager', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: ReturnType<typeof createMockContext>;
  let toolManager: ToolManager;
  let historyManager: HistoryManager;
  let canvasManager: CanvasManager;

  beforeEach(() => {
    mockContext = createMockContext();

    mockCanvas = {
      width: 800,
      height: 600,
      style: {},
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
      toBlob: vi.fn((callback) => {
        const blob = new Blob(['test'], { type: 'image/png' });
        callback(blob);
      }),
      dispatchEvent: vi.fn(),
    } as unknown as HTMLCanvasElement;

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock document.createElement for download link
    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);

    toolManager = new ToolManager();
    historyManager = new HistoryManager(mockCanvas);
    canvasManager = new CanvasManager(mockCanvas, toolManager, historyManager);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('clear', () => {
    it('should fill canvas with white color', () => {
      canvasManager.clear();

      expect(mockContext.fillStyle).toBe('#ffffff');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should save state to history after clearing', () => {
      const saveStateSpy = vi.spyOn(historyManager, 'saveState');

      canvasManager.clear();

      expect(saveStateSpy).toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('should create blob from canvas', async () => {
      await canvasManager.download('test.png');

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    });

    it('should create object URL from blob', async () => {
      await canvasManager.download('test.png');

      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it('should create download link with correct filename', async () => {
      await canvasManager.download('cizim.png');

      const mockLink = document.createElement('a');
      expect(mockLink.download).toBe('cizim.png');
    });

    it('should click the download link', async () => {
      const mockClick = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        download: '',
        href: '',
        click: mockClick,
      } as unknown as HTMLAnchorElement);

      await canvasManager.download('cizim.png');

      expect(mockClick).toHaveBeenCalled();
    });

    it('should revoke object URL after download', async () => {
      vi.useFakeTimers();
      
      await canvasManager.download('cizim.png');

      // URL.revokeObjectURL is called after a timeout
      vi.advanceTimersByTime(1100);

      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      
      vi.useRealTimers();
    });

    it('should throw error if blob creation fails', async () => {
      mockCanvas.toBlob = vi.fn((callback) => callback(null));

      await expect(canvasManager.download('test.png')).rejects.toThrow('Failed to create blob from canvas');
    });
  });
});
