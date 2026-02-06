import { create } from "zustand";

export type TabType = "feed" | "foodnews" | "community" | "foodwiki";

interface BottomTabState {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

const useBottomTabStore = create<BottomTabState>((set) => ({
  currentTab: location.pathname.split("/")[2] as TabType,
  setCurrentTab: (tab) => set({ currentTab: tab }),
}));

export default useBottomTabStore;
