import { useState } from "react";
import { useDataStore } from "../../stores/data-store";
import { parseItemsJson, parseCharacterJson, readFileAsText } from "../../lib/parser";

export default function FileImport() {
  const { setInventoryData, setCharacterSheet, clearInventory, clearCharacter, itemsLoadedAt, characterLoadedAt } =
    useDataStore();
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [charError, setCharError] = useState<string | null>(null);

  async function handleItemsFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setItemsError(null);
    try {
      const text = await readFileAsText(file);
      const { items, vaults, characterName } = parseItemsJson(text);
      if (items.length === 0) {
        setItemsError("No items found in file. Make sure this is a Project Gorgon items export.");
        return;
      }
      setInventoryData(items, vaults, characterName);
    } catch (err) {
      setItemsError(`Failed to parse: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  async function handleCharacterFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCharError(null);
    try {
      const text = await readFileAsText(file);
      const sheet = parseCharacterJson(text);
      setCharacterSheet(sheet);
    } catch (err) {
      setCharError(`Failed to parse: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-text-primary mb-3">Load Character Data</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-xs text-text-secondary mb-1">
            Items Export (JSON)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleItemsFile}
              className="block w-full text-sm text-text-secondary
                file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0
                file:text-sm file:font-medium file:bg-accent file:text-text-primary
                file:cursor-pointer hover:file:bg-accent-hover"
            />
            {itemsLoadedAt && (
              <button
                onClick={() => { clearInventory(); }}
                className="text-xs text-text-muted hover:text-danger cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {itemsError && (
            <p className="text-danger text-xs mt-1">{itemsError}</p>
          )}
          {itemsLoadedAt && (
            <p className="text-success text-xs mt-1">Loaded at {itemsLoadedAt}</p>
          )}
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-xs text-text-secondary mb-1">
            Character Sheet (JSON) <span className="text-text-muted">- optional</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleCharacterFile}
              className="block w-full text-sm text-text-secondary
                file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0
                file:text-sm file:font-medium file:bg-bg-tertiary file:text-text-primary
                file:cursor-pointer hover:file:bg-accent"
            />
            {characterLoadedAt && (
              <button
                onClick={() => { clearCharacter(); }}
                className="text-xs text-text-muted hover:text-danger cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {charError && (
            <p className="text-danger text-xs mt-1">{charError}</p>
          )}
          {characterLoadedAt && (
            <p className="text-success text-xs mt-1">Loaded at {characterLoadedAt}</p>
          )}
        </div>
      </div>
    </div>
  );
}
