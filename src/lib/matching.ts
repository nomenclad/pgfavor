import type {
  NpcData,
  InventoryItem,
  CdnItemData,
  CdnNpcData,
  VendorMatch,
  FavorMatch,
  SellRecommendation,
  StorageVault,
} from "../types";

// Maps spreadsheet buy categories to CDN item keywords
const BUY_CATEGORY_KEYWORDS: Record<string, string[]> = {
  weapon: [
    "Sword", "Staff", "Hammer", "Bow", "Crossbow", "Dagger", "Dirk", "Club",
    "Knife", "OffHand", "MainHand",
  ],
  armor: [
    "ArmorHead", "ArmorChest", "ArmorLegs", "ArmorFeet", "ArmorHands",
    "Shield", "Armor", "ArmorSlot",
  ],
  jewelry: ["Ring", "Necklace", "Amulet", "Jewelry"],
  food: ["Food", "Meal", "PreparedFood", "Snack", "Drink"],
  potion: ["Potion", "Elixir"],
  recipe: ["Recipe", "RecipeBook", "RecipeItem", "Scroll"],
  book: ["Book", "SkillBook", "Textbook", "Scroll"],
  "animal part": [
    "AnimalPart", "Bone", "Skull", "Skin", "Hide", "Horn", "Tooth",
    "Wing", "Claw", "Feather",
  ],
  mushroom: ["Mushroom"],
  gem: ["Gem", "Crystal", "Gemstone"],
  crystal: ["Crystal"],
  "metal slab": ["MetalSlab", "MetalBar"],
  wood: ["Wood", "Lumber", "Log"],
  furniture: ["Furniture"],
  phlogiston: ["Phlogiston", "Augmentation", "Phlog"],
  augmentation: ["Augmentation", "Phlogiston"],
  skin: ["Skin", "Hide", "Leather", "AnimalSkin"],
  "cooking ingredient": ["CookingIngredient", "Ingredient", "RawFood"],
  "alchemy ingredient": ["AlchemyIngredient"],
  painting: ["Painting", "Art", "Artwork"],
  textbook: ["Textbook"],
  drug: ["Drug"],
  bone: ["Bone", "Skull"],
  skull: ["Skull", "Bone"],
  vegetable: ["Vegetable", "RawVegetable"],
  tool: ["Tool", "CraftingTool"],
  dust: ["Dust", "MagicDust"],
  oil: ["Oil", "MagicOil"],
  coin: ["Coin"],
  flower: ["Flower"],
  seed: ["Seed", "Seedling"],
  cloth: ["Cloth", "Cotton", "Fabric", "Textile"],
  "brewing ingredient": ["BrewingIngredient"],
  metal: ["Metal", "MetalSlab", "MetalBar", "Ore"],
  everything: [],
};

const FAVOR_RANKS: Record<string, number> = {
  Hated: 0,
  Neutral: 1,
  "Tolerated": 2,
  "Comfortable": 3,
  "Friends": 4,
  "Close Friends": 5,
  "CloseFriends": 5,
  "Like Family": 6,
  "LikeFamily": 6,
  "Best Friends": 7,
  "BestFriends": 7,
  "Soul Mates": 8,
  "SoulMates": 8,
};

