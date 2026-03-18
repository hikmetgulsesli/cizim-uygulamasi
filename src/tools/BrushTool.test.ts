import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrushTool } from './BrushTool';

describe('BrushTool', () => {
  let brush: BrushTool;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    brush = new BrushTool();
    mockCtx = {
      globalCompositeOperation: 'source-over',
      strokeStyle: '',
      fillStyle: '',
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
    expect(brush.name).toBe('Fırça');
    expect(brush.type).toBe('brush');
  });

  it('should set and get size', () => {
    brush.setSize(20);
    expect(brush.getSize()).toBe(20);
  });

  it('should set and get color', () => {
    brush.setColor('#2563eb');
    expect(brush.getColor()).toBe('#2563eb');
  });

  it('should configure context on pointer down', () => {
    brush.setColor('#ff0000');
    brush.setSize(15);
    brush.onPointerDown(mockCtx, 100, 200);

    expect(mockCtx.globalCompositeOperation).toBe('source-over');
    expect(mockCtx.strokeStyle).toBe('#ff0000');
    expect(mockCtx.lineWidth).toBe(15);
    expect(mockCtx.lineCap).toBe('round');
    expect(mockCtx.lineJoin).toBe('round');
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 200);
  });

  it('should draw initial dot on pointer down', () => {
    brush.setSize(10);
    brush.onPointerDown(mockCtx, 50, 50);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 5, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should draw lines on pointer move', () => {
    brush.onPointerDown(mockCtx, 0, 0);
    brush.onPointerMove(mockCtx, 50, 50);

    expect(mockCtx.lineTo).toHaveBeenCalledWith(50, 50);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should not draw on pointer move if not started', () => {
    brush.onPointerMove(mockCtx, 50, 50);
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
  });

  it('should close path on pointer up', () => {
    brush.onPointerDown(mockCtx, 0, 0);
    brush.onPointerUp(mockCtx, 100, 100);

    expect(mockCtx.closePath).toHaveBeenCalled();
  });
});
