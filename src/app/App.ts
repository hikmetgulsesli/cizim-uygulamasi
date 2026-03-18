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
  private canvasError: boolean = false;
  private globalHandlersInstalled: boolean = false;

  mount(element: HTMLElement): void {
    this.container = element;
    this.setupGlobalErrorHandler();
    this.render();
  }

  private setupGlobalErrorHandler(): void {
    if (this.globalHandlersInstalled) return;
    this.globalHandlersInstalled = true;

    window.addEventListener('error', (event: ErrorEvent) => {
      const msg = event.message || '';
      if (msg.includes('canvas') || msg.includes('Canvas') || msg.includes('2D context')) {
        this.canvasError = true;
        this.navigateTo('error');
      }
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = String(event.reason);
      if (reason.includes('canvas') || reason.includes('Canvas') || reason.includes('2D context')) {
        this.canvasError = true;
        this.navigateTo('error');
      }
    });
  }

  private render(): void {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    switch (this.currentScreen) {
      case 'drawing':
        try {
          if (!this.drawingScreen) {
            this.drawingScreen = new DrawingScreen(() => {
              this.canvasError = true;
              this.navigateTo('error');
            });
          }
          this.container.appendChild(this.drawingScreen.render());
        } catch (error) {
          console.error('Canvas initialization failed:', error);
          this.canvasError = true;
          this.currentScreen = 'error';
          this.render();
        }
        break;
      case 'error':
        if (!this.errorScreen) {
          this.errorScreen = new ErrorScreen({
            onRetry: () => {
              this.canvasError = false;
              this.navigateTo('empty');
            },
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

  hasCanvasError(): boolean {
    return this.canvasError;
  }
}

// Expose for debugging
(window as any).appNavigate = (screen: ScreenType) => {
  const app = new App();
  app.navigateTo(screen);
};
