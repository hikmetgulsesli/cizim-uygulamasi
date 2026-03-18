import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DrawingScreen } from './DrawingScreen';

describe('DrawingScreen', () => {
  let drawingScreen: DrawingScreen;
  let container: HTMLElement;

  beforeEach(() => {
    drawingScreen = new DrawingScreen();
    
    // Create a container for the rendered screen
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Mock confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    // Mock URL methods
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    container.remove();
  });

  describe('clear functionality', () => {
    it('should show confirmation dialog with Turkish text when clear button is clicked', () => {
      const screen = drawingScreen.render();
      container.appendChild(screen);

      // Get the clear button
      const clearBtn = screen.querySelector('#clear-btn') as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();

      // Check button text
      const buttonText = clearBtn.querySelector('span')?.textContent;
      expect(buttonText).toBe('Temizle');
    });

    it('should show confirmation with correct Turkish message', async () => {
      const screen = drawingScreen.render();
      container.appendChild(screen);

      // Wait for setTimeout to attach event listeners
      await new Promise(resolve => setTimeout(resolve, 50));

      const clearBtn = screen.querySelector('#clear-btn') as HTMLButtonElement;
      
      // Trigger click
      clearBtn.click();

      expect(window.confirm).toHaveBeenCalledWith('Silmek istediğinize emin misiniz?');
    });
  });

  describe('download functionality', () => {
    it('should have download button with Turkish text "İndir"', () => {
      const screen = drawingScreen.render();
      container.appendChild(screen);

      const downloadBtn = screen.querySelector('#download-btn') as HTMLButtonElement;
      expect(downloadBtn).toBeTruthy();

      const buttonText = downloadBtn.querySelector('span')?.textContent;
      expect(buttonText).toBe('İndir');
    });

    it('should have functional download button', () => {
      const screen = drawingScreen.render();
      container.appendChild(screen);

      const downloadBtn = screen.querySelector('#download-btn') as HTMLButtonElement;
      
      // Button should be clickable without errors
      expect(() => downloadBtn.click()).not.toThrow();
    });
  });
});
