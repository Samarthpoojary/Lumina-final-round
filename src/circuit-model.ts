export const DIGITAL_PINS = ['D2', 'D3', 'D4', 'D5'] as const;

export type DigitalPin = (typeof DIGITAL_PINS)[number];
export type DiyaPathId = 'diya-1' | 'diya-2' | 'diya-3' | 'diya-4';
export type WireNetId = string;

export interface PinAssignment {
  pathId: DiyaPathId;
  pin: DigitalPin | null;
}

export interface ResistorComponent {
  id: string;
  type: 'resistor';
  netA: WireNetId;
  netB: WireNetId;
  resistanceOhms: number;
}

export interface LedComponent {
  id: string;
  type: 'led';
  pathId: DiyaPathId;
  anodeNet: WireNetId;
  cathodeNet: WireNetId;
}

export type CircuitComponent = ResistorComponent | LedComponent;

export interface CircuitNetlist {
  groundNet: WireNetId;
  pinNets: Record<DigitalPin, WireNetId>;
  components: readonly CircuitComponent[];
}

const groundNet: WireNetId = 'gnd-rail';

/** Static, pre-wired Milestone 1 circuit. Each MCU pin has its own R→LED branch to shared GND. */
export const referenceCircuit: CircuitNetlist = {
  groundNet,
  pinNets: {
    D2: 'd2-row-net',
    D3: 'd3-row-net',
    D4: 'd4-row-net',
    D5: 'd5-row-net',
  },
  components: [
    { id: 'R-D2', type: 'resistor', netA: 'd2-row-net', netB: 'led-1-anode-net', resistanceOhms: 220 },
    { id: 'LED-1', type: 'led', pathId: 'diya-1', anodeNet: 'led-1-anode-net', cathodeNet: groundNet },
    { id: 'R-D3', type: 'resistor', netA: 'd3-row-net', netB: 'led-2-anode-net', resistanceOhms: 220 },
    { id: 'LED-2', type: 'led', pathId: 'diya-2', anodeNet: 'led-2-anode-net', cathodeNet: groundNet },
    { id: 'R-D4', type: 'resistor', netA: 'd4-row-net', netB: 'led-3-anode-net', resistanceOhms: 220 },
    { id: 'LED-3', type: 'led', pathId: 'diya-3', anodeNet: 'led-3-anode-net', cathodeNet: groundNet },
    { id: 'R-D5', type: 'resistor', netA: 'd5-row-net', netB: 'led-4-anode-net', resistanceOhms: 220 },
    { id: 'LED-4', type: 'led', pathId: 'diya-4', anodeNet: 'led-4-anode-net', cathodeNet: groundNet },
  ],
};
