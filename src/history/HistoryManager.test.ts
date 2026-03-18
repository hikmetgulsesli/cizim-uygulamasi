import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistoryManager } from './HistoryManager';

describe('HistoryManager', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let imageDataCounter = 0;

  beforeEach(() => {
    imageDataCounter = 0;
    
    // Create mock ImageData
    const createMockImageData = (width: number, height: number): ImageData => {
      const data = new Uint8ClampedArray(width * height * 4);
      // Fill with unique identifier for each ImageData
      for (let i = 0; i < data.length; i += 4) {
        data[i] = imageDataCounter;     // R
        data[i + 1] = imageDataCounter; // G
        data[i + 2] = imageDataCounter; // B
        data[i + 3] = 255;              // A
      }
      imageDataCounter++;
      return { data, width, height } as ImageData;
    };

    // Create mock context
    let currentImageData = createMockImageData(100, 100);
    
    mockCtx = {
      getImageData: vi.fn().mockImplementation(() => {
        return createMockImageData(100, 100);
      }),
      putImageData: vi.fn().mockImplementation((imageData: ImageData) => {
        currentImageData = imageData;
      }),
      fillStyle: '',
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Create mock canvas
    mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockCtx),
      width: 100,
      height: 100,
    } as unknown as HTMLCanvasElement;
  });

  describe('Basic Operations', () => {
    it('should create history manager with default max history of 50', () => {
      const manager = new HistoryManager(mockCanvas);
      expect(manager.getMaxHistory()).toBe(50);
    });

    it('should save initial state', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      
      expect(manager.getHistorySize()).toBe(1);
      expect(manager.getCurrentIndex()).toBe(0);
      expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, 100, 100);
    });

    it('should save multiple states', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      manager.saveState();
      manager.saveState();

      expect(manager.getHistorySize()).toBe(3);
      expect(manager.getCurrentIndex()).toBe(2);
    });

    it('should undo to previous state', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      manager.saveState();

      expect(manager.canUndo()).toBe(true);
      
      const result = manager.undo();
      
      expect(result).toBe(true);
      expect(manager.getCurrentIndex()).toBe(0);
      expect(mockCtx.putImageData).toHaveBeenCalled();
    });

    it('should redo to next state', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      manager.saveState();

      // Undo first
      manager.undo();
      expect(manager.getCurrentIndex()).toBe(0);

      // Redo
      const result = manager.redo();
      
      expect(result).toBe(true);
      expect(manager.getCurrentIndex()).toBe(1);
      expect(mockCtx.putImageData).toHaveBeenCalled();
    });

    it('should return false when undo is not possible', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      
      expect(manager.canUndo()).toBe(false);
      
      const result = manager.undo();
      
      expect(result).toBe(false);
    });

    it('should return false when redo is not possible', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      
      expect(manager.canRedo()).toBe(false);
      
      const result = manager.redo();
      
      expect(result).toBe(false);
    });
  });

  describe('50+ Steps History', () => {
    it('should support at least 50 undo steps', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Create 55 states
      for (let i = 0; i < 55; i++) {
        manager.saveState();
      }

      // Should have 50 states (max history limit)
      expect(manager.getHistorySize()).toBe(50);
      expect(manager.getMaxHistory()).toBe(50);
    });

    it('should allow undoing 50 times', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Create 51 states (initial + 50 more)
      for (let i = 0; i < 50; i++) {
        manager.saveState();
      }

      let undoCount = 0;
      while (manager.canUndo()) {
        manager.undo();
        undoCount++;
      }

      // We started at index 49 (50 states), can undo to index 0
      expect(undoCount).toBeGreaterThanOrEqual(49);
    });

    it('should allow redoing after 50 undos', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Create 51 states
      for (let i = 0; i < 50; i++) {
        manager.saveState();
      }

      // Undo all the way to beginning
      while (manager.canUndo()) {
        manager.undo();
      }

      // Redo all the way back
      let redoCount = 0;
      while (manager.canRedo()) {
        manager.redo();
        redoCount++;
      }

      expect(redoCount).toBeGreaterThanOrEqual(49);
    });

    it('should respect custom max history limit', () => {
      const customManager = new HistoryManager(mockCanvas, 100);
      expect(customManager.getMaxHistory()).toBe(100);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset history on canvas clear', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Add multiple states
      for (let i = 0; i < 10; i++) {
        manager.saveState();
      }

      expect(manager.getHistorySize()).toBe(10);

      // Reset
      manager.reset();

      expect(manager.getHistorySize()).toBe(1);
      expect(manager.getCurrentIndex()).toBe(0);
      expect(manager.canUndo()).toBe(false);
      expect(manager.canRedo()).toBe(false);
    });

    it('should save cleared state after reset', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Add some states
      for (let i = 0; i < 5; i++) {
        manager.saveState();
      }

      // Reset
      manager.reset();

      // Should have 1 state (the cleared canvas)
      expect(manager.getHistorySize()).toBe(1);
      expect(manager.getCurrentIndex()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should invalidate future history when saving after undo', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Create 3 states (index 0, 1, 2)
      manager.saveState(); // state 0
      manager.saveState(); // state 1
      manager.saveState(); // state 2

      expect(manager.getCurrentIndex()).toBe(2);
      
      // Undo twice to go back to state 0
      manager.undo(); // back to index 1
      manager.undo(); // back to index 0

      expect(manager.getCurrentIndex()).toBe(0);

      // Now draw something new (this should invalidate states 1 and 2)
      manager.saveState(); // new state 1

      // History should now have 2 states (initial 0, new state 1)
      expect(manager.getHistorySize()).toBe(2);
      expect(manager.getCurrentIndex()).toBe(1);
      expect(manager.canRedo()).toBe(false);
    });

    it('should handle rapid save operations', () => {
      const manager = new HistoryManager(mockCanvas);
      
      // Simulate rapid drawing
      for (let i = 0; i < 100; i++) {
        manager.saveState();
      }

      // Should not exceed max history
      expect(manager.getHistorySize()).toBeLessThanOrEqual(50);
    });

    it('should handle getContext returning null gracefully', () => {
      const nullCanvas = {
        getContext: vi.fn().mockReturnValue(null),
        width: 100,
        height: 100,
      } as unknown as HTMLCanvasElement;

      const manager = new HistoryManager(nullCanvas);
      
      // Should not throw
      expect(() => manager.saveState()).not.toThrow();
      expect(() => manager.undo()).not.toThrow();
      expect(() => manager.redo()).not.toThrow();
      expect(() => manager.reset()).not.toThrow();
    });
  });

  describe('canUndo and canRedo', () => {
    it('should return correct canUndo state', () => {
      const manager = new HistoryManager(mockCanvas);
      
      expect(manager.canUndo()).toBe(false);
      
      manager.saveState();
      expect(manager.canUndo()).toBe(false);
      
      manager.saveState();
      expect(manager.canUndo()).toBe(true);
      
      manager.undo();
      expect(manager.canUndo()).toBe(false);
    });

    it('should return correct canRedo state', () => {
      const manager = new HistoryManager(mockCanvas);
      
      expect(manager.canRedo()).toBe(false);
      
      manager.saveState();
      manager.saveState();
      expect(manager.canRedo()).toBe(false);
      
      manager.undo();
      expect(manager.canRedo()).toBe(true);
      
      manager.redo();
      expect(manager.canRedo()).toBe(false);
    });
  });

  describe('Keyboard Shortcuts Integration', () => {
    it('should be callable from event handlers', () => {
      const manager = new HistoryManager(mockCanvas);
      manager.saveState();
      manager.saveState();

      // Simulate Ctrl+Z
      const undoResult = manager.undo();
      expect(undoResult).toBe(true);

      // Simulate Ctrl+Shift+Z or Ctrl+Y
      const redoResult = manager.redo();
      expect(redoResult).toBe(true);
    });
  });
});
