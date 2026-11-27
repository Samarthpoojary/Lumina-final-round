import {
  DIGITAL_PINS,
  type CircuitComponent,
  type CircuitNetlist,
  type DiyaPathId,
  type DigitalPin,
  type LedComponent,
  type PinAssignment,
  type ResistorComponent,
  referenceCircuit,
} from './circuit-model';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface WalkResult {
  components: CircuitComponent[];
  ledOrientationCorrect: boolean;
}

interface PhysicalPathValidation {
  errors: string[];
  pathByPin: Map<DigitalPin, DiyaPathId>;
}

const PATH_IDS: readonly DiyaPathId[] = ['diya-1', 'diya-2', 'diya-3', 'diya-4'];
const REQUIRED_ORDER = ['resistor', 'led'] as const;
const REVERSED_ORDER = ['led', 'resistor'] as const;

function resistorOtherEnd(component: ResistorComponent, currentNet: string): string | null {
  if (component.netA === currentNet) return component.netB;
  if (component.netB === currentNet) return component.netA;
  return null;
}

function walkComponentSequence(
  circuit: CircuitNetlist,
  startNet: string,
  requiredOrder: readonly ('resistor' | 'led')[],
  allowReverseLed: boolean,
): WalkResult[] {
  const results: WalkResult[] = [];

  const walk = (
    currentNet: string,
    step: number,
    usedIds: ReadonlySet<string>,
    components: readonly CircuitComponent[],
    ledOrientationCorrect: boolean,
  ): void => {
    if (step === requiredOrder.length) {
      if (currentNet === circuit.groundNet) {
        results.push({ components: [...components], ledOrientationCorrect });
      }
      return;
    }

    const expectedType = requiredOrder[step];
    for (const component of circuit.components) {
      if (component.type !== expectedType || usedIds.has(component.id)) continue;

      if (component.type === 'resistor') {
        const nextNet = resistorOtherEnd(component, currentNet);
        if (!nextNet) continue;

        walk(
          nextNet,
          step + 1,
          new Set([...usedIds, component.id]),
          [...components, component],
          ledOrientationCorrect,
        );
        continue;
      }

      if (component.anodeNet === currentNet) {
        walk(
          component.cathodeNet,
          step + 1,
          new Set([...usedIds, component.id]),
          [...components, component],
          ledOrientationCorrect,
        );
      } else if (allowReverseLed && component.cathodeNet === currentNet) {
        walk(
          component.anodeNet,
          step + 1,
          new Set([...usedIds, component.id]),
          [...components, component],
          false,
        );
      }
    }
  };

  walk(startNet, 0, new Set(), [], true);
  return results;
}

function getResistors(path: WalkResult): ResistorComponent[] {
  return path.components.filter((component): component is ResistorComponent => component.type === 'resistor');
}

