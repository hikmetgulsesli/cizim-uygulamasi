export interface ColorOption {
  name: string;
  value: string;
}

export const PREDEFINED_COLORS: ColorOption[] = [
  { name: 'Kırmızı', value: '#dc2626' },
  { name: 'Mavi', value: '#2563eb' },
  { name: 'Yeşil', value: '#16a34a' },
  { name: 'Sarı', value: '#facc15' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Mor', value: '#9333ea' },
  { name: 'Pembe', value: '#f472b6' },
  { name: 'Kahverengi', value: '#92400e' },
  { name: 'Siyah', value: '#0f172a' },
  { name: 'Beyaz', value: '#ffffff' },
  { name: 'Gri', value: '#94a3b8' },
  { name: 'Turkuaz', value: '#22d3ee' },
];

export type ColorChangeHandler = (color: string, name: string) => void;

export class ColorPicker {
  private container: HTMLElement | null = null;
  private currentColor: string;
  private onColorChange: ColorChangeHandler;
  private colorGrid: HTMLElement | null = null;
  private activeColorPreview: HTMLElement | null = null;
  private activeColorName: HTMLElement | null = null;
  private customColorInput: HTMLInputElement | null = null;

  constructor(initialColor: string = '#dc2626', onColorChange: ColorChangeHandler) {
    this.currentColor = initialColor;
    this.onColorChange = onColorChange;
  }

  render(): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = 'color-picker';

    // Renk Paleti section
    const colorSection = this.createColorPaletteSection();
    this.container.appendChild(colorSection);

    // Active color indicator
    const activeColorSection = this.createActiveColorSection();
    this.container.appendChild(activeColorSection);

    return this.container;
  }

  private createColorPaletteSection(): HTMLElement {
    const section = document.createElement('div');
    section.innerHTML = `
      <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Renk Paleti</h3>
      <div class="grid grid-cols-4 gap-3 mb-4" id="color-grid"></div>
      <button class="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" id="custom-color-btn">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-4 4-3 3-1.4 1.4a2.1 2.1 0 1 1-3-3L9 13Z"/></svg>
          <span>Özel Renk</span>
        </div>
        <div class="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-purple-500 border border-white dark:border-slate-700" id="custom-color-preview"></div>
      </button>
      <input type="color" id="custom-color-input" style="position: absolute; visibility: hidden; pointer-events: none;" />
    `;

    // Render color grid
    this.colorGrid = section.querySelector('#color-grid') as HTMLElement;
    this.renderColorGrid();

    // Setup custom color button
    const customColorBtn = section.querySelector('#custom-color-btn') as HTMLButtonElement;
    this.customColorInput = section.querySelector('#custom-color-input') as HTMLInputElement;

    customColorBtn?.addEventListener('click', () => {
      this.customColorInput?.click();
    });

    this.customColorInput?.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      this.selectColor(color, 'Özel Renk');
    });

    return section;
  }

  private renderColorGrid(): void {
    if (!this.colorGrid) return;

    this.colorGrid.innerHTML = PREDEFINED_COLORS.map((color) => {
      const isActive = color.value === this.currentColor;
      return `
        <button 
          class="w-10 h-10 rounded-full ${isActive ? 'border-4 border-white dark:border-slate-800 ring-2 ring-primary' : 'border-2 border-transparent'} shadow-sm color-btn transition-all hover:scale-110" 
          style="background-color: ${color.value}"
          data-color="${color.value}"
          data-name="${color.name}"
          title="${color.name}"
        ></button>
      `;
    }).join('');

    // Add event listeners to color buttons
    this.colorGrid.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).dataset.color!;
        const name = (e.currentTarget as HTMLElement).dataset.name!;
        this.selectColor(color, name);
      });
    });
  }

  private createActiveColorSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'p-4 bg-primary/5 rounded-xl border border-primary/10 mt-6';

    const colorName = this.getColorName(this.currentColor);

    section.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg shadow-md active-color-preview" style="background-color: ${this.currentColor}"></div>
        <div>
          <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Aktif Renk</p>
          <p class="text-sm font-bold active-color-name">${colorName}</p>
        </div>
      </div>
    `;

    this.activeColorPreview = section.querySelector('.active-color-preview') as HTMLElement;
    this.activeColorName = section.querySelector('.active-color-name') as HTMLElement;

    return section;
  }

  private selectColor(color: string, name: string): void {
    this.currentColor = color;

    // Update UI
    this.updateColorGridVisuals();
    this.updateActiveColorPreview(color, name);

    // Update custom color preview
    const customPreview = this.container?.querySelector('#custom-color-preview') as HTMLElement;
    if (customPreview) {
      customPreview.style.background = color;
    }

    // Notify callback
    this.onColorChange(color, name);
  }

  private updateColorGridVisuals(): void {
    if (!this.colorGrid) return;

    this.colorGrid.querySelectorAll('.color-btn').forEach(btn => {
      const btnColor = (btn as HTMLElement).dataset.color;
      if (btnColor === this.currentColor) {
        btn.className = 'w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 ring-2 ring-primary shadow-sm color-btn transition-all hover:scale-110';
      } else {
        btn.className = 'w-10 h-10 rounded-full border-2 border-transparent shadow-sm color-btn transition-all hover:scale-110';
      }
    });
  }

  private updateActiveColorPreview(color: string, name: string): void {
    if (this.activeColorPreview) {
      this.activeColorPreview.style.backgroundColor = color;
    }
    if (this.activeColorName) {
      this.activeColorName.textContent = name;
    }
  }

  private getColorName(colorValue: string): string {
    const color = PREDEFINED_COLORS.find(c => c.value === colorValue);
    return color?.name || 'Özel Renk';
  }

  getCurrentColor(): string {
    return this.currentColor;
  }

  setColor(color: string, name?: string): void {
    this.selectColor(color, name || this.getColorName(color));
  }
}
