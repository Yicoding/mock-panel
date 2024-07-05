import { create } from 'zustand';

/**
 * 字段
 */
type State = {
  bears: number;
};

/**
 * 方法
 */
type Action = {
  increase: () => void;
  increaseAsync: () => Promise<void>;
};

export type BearState = State & Action;

const stateField = {
  bears: 0
};

export const useBearStore = create<BearState>()((set, get) => ({
  ...stateField,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  increaseAsync: async () => {
    set({
      bears: get().bears + 1
    });
  }
}));
