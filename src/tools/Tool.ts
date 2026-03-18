// CanvasRenderingContext2D is a built-in browser type

export interface Tool {
  readonly name: string;
  readonly type: string;
  onPointerDown(ctx: CanvasRenderingContext2D, x: number, y: number): void;
  onPointerMove(ctx: CanvasRenderingContext2D, x: number, y: number): void;
  onPointerUp(ctx: CanvasRenderingContext2D, x: number, y: number): void;
  setSize(size: number): void;
  setColor(color: string): void;
}

export abstract class BaseTool implements Tool {
  protected size: number = 12;
  protected color: string = '#dc2626';
  protected isDrawing: boolean = false;

  abstract readonly name: string;
  abstract readonly type: string;

  setSize(size: number): void {
    this.size = size;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getSize(): number {
    return this.size;
  }

  getColor(): string {
    return this.color;
  }

  abstract onPointerDown(ctx: CanvasRenderingContext2D, x: number, y: number): void;
  abstract onPointerMove(ctx: CanvasRenderingContext2D, x: number, y: number): void;
  abstract onPointerUp(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}
