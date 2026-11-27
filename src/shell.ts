import { createBoardView } from './board-view';
import { createPinConfiguration } from './pin-configuration';

export function initShell(container: HTMLElement) {
  const shell = document.createElement('div');
  shell.className = 'lumina-shell';
  shell.innerHTML = `
    <header class="lumina-header">
      <div>
        <p class="eyebrow">ROUND 4 · THE FINAL BOSS</p>
        <h1>Diya Chaser</h1>
      </div>
      <p class="header-note">Configure the pins for the pre-wired circuit.</p>
    </header>
  `;

  const workspace = document.createElement('main');
  workspace.className = 'workspace';
  workspace.setAttribute('aria-label', 'Diya chaser pin configuration');

  const pinConfiguration = createPinConfiguration();
  workspace.append(createBoardView(), pinConfiguration.element);
  shell.append(workspace);
  container.replaceChildren(shell);

  return pinConfiguration;
}
