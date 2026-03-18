import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolManager } from './ToolManager';
import { BrushTool } from './BrushTool';
import { EraserTool } from './EraserTool';

describe('ToolManager', () => {
  let toolManager: ToolManager;

  beforeEach(() => {
    toolManager = new ToolManager();
  });

  describe('Tool Selection', () => {
    it('should default to brush tool', () => {
      expect(toolManager.getCurrentTool()).toBe('brush');
    });

    it('should switch to eraser tool', () => {
      toolManager.setTool('eraser');
      expect(toolManager.getCurrentTool()).toBe('eraser');
    });

    it('should switch back to brush tool', () => {
      toolManager.setTool('eraser');
      expect(toolManager.getCurrentTool()).toBe('eraser');

      toolManager.setTool('brush');
      expect(toolManager.getCurrentTool()).toBe('brush');
    });

    it('should notify listeners when tool changes', () => {
      const listener = vi.fn();
      const unsubscribe = toolManager.onToolChange(listener);

      toolManager.setTool('eraser');
      expect(listener).toHaveBeenCalledWith('eraser');

      toolManager.setTool('brush');
      expect(listener).toHaveBeenCalledWith('brush');

      unsubscribe();
    });

    it('should not notify after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = toolManager.onToolChange(listener);

      unsubscribe();
      toolManager.setTool('eraser');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Brush Size', () => {
    it('should have default brush size of 12', () => {
      expect(toolManager.getBrushSize()).toBe(12);
    });

    it('should update brush size', () => {
      toolManager.setBrushSize(25);
      expect(toolManager.getBrushSize()).toBe(25);
    });

    it('should update brush size to minimum 1', () => {
      toolManager.setBrushSize(1);
      expect(toolManager.getBrushSize()).toBe(1);
    });

    it('should update brush size to maximum 50', () => {
      toolManager.setBrushSize(50);
      expect(toolManager.getBrushSize()).toBe(50);
    });

    it('should propagate brush size to tool instances', () => {
      toolManager.setBrushSize(20);
      const brush = toolManager.getToolInstance('brush') as BrushTool;
      expect(brush.getSize()).toBe(20);

      const eraser = toolManager.getToolInstance('eraser') as EraserTool;
      expect(eraser.getSize()).toBe(20);
    });
  });

  describe('Color Management', () => {
    it('should have default color', () => {
      expect(toolManager.getColor()).toBe('#dc2626');
    });

    it('should update color', () => {
      toolManager.setColor('#2563eb');
      expect(toolManager.getColor()).toBe('#2563eb');
    });

    it('should propagate color to tool instances', () => {
      toolManager.setColor('#16a34a');
      const brush = toolManager.getToolInstance('brush') as BrushTool;
      expect(brush.getColor()).toBe('#16a34a');
    });
  });

  describe('Tool Instances', () => {
    it('should return brush tool instance', () => {
      const brush = toolManager.getToolInstance('brush');
      expect(brush).toBeInstanceOf(BrushTool);
    });

    it('should return eraser tool instance', () => {
      const eraser = toolManager.getToolInstance('eraser');
      expect(eraser).toBeInstanceOf(EraserTool);
    });

    it('should return current tool instance', () => {
      const tool = toolManager.getCurrentToolInstance();
      expect(tool).toBeInstanceOf(BrushTool);
    });

    it('should return correct tool instance after switching', () => {
      toolManager.setTool('eraser');
      const tool = toolManager.getCurrentToolInstance();
      expect(tool).toBeInstanceOf(EraserTool);
    });
  });
});
