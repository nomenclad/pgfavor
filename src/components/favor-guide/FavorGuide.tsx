import { useState, useMemo } from "react";
import { useDataStore } from "../../stores/data-store";
import { NPC_DATA } from "../../data/npc-data";
import { findFavorItems, getZones } from "../../lib/matching";
import type { NpcData, FavorMatch, InventoryItem } from "../../types";

const ZONES = getZones(NPC_DATA);

interface NpcFavorResult {
  npc: NpcData;
  matches: { item: InventoryItem; desire: "Love" | "Like"; matchedOn: string }[];
}

export default function FavorGuide() {
  const { inventoryItems, cdnNpcs } = useDataStore();
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [desireFilter, setDesireFilter] = useState<"" | "Love" | "Like">("");

  // Build NPC -> matching items map
  const npcResults = useMemo(() => {
    if (inventoryItems.length === 0) return [];

    const npcMap = new Map<string, NpcFavorResult>();

    for (const item of inventoryItems) {
      const matches: FavorMatch[] = findFavorItems(item, NPC_DATA, cdnNpcs);
      for (const match of matches) {
        if (!npcMap.has(match.npc.name)) {
          npcMap.set(match.npc.name, { npc: match.npc, matches: [] });
        }
        npcMap.get(match.npc.name)!.matches.push({
          item,
          desire: match.desire,
          matchedOn: match.matchedOn,
        });
      }
    }

    // Sort: by priority (asc), then by number of matches (desc)
    return Array.from(npcMap.values()).sort((a, b) => {
      const priDiff = (a.npc.priority || 99) - (b.npc.priority || 99);
      if (priDiff !== 0) return priDiff;
      return b.matches.length - a.matches.length;
    });
  }, [inventoryItems, cdnNpcs]);

  const filtered = useMemo(() => {
    return npcResults.filter((result) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !result.npc.name.toLowerCase().includes(s) &&
          !result.matches.some((m) => m.item.Name.toLowerCase().includes(s))
        ) {
          return false;
        }
      }
      if (zoneFilter && result.npc.zone !== zoneFilter) return false;
      if (priorityFilter && result.npc.priority !== parseInt(priorityFilter)) return false;
      if (desireFilter) {
        const hasDesire = result.matches.some((m) => m.desire === desireFilter);
        if (!hasDesire) return false;
      }
      return true;
    });
  }, [npcResults, search, zoneFilter, priorityFilter, desireFilter]);

  if (inventoryItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-bg-secondary rounded-lg border border-border p-8 text-center">
          <p className="text-text-muted mb-2">No inventory loaded.</p>
          <p className="text-text-muted text-sm">
            Load your items export to see which NPCs would appreciate your items as gifts.
          </p>
        </div>

        {/* Still show NPC favor preferences from the spreadsheet */}
        <div className="bg-bg-secondary rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">
            NPC Favor Preferences (from spreadsheet)
          </h3>
          <p className="text-text-muted text-xs mb-4">
            Load items to match against these preferences, or browse below.
          </p>
          <div className="space-y-3">
            {NPC_DATA.filter((n) => n.favorItems.length > 0)
              .sort((a, b) => (a.priority || 99) - (b.priority || 99))
              .slice(0, 30)
              .map((npc) => (
                <div
                  key={npc.name}
                  className="flex flex-wrap gap-x-4 gap-y-1 py-1 border-b border-border/50"
                >
                  <span className="text-text-primary font-medium text-sm min-w-[140px]">
                    {npc.name}
                  </span>
                  <span className="text-accent text-xs">{npc.zone}</span>
                  <span className="text-text-secondary text-xs">{npc.favorItemsRaw}</span>
                </div>
              ))}
            <p className="text-text-muted text-xs">
              ...and {NPC_DATA.filter((n) => n.favorItems.length > 0).length - 30} more NPCs.
              Load your inventory to see matches.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-bg-secondary rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-text-muted mb-1">Search</label>
            <input
              type="text"
              placeholder="Search NPCs or items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Zone</label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">All Zones</option>
              {ZONES.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">All</option>
              <option value="1">P1</option>
              <option value="2">P2</option>
              <option value="3">P3</option>
              <option value="4">P4</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Desire</label>
            <select
              value={desireFilter}
              onChange={(e) => setDesireFilter(e.target.value as "" | "Love" | "Like")}
              className="px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">All</option>
              <option value="Love">Loves Only</option>
              <option value="Like">Likes Only</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {filtered.length} NPCs want items from your inventory
        </p>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((result) => (
          <div
            key={result.npc.name}
            className="bg-bg-secondary rounded-lg border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-medium text-text-primary">{result.npc.name}</h3>
                <p className="text-xs text-accent">{result.npc.zone}</p>
              </div>
              <div className="flex items-center gap-2">
                {result.npc.priority && (
                  <span
                    className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${
                      { 1: "bg-accent/20 text-accent", 2: "bg-success/20 text-success", 3: "bg-gold/20 text-gold", 4: "bg-text-muted/20 text-text-muted" }[result.npc.priority] || ""
                    }`}
                  >
                    P{result.npc.priority}
                  </span>
                )}
                <span className="text-xs text-text-muted">
                  {result.matches.length} item{result.matches.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {result.matches
                .sort((a, b) => (a.desire === "Love" ? -1 : 1))
                .map((match, i) => (
                  <div
                    key={`${match.item.Name}-${i}`}
                    className="flex items-center justify-between gap-2 py-1 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-xs font-medium shrink-0 ${
                          match.desire === "Love" ? "text-love" : "text-success"
                        }`}
                      >
                        {match.desire === "Love" ? "\u2665 Loves" : "\u2606 Likes"}
                      </span>
                      <span className="text-sm text-text-primary truncate">
                        {match.item.Name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      {match.item.Value ? (
                        <span className="text-gold">{match.item.Value.toLocaleString()}c</span>
                      ) : null}
                      <span className="text-text-muted">
                        x{match.item.StackSize || match.item.NumItemsInStack || 1}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {result.npc.favorItemsRaw && (
              <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border/50">
                Full preferences: {result.npc.favorItemsRaw}
              </p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">
          No matching favor items found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