function validatePhysicalPaths(circuit: CircuitNetlist): PhysicalPathValidation {
  const errors: string[] = [];
  const pathByPin = new Map<DigitalPin, DiyaPathId>();
  const pinNets = new Map<string, DigitalPin[]>();

  for (const pin of DIGITAL_PINS) {
    const net = circuit.pinNets[pin];
    pinNets.set(net, [...(pinNets.get(net) ?? []), pin]);

    if (net === circuit.groundNet) {
      errors.push(`${pin} is wired directly to GND, bypassing the resistor and LED.`);
    }
  }

  for (const pins of pinNets.values()) {
    if (pins.length > 1) {
      errors.push(`${pins.join(' and ')} share one wire net and are shorted together.`);
    }
  }

  const usedComponentIds = new Set<string>();
  for (const pin of DIGITAL_PINS) {
    const pinNet = circuit.pinNets[pin];
    if (pinNet === circuit.groundNet) continue;

    const directedPaths = walkComponentSequence(circuit, pinNet, REQUIRED_ORDER, false)
      .filter((path) => getResistors(path).every((resistor) => resistor.resistanceOhms === 220));

    if (directedPaths.length === 0) {
      const reversedLedPaths = walkComponentSequence(circuit, pinNet, REQUIRED_ORDER, true)
        .filter((path) => !path.ledOrientationCorrect);
      const wrongResistorPaths = walkComponentSequence(circuit, pinNet, REQUIRED_ORDER, false)
        .filter((path) => getResistors(path).some((resistor) => resistor.resistanceOhms !== 220));
      const wrongOrderPaths = walkComponentSequence(circuit, pinNet, REVERSED_ORDER, true);

      if (reversedLedPaths.length > 0) {
        errors.push(`${pin} reaches GND through an LED with reversed polarity.`);
      } else if (wrongResistorPaths.length > 0) {
        errors.push(`${pin} path must use a 220 Ω resistor before its LED.`);
      } else if (wrongOrderPaths.length > 0) {
        errors.push(`${pin} path has the LED and resistor in the wrong order.`);
      } else {
        errors.push(`${pin} is missing a resistor → LED path to GND.`);
      }
      continue;
    }

    if (directedPaths.length > 1) {
      errors.push(`${pin} reaches GND through multiple resistor/LED paths; exactly one path is allowed.`);
      continue;
    }

    const [path] = directedPaths;
    const led = path.components.find((component): component is LedComponent => component.type === 'led');
    if (led) pathByPin.set(pin, led.pathId);
    for (const component of path.components) {
      if (usedComponentIds.has(component.id)) {
        errors.push(`${pin} shares component ${component.id} with another pin path.`);
      }
      usedComponentIds.add(component.id);
    }
  }

  return { errors, pathByPin };
}

function isDigitalPin(value: string | null): value is DigitalPin {
  return value !== null && DIGITAL_PINS.includes(value as DigitalPin);
}

function getPathLabel(pathId: string): string {
  const pathIndex = PATH_IDS.indexOf(pathId as DiyaPathId);
  return pathIndex >= 0 ? `LED ${pathIndex + 1} path` : `Unknown path (${pathId})`;
}

/** Validates the fixed reference circuit and the player's one-to-one D2–D5 assignments. */
export function validatePinConfiguration(
  assignments: readonly PinAssignment[],
  circuit: CircuitNetlist = referenceCircuit,
): ValidationResult {
  const physicalPaths = validatePhysicalPaths(circuit);
  const errors = [...physicalPaths.errors];
  const assignmentsByPath = new Map<string, PinAssignment>();
  const pathsByPin = new Map<DigitalPin, string[]>();

  for (const assignment of assignments) {
    if (!PATH_IDS.includes(assignment.pathId)) {
      errors.push(`Unknown LED path: ${assignment.pathId}.`);
      continue;
    }

    if (assignmentsByPath.has(assignment.pathId)) {
      errors.push(`${getPathLabel(assignment.pathId)} has more than one pin assignment.`);
      continue;
    }
    assignmentsByPath.set(assignment.pathId, assignment);

    if (!isDigitalPin(assignment.pin)) {
      errors.push(`${getPathLabel(assignment.pathId)}: choose a pin from D2–D5.`);
      continue;
    }

    pathsByPin.set(assignment.pin, [...(pathsByPin.get(assignment.pin) ?? []), assignment.pathId]);
  }

  for (const pathId of PATH_IDS) {
    if (!assignmentsByPath.has(pathId)) {
      errors.push(`${getPathLabel(pathId)}: choose a pin.`);
    }
  }

  for (const [pin, pathIds] of pathsByPin) {
    if (pathIds.length > 1) {
      errors.push(`${pin} is assigned to more than one LED path.`);
    }
  }

  const pinByPhysicalPath = new Map(
    [...physicalPaths.pathByPin].map(([pin, pathId]) => [pathId, pin] as const),
  );
  for (const [pathId, assignment] of assignmentsByPath) {
    if (!isDigitalPin(assignment.pin)) continue;
    const physicalPin = pinByPhysicalPath.get(pathId as DiyaPathId);
    if (physicalPin && assignment.pin !== physicalPin) {
      errors.push(`${getPathLabel(pathId)} is physically wired to ${physicalPin}, not ${assignment.pin}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
