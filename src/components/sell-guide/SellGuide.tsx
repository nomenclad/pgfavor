import { useState, useMemo } from "react";
import { useDataStore } from "../../stores/data-store";
import { NPC_DATA } from "../../data/npc-data";
import { generateSellRecommendations, getZones } from "../../lib/matching";

const ZONES = getZones(NPC_DATA);

export default function SellGuide() {
  const { storageVaults, inventoryItems, cdnItems, cdnNpcs } = useDataStore();
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [showFavorOnly, setShowFavorOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "value" | "vendor">("value");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const recommendations = useMemo(() => {
    if (inventoryItems.length === 0) return [];
    return generateSellRecommendations(storageVaults, NPC_DATA, cdnItems, cdnNpcs);
  }, [storageVaults, inventoryItems, cdnItems, cdnNpcs]);

  const filtered = useMemo(() => {
    let items = recommendations;

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.item.Name.toLowerCase().includes(s) ||
          r.vaultName.toLowerCase().includes(s)
      );
    }

    if (zoneFilter) {
      items = items.filter((r) =>
        r.bestVendors.some((v) => v.npc.zone === zoneFilter) ||
        r.favorMatches.some((f) => f.npc.zone === zoneFilter)
      );
    }

    if (showFavorOnly) {
      items = items.filter((r) => r.favorMatches.length > 0);
    }

    // Sort
    items = [...items];
    switch (sortBy) {
      case "name":
        items.sort((a, b) => a.item.Name.localeCompare(b.item.Name));
        break;
      case "value":
        items.sort((a, b) => (b.item.Value || 0) - (a.item.Value || 0));
        break;
      case "vendor":
        items.sort(
          (a, b) =>
            (b.bestVendors[0]?.councilLimit || 0) -
            (a.bestVendors[0]?.councilLimit || 0)
        );
        break;
    }

    return items;
  }, [recommendations, search, zoneFilter, showFavorOnly, sortBy]);

  function toggleExpand(idx: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  if (inventoryItems.length === 0) {
    return (
      <div className="bg-bg-secondary rounded-lg border border-border p-8 text-center">
        <p className="text-text-muted mb-2">No inventory loaded.</p>
        <p className="text-text-muted text-sm">
          Load your Project Gorgon items export to see sell recommendations.
        </p>
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
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Vendor Zone</label>
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
            <label className="block text-xs text-text-muted mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "value" | "vendor")}
              className="px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="value">Item Value</option>
              <option value="name">Item Name</option>
              <option value="vendor">Vendor Limit</option>
            </select>
          </div>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showFavorOnly}
              onChange={(e) => setShowFavorOnly(e.target.checked)}
              className="rounded accent-love"
            />
            Favor Items Only
          </label>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {filtered.length} items with recommendations
        </p>
      </div>

      {/* Results Table */}
      <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted text-xs border-b border-border bg-bg-tertiary">
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Storage</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Value</th>
                <th className="px-4 py-2">Best Vendor</th>
                <th className="px-4 py-2">Zone</th>
                <th className="px-4 py-2 text-right">Limit</th>
                <th className="px-4 py-2">Favor?</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => {
                const best = rec.bestVendors[0];
                const topFavor = rec.favorMatches[0];
                const isExpanded = expandedRows.has(idx);

                return (
                  <tr
                    key={`${rec.item.Name}-${rec.vaultName}-${idx}`}
                    className="border-b border-border/50 hover:bg-bg-tertiary/30 cursor-pointer"
                    onClick={() => toggleExpand(idx)}
                  >
                    <td className="px-4 py-2 text-text-primary font-medium">
                      {rec.item.Name}
                      {isExpanded && rec.bestVendors.length > 1 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-text-muted font-normal">
                            All vendors ({rec.bestVendors.length}):
                          </p>
                          {rec.bestVendors.slice(0, 5).map((v, vi) => (
                            <div key={vi} className="text-xs font-normal text-text-secondary">
                              {v.npc.name} ({v.npc.zone}) - {v.councilLimit.toLocaleString()}c
                              <span className="text-text-muted ml-1">[{v.categoryMatch}]</span>
                            </div>
                          ))}
                          {rec.bestVendors.length > 5 && (
                            <p className="text-xs text-text-muted font-normal">
                              ...and {rec.bestVendors.length - 5} more
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-text-muted text-xs">{rec.vaultName}</td>
                    <td className="px-4 py-2 text-right text-text-secondary">
                      {rec.item.StackSize || rec.item.NumItemsInStack || 1}
                    </td>
                    <td className="px-4 py-2 text-right text-gold">
                      {rec.item.Value ? `${rec.item.Value.toLocaleString()}c` : "--"}
                    </td>
                    <td className="px-4 py-2 text-text-primary">
                      {best ? best.npc.name : (
                        <span className="text-text-muted">No vendor found</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-accent text-xs">
                      {best?.npc.zone || "--"}
                    </td>
                    <td className="px-4 py-2 text-right text-gold text-xs">
                      {best ? `${best.councilLimit.toLocaleString()}c` : "--"}
                    </td>
                    <td className="px-4 py-2">
                      {topFavor ? (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                            topFavor.desire === "Love"
                              ? "bg-love/20 text-love"
                              : "bg-success/20 text-success"
                          }`}
                          title={`${topFavor.npc.name} ${topFavor.desire}s ${topFavor.matchedOn}`}
                        >
                          {topFavor.desire === "Love" ? "\u2665" : "\u2606"}{" "}
                          {topFavor.npc.name}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-4">No items match your filters.</p>
      )}
    </div>
  );
}
