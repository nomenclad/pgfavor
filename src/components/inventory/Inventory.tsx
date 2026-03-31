import { useState, useMemo } from "react";
import { useDataStore } from "../../stores/data-store";

export default function Inventory() {
  const { storageVaults, inventoryItems } = useDataStore();
  const [search, setSearch] = useState("");
  const [vaultFilter, setVaultFilter] = useState("");

  const vaultNames = useMemo(
    () => storageVaults.map((v) => v.name),
    [storageVaults]
  );

  const filteredVaults = useMemo(() => {
    return storageVaults
      .filter((v) => !vaultFilter || v.name === vaultFilter)
      .map((vault) => ({
        ...vault,
        items: vault.items.filter(
          (item) =>
            !search ||
            item.Name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((v) => v.items.length > 0);
  }, [storageVaults, search, vaultFilter]);

  if (inventoryItems.length === 0) {
    return (
      <div className="bg-bg-secondary rounded-lg border border-border p-8 text-center">
        <p className="text-text-muted mb-2">No inventory loaded.</p>
        <p className="text-text-muted text-sm">
          Load your Project Gorgon items export JSON using the file input above.
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
            <label className="block text-xs text-text-muted mb-1">Search Items</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Storage</label>
            <select
              value={vaultFilter}
              onChange={(e) => setVaultFilter(e.target.value)}
              className="px-3 py-1.5 rounded bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">All Storage</option>
              {vaultNames.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {inventoryItems.length} items across {storageVaults.length} storage locations
        </p>
      </div>

      {/* Vault sections */}
      {filteredVaults.map((vault) => (
        <div key={vault.name} className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-bg-tertiary border-b border-border">
            <h3 className="text-sm font-medium text-text-primary">
              {vault.name}
              <span className="text-text-muted ml-2">({vault.items.length} items)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted text-xs border-b border-border">
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {vault.items.map((item, i) => (
                  <tr
                    key={`${item.Name}-${i}`}
                    className="border-b border-border/50 hover:bg-bg-tertiary/30"
                  >
                    <td className="px-4 py-1.5 text-text-primary">{item.Name}</td>
                    <td className="px-4 py-1.5 text-right text-text-secondary">
                      {item.StackSize || item.NumItemsInStack || 1}
                    </td>
                    <td className="px-4 py-1.5 text-right text-gold">
                      {item.Value ? `${item.Value.toLocaleString()}c` : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
