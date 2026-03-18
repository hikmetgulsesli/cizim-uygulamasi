import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColorPicker, PREDEFINED_COLORS, type ColorOption } from './ColorPicker';

describe('ColorPicker', () => {
  let container: HTMLElement;
  let onColorChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    onColorChangeMock = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Predefined Colors', () => {
    it('should have exactly 12 predefined colors', () => {
      expect(PREDEFINED_COLORS.length).toBe(12);
    });

    it('should include all required colors', () => {
      const expectedColors = [
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

      expectedColors.forEach((expected: { name: string; value: string }) => {
        const found = PREDEFINED_COLORS.find((c: ColorOption) => c.name === expected.name && c.value === expected.value);
        expect(found).toBeDefined();
      });
    });
  });

  describe('Rendering', () => {
    it('should render color picker with all 12 predefined colors', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const colorButtons = element.querySelectorAll('.color-btn');
      expect(colorButtons.length).toBe(12);
    });

    it('should have "Renk Paleti" as section title', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const title = element.querySelector('h3');
      expect(title?.textContent).toBe('Renk Paleti');
    });

    it('should render custom color button', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const customColorBtn = element.querySelector('#custom-color-btn');
      expect(customColorBtn).not.toBeNull();
      expect(customColorBtn?.textContent).toContain('Özel Renk');
    });

    it('should render active color indicator section', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const activeColorSection = element.querySelector('.active-color-preview');
      expect(activeColorSection).not.toBeNull();

      const activeColorLabel = element.querySelector('.active-color-name');
      expect(activeColorLabel).not.toBeNull();
    });
  });

  describe('Color Selection', () => {
    it('should call onColorChange when a predefined color is clicked', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const blueButton = element.querySelector('[data-color="#2563eb"]') as HTMLButtonElement;
      blueButton.click();

      expect(onColorChangeMock).toHaveBeenCalledWith('#2563eb', 'Mavi');
    });

    it('should update active color indicator when color is selected', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const greenButton = element.querySelector('[data-color="#16a34a"]') as HTMLButtonElement;
      greenButton.click();

      const activeColorPreview = element.querySelector('.active-color-preview') as HTMLElement;
      const activeColorName = element.querySelector('.active-color-name') as HTMLElement;

      // Browser converts hex to rgb
      expect(activeColorPreview.style.backgroundColor).toBe('rgb(22, 163, 74)');
      expect(activeColorName.textContent).toBe('Yeşil');
    });

    it('should highlight selected color with active styling', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const redButton = element.querySelector('[data-color="#dc2626"]') as HTMLButtonElement;
      
      // Initially red should be active (matching initialColor)
      expect(redButton.className).toContain('ring-2');
      expect(redButton.className).toContain('ring-primary');

      // Click blue
      const blueButton = element.querySelector('[data-color="#2563eb"]') as HTMLButtonElement;
      blueButton.click();

      // Now blue should be active, red should not
      expect(blueButton.className).toContain('ring-2');
      expect(redButton.className).not.toContain('ring-2');
    });
  });

  describe('Custom Color Selection', () => {
    it('should have hidden color input for custom color', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const customColorInput = element.querySelector('#custom-color-input') as HTMLInputElement;
      expect(customColorInput).not.toBeNull();
      expect(customColorInput.type).toBe('color');
    });

    it('should call onColorChange when custom color is selected', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const customColorInput = element.querySelector('#custom-color-input') as HTMLInputElement;
      
      // Simulate color input change
      customColorInput.value = '#ff6600';
      customColorInput.dispatchEvent(new Event('input'));

      expect(onColorChangeMock).toHaveBeenCalledWith('#ff6600', 'Özel Renk');
    });

    it('should update custom color preview when color is selected', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const customColorInput = element.querySelector('#custom-color-input') as HTMLInputElement;
      const customPreview = element.querySelector('#custom-color-preview') as HTMLElement;

      customColorInput.value = '#ff6600';
      customColorInput.dispatchEvent(new Event('input'));

      // Browser converts hex to rgb when setting style.background
      expect(customPreview.style.background).toBe('rgb(255, 102, 0)');
    });
  });

  describe('Active Color Indicator', () => {
    it('should display initial color name correctly', () => {
      const colorPicker = new ColorPicker('#2563eb', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const activeColorName = element.querySelector('.active-color-name') as HTMLElement;
      expect(activeColorName.textContent).toBe('Mavi');
    });

    it('should display "Özel Renk" for non-predefined colors', () => {
      const colorPicker = new ColorPicker('#ff6600', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const activeColorName = element.querySelector('.active-color-name') as HTMLElement;
      expect(activeColorName.textContent).toBe('Özel Renk');
    });

    it('should have "Aktif Renk" label', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const paragraphs = Array.from(element.querySelectorAll('p')) as HTMLElement[];
      const label = paragraphs.find((p: HTMLElement) => 
        p.textContent === 'Aktif Renk'
      );
      expect(label).toBeDefined();
    });
  });

  describe('API Methods', () => {
    it('getCurrentColor should return current color', () => {
      const colorPicker = new ColorPicker('#2563eb', onColorChangeMock);
      colorPicker.render();

      expect(colorPicker.getCurrentColor()).toBe('#2563eb');
    });

    it('setColor should update current color and trigger callback', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      colorPicker.setColor('#16a34a', 'Yeşil');

      expect(colorPicker.getCurrentColor()).toBe('#16a34a');
      expect(onColorChangeMock).toHaveBeenCalledWith('#16a34a', 'Yeşil');
    });

    it('setColor should display "Özel Renk" when name is not provided for unknown color', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      colorPicker.setColor('#ff6600');

      const activeColorName = element.querySelector('.active-color-name') as HTMLElement;
      expect(activeColorName.textContent).toBe('Özel Renk');
    });
  });

  describe('Visual Indicators', () => {
    it('should have ring-2 ring-primary class on active color button', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const activeButton = element.querySelector('[data-color="#dc2626"]') as HTMLButtonElement;
      expect(activeButton.className).toContain('ring-2');
      expect(activeButton.className).toContain('ring-primary');
    });

    it('should have border-4 border-white dark:border-slate-800 on active color button', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const activeButton = element.querySelector('[data-color="#dc2626"]') as HTMLButtonElement;
      expect(activeButton.className).toContain('border-4');
      expect(activeButton.className).toContain('border-white');
    });

    it('inactive colors should have border-2 border-transparent', () => {
      const colorPicker = new ColorPicker('#dc2626', onColorChangeMock);
      const element = colorPicker.render();
      container.appendChild(element);

      const inactiveButton = element.querySelector('[data-color="#2563eb"]') as HTMLButtonElement;
      expect(inactiveButton.className).toContain('border-2');
      expect(inactiveButton.className).toContain('border-transparent');
      expect(inactiveButton.className).not.toContain('ring-2');
    });
  });
});
