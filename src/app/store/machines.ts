import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import * as G from "../game";
const initialState: G.Machine[] = [];

export const machineSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<G.MachineType>) => {
      state.push(G.createMachine(action.payload));
    },
  },
});

export const { add } = machineSlice.actions;

export const selectMachines = (state: RootState) => state.gameState.machines;

export default machineSlice.reducer;
