"use client";
import * as G from "./game";
import { useAppSelector, useAppDispatch } from "./hooks";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { addMachine, loadGame, saveGame, tick } from "./store/gameState";

export default function Home() {
  return (
    <Provider store={store}>
      <GameComponent />
    </Provider>
  );
}

function GameComponent() {
  const { worldStats, turn, machines } = useAppSelector((s) => s.gameState);
  const terraform = worldStats.pressure + worldStats.heat + worldStats.oxygen;
  const { energy, pressure, heat, oxygen } = G.production(machines);
  const dispatch = useAppDispatch();
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col">
        <div>Turn: {turn}</div>
        <button onClick={() => dispatch(tick())}>Tick</button>
        <button onClick={() => dispatch(saveGame())}>Save State</button>
        <button onClick={() => dispatch(loadGame())}>Load State</button>
        <button onClick={() => dispatch(addMachine("windTurbine"))}>
          Add Wind Turbine
        </button>
        <button onClick={() => dispatch(addMachine("drillT1"))}>
          Add Drill
        </button>
      </div>

      <div className="flex flex-col">
        {machines.map((m) => (
          <div key={m.id}>
            {m.type} {m.id}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div>Electricity Balance: {energy}</div>
        <div>Terraform Index: {terraform}</div>
        <div>
          Pressure {worldStats.pressure} ({pressure}/s)
        </div>
        <div>
          Heat {worldStats.heat} ({heat}/s)
        </div>
        <div>
          Oxygen {worldStats.oxygen} ({oxygen}/s)
        </div>
      </div>
    </div>
  );
}