function normalizeCategoryText(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];

  // Check for "everything" first
  if (lower.includes("everything")) {
    matched.push("everything");
    return matched;
  }

  for (const key of Object.keys(BUY_CATEGORY_KEYWORDS)) {
    if (key === "everything") continue;
    // Check if the category text contains this keyword
    if (lower.includes(key)) {
      matched.push(key);
    }
  }

  // Broader matching for common terms
  if (lower.includes("weapons") && !matched.includes("weapon")) matched.push("weapon");
  if (lower.includes("armor") && !matched.includes("armor")) matched.push("armor");
  if (lower.includes("potions") && !matched.includes("potion")) matched.push("potion");
  if (lower.includes("recipes") && !matched.includes("recipe")) matched.push("recipe");
  if (lower.includes("scrolls") && !matched.includes("recipe")) matched.push("recipe");
  if (lower.includes("books") && !matched.includes("book")) matched.push("book");
  if (lower.includes("gems") && !matched.includes("gem")) matched.push("gem");
  if (lower.includes("metals") && !matched.includes("metal")) matched.push("metal");
  if (lower.includes("skins") && !matched.includes("skin")) matched.push("skin");
  if (lower.includes("mushrooms") && !matched.includes("mushroom")) matched.push("mushroom");
  if (lower.includes("drugs") && !matched.includes("drug")) matched.push("drug");
  if (lower.includes("bones") && !matched.includes("bone")) matched.push("bone");
  if (lower.includes("skulls") && !matched.includes("skull")) matched.push("skull");
  if (lower.includes("painting") && !matched.includes("painting")) matched.push("painting");
  if (lower.includes("furniture") && !matched.includes("furniture")) matched.push("furniture");
  if (lower.includes("vegetables") && !matched.includes("vegetable")) matched.push("vegetable");
  if (lower.includes("tools") && !matched.includes("tool")) matched.push("tool");
  if (lower.includes("flowers") && !matched.includes("flower")) matched.push("flower");
  if (lower.includes("seeds") && !matched.includes("seed")) matched.push("seed");
  if (lower.includes("oils") && !matched.includes("oil")) matched.push("oil");
  if (lower.includes("dusts") && !matched.includes("dust")) matched.push("dust");
  if (lower.includes("cloth") && !matched.includes("cloth")) matched.push("cloth");
  if (lower.includes("coins") && !matched.includes("coin")) matched.push("coin");
  if (lower.includes("textbooks") && !matched.includes("textbook")) matched.push("textbook");
  if (lower.includes("jewelry") && !matched.includes("jewelry")) matched.push("jewelry");

  return matched;
}

function doesNpcBuyItem(
  npc: NpcData,
  item: InventoryItem,
  cdnItem: CdnItemData | undefined
): { matches: boolean; category: string } {
  if (!npc.buysStuff) return { matches: false, category: "" };

  const npcCategories = npc.whatTheyBuy.flatMap((c) => normalizeCategoryText(c));

  // "Everything" vendors buy anything
  if (npcCategories.includes("everything")) {
    // Check per-item value cap from raw text
    const raw = npc.whatTheyBuyRaw.toLowerCase();
    const capMatch = raw.match(/(\d+)\s*(ea|each|councils?\s+each)/);
    if (capMatch) {
      const cap = parseInt(capMatch[1]);
      if ((item.Value || 0) > cap) {
        return { matches: false, category: "" };
      }
    }
    return { matches: true, category: "Everything" };
  }

  // Check item name against buy categories (text-based)
  const itemName = item.Name.toLowerCase();
  for (const cat of npcCategories) {
    const keywords = BUY_CATEGORY_KEYWORDS[cat];
    if (!keywords) continue;
    // Text match against item name
    for (const kw of keywords) {
      if (itemName.includes(kw.toLowerCase())) {
        return { matches: true, category: cat };
      }
    }
  }

  // Check CDN keywords if available
  if (cdnItem?.Keywords) {
    for (const cat of npcCategories) {
      const catKeywords = BUY_CATEGORY_KEYWORDS[cat];
      if (!catKeywords) continue;
      for (const itemKw of cdnItem.Keywords) {
        for (const catKw of catKeywords) {
          if (
            itemKw.toLowerCase().includes(catKw.toLowerCase()) ||
            catKw.toLowerCase().includes(itemKw.toLowerCase())
          ) {
            return { matches: true, category: cat };
          }
        }
      }
    }
  }

  return { matches: false, category: "" };
}

function findFavorMatches(
  npc: NpcData,
  item: InventoryItem,
  _cdnNpc: CdnNpcData | undefined
): FavorMatch[] {
  const matches: FavorMatch[] = [];
  const itemName = item.Name.toLowerCase();

  // Match against spreadsheet favor items
  for (const favor of npc.favorItems) {
    if (favor.desire === "Hate" || favor.desire === "Dislike") continue;
    for (const favorItem of favor.items) {
      const favorLower = favorItem.toLowerCase();
      // Check for substring match in either direction
      if (
        itemName.includes(favorLower) ||
        favorLower.includes(itemName) ||
        fuzzyFavorMatch(itemName, favorLower)
      ) {
        matches.push({
          npc,
          desire: favor.desire as "Love" | "Like",
          matchedOn: favorItem,
        });
      }
    }
  }

  return matches;
}

function fuzzyFavorMatch(itemName: string, favorText: string): boolean {
  // Handle plural/singular differences
  const singularItem = itemName.replace(/s$/, "");
  const singularFavor = favorText.replace(/s$/, "");
  if (singularItem.includes(singularFavor) || singularFavor.includes(singularItem)) {
    return true;
  }
  // Check individual words
  const favorWords = favorText.split(/\s+/).filter((w) => w.length > 3);
  if (favorWords.length > 0) {
    return favorWords.every((w) => itemName.includes(w));
  }
  return false;
}

