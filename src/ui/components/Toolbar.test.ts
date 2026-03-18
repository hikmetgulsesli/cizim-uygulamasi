import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Toolbar, TOOLS, COLORS, type ToolbarProps } from './Toolbar';
import type { ToolType } from '../../tools/ToolManager';

describe('Toolbar', () => {
  let container: HTMLElement;
  let mockProps: ToolbarProps;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    mockProps = {
      activeTool: 'brush' as ToolType,
      activeColor: '#dc2626',
      brushSize: 12,
      onToolChange: vi.fn(),
      onColorChange: vi.fn(),
      onBrushSizeChange: vi.fn(),
      onUndo: vi.fn(),
      onRedo: vi.fn(),
      onClear: vi.fn(),
      onDownload: vi.fn(),
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('TOOLS constant', () => {
    it('should have exactly 5 tools', () => {
      expect(TOOLS.length).toBe(5);
    });

    it('should include all required tools', () => {
      const toolTypes = TOOLS.map(t => t.type);
      expect(toolTypes).toContain('brush');
      expect(toolTypes).toContain('eraser');
      expect(toolTypes).toContain('rectangle');
      expect(toolTypes).toContain('circle');
      expect(toolTypes).toContain('line');
    });

    it('should have Turkish labels for all tools', () => {
      expect(TOOLS.find(t => t.type === 'brush')?.label).toBe('Fırça');
      expect(TOOLS.find(t => t.type === 'eraser')?.label).toBe('Silgi');
      expect(TOOLS.find(t => t.type === 'rectangle')?.label).toBe('Dikdörtgen');
      expect(TOOLS.find(t => t.type === 'circle')?.label).toBe('Daire');
      expect(TOOLS.find(t => t.type === 'line')?.label).toBe('Çizgi');
    });
  });

  describe('COLORS constant', () => {
    it('should have exactly 12 colors', () => {
      expect(COLORS.length).toBe(12);
    });

    it('should include all required colors with Turkish names', () => {
      const colorNames = COLORS.map(c => c.name);
      expect(colorNames).toContain('Kırmızı');
      expect(colorNames).toContain('Mavi');
      expect(colorNames).toContain('Yeşil');
      expect(colorNames).toContain('Sarı');
      expect(colorNames).toContain('Turuncu');
      expect(colorNames).toContain('Mor');
      expect(colorNames).toContain('Pembe');
      expect(colorNames).toContain('Kahverengi');
      expect(colorNames).toContain('Siyah');
      expect(colorNames).toContain('Beyaz');
      expect(colorNames).toContain('Gri');
      expect(colorNames).toContain('Turkuaz');
    });
  });

  describe('Rendering', () => {
    it('should render toolbar with all tools', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const toolButtons = element.querySelectorAll('[data-tool]');
      expect(toolButtons.length).toBe(5);
    });

    it('should have "Araçlar" as tools section title', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const titles = element.querySelectorAll('h3');
      const toolsTitle = Array.from(titles).find(t => t.textContent === 'Araçlar');
      expect(toolsTitle).toBeDefined();
    });

    it('should render all 12 colors', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const colorButtons = element.querySelectorAll('[data-color]');
      expect(colorButtons.length).toBe(12);
    });

    it('should have "Renk Paleti" as color section title', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const titles = element.querySelectorAll('h3');
      const colorTitle = Array.from(titles).find(t => t.textContent === 'Renk Paleti');
      expect(colorTitle).toBeDefined();
    });

    it('should render custom color button', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const customColorBtn = Array.from(element.querySelectorAll('button')).find(
        b => b.textContent?.includes('Özel Renk')
      );
      expect(customColorBtn).toBeDefined();
    });

    it('should render brush size slider', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const slider = element.querySelector('input[type="range"]') as HTMLInputElement;
      expect(slider).not.toBeNull();
      expect(slider.min).toBe('1');
      expect(slider.max).toBe('50');
    });

    it('should have "Fırça Boyutu" as brush size section title', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const titles = element.querySelectorAll('h3');
      const brushSizeTitle = Array.from(titles).find(t => t.textContent === 'Fırça Boyutu');
      expect(brushSizeTitle).toBeDefined();
    });

    it('should display current brush size value', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const display = element.querySelector('#brush-size-display');
      expect(display?.textContent).toBe('12px');
    });
  });

  describe('Tool Selection', () => {
    it('should call onToolChange when a tool is clicked', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const eraserButton = element.querySelector('[data-tool="eraser"]') as HTMLButtonElement;
      eraserButton.click();

      expect(mockProps.onToolChange).toHaveBeenCalledWith('eraser');
    });

    it('should highlight active tool with primary color', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const brushButton = element.querySelector('[data-tool="brush"]') as HTMLButtonElement;
      expect(brushButton.className).toContain('bg-primary/10');
      expect(brushButton.className).toContain('text-primary');
    });

    it('should not highlight inactive tools', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const eraserButton = element.querySelector('[data-tool="eraser"]') as HTMLButtonElement;
      expect(eraserButton.className).not.toContain('bg-primary/10');
      expect(eraserButton.className).toContain('text-slate-500');
    });

    it('should update visual state when updateProps is called with new tool', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      toolbar.updateProps({ activeTool: 'eraser' as ToolType });

      const brushButton = element.querySelector('[data-tool="brush"]') as HTMLButtonElement;
      const eraserButton = element.querySelector('[data-tool="eraser"]') as HTMLButtonElement;

      expect(brushButton.className).not.toContain('bg-primary/10');
      expect(eraserButton.className).toContain('bg-primary/10');
    });
  });

  describe('Color Selection', () => {
    it('should call onColorChange when a color is clicked', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const blueButton = element.querySelector('[data-color="#2563eb"]') as HTMLButtonElement;
      blueButton.click();

      expect(mockProps.onColorChange).toHaveBeenCalledWith('#2563eb', 'Mavi');
    });

    it('should highlight active color with ring', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const redButton = element.querySelector('[data-color="#dc2626"]') as HTMLButtonElement;
      expect(redButton.className).toContain('ring-2');
      expect(redButton.className).toContain('ring-primary');
    });

    it('should not highlight inactive colors with ring', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const blueButton = element.querySelector('[data-color="#2563eb"]') as HTMLButtonElement;
      expect(blueButton.className).not.toContain('ring-2');
    });

    it('should have min 44px touch target for colors', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const colorButtons = element.querySelectorAll('[data-color]');
      colorButtons.forEach((btn) => {
        expect((btn as HTMLElement).className).toContain('min-w-[44px]');
        expect((btn as HTMLElement).className).toContain('min-h-[44px]');
      });
    });
  });

  describe('Brush Size', () => {
    it('should call onBrushSizeChange when slider is moved', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const slider = element.querySelector('input[type="range"]') as HTMLInputElement;
      slider.value = '25';
      slider.dispatchEvent(new Event('input'));

      expect(mockProps.onBrushSizeChange).toHaveBeenCalledWith(25);
    });

    it('should update brush size display when slider is moved', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const slider = element.querySelector('input[type="range"]') as HTMLInputElement;
      const display = element.querySelector('#brush-size-display');

      slider.value = '30';
      slider.dispatchEvent(new Event('input'));

      expect(display?.textContent).toBe('30px');
    });

    it('should update slider value when updateProps is called', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      toolbar.updateProps({ brushSize: 20 });

      const slider = element.querySelector('input[type="range"]') as HTMLInputElement;
      const display = element.querySelector('#brush-size-display');

      expect(slider.value).toBe('20');
      expect(display?.textContent).toBe('20px');
    });
  });

  describe('Custom Color', () => {
    it('should have hidden color input', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const colorInput = element.querySelector('input[type="color"]') as HTMLInputElement;
      expect(colorInput).not.toBeNull();
      expect(colorInput.className).toBe('hidden');
    });

    it('should call onColorChange when custom color is selected', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const colorInput = element.querySelector('input[type="color"]') as HTMLInputElement;
      colorInput.value = '#ff6600';
      colorInput.dispatchEvent(new Event('input'));

      expect(mockProps.onColorChange).toHaveBeenCalledWith('#ff6600', 'Özel Renk');
    });
  });

  describe('Touch Targets', () => {
    it('should have min 44px touch targets for tool buttons', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const toolButtons = element.querySelectorAll('[data-tool]');
      toolButtons.forEach((btn) => {
        expect((btn as HTMLElement).className).toContain('min-h-[44px]');
      });
    });

    it('should have min 44px touch target for custom color button', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const customColorBtn = Array.from(element.querySelectorAll('button')).find(
        b => b.textContent?.includes('Özel Renk')
      );
      expect(customColorBtn?.className).toContain('min-h-[44px]');
    });
  });

  describe('Accessibility', () => {
    it('should have title attributes on color buttons', () => {
      const toolbar = new Toolbar(mockProps);
      const element = toolbar.render();
      container.appendChild(element);

      const colorButtons = element.querySelectorAll('[data-color]');
      colorButtons.forEach((btn) => {
        expect((btn as HTMLElement).title).toBeTruthy();
      });
    });
  });
});
