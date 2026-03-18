interface ErrorScreenProps {
  onRetry: () => void;
}

export class ErrorScreen {
  private props: ErrorScreenProps;

  constructor(props: ErrorScreenProps) {
    this.props = props;
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'relative flex h-screen w-full flex-col overflow-x-hidden';
    container.style.backgroundImage = 'radial-gradient(#e21d4822 1px, transparent 1px)';
    container.style.backgroundSize = '20px 20px';

    // Header
    const header = document.createElement('header');
    header.className = 'flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md';
    header.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="size-10 flex items-center justify-center rounded-xl bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </div>
        <h2 class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Hata Durumu</h2>
      </div>
      <div class="flex gap-2">
        <button class="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" id="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    `;

    // Main content
    const main = document.createElement('main');
    main.className = 'flex flex-1 flex-col items-center justify-center px-6 text-center';
    main.innerHTML = `
      <div class="max-w-md w-full p-8 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-primary/5 flex flex-col items-center gap-8">
        <!-- Playful Illustration -->
        <div class="relative w-64 h-64 flex items-center justify-center">
          <!-- Abstract Creative Error Illustration -->
          <div class="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-violet-500/20 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex flex-col items-center">
            <!-- Spilled Paint Bucket / Broken Tool Concept -->
            <div class="w-32 h-32 bg-primary rounded-2xl rotate-12 flex items-center justify-center relative shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 19-7-7 3-3 7 7"/><path d="m18 13 1.5-7.5L21 4l-3.5 14.5L11 18l-5-5"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              <div class="absolute -bottom-4 -left-8 w-24 h-12 bg-primary/40 rounded-full blur-md"></div>
              <div class="absolute -bottom-6 -right-4 w-16 h-8 bg-violet-500/40 rounded-full blur-md"></div>
            </div>
            <div class="mt-4 flex gap-2">
              <div class="w-3 h-3 rounded-full bg-rose-400 animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-3 h-3 rounded-full bg-violet-400 animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-3 h-3 rounded-full bg-primary animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
          <!-- Broken Pencil Decoration -->
          <div class="absolute top-0 right-0 -rotate-45 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m12 19-7-7 3-3 7 7"/><path d="m18 13 1.5-7.5L21 4l-3.5 14.5L11 18l-5-5"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          </div>
        </div>
        <!-- Error Messages -->
        <div class="space-y-3">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bir Hata Oluştu
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Canvas yüklenirken bir sorun oluştu. <br/>Lütfen sayfayı yenileyin.
          </p>
        </div>
        <!-- Action Button -->
        <div class="w-full pt-4">
          <button class="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/25" id="retry-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            <span>Yenile</span>
          </button>
        </div>
        <!-- Footer Info -->
        <div class="pt-4 flex flex-col items-center gap-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">Hata Kodu</span>
          <code class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-primary font-mono text-sm">ERR_CANVAS_LOAD_05</code>
        </div>
      </div>
      <!-- Playful floating elements -->
      <div class="absolute bottom-10 left-10 opacity-20 hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>
      </div>
      <div class="absolute top-40 right-10 opacity-20 hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
      </div>
    `;

    // Footer
    const footer = document.createElement('footer');
    footer.className = 'p-6 flex justify-center items-center';
    footer.innerHTML = `
      <div class="flex gap-4 p-2 bg-white/50 dark:bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 py-1 px-2">Sanat bekleyebilir, teknik ekip kontrol ediyor.</p>
      </div>
    `;

    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);

    // Add event listener
    setTimeout(() => {
      const retryBtn = container.querySelector('#retry-btn');
      retryBtn?.addEventListener('click', () => this.props.onRetry());
    }, 0);

    return container;
  }
}
