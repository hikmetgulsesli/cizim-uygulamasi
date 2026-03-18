import { Tool } from './Tool';
import { BrushTool } from './BrushTool';
import { EraserTool } from './EraserTool';

export type ToolType = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';

export class ToolManager {
  private currentTool: ToolType = 'brush';
  private color: string = '#dc2626';
  private brushSize: number = 12;
  private tools: Map<ToolType, Tool> = new Map();
  private listeners: Set<(tool: ToolType) => void> = new Set();

  constructor() {
    // Initialize tools
    const brush = new BrushTool();
    const eraser = new EraserTool();

    this.tools.set('brush', brush);
    this.tools.set('eraser', eraser);

    // Set initial values
    this.updateToolSizes();
    this.updateToolColors();
  }

  setTool(tool: ToolType): void {
    this.currentTool = tool;
    this.notifyListeners();
  }

  getCurrentTool(): ToolType {
    return this.currentTool;
  }

  getToolInstance(tool: ToolType): Tool | undefined {
    return this.tools.get(tool);
  }

  getCurrentToolInstance(): Tool | undefined {
    return this.tools.get(this.currentTool);
  }

  setColor(color: string): void {
    this.color = color;
    this.updateToolColors();
  }

  getColor(): string {
    return this.color;
  }

  setBrushSize(size: number): void {
    this.brushSize = size;
    this.updateToolSizes();
  }

  getBrushSize(): number {
    return this.brushSize;
  }

  private updateToolSizes(): void {
    this.tools.forEach(tool => {
      tool.setSize(this.brushSize);
    });
  }

  private updateToolColors(): void {
    this.tools.forEach(tool => {
      tool.setColor(this.color);
    });
  }

  onToolChange(listener: (tool: ToolType) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.currentTool);
    });
  }
}
