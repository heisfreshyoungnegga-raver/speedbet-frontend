import { create } from 'zustand';

export type BetSelection = {
  matchId: string;
  market: string;
  selection: string;
  odds: number;
  matchLabel: string;
};

type BetSlipStore = {
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (matchId: string, market: string, selection: string) => void;
  clearSlip: () => void;
  setStake: (stake: number) => void;
};

const calculateTotals = (selections: BetSelection[], stake: number) => {
  const totalOdds = selections.length === 0 
    ? 0 
    : selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialReturn = stake * totalOdds;
  return { totalOdds, potentialReturn };
};

export const useBetSlipStore = create<BetSlipStore>((set) => ({
  selections: [],
  stake: 0,
  totalOdds: 0,
  potentialReturn: 0,

  addSelection: (selection) => set((state) => {
    const existingIndex = state.selections.findIndex(
      (sel) => sel.matchId === selection.matchId 
        && sel.market === selection.market 
        && sel.selection === selection.selection
    );
    
    let newSelections;
    if (existingIndex > -1) {
      newSelections = [...state.selections];
      newSelections[existingIndex] = selection;
    } else {
      newSelections = [...state.selections, selection];
    }

    const { totalOdds, potentialReturn } = calculateTotals(newSelections, state.stake);
    return { selections: newSelections, totalOdds, potentialReturn };
  }),

  removeSelection: (matchId, market, selection) => set((state) => {
    const newSelections = state.selections.filter(
      (sel) => !(sel.matchId === matchId && sel.market === market && sel.selection === selection)
    );
    const { totalOdds, potentialReturn } = calculateTotals(newSelections, state.stake);
    return { selections: newSelections, totalOdds, potentialReturn };
  }),

  clearSlip: () => set({
    selections: [],
    stake: 0,
    totalOdds: 0,
    potentialReturn: 0
  }),

  setStake: (stake) => set((state) => {
    const newStake = Math.max(0, stake);
    const { totalOdds, potentialReturn } = calculateTotals(state.selections, newStake);
    return { stake: newStake, totalOdds, potentialReturn };
  }),
}));
