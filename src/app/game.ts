"use client";
import { z } from "zod";

const worldStasSchema = z.object({
  pressure: z.number().int(),
  heat: z.number().int(),
  oxygen: z.number().int(),
});

export type WorldStats = z.infer<typeof worldStasSchema>;

// Machines

export const machineTypeSchema = z.union([
  z.literal("drillT1"),
  z.literal("windTurbine"),
  z.literal("solarPanelT1"),
]);
export type MachineType = z.infer<typeof machineTypeSchema>;

export const machineSchema = z.object({
  type: machineTypeSchema,
  id: z.string().uuid(),
});
export const allMachines: MachineType[] = Object.values(
  machineTypeSchema.options
).map((x) => x.value);

export const availableMachines = (worldStats: WorldStats): MachineType[] => {
  return allMachines.filter((m) => {
    const unlock = machineDef[m].unlockAt;
    return unlock ? fullfillRequirement(unlock, worldStats) : true;
  });
};

export type Machine = z.infer<typeof machineSchema>;

export const createMachine = (type: MachineType): Machine => ({
  type,
  id: crypto.randomUUID(),
});

const exampleMachinesTypes: MachineType[] = [
  "drillT1",
  "windTurbine",
  "windTurbine",
  "solarPanelT1",
];
export const exampleMachines: Machine[] =
  exampleMachinesTypes.map(createMachine);

// Machines logic

type UnlockRequirementType = "terraform" | "heat" | "pressure" | "oxygen";

type UnlockRequirement = { type: UnlockRequirementType; amount: number };
export type MachineDef = {
  production: Production;
  unlockAt?: UnlockRequirement;
};

export const machineDef: Record<MachineType, MachineDef> = {
  drillT1: {
    production: {
      energy: -5,
      heat: 0,
      pressure: 2,
      oxygen: 0,
    },
  },
  windTurbine: {
    production: {
      energy: 12,
      heat: 0,
      pressure: 0,
      oxygen: 0,
    },
  },
  solarPanelT1: {
    production: {
      energy: 65,
      heat: 0,
      pressure: 0,
      oxygen: 0,
    },
    unlockAt: { type: "terraform", amount: 1000 },
  },
};

export const terraformValue = (worldStats: WorldStats): number =>
  worldStats.pressure + worldStats.heat + worldStats.oxygen;

export const fullfillRequirement = (
  { amount, type }: UnlockRequirement,
  stats: WorldStats
): boolean => {
  return { ...stats, terraform: terraformValue(stats) }[type] >= amount;
};

type Production = {
  energy: number;
  heat: number;
  pressure: number;
  oxygen: number;
};

const emptyProduction: Production = {
  energy: 0,
  heat: 0,
  pressure: 0,
  oxygen: 0,
};
export const production = (machines: Machine[]): Production =>
  machines.reduce(
    (acc, cur) => ({
      ...acc,
      energy: acc.energy + machineDef[cur.type].production.energy,
      heat: acc.heat + machineDef[cur.type].production.heat,
      pressure: acc.pressure + machineDef[cur.type].production.pressure,
      oxygen: acc.oxygen + machineDef[cur.type].production.oxygen,
    }),
    emptyProduction
  );

export const tick = (gs: GameState): GameState => {
  const { worldStats, turn, machines } = gs;
  const { energy, heat, pressure, oxygen } = production(machines);
  const afterTurn = { ...gs, turn: turn + 1 };
  if (energy < 0) return afterTurn;
  return {
    ...afterTurn,
    worldStats: {
      heat: worldStats.heat + heat,
      pressure: worldStats.pressure + pressure,
      oxygen: worldStats.oxygen + oxygen,
    },
  };
};

export const gameStateSchema = z.object({
  turn: z.number().nonnegative(),
  machines: z.array(machineSchema),
  worldStats: worldStasSchema,
});

export type GameState = z.infer<typeof gameStateSchema>;
