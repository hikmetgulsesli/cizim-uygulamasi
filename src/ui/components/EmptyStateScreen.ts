interface EmptyStateScreenProps {
  onStartDrawing: () => void;
}

export class EmptyStateScreen {
  private props: EmptyStateScreenProps;

  constructor(props: EmptyStateScreenProps) {
    this.props = props;
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex h-screen w-full flex-col overflow-hidden';

    // Header
    const header = document.createElement('header');
    header.className = 'flex items-center justify-between border-b border-primary/10 bg-white dark:bg-background-dark px-6 py-3';
    header.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Çizim Uygulaması</h2>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" id="share-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        </button>
        <button class="flex h-10 px-4 items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity" id="save-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>Kaydet</span>
        </button>
      </div>
    `;

    // Main content
    const main = document.createElement('main');
    main.className = 'flex flex-1 overflow-hidden';

    // Left sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'w-64 border-r border-primary/10 bg-white dark:bg-background-dark p-4 flex flex-col gap-6';
    sidebar.innerHTML = `
      <div>
        <h3 class="text-xs font-bold uppercase tracking-wider text-primary mb-4">Araçlar</h3>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="text-sm font-semibold">Fırça</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="text-sm font-medium">Kalem</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
            <span class="text-sm font-medium">Silgi</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span class="text-sm font-medium">Şekil</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/></svg>
            <span class="text-sm font-medium">Seçim</span>
          </div>
        </div>
      </div>
      <div class="mt-auto">
        <h3 class="text-xs font-bold uppercase tracking-wider text-primary mb-4">Renk Paleti</h3>
        <div class="grid grid-cols-4 gap-2">
          <div class="aspect-square rounded-full bg-primary border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-amber-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-sky-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-emerald-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-slate-900 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-slate-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-purple-500 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 cursor-pointer hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
        </div>
      </div>
    `;

    // Main canvas area - Empty State
    const section = document.createElement('section');
    section.className = 'flex-1 bg-slate-50 dark:bg-slate-900/50 p-8 flex items-center justify-center';
    section.innerHTML = `
      <div class="max-w-md w-full bg-white dark:bg-background-dark rounded-xl border-2 border-dashed border-primary/20 p-12 flex flex-col items-center text-center shadow-sm">
        <div class="relative mb-8">
          <div class="absolute -inset-4 bg-primary/5 rounded-full blur-2xl"></div>
          <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          </div>
          <div class="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Çizmeye Başlayın</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
          Fırça ve renk seçerek çizim yapmaya başlayabilirsiniz.
        </p>
        <p class="text-sm font-medium text-primary mb-8 px-4 py-1.5 bg-primary/5 rounded-full">
          Sol panelden araçları seçin
        </p>
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <button class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-bold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95" id="start-drawing-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l4-4h12a8 8 0 0 0 0-16Z"/></svg>
            <span>Yeni Tuval Oluştur</span>
          </button>
        </div>
      </div>
    `;

    main.appendChild(sidebar);
    main.appendChild(section);

    // Floating action button
    const fab = document.createElement('div');
    fab.className = 'fixed bottom-6 right-6';
    fab.innerHTML = `
      <button class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all" id="fab-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>
    `;

    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(fab);

    // Add event listeners
    setTimeout(() => {
      const startBtn = container.querySelector('#start-drawing-btn');
      const fabBtn = container.querySelector('#fab-btn');
      
      startBtn?.addEventListener('click', () => this.props.onStartDrawing());
      fabBtn?.addEventListener('click', () => this.props.onStartDrawing());
    }, 0);

    return container;
  }
}
