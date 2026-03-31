import { create } from "zustand";
import type { TabId } from "../types";

interface NavState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const useNavStore = create<NavState>((set) => ({
  activeTab: "how-to-use",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
