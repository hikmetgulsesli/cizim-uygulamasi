export class HistoryManager {
  private canvas: HTMLCanvasElement;
  private history: ImageData[] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  saveState(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Remove any redo states
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Save current state
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(imageData);

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): boolean {
    if (this.currentIndex <= 0) return false;

    this.currentIndex--;
    this.restoreState();
    return true;
  }

  redo(): boolean {
    if (this.currentIndex >= this.history.length - 1) return false;

    this.currentIndex++;
    this.restoreState();
    return true;
  }

  private restoreState(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx || this.currentIndex < 0 || this.currentIndex >= this.history.length) return;

    ctx.putImageData(this.history[this.currentIndex], 0, 0);
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}
