import { createBoardView } from './board-view';
import { createDiyaSequence } from './diya-sequence';
import { createPinConfiguration } from './pin-configuration';
import { validatePinConfiguration } from './pin-validator';

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
  const board = createBoardView();
  workspace.append(board, pinConfiguration.element);
  shell.append(workspace);
  container.replaceChildren(shell);

  const button = pinConfiguration.element.querySelector<HTMLButtonElement>('#diya-sequence-toggle');
  const sequence = createDiyaSequence((pin, pathId) => {
    pinConfiguration.setGuideState('sequence-active');
    board.querySelectorAll<SVGGElement>('.circuit-path').forEach((path) => {
      path.classList.toggle('is-active', path.dataset.ledPath === pathId);
    });
    pinConfiguration.setCurrentStep(`${pin} is active — ${pathId.replace('diya-', 'LED ')} is lit.`);
  }, () => {
    pinConfiguration.setGuideState('idle');
    board.querySelectorAll('.circuit-path').forEach((path) => path.classList.remove('is-active'));
    pinConfiguration.setCurrentStep('');
    if (button) button.textContent = 'Validate & start sequence';
  });

  button?.addEventListener('click', () => {
    if (sequence.isRunning()) {
      sequence.stop();
      pinConfiguration.setStatus('Sequence stopped. Validate and start again when ready.');
      return;
    }

    const assignments = pinConfiguration.getAssignments();
    const result = validatePinConfiguration(assignments);
    if (!result.valid) {
      pinConfiguration.setGuideState('validation-error');
      pinConfiguration.setStatus(`Configuration needs changes: ${result.errors.join(' ')}`);
      return;
    }

    button.textContent = 'Stop sequence';
    pinConfiguration.setStatus('Sequence running in the approved D2 → D3 → D4 → D5 order.');
    sequence.start(assignments);
  });

  pinConfiguration.onChange(() => {
    if (!sequence.isRunning()) return;
    sequence.stop();
    pinConfiguration.setGuideState('selecting');
    pinConfiguration.setStatus('Configuration changed; sequence stopped. Validate and start again.');
  });

  return pinConfiguration;
}
