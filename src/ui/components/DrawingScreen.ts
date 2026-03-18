import { CanvasManager } from '../../canvas/CanvasManager';
import { ToolManager, ToolType } from '../../tools/ToolManager';
import { HistoryManager } from '../../history/HistoryManager';
import { Toolbar } from './Toolbar';

export class DrawingScreen {
  private canvasManager: CanvasManager | null = null;
  private toolManager: ToolManager | null = null;
  private historyManager: HistoryManager | null = null;
  private toolbar: Toolbar | null = null;
  private currentColor: string = '#dc2626';
  private currentBrushSize: number = 12;
  private currentTool: ToolType = 'brush';
  private container: HTMLElement | null = null;

  render(): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = 'flex flex-col h-screen';

    // Header
    const header = this.createHeader();
    this.container.appendChild(header);

    // Main content area
    const content = document.createElement('div');
    content.className = 'flex flex-1 overflow-hidden';

    // Left sidebar with Toolbar
    const sidebar = this.createSidebar();
    content.appendChild(sidebar);

    // Main canvas area
    const canvasArea = this.createCanvasArea();
    content.appendChild(canvasArea);

    this.container.appendChild(content);

    // Footer
    const footer = this.createFooter();
    this.container.appendChild(footer);

    // Initialize canvas after DOM is ready
    setTimeout(() => {
      this.initializeCanvas();
    }, 0);

    return this.container;
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    header.className = 'flex items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3 shrink-0';
    header.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Çizim Uygulaması</h1>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg mr-4">
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" title="Geri Al" id="undo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" title="İleri Al" id="redo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </button>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium min-h-[44px]" id="clear-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          <span>Temizle</span>
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold min-h-[44px]" id="download-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>İndir</span>
        </button>
        <div class="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>
        <button class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l-.15-.09a2 2 0 0 0-.73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    `;

    // Event listeners
    setTimeout(() => {
      header.querySelector('#undo-btn')?.addEventListener('click', () => this.handleUndo());
      header.querySelector('#redo-btn')?.addEventListener('click', () => this.handleRedo());
      header.querySelector('#clear-btn')?.addEventListener('click', () => this.handleClear());
      header.querySelector('#download-btn')?.addEventListener('click', () => this.handleDownload());
    }, 0);

    return header;
  }

  private createSidebar(): HTMLElement {
    const sidebar = document.createElement('aside');
    sidebar.className = 'w-64 lg:w-72 bg-white dark:bg-background-dark border-r border-primary/10 flex flex-col p-4 lg:p-6 gap-6 shrink-0 overflow-y-auto';

    // Create Toolbar component
    this.toolbar = new Toolbar({
      activeTool: this.currentTool,
      activeColor: this.currentColor,
      brushSize: this.currentBrushSize,
      onToolChange: (tool) => this.setTool(tool),
      onColorChange: (color, name) => this.setColor(color, name),
      onBrushSizeChange: (size) => this.setBrushSize(size),
      onUndo: () => this.handleUndo(),
      onRedo: () => this.handleRedo(),
      onClear: () => this.handleClear(),
      onDownload: () => this.handleDownload(),
    });

    const toolbarElement = this.toolbar.render();
    sidebar.appendChild(toolbarElement);

    return sidebar;
  }

  private createCanvasArea(): HTMLElement {
    const main = document.createElement('main');
    main.className = 'flex-1 bg-background-light dark:bg-background-dark p-4 lg:p-6 relative overflow-hidden';
    main.innerHTML = `
      <div class="w-full h-full bg-white dark:bg-white/5 rounded-2xl shadow-inner border border-primary/5 flex items-center justify-center relative overflow-hidden" id="canvas-wrapper">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
        <canvas id="drawing-canvas" class="absolute inset-0 w-full h-full cursor-crosshair"></canvas>
      </div>
    `;
    return main;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'h-8 bg-slate-50 dark:bg-background-dark border-t border-primary/10 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0';
    footer.innerHTML = `
      <div class="flex gap-4">
        <span>Tuval: 1920x1080</span>
        <span>Zoom: %100</span>
      </div>
      <div class="flex gap-4">
        <span>Konum: <span id="cursor-position">0, 0</span></span>
        <span class="text-primary">Hazır</span>
      </div>
    `;
    return footer;
  }

  private initializeCanvas(): void {
    const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    this.historyManager = new HistoryManager(canvas);
    this.toolManager = new ToolManager();
    this.canvasManager = new CanvasManager(canvas, this.toolManager, this.historyManager);

    // Set initial tool and color
    this.canvasManager.setTool('brush');
    this.canvasManager.setColor(this.currentColor);
    this.canvasManager.setBrushSize(this.currentBrushSize);

    // Track cursor position
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      const cursorPosition = document.getElementById('cursor-position');
      if (cursorPosition) {
        cursorPosition.textContent = `${x}, ${y}`;
      }
    });
  }

  private setTool(tool: ToolType): void {
    this.currentTool = tool;
    this.canvasManager?.setTool(tool);
  }

  private setColor(color: string, _name: string): void {
    this.currentColor = color;
    this.canvasManager?.setColor(color);
  }

  private setBrushSize(size: number): void {
    this.currentBrushSize = size;
    this.canvasManager?.setBrushSize(size);
  }

  private handleUndo(): void {
    this.historyManager?.undo();
  }

  private handleRedo(): void {
    this.historyManager?.redo();
  }

  private handleClear(): void {
    if (confirm('Tuvali temizlemek istediğinizden emin misiniz?')) {
      this.canvasManager?.clear();
    }
  }

  private handleDownload(): void {
    this.canvasManager?.download('cizim.png');
  }
}
