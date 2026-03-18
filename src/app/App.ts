import { DrawingScreen } from '../ui/components/DrawingScreen';
import { EmptyStateScreen } from '../ui/components/EmptyStateScreen';
import { ErrorScreen } from '../ui/components/ErrorScreen';

type ScreenType = 'drawing' | 'empty' | 'error';

export class App {
  private container: HTMLElement | null = null;
  private currentScreen: ScreenType = 'empty';
  private drawingScreen: DrawingScreen | null = null;
  private emptyStateScreen: EmptyStateScreen | null = null;
  private errorScreen: ErrorScreen | null = null;

  mount(element: HTMLElement): void {
    this.container = element;
    this.render();
  }

  private render(): void {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    switch (this.currentScreen) {
      case 'drawing':
        if (!this.drawingScreen) {
          this.drawingScreen = new DrawingScreen();
        }
        this.container.appendChild(this.drawingScreen.render());
        break;
      case 'error':
        if (!this.errorScreen) {
          this.errorScreen = new ErrorScreen({
            onRetry: () => this.navigateTo('empty'),
          });
        }
        this.container.appendChild(this.errorScreen.render());
        break;
      case 'empty':
      default:
        if (!this.emptyStateScreen) {
          this.emptyStateScreen = new EmptyStateScreen({
            onStartDrawing: () => this.navigateTo('drawing'),
          });
        }
        this.container.appendChild(this.emptyStateScreen.render());
        break;
    }
  }

  navigateTo(screen: ScreenType): void {
    this.currentScreen = screen;
    this.render();
  }

  // Exposed for testing
  getCurrentScreen(): ScreenType {
    return this.currentScreen;
  }
}

// Expose for debugging
(window as any).appNavigate = (screen: ScreenType) => {
  const app = new App();
  app.navigateTo(screen);
};
