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
const VIEW_WIDTH_TILES = 28;
const VIEW_HEIGHT_TILES = 16;
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
        <div class="world-heading"><div><span class="live-dot"></span><strong>THE LANTERN VILLAGE</strong></div><span class="world-coords" id="world-coords">X 010 · Y 016</span></div>
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
    const startX = Math.floor(cameraX / TILE);
    const startY = Math.floor(cameraY / TILE);
    const offsetX = cameraX % TILE;
    const offsetY = cameraY % TILE;
    const toScreenX = (x: number): number => x * TILE - cameraX;
    const toScreenY = (y: number): number => y * TILE - cameraY;
    const tile = (x: number, y: number, sourceX: number, sourceY = 0): void => {
      const sx = toScreenX(x); const sy = toScreenY(y);
      if (tileAtlas.complete && tileAtlas.naturalWidth) context.drawImage(tileAtlas, sourceX, sourceY, 32, 32, sx, sy, TILE, TILE);
      else { context.fillStyle = sourceY === 32 ? '#a77c54' : '#a77a4e'; context.fillRect(sx, sy, TILE, TILE); }
    };
    context.fillStyle = '#29483a'; context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    for (let vy = 0; vy <= VIEW_HEIGHT_TILES; vy++) for (let vx = 0; vx <= VIEW_WIDTH_TILES; vx++) {
      const x = startX + vx; const y = startY + vy;
      const noise = (x * 7 + y * 11) % 5;
      const sx = vx * TILE - offsetX; const sy = vy * TILE - offsetY;
      if (tileAtlas.complete && tileAtlas.naturalWidth) context.drawImage(tileAtlas, noise === 1 ? 32 : 0, 0, 32, 32, sx, sy, TILE, TILE);
      else { context.fillStyle = ['#29483a','#2d4b3b','#304d3c','#294638','#324e3d'][noise]; context.fillRect(sx,sy,TILE,TILE); }
    }
    // Wide paths connect each of the four base neighborhoods to the festival courtyard.
    for (let y = startY; y <= Math.min(MAP_HEIGHT-1,startY+VIEW_HEIGHT_TILES); y++) for (let x = startX; x <= Math.min(MAP_WIDTH-1,startX+VIEW_WIDTH_TILES); x++) {
      const centralRoad = (x >= 40 && x <= 43) || (y >= 30 && y <= 33);
      const diagonalRoad = (x >= 10 && x <= 12 && y >= 10 && y <= 30) || (x >= 72 && x <= 74 && y >= 10 && y <= 30)
        || (x >= 10 && x <= 12 && y >= 33 && y <= 54) || (x >= 72 && x <= 74 && y >= 33 && y <= 54);
      if (centralRoad || diagonalRoad) tile(x, y, (x === 41 && y === 31) ? 224 : (y === 31 && x >= 40 && x <= 43) ? 128 : 96);
      if (x >= 37 && x <= 46 && y >= 27 && y <= 36) tile(x, y, 160, 32);
    }
    const house = (x: number, y: number, w: number, h: number, roof: string, wall: string): void => {
      const sx = toScreenX(x); const sy = toScreenY(y);
      if (sx > context.canvas.width || sy > context.canvas.height || sx + w*TILE < 0 || sy + h*TILE < 0) return;
      context.fillStyle = 'rgba(14,20,17,.42)'; context.fillRect(sx + TILE, sy + h*TILE - 2, w*TILE, 7);
      context.fillStyle = wall; context.fillRect(sx + 3, sy + 11, w*TILE - 6, h*TILE - 10);
      context.fillStyle = roof; context.fillRect(sx, sy + 3, w*TILE, 12);
      context.fillStyle = '#f1cf91'; context.fillRect(sx + 5, sy + 13, w*TILE - 10, 3);
      context.fillStyle = '#51372e'; context.fillRect(sx + (Math.floor(w/2))*TILE - 4, sy + h*TILE - 18, 8, 18);
      for (let bx=0; bx<w*2; bx++) { context.fillStyle=bx%2?'rgba(255,215,142,.28)':'rgba(80,42,27,.12)'; context.fillRect(sx+bx*6,sy+5,6,6); }
    };
    HOUSES.forEach((item) => house(item.x,item.y,item.w,item.h,item.roof,item.wall));
    BASES.forEach((base) => {
      const bx=toScreenX(base.x); const by=toScreenY(base.y);
      context.fillStyle='#3b2b22'; context.fillRect(bx+4,by+3,16,17);
      context.fillStyle=base.color; context.fillRect(bx+6,by+5,12,11);
      context.fillStyle='#ffe1a0'; context.fillRect(bx+10,by+8,4,4);
    });
    // Courtyard lantern stall.
    const sx = toScreenX(CRAFT_STATION.x); const sy = toScreenY(CRAFT_STATION.y);
    context.fillStyle='#30261f'; context.fillRect(sx-12,sy+12,48,4);
    context.fillStyle='#f1c96e'; context.fillRect(sx-8,sy-12,40,18);
    context.fillStyle='#c65e3f'; context.fillRect(sx-3,sy-9,30,8);
    context.fillStyle='#fff0b5'; context.fillRect(sx+10,sy,4,4);
    const decorations = [[7,8],[18,14],[29,18],[54,16],[77,23],[8,34],[21,41],[32,52],[51,45],[71,47],[77,58],[16,57],[63,9],[58,56],[34,27],[51,37]];
    decorations.forEach(([x,y],index) => {
      const dx=toScreenX(x); const dy=toScreenY(y);
      if (dx < -TILE || dy < -TILE || dx > context.canvas.width || dy > context.canvas.height) return;
      if (index%3===0) { context.fillStyle='#d99555'; context.fillRect(dx+4,dy+10,16,3); context.fillRect(dx+10,dy+4,3,16); context.fillStyle='#d6b6df'; context.fillRect(dx+8,dy+8,8,8); context.fillStyle='#f2c26b'; context.fillRect(dx+10,dy+10,4,4); }
      else { context.fillStyle='rgba(255,190,94,.22)'; context.fillRect(dx+4,dy+5,16,16); context.fillStyle='#4f3a2d'; context.fillRect(dx+8,dy+13,9,5); context.fillStyle=index%2?'#ff9a44':'#ffd568'; context.fillRect(dx+11,dy+8,3,6); }
    });
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
    miniCtx.fillStyle = '#243c30'; miniCtx.fillRect(0, 0, minimap.width, minimap.height);
    miniCtx.fillStyle = '#9a704b'; miniCtx.fillRect(0, sy*30, minimap.width, sy*4); miniCtx.fillRect(sx*40,0,sx*4,minimap.height);
    miniCtx.fillStyle = '#c29a6c'; miniCtx.fillRect(sx*37,sy*27,sx*10,sy*10);
    HOUSES.forEach((house) => { miniCtx!.fillStyle=house.roof; miniCtx!.fillRect(house.x*sx,house.y*sy,house.w*sx,house.h*sy); });
    BASES.forEach((base) => { miniCtx!.fillStyle=base.color; miniCtx!.fillRect(base.x*sx,base.y*sy,Math.max(4,3*sx),Math.max(4,3*sy)); });
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

