import { DIGITAL_PINS, type DigitalPin, type DiyaPathId, type PinAssignment } from './circuit-model';

export interface PinConfigurationView {
  element: HTMLElement;
  getAssignments: () => PinAssignment[];
  setStatus: (message: string) => void;
  setCurrentStep: (message: string) => void;
  onChange: (listener: () => void) => void;
}

const pinOptions: readonly DigitalPin[] = DIGITAL_PINS;
const paths: Array<{ id: DiyaPathId; label: string }> = [
  { id: 'diya-1', label: 'LED 1 path' },
  { id: 'diya-2', label: 'LED 2 path' },
  { id: 'diya-3', label: 'LED 3 path' },
  { id: 'diya-4', label: 'LED 4 path' },
];

export function createPinConfiguration(): PinConfigurationView {
  const element = document.createElement('aside');
  element.className = 'panel pin-panel';
  element.setAttribute('aria-labelledby', 'pin-config-title');
  element.innerHTML = `
    <div class="panel-heading panel-heading-stacked">
      <div>
        <p class="eyebrow">YOUR TASK</p>
        <h2 id="pin-config-title">Configure the pins</h2>
      </div>
      <p class="panel-note">Assign D2–D5 once each. The circuit is already wired.</p>
    </div>
    <p class="input-hint" id="pin-config-hint">Choose one digital pin for each LED path. A pin already assigned elsewhere cannot be selected again.</p>
    <div class="pin-fields">
      ${paths.map(({ id, label }) => `
        <div class="pin-field">
          <label for="${id}">${label}</label>
          <select id="${id}" name="${id}" data-path-id="${id}" aria-describedby="pin-config-hint pin-config-status">
            <option value="" selected>Choose a pin</option>
            ${pinOptions.map((pin) => `<option value="${pin}">${pin}</option>`).join('')}
          </select>
        </div>
      `).join('')}
    </div>
    <button class="sequence-button" id="diya-sequence-toggle" type="button">Validate &amp; start sequence</button>
    <p class="pin-status" id="pin-config-status" role="status" aria-live="polite">Choose a pin for each of the four LED paths.</p>
    <p class="sequence-current" id="sequence-current" aria-live="off"></p>
  `;

  const selectors = Array.from(element.querySelectorAll<HTMLSelectElement>('select[data-path-id]'));
  const status = element.querySelector<HTMLElement>('#pin-config-status');
  const currentStep = element.querySelector<HTMLElement>('#sequence-current');
  const changeListeners: Array<() => void> = [];

  const readAssignments = (): PinAssignment[] => selectors.map((selector) => ({
    pathId: selector.dataset.pathId as DiyaPathId,
    pin: pinOptions.includes(selector.value as DigitalPin) ? selector.value as DigitalPin : null,
  }));

  const update = (): void => {
    const assignedPins = selectors.map((selector) => selector.value).filter(Boolean);

    selectors.forEach((selector) => {
      const currentPin = selector.value;
      Array.from(selector.options).forEach((option) => {
        option.disabled = option.value !== ''
          && option.value !== currentPin
          && assignedPins.includes(option.value);
      });
    });

    if (!status) return;

    const assignedCount = assignedPins.length;
    const duplicateExists = new Set(assignedPins).size !== assignedCount;
    if (duplicateExists) {
      status.textContent = 'Each pin can be assigned to only one LED path.';
    } else if (assignedCount < paths.length) {
      status.textContent = `Choose a pin for each LED path. ${assignedCount} of ${paths.length} assigned.`;
    } else {
      status.textContent = 'All four pins are assigned once. Ready for configuration validation.';
    }
  };

  selectors.forEach((selector) => selector.addEventListener('change', () => {
    update();
    changeListeners.forEach((listener) => listener());
  }));

  return {
    element,
    getAssignments: readAssignments,
    setStatus: (message) => {
      if (status) status.textContent = message;
    },
    setCurrentStep: (message) => {
      if (currentStep) currentStep.textContent = message;
    },
    onChange: (listener) => changeListeners.push(listener),
  };
}
