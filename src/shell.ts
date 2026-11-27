export function initShell(container: HTMLElement): void {
  container.innerHTML = `
    <div class="lumina-shell">
      <header class="lumina-header">
        <h1>LUMINA — Round 4: The Final Boss</h1>
        <p>Virtual circuit challenge</p>
      </header>
      <main class="workspace" aria-label="Game workspace"></main>
    </div>
  `;
}
