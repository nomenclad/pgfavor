import type {
  InventoryItem,
  StorageVault,
  CharacterSheet,
} from "../types";

interface RawItemsExport {
  Character?: string;
  CharacterName?: string;
  Items?: Record<string, unknown>[];
  InventoryItems?: Record<string, unknown>[];
  [key: string]: unknown;
}

function normalizeItem(raw: Record<string, unknown>): InventoryItem {
  return {
    Name: (raw.Name as string) || (raw.name as string) || "Unknown",
    Desc: (raw.Desc as string) || (raw.Description as string) || undefined,
    StackSize: (raw.StackSize as number) || (raw.NumItemsInStack as number) || 1,
    NumItemsInStack: (raw.NumItemsInStack as number) || (raw.StackSize as number) || 1,
    Value: (raw.Value as number) || 0,
    IconId: (raw.IconId as number) || undefined,
    Keywords: (raw.Keywords as string[]) || undefined,
    ItemCode: (raw.ItemCode as number) || undefined,
  };
}

export function parseItemsJson(
  text: string
): { items: InventoryItem[]; vaults: StorageVault[]; characterName: string | null } {
  const data = JSON.parse(text) as RawItemsExport;
  const characterName = data.Character || data.CharacterName || null;
  const vaultMap = new Map<string, InventoryItem[]>();
  const allItems: InventoryItem[] = [];

  // Handle different export formats
  // Format 1: Top-level Items array
  const rawItems = data.Items || data.InventoryItems || [];

  if (Array.isArray(rawItems)) {
    for (const raw of rawItems) {
      const item = normalizeItem(raw as Record<string, unknown>);
      allItems.push(item);
      const vaultName = ((raw as Record<string, unknown>).VaultName as string) ||
        ((raw as Record<string, unknown>).StorageName as string) ||
        "Inventory";
      if (!vaultMap.has(vaultName)) vaultMap.set(vaultName, []);
      vaultMap.get(vaultName)!.push(item);
    }
  }

  // Format 2: Named vault keys (e.g., "Inventory", "Storage_Serbule_Marna", etc.)
  if (allItems.length === 0) {
    for (const [key, value] of Object.entries(data)) {
      if (key === "Character" || key === "CharacterName") continue;
      if (Array.isArray(value)) {
        const vaultItems: InventoryItem[] = [];
        for (const raw of value) {
          if (typeof raw === "object" && raw !== null && ("Name" in raw || "name" in raw)) {
            const item = normalizeItem(raw as Record<string, unknown>);
            allItems.push(item);
            vaultItems.push(item);
          }
        }
        if (vaultItems.length > 0) {
          const vaultName = key.replace(/^Storage_/, "").replace(/_/g, " ");
          vaultMap.set(vaultName, vaultItems);
        }
      }
    }
  }

  const vaults: StorageVault[] = Array.from(vaultMap.entries()).map(
    ([name, items]) => ({ name, items })
  );

  return { items: allItems, vaults, characterName };
}

export function parseCharacterJson(text: string): CharacterSheet {
  const data = JSON.parse(text);
  return {
    Name: data.Name || data.Character || data.CharacterName || null,
    Character: data.Character || data.Name || null,
    NpcFavorLevels: data.NpcFavorLevels || data.FavorLevels || {},
    Skills: data.Skills || {},
  };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
