import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EraserTool } from './EraserTool';

describe('EraserTool', () => {
  let eraser: EraserTool;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    eraser = new EraserTool();
    mockCtx = {
      globalCompositeOperation: 'source-over',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it('should have correct name and type', () => {
    expect(eraser.name).toBe('Silgi');
    expect(eraser.type).toBe('eraser');
  });

  it('should set and get size', () => {
    eraser.setSize(25);
    expect(eraser.getSize()).toBe(25);
  });

  it('should set and get background color', () => {
    eraser.setBackgroundColor('#f0f0f0');
    expect(eraser.getBackgroundColor()).toBe('#f0f0f0');
  });

  it('should have default white background color', () => {
    expect(eraser.getBackgroundColor()).toBe('#ffffff');
  });

  it('should use destination-out composite operation on pointer down', () => {
    eraser.setSize(20);
    eraser.onPointerDown(mockCtx, 100, 200);

    expect(mockCtx.globalCompositeOperation).toBe('destination-out');
    expect(mockCtx.lineWidth).toBe(20);
    expect(mockCtx.lineCap).toBe('round');
    expect(mockCtx.lineJoin).toBe('round');
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 200);
  });

  it('should erase on pointer move', () => {
    eraser.onPointerDown(mockCtx, 0, 0);
    eraser.onPointerMove(mockCtx, 50, 50);

    expect(mockCtx.globalCompositeOperation).toBe('destination-out');
    expect(mockCtx.lineTo).toHaveBeenCalledWith(50, 50);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should not erase on pointer move if not started', () => {
    eraser.onPointerMove(mockCtx, 50, 50);
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
  });

  it('should reset composite operation on pointer up', () => {
    eraser.onPointerDown(mockCtx, 0, 0);
    eraser.onPointerUp(mockCtx, 100, 100);

    expect(mockCtx.closePath).toHaveBeenCalled();
    expect(mockCtx.globalCompositeOperation).toBe('source-over');
  });

  it('should draw initial erase dot on pointer down', () => {
    eraser.setSize(10);
    eraser.onPointerDown(mockCtx, 50, 50);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 5, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });
});
