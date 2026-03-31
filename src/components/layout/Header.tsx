import { useDataStore } from "../../stores/data-store";

export default function Header() {
  const { characterName, itemsLoadedAt, characterLoadedAt, cdnVersion, cdnLoading, cdnError } =
    useDataStore();

  return (
    <header className="bg-bg-secondary border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            pgfavor
          </h1>
          <p className="text-sm text-text-muted">
            Item Selling &amp; Favor Guide for Project Gorgon
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {characterName && (
            <span className="text-text-secondary">
              Character: <span className="text-accent font-medium">{characterName}</span>
            </span>
          )}

          {itemsLoadedAt && (
            <span className="text-success">Items loaded</span>
          )}

          {characterLoadedAt && (
            <span className="text-success">Character loaded</span>
          )}

          {cdnLoading && (
            <span className="text-text-muted">Loading game data...</span>
          )}

          {cdnError && (
            <span className="text-danger text-xs">{cdnError}</span>
          )}

          {cdnVersion && !cdnLoading && (
            <span className="text-text-muted">CDN v{cdnVersion}</span>
          )}
        </div>
      </div>
    </header>
  );
}
