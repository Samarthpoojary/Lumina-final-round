type Material = 'petals' | 'wicks' | 'glowDust';

interface Pickup {
  x: number;
  y: number;
  material: Material;
  collected: boolean;
}

const TILE = 24;
const MAP_WIDTH = 84;
const MAP_HEIGHT = 64;
const MOVE_DELAY = 125;
const CRAFT_STATION = { x: 42, y: 32 };
const BASES = [
  { id: 'amber', x: 10, y: 10, color: '#b95b45' },
  { id: 'sapphire', x: 74, y: 10, color: '#587fb6' },
  { id: 'jade', x: 10, y: 54, color: '#588c65' },
  { id: 'citrine', x: 74, y: 54, color: '#c69b48' },
];
const HOUSES = [
  { x: 4, y: 4, w: 5, h: 4, roof: '#984f3f', wall: '#d49c64' },
  { x: 13, y: 6, w: 4, h: 3, roof: '#8c5444', wall: '#d4a36c' },
  { x: 4, y: 13, w: 4, h: 3, roof: '#8f5741', wall: '#d4a36c' },
  { x: 68, y: 4, w: 5, h: 4, roof: '#536f8f', wall: '#d1a574' },
  { x: 77, y: 6, w: 4, h: 3, roof: '#526d8f', wall: '#d9ad78' },
  { x: 76, y: 13, w: 4, h: 3, roof: '#58799d', wall: '#d4a36c' },
  { x: 4, y: 48, w: 5, h: 4, roof: '#557451', wall: '#d49c64' },
  { x: 13, y: 50, w: 4, h: 3, roof: '#58744f', wall: '#d4a36c' },
  { x: 4, y: 57, w: 4, h: 3, roof: '#577b53', wall: '#d4a36c' },
  { x: 68, y: 48, w: 5, h: 4, roof: '#a27a3f', wall: '#d6ac6f' },
  { x: 77, y: 50, w: 4, h: 3, roof: '#98713f', wall: '#d4a36c' },
  { x: 76, y: 57, w: 4, h: 3, roof: '#a17b42', wall: '#d4a36c' },
];
const MATERIALS: Record<Material, { name: string; mark: string; color: string }> = {
  petals: { name: 'Marigold petals', mark: '✿', color: '#ffba48' },
  wicks: { name: 'Cotton wicks', mark: '≋', color: '#fff0c8' },
  glowDust: { name: 'Glow dust', mark: '✦', color: '#a9dcff' },
};

const RECIPE: Partial<Record<Material, number>> = { petals: 2, wicks: 1 };

