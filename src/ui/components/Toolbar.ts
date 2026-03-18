import { ToolType } from '../../tools/ToolManager';

export interface ToolbarProps {
  activeTool: ToolType;
  activeColor: string;
  brushSize: number;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string, name: string) => void;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export interface ToolOption {
  type: ToolType;
  icon: string;
  label: string;
}

export interface ColorOption {
  name: string;
  value: string;
  className: string;
}

const TOOL_BASE_CLASSES = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left min-h-[44px]';
const TOOL_ACTIVE_CLASSES = 'bg-primary/10 text-primary';
const TOOL_INACTIVE_CLASSES = 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800';

export const TOOLS: ToolOption[] = [
  { type: 'brush', icon: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>', label: 'Fırça' },
  { type: 'eraser', icon: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>', label: 'Silgi' },
  { type: 'rectangle', icon: '<rect width="18" height="18" x="3" y="3" rx="2"/>', label: 'Dikdörtgen' },
  { type: 'circle', icon: '<circle cx="12" cy="12" r="10"/>', label: 'Daire' },
  { type: 'line', icon: '<path d="M5 12h14"/>', label: 'Çizgi' },
];

export const COLORS: ColorOption[] = [
  { name: 'Kırmızı', value: '#dc2626', className: 'bg-red-600' },
  { name: 'Mavi', value: '#2563eb', className: 'bg-blue-600' },
  { name: 'Yeşil', value: '#16a34a', className: 'bg-green-600' },
  { name: 'Sarı', value: '#facc15', className: 'bg-yellow-400' },
  { name: 'Turuncu', value: '#f97316', className: 'bg-orange-500' },
  { name: 'Mor', value: '#9333ea', className: 'bg-purple-600' },
  { name: 'Pembe', value: '#f472b6', className: 'bg-pink-400' },
  { name: 'Kahverengi', value: '#92400e', className: 'bg-amber-800' },
  { name: 'Siyah', value: '#0f172a', className: 'bg-slate-900' },
  { name: 'Beyaz', value: '#ffffff', className: 'bg-white' },
  { name: 'Gri', value: '#94a3b8', className: 'bg-slate-400' },
  { name: 'Turkuaz', value: '#22d3ee', className: 'bg-cyan-400' },
];

export class Toolbar {
  private props: ToolbarProps;
  private container: HTMLElement | null = null;
  private customColorInput: HTMLInputElement | null = null;

  constructor(props: ToolbarProps) {
    this.props = props;
  }

  render(): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = 'flex flex-col h-full';

    // Araçlar section
    const toolsSection = this.createToolsSection();
    this.container.appendChild(toolsSection);

    // Renk Paleti section
    const colorSection = this.createColorSection();
    this.container.appendChild(colorSection);

    // Fırça Boyutu section
    const brushSizeSection = this.createBrushSizeSection();
    this.container.appendChild(brushSizeSection);

    return this.container;
  }

  private createToolsSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'mb-6';

    const title = document.createElement('h3');
    title.className = 'text-xs font-bold uppercase tracking-wider text-primary mb-4';
    title.textContent = 'Araçlar';
    section.appendChild(title);

    const toolsList = document.createElement('div');
    toolsList.className = 'flex flex-col gap-1';

    TOOLS.forEach((tool) => {
      const isActive = tool.type === this.props.activeTool;
      const toolItem = document.createElement('button');
      toolItem.className = `${TOOL_BASE_CLASSES} ${isActive ? TOOL_ACTIVE_CLASSES : TOOL_INACTIVE_CLASSES}`;
      toolItem.dataset.tool = tool.type;
      toolItem.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${tool.icon}</svg>
        <span class="text-sm font-medium">${tool.label}</span>
      `;
      toolItem.addEventListener('click', () => {
        this.props.onToolChange(tool.type);
        this.updateToolVisuals(tool.type);
      });
      toolsList.appendChild(toolItem);
    });

    section.appendChild(toolsList);
    return section;
  }

  private createColorSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'mt-auto';

    const title = document.createElement('h3');
    title.className = 'text-xs font-bold uppercase tracking-wider text-primary mb-4';
    title.textContent = 'Renk Paleti';
    section.appendChild(title);

    const colorGrid = document.createElement('div');
    colorGrid.className = 'grid grid-cols-4 gap-2 mb-3';

    COLORS.forEach((color) => {
      const isActive = color.value === this.props.activeColor;
      const colorBtn = document.createElement('button');
      colorBtn.className = `aspect-square rounded-full ${color.className} ${
        isActive 
          ? 'border-2 border-white shadow-sm ring-2 ring-primary scale-110' 
          : 'border-2 border-white shadow-sm hover:scale-110'
      } transition-transform min-w-[44px] min-h-[44px]`;
      colorBtn.dataset.color = color.value;
      colorBtn.title = color.name;
      colorBtn.addEventListener('click', () => {
        this.props.onColorChange(color.value, color.name);
        this.updateColorVisuals(color.value);
      });
      colorGrid.appendChild(colorBtn);
    });

    section.appendChild(colorGrid);

    // Custom color button
    const customColorBtn = document.createElement('button');
    customColorBtn.className = 'w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors min-h-[44px]';
    customColorBtn.innerHTML = `
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-4 4-3 3-1.4 1.4a2.1 2.1 0 1 1-3-3L9 13Z"/></svg>
        <span>Özel Renk</span>
      </div>
      <div class="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-purple-500 border border-white dark:border-slate-700" id="custom-color-preview"></div>
    `;
    customColorBtn.addEventListener('click', () => {
      this.customColorInput?.click();
    });
    section.appendChild(customColorBtn);

    // Hidden color input
    this.customColorInput = document.createElement('input');
    this.customColorInput.type = 'color';
    this.customColorInput.className = 'hidden';
    this.customColorInput.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      this.props.onColorChange(color, 'Özel Renk');
      this.updateColorVisuals(color);
      
      // Update custom color preview
      const customPreview = this.container?.querySelector('#custom-color-preview') as HTMLElement;
      if (customPreview) {
        customPreview.style.background = color;
      }
    });
    section.appendChild(this.customColorInput);

    return section;
  }

  private createBrushSizeSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'mt-6';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';

    const title = document.createElement('h3');
    title.className = 'text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400';
    title.textContent = 'Fırça Boyutu';

    const value = document.createElement('span');
    value.className = 'text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full';
    value.id = 'brush-size-display';
    value.textContent = `${this.props.brushSize}px`;

    header.appendChild(title);
    header.appendChild(value);
    section.appendChild(header);

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'relative flex items-center gap-4';
    sliderContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>
    `;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '50';
    slider.value = String(this.props.brushSize);
    slider.className = 'w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary';
    slider.addEventListener('input', (e) => {
      const size = parseInt((e.target as HTMLInputElement).value);
      this.props.onBrushSizeChange(size);
      
      const display = this.container?.querySelector('#brush-size-display');
      if (display) {
        display.textContent = `${size}px`;
      }
    });

    sliderContainer.appendChild(slider);
    
    const largeIcon = document.createElement('span');
    largeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>`;
    sliderContainer.appendChild(largeIcon);

    section.appendChild(sliderContainer);

    return section;
  }

  private updateToolVisuals(activeTool: ToolType): void {
    if (!this.container) return;

    this.container.querySelectorAll('[data-tool]').forEach((btn) => {
      const toolType = (btn as HTMLElement).dataset.tool as ToolType;
      if (toolType === activeTool) {
        btn.className = `${TOOL_BASE_CLASSES} ${TOOL_ACTIVE_CLASSES}`;
      } else {
        btn.className = `${TOOL_BASE_CLASSES} ${TOOL_INACTIVE_CLASSES}`;
      }
    });
  }

  private updateColorVisuals(activeColor: string): void {
    if (!this.container) return;

    this.container.querySelectorAll('[data-color]').forEach((btn) => {
      const colorValue = (btn as HTMLElement).dataset.color;
      const isActive = colorValue === activeColor;
      
      // Reset all classes to base state
      btn.className = `aspect-square rounded-full transition-transform min-w-[44px] min-h-[44px]`;
      
      // Get the color class from original COLORS
      const colorOption = COLORS.find(c => c.value === colorValue);
      if (colorOption) {
        btn.classList.add(colorOption.className);
      }
      btn.classList.add('border-2', 'border-white', 'shadow-sm');
      
      if (isActive) {
        btn.classList.add('ring-2', 'ring-primary', 'scale-110');
      } else {
        btn.classList.add('hover:scale-110');
      }
    });
  }

  updateProps(newProps: Partial<ToolbarProps>): void {
    this.props = { ...this.props, ...newProps };
    
    if (newProps.activeTool) {
      this.updateToolVisuals(newProps.activeTool);
    }
    if (newProps.activeColor) {
      this.updateColorVisuals(newProps.activeColor);
    }
    if (newProps.brushSize !== undefined) {
      const slider = this.container?.querySelector('input[type="range"]') as HTMLInputElement;
      const display = this.container?.querySelector('#brush-size-display');
      if (slider) slider.value = String(newProps.brushSize);
      if (display) display.textContent = `${newProps.brushSize}px`;
    }
  }
}
