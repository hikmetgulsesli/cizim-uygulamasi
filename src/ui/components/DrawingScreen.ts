import { CanvasManager } from '../../canvas/CanvasManager';
import { ToolManager, ToolType } from '../../tools/ToolManager';
import { HistoryManager } from '../../history/HistoryManager';
import { ColorPicker } from './ColorPicker';

export class DrawingScreen {
  private canvasManager: CanvasManager | null = null;
  private toolManager: ToolManager | null = null;
  private historyManager: HistoryManager | null = null;
  private colorPicker: ColorPicker | null = null;
  private currentColor: string = '#dc2626';
  private currentBrushSize: number = 12;
  private onError: () => void;

  constructor(onError: () => void = () => {}) {
    this.onError = onError;
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex flex-col h-screen';

    // Header
    const header = this.createHeader();
    container.appendChild(header);

    // Main content area
    const content = document.createElement('div');
    content.className = 'flex flex-1 overflow-hidden';

    // Left toolbar
    const toolbar = this.createToolbar();
    content.appendChild(toolbar);

    // Main canvas area
    const canvasArea = this.createCanvasArea();
    content.appendChild(canvasArea);

    // Right sidebar
    const sidebar = this.createSidebar();
    content.appendChild(sidebar);

    container.appendChild(content);

    // Footer
    const footer = this.createFooter();
    container.appendChild(footer);

    // Initialize canvas after DOM is ready
    setTimeout(() => {
      this.initializeCanvas();
    }, 0);

    return container;
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
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors" title="Geri Al" id="undo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors" title="İleri Al" id="redo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </button>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium" id="clear-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          <span>Temizle</span>
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold" id="download-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>İndir</span>
        </button>
        <div class="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>
        <button class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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

  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('aside');
    toolbar.className = 'w-20 bg-white dark:bg-background-dark border-r border-primary/10 flex flex-col items-center py-6 gap-6 shrink-0';

    const tools: { type: ToolType; icon: string; label: string }[] = [
      { type: 'brush', icon: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>', label: 'Fırça' },
      { type: 'eraser', icon: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>', label: 'Silgi' },
      { type: 'rectangle', icon: '<rect width="18" height="18" x="3" y="3" rx="2"/>', label: 'Dikdörtgen' },
      { type: 'circle', icon: '<circle cx="12" cy="12" r="10"/>', label: 'Daire' },
      { type: 'line', icon: '<path d="M5 12h14"/>', label: 'Çizgi' },
    ];

    tools.forEach((tool, index) => {
      const isActive = index === 0;
      const btn = document.createElement('div');
      btn.className = 'group relative';
      btn.innerHTML = `
        <button class="p-3 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'} rounded-xl flex items-center justify-center transition-all tool-btn" data-tool="${tool.type}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${tool.icon}</svg>
        </button>
        <span class="tooltip">${tool.label}</span>
      `;
      toolbar.appendChild(btn);
    });

    // Event delegation for tool buttons
    setTimeout(() => {
      toolbar.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tool = (e.currentTarget as HTMLElement).dataset.tool as ToolType;
          this.setTool(tool);
          
          // Update visual state
          toolbar.querySelectorAll('.tool-btn').forEach(b => {
            b.className = 'p-3 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center transition-all tool-btn';
          });
          (e.currentTarget as HTMLElement).className = 'p-3 bg-primary text-white shadow-lg shadow-primary/20 rounded-xl flex items-center justify-center transition-all tool-btn';
        });
      });
    }, 0);

    return toolbar;
  }

  private createCanvasArea(): HTMLElement {
    const main = document.createElement('main');
    main.className = 'flex-1 bg-background-light dark:bg-background-dark p-6 relative overflow-hidden';
    main.innerHTML = `
      <div class="w-full h-full bg-white dark:bg-white/5 rounded-2xl shadow-inner border border-primary/5 flex items-center justify-center relative overflow-hidden" id="canvas-wrapper">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
        <canvas id="drawing-canvas" class="absolute inset-0 w-full h-full cursor-crosshair"></canvas>
      </div>
    `;
    return main;
  }

  private createSidebar(): HTMLElement {
    const sidebar = document.createElement('aside');
    sidebar.className = 'w-72 bg-white dark:bg-background-dark border-l border-primary/10 flex flex-col p-6 gap-8 shrink-0';

    // Color picker component
    this.colorPicker = new ColorPicker(this.currentColor, (color, name) => {
      this.setColor(color, name);
    });
    const colorPickerElement = this.colorPicker.render();
    sidebar.appendChild(colorPickerElement);

    // Brush size
    const brushSizeSection = document.createElement('div');
    brushSizeSection.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fırça Boyutu</h3>
        <span class="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full" id="brush-size-display">${this.currentBrushSize}px</span>
      </div>
      <div class="relative flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>
        <input type="range" min="1" max="50" value="${this.currentBrushSize}" class="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" id="brush-size-slider">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    `;

    // Layers section
    const layersSection = document.createElement('div');
    layersSection.className = 'mt-auto';
    layersSection.innerHTML = `
      <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Katmanlar</h3>
      <div class="flex items-center gap-3 p-3 bg-primary text-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        <span class="text-sm font-semibold flex-1">Katman 1</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
    `;

    sidebar.appendChild(brushSizeSection);
    sidebar.appendChild(layersSection);

    // Event listeners
    setTimeout(() => {
      // Brush size
      const slider = sidebar.querySelector('#brush-size-slider') as HTMLInputElement;
      const display = sidebar.querySelector('#brush-size-display');
      slider?.addEventListener('input', (e) => {
        const size = parseInt((e.target as HTMLInputElement).value);
        this.setBrushSize(size);
        if (display) display.textContent = `${size}px`;
      });
    }, 0);

    return sidebar;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'h-8 bg-slate-50 dark:bg-background-dark border-t border-primary/10 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium';
    footer.innerHTML = `
      <div class="flex gap-4">
        <span>Tuval: 1920x1080</span>
        <span>Zoom: %100</span>
      </div>
      <div class="flex gap-4">
        <span>Konum: <span id="cursor-position">245, 612</span></span>
        <span class="text-primary">Hazır</span>
      </div>
    `;
    return footer;
  }

  private initializeCanvas(): void {
    try {
      const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get 2D context');
      }

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

      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
    } catch (error) {
      console.error('Canvas initialization error:', error);
      this.onError();
    }
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl+Z: Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.handleUndo();
      }
      // Ctrl+Shift+Z or Ctrl+Y: Redo
      else if ((e.ctrlKey && e.key === 'z' && e.shiftKey) || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        this.handleRedo();
      }
    });
  }

  private setTool(tool: ToolType): void {
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
