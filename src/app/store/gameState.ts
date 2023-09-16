import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as G from "../game";

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: {
    turn: 1,
    machines: [] as G.Machine[],
    worldStats: { pressure: 0, heat: 0, oxygen: 0 },
  },
  reducers: {
    tick: (state) => G.tick(state),
    addMachine: (state, action: PayloadAction<G.MachineType>) => {
      state.machines.push(G.createMachine(action.payload));
    },
    saveGame: (state) => {
      localStorage.setItem("pl-save", JSON.stringify(state));
    },
    loadGame: (state) => {
      const loaded = G.gameStateSchema.safeParse(
        JSON.parse(localStorage.getItem("pl-save") || "")
      );
      if (loaded.success) return loaded.data;
      return state;
    },
  },
});
export const { tick, addMachine, saveGame, loadGame } = gameStateSlice.actions;
export default gameStateSlice.reducer;
