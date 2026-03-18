export type ToolType = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';

export class ToolManager {
  private currentTool: ToolType = 'brush';
  private color: string = '#dc2626';
  private brushSize: number = 12;

  setTool(tool: ToolType): void {
    this.currentTool = tool;
  }

  getCurrentTool(): ToolType {
    return this.currentTool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getColor(): string {
    return this.color;
  }

  setBrushSize(size: number): void {
    this.brushSize = size;
  }

  getBrushSize(): number {
    return this.brushSize;
  }
}
