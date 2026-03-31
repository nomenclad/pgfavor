export interface FavorItem {
  desire: "Love" | "Like" | "Hate" | "Dislike";
  items: string[];
}

export interface NpcData {
  name: string;
  priority: number | null;
  zone: string;
  buysStuff: boolean;
  councilLimit: number | null;
  councilLimitFavor: string | null;
  whatTheyBuy: string[];
  whatTheyBuyRaw: string;
  isStorage: boolean;
  storageMax: number | null;
  storageNote: string | null;
  trainsSkills: string[];
  favorItems: FavorItem[];
  favorItemsRaw: string;
}

export interface InventoryItem {
  Name: string;
  Desc?: string;
  StackSize?: number;
  NumItemsInStack?: number;
  Value?: number;
  IconId?: number;
  Keywords?: string[];
  ItemCode?: number;
}

export interface StorageVault {
  name: string;
  items: InventoryItem[];
}

export interface LoadedInventory {
  characterName: string;
  vaults: StorageVault[];
  allItems: InventoryItem[];
}

export interface CharacterSheet {
  Name?: string;
  Character?: string;
  NpcFavorLevels?: Record<string, string>;
  Skills?: Record<string, number>;
}

export interface CdnItemData {
  Name: string;
  Description?: string;
  Keywords?: string[];
  IconId?: number;
  Value?: number;
  ItemCode?: number;
}

export interface CdnNpcPreference {
  Keywords: string[];
  Favor: string;
}

export interface CdnNpcData {
  Name: string;
  AreaName?: string;
  Preferences?: CdnNpcPreference[];
}

export interface SellRecommendation {
  item: InventoryItem;
  vaultName: string;
  bestVendors: VendorMatch[];
  favorMatches: FavorMatch[];
}

export interface VendorMatch {
  npc: NpcData;
  councilLimit: number;
  categoryMatch: string;
}

export interface FavorMatch {
  npc: NpcData;
  desire: "Love" | "Like";
  matchedOn: string;
}

export type TabId =
  | "how-to-use"
  | "sell-guide"
  | "favor-guide"
  | "npc-directory"
  | "inventory";
