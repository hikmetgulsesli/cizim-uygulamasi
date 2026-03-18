export class HistoryManager {
  private canvas: HTMLCanvasElement;
  private history: ImageData[] = [];
  private currentIndex = -1;
  private readonly maxHistory: number;

  constructor(canvas: HTMLCanvasElement, maxHistory = 50) {
    this.canvas = canvas;
    this.maxHistory = maxHistory;
  }

  /**
   * Saves the current canvas state to history.
   * Removes any redo states (future history) when a new state is saved.
   */
  saveState(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Remove any redo states (future history is invalidated on new action)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Save current state
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(imageData);

    // Limit history size and adjust index accordingly
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      // Index stays the same since we removed from beginning
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Undoes the last action by restoring the previous state.
   * @returns true if undo was successful, false if at the beginning of history
   */
  undo(): boolean {
    if (this.currentIndex <= 0) return false;

    this.currentIndex--;
    this.restoreState();
    return true;
  }

  /**
   * Redoes the previously undone action by restoring the next state.
   * @returns true if redo was successful, false if at the end of history
   */
  redo(): boolean {
    if (this.currentIndex >= this.history.length - 1) return false;

    this.currentIndex++;
    this.restoreState();
    return true;
  }

  /**
   * Clears all history and resets to initial state.
   * Should be called when the canvas is cleared.
   */
  reset(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.history = [];
    this.currentIndex = -1;

    // Save the cleared state as the new initial state
    this.saveState();
  }

  /**
   * Restores the canvas to the state at the current index.
   */
  private restoreState(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx || this.currentIndex < 0 || this.currentIndex >= this.history.length) return;

    ctx.putImageData(this.history[this.currentIndex], 0, 0);
  }

  /**
   * Checks if undo is available.
   * @returns true if there are states to undo to
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Checks if redo is available.
   * @returns true if there are states to redo to
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Gets the current history size.
   * @returns number of saved states
   */
  getHistorySize(): number {
    return this.history.length;
  }

  /**
   * Gets the current position in history.
   * @returns current index (0-based)
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Gets the maximum allowed history size.
   * @returns max history limit
   */
  getMaxHistory(): number {
    return this.maxHistory;
  }
}
