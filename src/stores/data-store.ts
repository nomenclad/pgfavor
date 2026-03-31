import { create } from "zustand";
import type {
  InventoryItem,
  CharacterSheet,
  CdnItemData,
  CdnNpcData,
  StorageVault,
} from "../types";

interface DataState {
  // User-loaded data
  inventoryItems: InventoryItem[];
  storageVaults: StorageVault[];
  characterName: string | null;
  characterSheet: CharacterSheet | null;
  itemsLoadedAt: string | null;
  characterLoadedAt: string | null;

  // CDN data
  cdnItems: Record<string, CdnItemData>;
  cdnNpcs: Record<string, CdnNpcData>;
  cdnVersion: string | null;
  cdnLoading: boolean;
  cdnError: string | null;

  // Actions
  setInventoryData: (
    items: InventoryItem[],
    vaults: StorageVault[],
    characterName: string | null
  ) => void;
  setCharacterSheet: (sheet: CharacterSheet) => void;
  setCdnData: (
    items: Record<string, CdnItemData>,
    npcs: Record<string, CdnNpcData>,
    version: string
  ) => void;
  setCdnLoading: (loading: boolean) => void;
  setCdnError: (error: string | null) => void;
  clearInventory: () => void;
  clearCharacter: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  inventoryItems: [],
  storageVaults: [],
  characterName: null,
  characterSheet: null,
  itemsLoadedAt: null,
  characterLoadedAt: null,
  cdnItems: {},
  cdnNpcs: {},
  cdnVersion: null,
  cdnLoading: false,
  cdnError: null,

  setInventoryData: (items, vaults, characterName) =>
    set({
      inventoryItems: items,
      storageVaults: vaults,
      characterName,
      itemsLoadedAt: new Date().toLocaleString(),
    }),

  setCharacterSheet: (sheet) =>
    set({
      characterSheet: sheet,
      characterLoadedAt: new Date().toLocaleString(),
    }),

  setCdnData: (items, npcs, version) =>
    set({ cdnItems: items, cdnNpcs: npcs, cdnVersion: version }),

  setCdnLoading: (loading) => set({ cdnLoading: loading }),
  setCdnError: (error) => set({ cdnError: error }),

  clearInventory: () =>
    set({
      inventoryItems: [],
      storageVaults: [],
      characterName: null,
      itemsLoadedAt: null,
    }),

  clearCharacter: () =>
    set({ characterSheet: null, characterLoadedAt: null }),
}));
