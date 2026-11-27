const paths = [
  { id: 'diya-1', pin: 'D2', led: 'LED 1', color: '#f0aa56' },
  { id: 'diya-2', pin: 'D3', led: 'LED 2', color: '#61c6a5' },
  { id: 'diya-3', pin: 'D4', led: 'LED 3', color: '#7ca8ff' },
  { id: 'diya-4', pin: 'D5', led: 'LED 4', color: '#d79bdf' },
] as const;

function renderPath(id: string, pin: string, led: string, color: string, y: number): string {
  const holesLeft = [300, 318, 336, 354, 372]
    .map((x) => `<circle class="board-hole" cx="${x}" cy="${y}" r="4" />`)
    .join('');
  const holesRight = [480, 498, 516, 534, 552]
    .map((x) => `<circle class="board-hole" cx="${x}" cy="${y}" r="4" />`)
    .join('');

  return `
    <g class="circuit-path" data-led-path="${id}" style="--path-color: ${color}">
      <path class="path-wire" d="M 210 ${y} H 300" />
      <path class="row-net" d="M 300 ${y} H 372" />
      ${holesLeft}
      <path class="path-wire" d="M 372 ${y} H 398" />
      <path class="resistor-lead" d="M 398 ${y} H 410 M 464 ${y} H 480" />
      <rect class="resistor" x="410" y="${y - 13}" width="54" height="26" rx="5" />
      <text class="component-label" x="437" y="${y + 4}" text-anchor="middle">220 Ω</text>
      <path class="row-net" d="M 480 ${y} H 552" />
      ${holesRight}
      <path class="path-wire" d="M 552 ${y} H 612" />
      <path class="component-lead" d="M 612 ${y} H 626 M 696 ${y} H 856 V 444" />
      <rect class="led" x="626" y="${y - 19}" width="70" height="38" rx="19" />
      <text class="led-label" x="661" y="${y + 4}" text-anchor="middle">${led}</text>
      <text class="polarity-label" x="618" y="${y - 25}" text-anchor="middle">A</text>
      <text class="polarity-label" x="704" y="${y - 25}" text-anchor="middle">K</text>
      <path class="led-ray" d="M 680 ${y - 24} l 8 -8 M 687 ${y - 17} l 8 -8" />
      <text class="path-label" x="232" y="${y - 8}">${pin}</text>
    </g>
  `;
}

export function createBoardView(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'panel board-panel';
  section.setAttribute('aria-labelledby', 'board-title');
  section.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">FIXED CIRCUIT</p>
        <h2 id="board-title">Pre-wired breadboard</h2>
      </div>
      <p class="panel-note">4 paths · 220 Ω each · shared GND</p>
    </div>
    <div class="board-scroll">
      <svg class="board-diagram" viewBox="0 0 1000 500" role="img" aria-labelledby="diagram-title diagram-description">
        <title id="diagram-title">Pre-wired four-LED Diya circuit</title>
        <desc id="diagram-description">A microcontroller beside a breadboard. Pins D2, D3, D4, and D5 each connect through a 220 ohm resistor and a correctly oriented LED to one shared ground rail. The breadboard has five-hole row segments divided by a center gap.</desc>
        <rect class="board-surface" x="250" y="54" width="720" height="410" rx="20" />
        <text class="board-heading" x="280" y="84">BREADBOARD</text>
        <text class="hole-heading" x="300" y="108">A–E</text>
        <text class="hole-heading" x="480" y="108">F–J</text>
        <rect class="center-gap" x="405" y="112" width="63" height="306" rx="8" />
        <line class="ground-rail" x1="282" y1="444" x2="920" y2="444" />
        <text class="rail-label" x="820" y="432">SHARED GND</text>
        <path class="ground-wire" d="M 210 410 H 232 V 444 H 282" />
        <text class="ground-terminal-label" x="236" y="416">GND</text>
        <rect class="mcu" x="24" y="104" width="186" height="324" rx="16" />
        <text class="mcu-title" x="44" y="137">MICROCONTROLLER</text>
        <text class="mcu-subtitle" x="44" y="159">Digital output pins</text>
        ${paths.map((path, index) => renderPath(path.id, path.pin, path.led, path.color, 190 + index * 66)).join('')}
        <g class="mcu-terminals">
          ${paths.map((path, index) => `<text x="48" y="${194 + index * 66}">${path.pin}</text>`).join('')}
          <text x="48" y="414">GND</text>
        </g>
        <text class="board-footnote" x="282" y="480">Each five-hole row segment is connected internally. The center gap separates the two sides.</text>
      </svg>
    </div>
  `;

  return section;
}