export function createVillageGame(openCircuit: () => void): HTMLElement {
  const root = document.createElement('section');
  root.className = 'village-game';
  root.innerHTML = `
    <div class="village-topline">
      <div><p class="village-kicker">ROUND FOUR · THE FINAL BOSS</p><h1>Diwali Village</h1><p class="village-intro">Gather festival materials and bring the village lights to life.</p></div>
      <div class="player-card"><span class="player-avatar" aria-hidden="true">✦</span><div><strong>Aarav</strong><small>Village apprentice</small></div><div class="health" aria-label="3 hearts">♥ ♥ ♥</div></div>
    </div>
    <div class="village-layout">
      <aside class="village-quests" aria-label="Village goals">
        <div class="panel-label">TONIGHT'S TASKS <span>01 / 03</span></div>
        <div class="quest-card is-current" id="primary-quest"><span class="quest-icon" id="primary-quest-icon">✿</span><div><strong id="primary-quest-title">Light the courtyard</strong><small id="primary-quest-note">Make your first Diya Charm</small></div><span class="quest-arrow" id="primary-quest-arrow">›</span></div>
        <div class="quest-card"><span class="quest-icon muted">⌖</span><div><strong>Explore the village</strong><small>Find the scattered materials</small></div></div>
        <div class="village-tip"><span>✦</span><p>Walk through a material to collect it. Visit the lantern stall and press <kbd>E</kbd> to craft.</p></div>
      </aside>
      <section class="world-panel" aria-label="Village map">
        <div class="world-heading"><div><span class="live-dot"></span><strong>FESTIVAL GROUNDS</strong></div><span class="world-coords" id="world-coords">X 010 · Y 016</span></div>
        <div class="world-viewport"><canvas class="village-canvas" width="672" height="384" aria-label="Pixel-art village. Use WASD or arrow keys to move; press E near the lantern stall."></canvas><div class="world-toast" id="world-toast" aria-live="polite"></div><button class="world-prompt" id="world-prompt" type="button" hidden><span>E</span> CRAFT AT LANTERN STALL</button></div>
        <div class="world-footer"><span><kbd>W A S D</kbd> <kbd>↑ ↓ ← →</kbd> MOVE</span><span><kbd>E</kbd> INTERACT</span><span class="world-night"><span>◒</span> NIGHT 01 · FESTIVAL EVE</span></div>
      </section>
      <aside class="village-side">
        <div class="minimap-panel"><div class="panel-label">WHOLE VILLAGE <span>YOU ARE HERE</span></div><canvas class="minimap-canvas" width="210" height="160" aria-label="Minimap showing the four village neighborhoods and your location"></canvas><div class="map-legend"><span><i class="legend-player"></i> You</span><span><i class="legend-stall"></i> Lantern stall</span></div></div>
        <div class="inventory-panel"><div class="panel-label">YOUR SATCHEL <span id="satchel-count">00 ITEMS</span></div><div class="inventory-grid" id="inventory-grid"></div><p class="inventory-note">Materials gathered tonight</p></div>
        <button class="circuit-link" type="button"><span>⌁</span><span><strong>Open Circuit Lab</strong><small>Try the Diya Chaser challenge</small></span><b>↗</b></button>
      </aside>
    </div>
    <div class="craft-backdrop" id="craft-backdrop" hidden>
      <section class="craft-dialog" role="dialog" aria-modal="true" aria-labelledby="craft-title">
        <header class="craft-heading"><div><span class="craft-kicker">LANTERN STALL · CRAFTING</span><h2 id="craft-title">Make a Diya Charm</h2></div><button class="craft-close" type="button" aria-label="Close crafting panel">×</button></header>
        <p class="craft-description">Gather a few festival materials, then bind them into a little charm for the courtyard.</p>
        <div class="recipe-row" id="recipe-row"></div>
        <div class="craft-result"><span class="result-icon">✧</span><div><small>YOU WILL MAKE</small><strong>Diya Charm <span>×1</span></strong></div></div>
        <p class="craft-message" id="craft-message" role="status">A starter recipe for this demo slice.</p>
        <button class="craft-button" id="craft-button" type="button">Craft charm <span>→</span></button>
      </section>
    </div>
    <div class="toast-stack" id="toast-stack" aria-live="polite"></div>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>('.village-canvas');
  const ctx = canvas?.getContext('2d');
  const worldArt = new Image();
  worldArt.src = '/game-art/diwali-village-world.svg';
  const heroSheet = new Image();
  heroSheet.src = '/game-art/protagonist-sprite.svg';
  const minimap = root.querySelector<HTMLCanvasElement>('.minimap-canvas');
  const miniCtx = minimap?.getContext('2d');
  const prompt = root.querySelector<HTMLElement>('#world-prompt');
  const toast = root.querySelector<HTMLElement>('#world-toast');
  const coord = root.querySelector<HTMLElement>('#world-coords');
  const overlay = root.querySelector<HTMLElement>('#craft-backdrop');
  const craftMessage = root.querySelector<HTMLElement>('#craft-message');
  const craftButton = root.querySelector<HTMLButtonElement>('#craft-button');
  const recipeRow = root.querySelector<HTMLElement>('#recipe-row');
  const inventoryGrid = root.querySelector<HTMLElement>('#inventory-grid');
  const satchelCount = root.querySelector<HTMLElement>('#satchel-count');
  const questTitle = root.querySelector<HTMLElement>('#primary-quest-title');
  const questNote = root.querySelector<HTMLElement>('#primary-quest-note');
  const questIcon = root.querySelector<HTMLElement>('#primary-quest-icon');
  const questArrow = root.querySelector<HTMLElement>('#primary-quest-arrow');
  const collected: Record<Material, number> = { petals: 0, wicks: 0, glowDust: 0 };
  const pickups: Pickup[] = [
    { x: 11, y: 16, material: 'petals', collected: false },
    { x: 14, y: 25, material: 'wicks', collected: false },
    { x: 27, y: 31, material: 'petals', collected: false },
    { x: 36, y: 34, material: 'glowDust', collected: false },
    { x: 48, y: 30, material: 'wicks', collected: false },
    { x: 59, y: 32, material: 'petals', collected: false },
    { x: 72, y: 20, material: 'glowDust', collected: false },
    { x: 69, y: 31, material: 'petals', collected: false },
    { x: 12, y: 39, material: 'wicks', collected: false },
    { x: 28, y: 33, material: 'glowDust', collected: false },
    { x: 52, y: 31, material: 'petals', collected: false },
    { x: 72, y: 40, material: 'wicks', collected: false },
    { x: 25, y: 52, material: 'glowDust', collected: false },
    { x: 45, y: 53, material: 'petals', collected: false },
    { x: 58, y: 51, material: 'wicks', collected: false },
    { x: 40, y: 21, material: 'glowDust', collected: false },
    { x: 42, y: 44, material: 'petals', collected: false },
    { x: 33, y: 48, material: 'wicks', collected: false },
  ];
  const player = { x: 10, y: 16, facing: 1, direction: 0, step: 0 };
  let cameraX = 0;
  let cameraY = 0;
  const held = new Set<string>();
  let lastMove = 0;
  let toastTimeout = 0;
  let isCrafted = false;
  let isClosed = false;

  const showToast = (message: string): void => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 1900);
  };

  const canCraft = (): boolean => Object.entries(RECIPE).every(([key, amount]) => collected[key as Material] >= (amount ?? 0));

  const updateInventory = (): void => {
    if (!inventoryGrid || !satchelCount) return;
    const entries = Object.entries(MATERIALS) as Array<[Material, typeof MATERIALS[Material]]>;
    inventoryGrid.innerHTML = entries.map(([key, item]) => `<div class="inventory-slot"><span class="item-glyph" style="--item-color:${item.color}">${item.mark}</span><strong>${String(collected[key]).padStart(2, '0')}</strong><small>${item.name}</small></div>`).join('')
      + `<div class="inventory-slot charm-slot"><span class="item-glyph">✧</span><strong>${isCrafted ? '01' : '00'}</strong><small>Diya Charm</small></div>`;
    const itemCount = Object.values(collected).reduce((sum, value) => sum + value, isCrafted ? 1 : 0);
    satchelCount.textContent = `${String(itemCount).padStart(2, '0')} ITEMS`;
  };

  const updateCrafting = (): void => {
    if (!recipeRow || !craftButton || !craftMessage) return;
    recipeRow.innerHTML = Object.entries(RECIPE).map(([key, amount]) => {
      const material = key as Material;
      const info = MATERIALS[material];
      const ready = collected[material] >= (amount ?? 0);
      return `<div class="recipe-item ${ready ? 'is-ready' : ''}"><span style="--item-color:${info.color}">${info.mark}</span><div><strong>${info.name}</strong><small>${collected[material]} / ${amount} gathered</small></div><b>${ready ? '✓' : '·'}</b></div>`;
    }).join('');
    craftButton.disabled = isCrafted || !canCraft();
    craftButton.innerHTML = isCrafted ? 'Charm crafted <span>✓</span>' : `Craft charm <span>→</span>`;
    craftMessage.textContent = isCrafted ? 'The Diya Charm is ready in your satchel.' : canCraft() ? 'All materials ready. Light up the courtyard!' : 'A starter recipe for this demo slice.';
  };

  const nearStall = (): boolean => Math.abs(player.x - CRAFT_STATION.x) + Math.abs(player.y - CRAFT_STATION.y) <= 2;

  const collectAtPlayer = (): void => {
    const pickup = pickups.find((item) => !item.collected && item.x === player.x && item.y === player.y);
    if (!pickup) return;
    pickup.collected = true;
    collected[pickup.material] += 1;
    updateInventory();
    updateCrafting();
    showToast(`${MATERIALS[pickup.material].name} collected`);
  };

  const move = (key: string): void => {
    const direction = key.toLowerCase();
    let dx = 0;
    let dy = 0;
    if (direction === 'arrowleft' || direction === 'a') dx = -1;
    if (direction === 'arrowright' || direction === 'd') dx = 1;
    if (direction === 'arrowup' || direction === 'w') dy = -1;
    if (direction === 'arrowdown' || direction === 's') dy = 1;
    if (!dx && !dy) return;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx < 1 || nx > MAP_WIDTH - 2 || ny < 1 || ny > MAP_HEIGHT - 2) return;
    if (HOUSES.some((house) => nx >= house.x && nx < house.x + house.w && ny >= house.y && ny < house.y + house.h)) return;
    player.x = nx;
    player.y = ny;
    player.facing = dx < 0 ? -1 : dx > 0 ? 1 : player.facing;
    player.direction = dy < 0 ? 3 : dy > 0 ? 0 : dx < 0 ? 2 : 1;
    player.step += 1;
    collectAtPlayer();
  };

  const drawGround = (context: CanvasRenderingContext2D): void => {
    if (worldArt.complete && worldArt.naturalWidth) {
      const scale = 32 / TILE;
      const sourceX = cameraX * scale;
      const sourceY = cameraY * scale;
      const sourceWidth = context.canvas.width * scale;
      const sourceHeight = context.canvas.height * scale;
      context.imageSmoothingEnabled = false;
      context.drawImage(worldArt, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, context.canvas.width, context.canvas.height);
      return;
    }

    context.fillStyle = '#426344';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = '#9b704a';
    context.fillRect(0, 30 * TILE - cameraY, context.canvas.width, 4 * TILE);
    context.fillRect(40 * TILE - cameraX, 0, 4 * TILE, context.canvas.height);
  };

  const drawScene = (): void => {
    if (!ctx || !canvas) return;
    cameraX = Math.max(0, Math.min(MAP_WIDTH*TILE-canvas.width, player.x*TILE+TILE/2-canvas.width/2));
    cameraY = Math.max(0, Math.min(MAP_HEIGHT*TILE-canvas.height, player.y*TILE+TILE/2-canvas.height/2));
    drawGround(ctx);
    // Floating material pickups.
    pickups.filter((pickup) => !pickup.collected).forEach((pickup) => {
      const info = MATERIALS[pickup.material];
      const px = pickup.x * TILE + 12 - cameraX;
      const py = pickup.y * TILE + 11 - cameraY + Math.sin(performance.now() / 330 + pickup.x) * 1.5;
      if (px < -16 || py < -16 || px > canvas.width+16 || py > canvas.height+16) return;
      ctx.fillStyle = 'rgba(12, 20, 18, .36)'; ctx.fillRect(px - 6, py + 9, 12, 4);
      ctx.fillStyle = info.color; ctx.fillRect(px - 4, py - 4, 8, 8);
      ctx.fillStyle = '#fff2c4'; ctx.fillRect(px - 1, py - 7, 3, 3);
      ctx.fillStyle = 'rgba(255,225,154,.38)'; ctx.fillRect(px - 8, py - 9, 16, 2);
    });
    // Use the original crisp-edged protagonist spritesheet when it has loaded.
    const px = player.x * TILE + 12 - cameraX;
    const py = player.y * TILE + 11 - cameraY + (held.size ? Math.sin(performance.now() / 48) * 1 : 0);
    if (heroSheet.complete && heroSheet.naturalWidth) {
      const frame = player.step % 2;
      ctx.drawImage(heroSheet, frame * 32, player.direction * 40, 32, 40, px - 12, py - 20, 24, 30);
    } else {
      ctx.fillStyle = 'rgba(10, 17, 18, .48)'; ctx.fillRect(px - 8, py + 9, 16, 4);
      ctx.fillStyle = '#382a24'; ctx.fillRect(px - 6, py - 9, 12, 9);
      ctx.fillStyle = '#c88655'; ctx.fillRect(px - 5, py - 6, 10, 7);
      ctx.fillStyle = '#4e3329'; ctx.fillRect(px - 6, py - 9, 12, 3); ctx.fillRect(px - 7, py - 6, 2, 4);
      ctx.fillStyle = '#f4c567'; ctx.fillRect(px - 1 + player.facing * 2, py - 3, 2, 2);
      ctx.fillStyle = '#b54e38'; ctx.fillRect(px - 6, py + 1, 12, 10);
      ctx.fillStyle = '#f2c76c'; ctx.fillRect(px - 1, py + 1, 3, 9); ctx.fillRect(px - 8, py + 3, 3, 6); ctx.fillRect(px + 5, py + 3, 3, 6);
      ctx.fillStyle = '#3b302c'; ctx.fillRect(px - 5, py + 11, 4, 4); ctx.fillRect(px + 2, py + 11, 4, 4);
      ctx.fillStyle = '#ffda7a'; ctx.fillRect(px - 10, py - 18, 20, 3);
    }
    if (coord) coord.textContent = `X ${String(player.x).padStart(2, '0')} · Y ${String(player.y).padStart(2, '0')}`;
    if (prompt) prompt.hidden = !nearStall();
    drawMinimap();
  };

  const drawMinimap = (): void => {
    if (!miniCtx || !minimap) return;
    const sx = minimap.width / MAP_WIDTH;
    const sy = minimap.height / MAP_HEIGHT;
    if (worldArt.complete && worldArt.naturalWidth) {
      miniCtx.imageSmoothingEnabled = false;
      miniCtx.drawImage(worldArt, 0, 0, worldArt.naturalWidth, worldArt.naturalHeight, 0, 0, minimap.width, minimap.height);
    } else {
      miniCtx.fillStyle = '#426344'; miniCtx.fillRect(0, 0, minimap.width, minimap.height);
      miniCtx.fillStyle = '#9b704a'; miniCtx.fillRect(0, sy * 30, minimap.width, sy * 4); miniCtx.fillRect(sx * 40, 0, sx * 4, minimap.height);
    }
    BASES.forEach((base) => {
      miniCtx!.fillStyle = base.color;
      miniCtx!.fillRect(base.x * sx - 2, base.y * sy - 2, 6, 6);
      miniCtx!.strokeStyle = '#f7e5b7';
      miniCtx!.lineWidth = 1;
      miniCtx!.strokeRect(base.x * sx - 2, base.y * sy - 2, 6, 6);
    });
    pickups.filter((pickup) => !pickup.collected).forEach((pickup) => {
      miniCtx!.fillStyle=MATERIALS[pickup.material].color;
      miniCtx!.fillRect(pickup.x*sx,pickup.y*sy,Math.max(2,1.5*sx),Math.max(2,1.5*sy));
    });
    miniCtx.fillStyle = '#ffd36c'; miniCtx.fillRect(CRAFT_STATION.x * sx + 3, CRAFT_STATION.y * sy + 3, 5, 5);
    miniCtx.strokeStyle = 'rgba(255,243,206,.65)'; miniCtx.lineWidth = 1;
    miniCtx.strokeRect(cameraX/(MAP_WIDTH*TILE)*minimap.width,cameraY/(MAP_HEIGHT*TILE)*minimap.height,canvas!.width/(MAP_WIDTH*TILE)*minimap.width,canvas!.height/(MAP_HEIGHT*TILE)*minimap.height);
    miniCtx.fillStyle = '#fff3ce'; miniCtx.fillRect(player.x * sx + 2, player.y * sy + 2, 5, 5);
  };

  const interact = (): void => {
    if (nearStall()) {
      if (overlay) overlay.hidden = false;
      updateCrafting();
      return;
    }
    showToast('Find the lantern stall in the village center');
  };

  const closeCrafting = (): void => { if (overlay) overlay.hidden = true; };
  prompt?.addEventListener('click', interact);
  const closeButton = root.querySelector<HTMLButtonElement>('.craft-close');
  closeButton?.addEventListener('click', closeCrafting);
  overlay?.addEventListener('click', (event) => { if (event.target === overlay) closeCrafting(); });
  craftButton?.addEventListener('click', () => {
    if (!canCraft() || isCrafted) return;
    Object.entries(RECIPE).forEach(([key, amount]) => { collected[key as Material] -= amount ?? 0; });
    isCrafted = true;
    updateInventory();
    updateCrafting();
    if (questTitle) questTitle.textContent = 'Courtyard charm made';
    if (questNote) questNote.textContent = 'The lantern stall is glowing';
    if (questIcon) questIcon.textContent = '✓';
    if (questArrow) questArrow.textContent = '✓';
    showToast('Diya Charm crafted · the courtyard glows brighter');
  });
  root.querySelector<HTMLButtonElement>('.circuit-link')?.addEventListener('click', openCircuit);
  root.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'e') { event.preventDefault(); interact(); return; }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)) {
      event.preventDefault();
      held.add(event.key);
    }
  });
  root.addEventListener('keyup', (event) => held.delete(event.key));
  window.addEventListener('blur', () => held.clear());
  root.addEventListener('pointerdown', () => root.focus());
  root.tabIndex = 0;
  root.focus();

  const frame = (time: number): void => {
    if (isClosed || !root.isConnected) { isClosed = true; return; }
    if (held.size && time - lastMove >= MOVE_DELAY && overlay?.hidden !== false) {
      const key = [...held][0];
      move(key);
      lastMove = time;
    }
    drawScene();
    requestAnimationFrame(frame);
  };
  updateInventory();
  updateCrafting();
  drawScene();
  requestAnimationFrame(frame);
  return root;
}


