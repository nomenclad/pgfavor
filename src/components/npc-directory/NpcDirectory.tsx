import { useState, useMemo } from "react";
import { NPC_DATA } from "../../data/npc-data";
import { getZones } from "../../lib/matching";
import type { NpcData } from "../../types";

const ZONES = getZones(NPC_DATA);

function PriorityBadge({ priority }: { priority: number | null }) {
  if (priority === null) return <span className="text-text-muted text-xs">--</span>;
  const colors: Record<number, string> = {
    1: "bg-accent/20 text-accent",
    2: "bg-success/20 text-success",
    3: "bg-gold/20 text-gold",
    4: "bg-text-muted/20 text-text-muted",
  };
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${colors[priority] || colors[4]}`}>
      P{priority}
    </span>
  );
}

function DesireBadge({ desire }: { desire: string }) {
  const colors: Record<string, string> = {
    Love: "text-love",
    Like: "text-success",
    Hate: "text-danger",
    Dislike: "text-warning",
  };
  return <span className={`font-medium ${colors[desire] || "text-text-secondary"}`}>{desire}s</span>;
}

function NpcCard({ npc }: { npc: NpcData }) {
  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-text-primary">{npc.name}</h3>
        <PriorityBadge priority={npc.priority} />
      </div>

      <p className="text-sm text-accent mb-3">{npc.zone}</p>

      {npc.buysStuff && (
        <div className="mb-2">
          <span className="text-xs text-text-muted">Buys: </span>
          <span className="text-xs text-text-secondary">{npc.whatTheyBuyRaw || "Nothing"}</span>
          {npc.councilLimit && (
            <span className="text-xs text-gold ml-1">
              ({npc.councilLimit.toLocaleString()}c
              {npc.councilLimitFavor ? ` at ${npc.councilLimitFavor}` : ""})
            </span>
          )}
        </div>
      )}

      {npc.isStorage && (
        <div className="mb-2">
          <span className="text-xs text-text-muted">Storage: </span>
          <span className="text-xs text-success">
            {npc.storageMax} slots
            {npc.storageNote ? ` (${npc.storageNote})` : ""}
          </span>
        </div>
      )}

      {npc.trainsSkills.length > 0 && (
        <div className="mb-2">
          <span className="text-xs text-text-muted">Trains: </span>
          <span className="text-xs text-text-secondary">{npc.trainsSkills.join(", ")}</span>
        </div>
      )}

      {npc.favorItems.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs text-text-muted block mb-1">Favor:</span>
          <div className="space-y-0.5">
            {npc.favorItems.map((favor, i) => (
              <div key={i} className="text-xs">
                <DesireBadge desire={favor.desire} />{" "}
                <span className="text-text-secondary">{favor.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NpcDirectory() {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showBuyers, setShowBuyers] = useState(false);
  const [showStorage, setShowStorage] = useState(false);

  const filtered = useMemo(() => {
    return NPC_DATA.filter((npc) => {
      if (search && !npc.name.toLowerCase().includes(search.toLowerCase()) &&
          !npc.favorItemsRaw.toLowerCase().includes(search.toLowerCase()) &&
          !npc.whatTheyBuyRaw.toLowerCase().includes(search.toLowerCase()) &&
          !npc.trainsSkills.join(" ").toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (zoneFilter && npc.zone !== zoneFilter) return false;
      if (priorityFilter && npc.priority !== parseInt(priorityFilter)) return false;
      if (showBuyers && !npc.buysStuff) return false;
      if (showStorage && !npc.isStorage) return false;
      return true;
    });
  }, [search, zoneFilter, priorityFilter, showBuyers, showStorage]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-bg-secondary rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-text-muted mb-1">Search</label>
            <input
              type="text"
              placeholder="Search NPCs, items, skills..."
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
              <option value="1">P1 - Essential</option>
              <option value="2">P2 - Important</option>
              <option value="3">P3 - Useful</option>
              <option value="4">P4 - Niche</option>
            </select>
          </div>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showBuyers}
              onChange={(e) => setShowBuyers(e.target.checked)}
              className="rounded accent-accent"
            />
            Buys Stuff
          </label>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showStorage}
              onChange={(e) => setShowStorage(e.target.checked)}
              className="rounded accent-accent"
            />
            Has Storage
          </label>
        </div>
        <p className="text-xs text-text-muted mt-2">
          Showing {filtered.length} of {NPC_DATA.length} NPCs
        </p>
      </div>

      {/* NPC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {filtered.map((npc) => (
          <NpcCard key={npc.name} npc={npc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">No NPCs match your filters.</p>
      )}
    </div>
  );
}
