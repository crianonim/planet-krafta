import * as G from "@/app/game";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { store } from "@/app/store/store";
import { addMachine, loadGame, saveGame, tick } from "@/app/store/gameState";
import { useState } from "react";

function MachineSelector() {
  const { worldStats } = useAppSelector((s) => s.gameState);
  const [selected, setSelected] = useState<G.MachineType>("drillT1");
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as G.MachineType)}
      >
        {G.availableMachines(worldStats).map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <button onClick={() => dispatch(addMachine(selected))}>Add</button>
    </div>
  );
}

export default MachineSelector;
