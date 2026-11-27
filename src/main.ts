import { initShell } from './shell';
import { createVillageGame } from './village-game';
import './styles.css';

const appContainer = document.querySelector<HTMLElement>('#app');

if (appContainer) {
  const app = document.createElement('div');
  app.className = 'lumina-app';
  app.innerHTML = `
    <header class="game-header">
      <a class="game-brand" href="#village" aria-label="LUMINA village home"><span class="brand-lamp" aria-hidden="true">✦</span><span><strong>LUMINA</strong><small>DIWALI VILLAGE</small></span></a>
      <nav class="game-tabs" aria-label="Game areas">
        <button class="game-tab is-selected" type="button" data-screen="village">Village</button>
        <button class="game-tab" type="button" data-screen="circuit">Circuit lab</button>
      </nav>
      <div class="header-season"><span class="season-dot"></span> FESTIVAL NIGHT <b>01</b></div>
    </header>
    <main class="game-screen" id="game-screen"></main>
  `;
  appContainer.replaceChildren(app);

  const screen = app.querySelector<HTMLElement>('#game-screen');
  const tabs = Array.from(app.querySelectorAll<HTMLButtonElement>('.game-tab'));
  const render = (name: string) => {
    if (!screen) return;
    tabs.forEach((tab) => tab.classList.toggle('is-selected', tab.dataset.screen === name));
    if (name === 'circuit') {
      initShell(screen);
      return;
    }
    screen.replaceChildren(createVillageGame(() => render('circuit')));
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => render(tab.dataset.screen ?? 'village')));
  render('village');
}
