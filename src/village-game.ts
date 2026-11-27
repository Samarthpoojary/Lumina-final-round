type Material = 'petals' | 'wicks' | 'glowDust';

interface Pickup {
  x: number;
  y: number;
  material: Material;
  collected: boolean;
}

const TILE = 24;
const MAP_WIDTH = 28;
const MAP_HEIGHT = 16;
const MOVE_DELAY = 125;
const CRAFT_STATION = { x: 14, y: 7 };
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
        <div class="world-heading"><div><span class="live-dot"></span><strong>THE LANTERN QUARTER</strong></div><span class="world-coords" id="world-coords">X 07 · Y 10</span></div>
        <div class="world-viewport"><canvas class="village-canvas" width="672" height="384" aria-label="Pixel-art village. Use WASD or arrow keys to move; press E near the lantern stall."></canvas><div class="world-toast" id="world-toast" aria-live="polite"></div><button class="world-prompt" id="world-prompt" type="button" hidden><span>E</span> CRAFT AT LANTERN STALL</button></div>
        <div class="world-footer"><span><kbd>W A S D</kbd> <kbd>↑ ↓ ← →</kbd> MOVE</span><span><kbd>E</kbd> INTERACT</span><span class="world-night"><span>◒</span> NIGHT 01 · FESTIVAL EVE</span></div>
      </section>
      <aside class="village-side">
        <div class="minimap-panel"><div class="panel-label">VILLAGE MAP <span>YOU ARE HERE</span></div><canvas class="minimap-canvas" width="224" height="112" aria-label="Minimap showing your location"></canvas><div class="map-legend"><span><i class="legend-player"></i> You</span><span><i class="legend-stall"></i> Lantern stall</span></div></div>
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
  const tileAtlas = new Image();
  tileAtlas.src = '/game-art/village-tiles.svg';
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
    { x: 8, y: 4, material: 'petals', collected: false },
    { x: 9, y: 11, material: 'wicks', collected: false },
    { x: 20, y: 9, material: 'petals', collected: false },
    { x: 26, y: 5, material: 'glowDust', collected: false },
    { x: 17, y: 13, material: 'wicks', collected: false },
    { x: 5, y: 13, material: 'glowDust', collected: false },
  ];
  const player = { x: 7, y: 10, facing: 1, direction: 0, step: 0 };
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
    if ((nx >= 2 && nx <= 5 && ny >= 2 && ny <= 4) || (nx >= 21 && nx <= 25 && ny >= 2 && ny <= 4) || (nx >= 1 && nx <= 4 && ny >= 10 && ny <= 12) || (nx >= 12 && nx <= 16 && ny >= 5 && ny <= 7)) return;
    player.x = nx;
    player.y = ny;
    player.facing = dx < 0 ? -1 : dx > 0 ? 1 : player.facing;
    player.direction = dy < 0 ? 3 : dy > 0 ? 0 : dx < 0 ? 2 : 1;
    player.step += 1;
    collectAtPlayer();
  };

  const drawGround = (context: CanvasRenderingContext2D, scale: number, width: number, height: number): void => {
    context.save();
    context.scale(scale, scale);
    const columns = width / TILE;
    const rows = height / TILE;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const noise = (x * 7 + y * 11) % 5;
        if (tileAtlas.complete && tileAtlas.naturalWidth) {
          const sourceX = noise === 0 ? 0 : noise === 1 ? 32 : 0;
          const sourceY = noise === 1 ? 0 : 0;
          context.drawImage(tileAtlas, sourceX, sourceY, 32, 32, x * TILE, y * TILE, TILE, TILE);
        } else {
          context.fillStyle = ['#29483a', '#2d4b3b', '#304d3c', '#294638', '#324e3d'][noise];
          context.fillRect(x * TILE, y * TILE, TILE, TILE);
          context.fillStyle = 'rgba(16, 30, 23, .22)';
          context.fillRect(x * TILE, (y + 1) * TILE - 2, TILE, 2);
          context.fillRect((x + 1) * TILE - 2, y * TILE, 2, TILE);
        }
        if ((!tileAtlas.complete || !tileAtlas.naturalWidth) && (x * 13 + y * 19) % 7 === 0) {
          context.fillStyle = '#52734c';
          context.fillRect(x * TILE + 5, y * TILE + 7, 2, 2);
        }
      }
    }
    const tile = (x: number, y: number, color: string, accent?: string): void => {
      if (tileAtlas.complete && tileAtlas.naturalWidth) {
        const sourceX = color === '#b4875a' ? 160 : x >= 11 && x <= 17 && y >= 6 && y <= 9 ? 224 : y >= 6 && y <= 9 ? 128 : 96;
        const sourceY = color === '#b4875a' ? 32 : 0;
        context.drawImage(tileAtlas, sourceX, sourceY, 32, 32, x * TILE, y * TILE, TILE, TILE);
        return;
      }
      context.fillStyle = color;
      context.fillRect(x * TILE, y * TILE, TILE, TILE);
      context.fillStyle = accent ?? 'rgba(69, 45, 30, .35)';
      context.fillRect(x * TILE, y * TILE + TILE - 3, TILE, 3);
      context.fillRect((x + 1) * TILE - 3, y * TILE, 3, TILE);
    };
    // A winding, hand-laid sandstone path through the green courtyard.
    for (let y = 6; y <= 9; y++) for (let x = 0; x < columns; x++) tile(x, y, '#a97a4e', '#805a3c');
    for (let x = 11; x <= 17; x++) for (let y = 0; y < rows; y++) tile(x, y, '#a97a4e', '#805a3c');
    for (let y = 4; y <= 11; y++) for (let x = 12; x <= 16; x++) tile(x, y, '#b4875a', '#8a6243');
    // Market huts and tiled roofs.
    const house = (x: number, y: number, w: number, h: number, roof: string, wall: string): void => {
      context.fillStyle = 'rgba(14, 20, 17, .42)';
      context.fillRect((x + 1) * TILE, (y + h) * TILE - 2, w * TILE, 7);
      context.fillStyle = wall;
      context.fillRect(x * TILE + 3, y * TILE + 11, w * TILE - 6, h * TILE - 10);
      context.fillStyle = roof;
      context.fillRect(x * TILE, y * TILE + 3, w * TILE, 12);
      context.fillStyle = '#f1cf91';
      context.fillRect(x * TILE + 5, y * TILE + 13, w * TILE - 10, 3);
      context.fillStyle = '#51372e';
      context.fillRect((x + Math.floor(w / 2)) * TILE - 4, (y + h) * TILE - 18, 8, 18);
      for (let bx = 0; bx < w * 2; bx++) {
        context.fillStyle = bx % 2 ? 'rgba(255,215,142,.28)' : 'rgba(80,42,27,.12)';
        context.fillRect(x * TILE + bx * 6, y * TILE + 5, 6, 6);
      }
    };
    house(2, 2, 4, 3, '#984f3f', '#d49c64');
    house(21, 2, 5, 3, '#7f5148', '#c68e5e');
    house(1, 10, 4, 3, '#8f5741', '#d4a36c');
    // A lantern stall beside the central path.
    house(12, 5, 5, 3, '#a34432', '#d9a85e');
    context.fillStyle = '#30261f';
    context.fillRect(12 * TILE + 7, 7 * TILE + 10, 5 * TILE - 14, 4);
    context.fillStyle = '#f1c96e';
    context.fillRect(13 * TILE, 6 * TILE + 2, 3 * TILE, 9);
    context.fillStyle = '#c65e3f';
    context.fillRect(13 * TILE + 4, 6 * TILE + 4, 3 * TILE - 8, 5);
    context.fillStyle = '#fff0b5';
    context.fillRect(14 * TILE - 1, 6 * TILE + 10, 3, 3);
    // Rangoli medallions and small festival lamps.
    const rangoli = (cx: number, cy: number): void => {
      context.fillStyle = '#d99555'; context.fillRect(cx - 14, cy - 2, 28, 4); context.fillRect(cx - 2, cy - 14, 4, 28);
      context.fillStyle = '#d6b6df'; context.fillRect(cx - 8, cy - 8, 16, 16);
      context.fillStyle = '#f2c26b'; context.fillRect(cx - 3, cy - 3, 6, 6);
    };
    rangoli(8 * TILE + 12, 3 * TILE + 12);
    rangoli(19 * TILE + 12, 12 * TILE + 12);
    [[7, 5], [10, 10], [19, 5], [7, 12], [20, 10]].forEach(([x, y], index) => {
      if (tileAtlas.complete && tileAtlas.naturalWidth) {
        const sourceX = index % 2 ? 32 : 224;
        const sourceY = index % 2 ? 64 : 96;
        context.drawImage(tileAtlas, sourceX, sourceY, 32, 32, x * TILE, y * TILE, TILE, TILE);
        return;
      }
      context.fillStyle = '#4f3a2d'; context.fillRect(x * TILE + 8, y * TILE + 14, 9, 5);
      context.fillStyle = index % 2 ? '#ff9a44' : '#ffd568'; context.fillRect(x * TILE + 11, y * TILE + 9, 3, 6);
      context.fillStyle = 'rgba(255, 190, 94, .22)'; context.fillRect(x * TILE + 4, y * TILE + 5, 17, 17);
    });
    context.restore();
  };

  const drawScene = (): void => {
    if (!ctx || !canvas) return;
    const scaleX = canvas.width / (MAP_WIDTH * TILE);
    const scaleY = canvas.height / (MAP_HEIGHT * TILE);
    drawGround(ctx, scaleX, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scaleX, scaleY);
    // Floating material pickups.
    pickups.filter((pickup) => !pickup.collected).forEach((pickup) => {
      const info = MATERIALS[pickup.material];
      const px = pickup.x * TILE + 12;
      const py = pickup.y * TILE + 11 + Math.sin(performance.now() / 330 + pickup.x) * 1.5;
      ctx.fillStyle = 'rgba(12, 20, 18, .36)'; ctx.fillRect(px - 6, py + 9, 12, 4);
      ctx.fillStyle = info.color; ctx.fillRect(px - 4, py - 4, 8, 8);
      ctx.fillStyle = '#fff2c4'; ctx.fillRect(px - 1, py - 7, 3, 3);
      ctx.fillStyle = 'rgba(255,225,154,.38)'; ctx.fillRect(px - 8, py - 9, 16, 2);
    });
    // Use the original crisp-edged protagonist spritesheet when it has loaded.
    const px = player.x * TILE + 12;
    const py = player.y * TILE + 11 + (held.size ? Math.sin(performance.now() / 48) * 1 : 0);
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
    ctx.restore();
    if (coord) coord.textContent = `X ${String(player.x).padStart(2, '0')} · Y ${String(player.y).padStart(2, '0')}`;
    if (prompt) prompt.hidden = !nearStall();
    drawMinimap();
  };

  const drawMinimap = (): void => {
    if (!miniCtx || !minimap) return;
    const sx = minimap.width / MAP_WIDTH;
    const sy = minimap.height / MAP_HEIGHT;
    miniCtx.fillStyle = '#243c30'; miniCtx.fillRect(0, 0, minimap.width, minimap.height);
    miniCtx.fillStyle = '#9a704b'; miniCtx.fillRect(0, sy * 6, minimap.width, sy * 4); miniCtx.fillRect(sx * 11, 0, sx * 6, minimap.height);
    miniCtx.fillStyle = '#b74e3b'; miniCtx.fillRect(sx * 12, sy * 5, sx * 5, sy * 3);
    [[2, 2, 4, 3], [21, 2, 5, 3], [1, 10, 4, 3]].forEach(([x, y, w, h]) => {
      miniCtx!.fillStyle = '#b66f51'; miniCtx!.fillRect(x * sx, y * sy, w * sx, h * sy);
    });
    miniCtx.fillStyle = '#ffd36c'; miniCtx.fillRect(CRAFT_STATION.x * sx + 3, CRAFT_STATION.y * sy + 3, 5, 5);
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
