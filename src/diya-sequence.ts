import {
  DIGITAL_PINS,
  type DiyaPathId,
  type PinAssignment,
} from './circuit-model';

export interface DiyaSequenceController {
  start: (assignments: readonly PinAssignment[]) => void;
  stop: () => void;
  isRunning: () => boolean;
}

const STEP_INTERVAL_MS = 700;

/** Runs the approved D2 → D3 → D4 → D5 sequence and reports its selected LED path. */
export function createDiyaSequence(
  onStep: (pin: (typeof DIGITAL_PINS)[number], pathId: DiyaPathId) => void,
  onStop: () => void,
): DiyaSequenceController {
  let intervalId: number | undefined;
  let running = false;

  const stop = (): void => {
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
    if (running) {
      running = false;
      onStop();
    }
  };

  const start = (assignments: readonly PinAssignment[]): void => {
    stop();

    const pathByPin = new Map(assignments
      .filter((assignment): assignment is PinAssignment & { pin: (typeof DIGITAL_PINS)[number] } => assignment.pin !== null)
      .map(({ pin, pathId }) => [pin, pathId] as const));
    if (DIGITAL_PINS.some((pin) => !pathByPin.has(pin))) return;

    let stepIndex = 0;
    const step = (): void => {
      const pin = DIGITAL_PINS[stepIndex];
      const pathId = pathByPin.get(pin);
      if (!pathId) {
        stop();
        return;
      }

      onStep(pin, pathId);
      stepIndex = (stepIndex + 1) % DIGITAL_PINS.length;
    };

    running = true;
    step();
    intervalId = window.setInterval(step, STEP_INTERVAL_MS);
  };

  return { start, stop, isRunning: () => running };
}
