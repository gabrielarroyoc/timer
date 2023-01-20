import { HandPalm, Play } from "phosphor-react";
import { createContext, useEffect, useState } from "react";

import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  InterruptedDate?: Date;
  FinishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, InterruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  const markCurrentCycleAsFinished() {
    setCycles((state) =>
    state.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, FinishedDate: new Date() };
      } else {
        return cycle;
      }
    })
  );
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
    reset();
  }


  const task = watch("task");

  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <CyclesContext.Provider value={{activeCycle, activeCycleId}}> 
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Começar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