function isHatedByNpc(npc: NpcData, item: InventoryItem): boolean {
  const itemName = item.Name.toLowerCase();
  for (const favor of npc.favorItems) {
    if (favor.desire !== "Hate" && favor.desire !== "Dislike") continue;
    for (const favorItem of favor.items) {
      const favorLower = favorItem.toLowerCase();
      if (itemName.includes(favorLower) || favorLower.includes(itemName)) {
        return true;
      }
    }
  }
  return false;
}

export function findBestVendors(
  item: InventoryItem,
  npcs: NpcData[],
  cdnItems: Record<string, CdnItemData>,
  _cdnNpcs: Record<string, CdnNpcData>
): VendorMatch[] {
  const cdnItem = findCdnItem(item, cdnItems);
  const vendors: VendorMatch[] = [];

  for (const npc of npcs) {
    if (!npc.buysStuff || !npc.councilLimit) continue;
    const { matches, category } = doesNpcBuyItem(npc, item, cdnItem);
    if (matches) {
      vendors.push({
        npc,
        councilLimit: npc.councilLimit,
        categoryMatch: category,
      });
    }
  }

  // Sort by council limit (desc), then priority (asc)
  vendors.sort((a, b) => {
    const limitDiff = b.councilLimit - a.councilLimit;
    if (limitDiff !== 0) return limitDiff;
    return (a.npc.priority || 99) - (b.npc.priority || 99);
  });

  return vendors;
}

export function findFavorItems(
  item: InventoryItem,
  npcs: NpcData[],
  cdnNpcs: Record<string, CdnNpcData>
): FavorMatch[] {
  const allMatches: FavorMatch[] = [];
  const cdnNpcByName = buildCdnNpcNameMap(cdnNpcs);

  for (const npc of npcs) {
    if (isHatedByNpc(npc, item)) continue;
    const cdnNpc = cdnNpcByName.get(npc.name.toLowerCase());
    const matches = findFavorMatches(npc, item, cdnNpc);
    allMatches.push(...matches);
  }

  // Sort: Loves first, then by priority
  allMatches.sort((a, b) => {
    if (a.desire !== b.desire) return a.desire === "Love" ? -1 : 1;
    return (a.npc.priority || 99) - (b.npc.priority || 99);
  });

  return allMatches;
}

export function generateSellRecommendations(
  vaults: StorageVault[],
  npcs: NpcData[],
  cdnItems: Record<string, CdnItemData>,
  cdnNpcs: Record<string, CdnNpcData>
): SellRecommendation[] {
  const recommendations: SellRecommendation[] = [];

  for (const vault of vaults) {
    for (const item of vault.items) {
      const bestVendors = findBestVendors(item, npcs, cdnItems, cdnNpcs);
      const favorMatches = findFavorItems(item, npcs, cdnNpcs);
      recommendations.push({
        item,
        vaultName: vault.name,
        bestVendors,
        favorMatches,
      });
    }
  }

  return recommendations;
}

function findCdnItem(
  item: InventoryItem,
  cdnItems: Record<string, CdnItemData>
): CdnItemData | undefined {
  // Try by ItemCode first
  if (item.ItemCode) {
    const key = `item_${item.ItemCode}`;
    if (cdnItems[key]) return cdnItems[key];
  }
  // Try by name match
  const nameLower = item.Name.toLowerCase();
  for (const cdnItem of Object.values(cdnItems)) {
    if (cdnItem.Name?.toLowerCase() === nameLower) return cdnItem;
  }
  return undefined;
}

function buildCdnNpcNameMap(
  cdnNpcs: Record<string, CdnNpcData>
): Map<string, CdnNpcData> {
  const map = new Map<string, CdnNpcData>();
  for (const npc of Object.values(cdnNpcs)) {
    if (npc.Name) map.set(npc.Name.toLowerCase(), npc);
  }
  return map;
}

export function getFavorRank(favor: string): number {
  return FAVOR_RANKS[favor] ?? 1;
}

export function getZones(npcs: NpcData[]): string[] {
  const zones = new Set<string>();
  for (const npc of npcs) {
    if (npc.zone) zones.add(npc.zone);
  }
  return Array.from(zones).sort();
}
