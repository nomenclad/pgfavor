export default function HowToUse() {
  return (
    <div className="space-y-6">
      <section className="bg-bg-secondary rounded-lg border border-border p-6">
        <h2 className="text-lg font-bold text-accent mb-4">
          Welcome to pgfavor
        </h2>
        <p className="text-text-secondary mb-4">
          pgfavor helps you decide <strong className="text-text-primary">which NPCs to sell your items to</strong> for
          maximum councils and <strong className="text-text-primary">which items to gift for favor</strong> instead of
          selling.
        </p>
        <p className="text-text-secondary">
          Load your Project Gorgon inventory export to get personalized recommendations based on
          150+ NPCs and their preferences.
        </p>
      </section>

      <section className="bg-bg-secondary rounded-lg border border-border p-6">
        <h3 className="text-md font-bold text-text-primary mb-3">
          How to Export Your Data
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li>
            Open Project Gorgon and go to the <strong className="text-text-primary">VIP Menu</strong>
          </li>
          <li>
            Navigate to the <strong className="text-text-primary">Reports</strong> tab
          </li>
          <li>
            Click <strong className="text-text-primary">Export Storage JSON</strong> to save your inventory
          </li>
          <li>
            Optionally click <strong className="text-text-primary">Export Character JSON</strong> for favor data
          </li>
          <li>
            Load the exported files using the file inputs above
          </li>
        </ol>
      </section>

      <section className="bg-bg-secondary rounded-lg border border-border p-6">
        <h3 className="text-md font-bold text-text-primary mb-3">
          Export File Locations
        </h3>
        <div className="space-y-2 text-sm text-text-secondary">
          <div>
            <span className="text-text-muted">Windows:</span>{" "}
            <code className="text-accent bg-bg-tertiary px-1.5 py-0.5 rounded text-xs">
              %userprofile%\AppData\LocalLow\Elder Game\Project Gorgon\Reports\
            </code>
          </div>
          <div>
            <span className="text-text-muted">Mac:</span>{" "}
            <code className="text-accent bg-bg-tertiary px-1.5 py-0.5 rounded text-xs">
              ~/Library/Logs/Unity/
            </code>
          </div>
          <div>
            <span className="text-text-muted">Linux:</span>{" "}
            <code className="text-accent bg-bg-tertiary px-1.5 py-0.5 rounded text-xs">
              ~/.config/unity3d/Elder Game/Project Gorgon/
            </code>
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary rounded-lg border border-border p-6">
        <h3 className="text-md font-bold text-text-primary mb-3">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-accent font-medium text-sm">Sell Guide</h4>
            <p className="text-text-muted text-sm">
              Find the best NPC vendor for each item in your inventory based on
              council limits and buy categories.
            </p>
          </div>
          <div>
            <h4 className="text-love font-medium text-sm">Favor Guide</h4>
            <p className="text-text-muted text-sm">
              See which items NPCs love or like, so you can gift them for favor
              instead of selling.
            </p>
          </div>
          <div>
            <h4 className="text-success font-medium text-sm">NPC Directory</h4>
            <p className="text-text-muted text-sm">
              Browse all 150+ NPCs with their zones, buy categories, storage,
              skills, and favor preferences.
            </p>
          </div>
          <div>
            <h4 className="text-gold font-medium text-sm">Inventory</h4>
            <p className="text-text-muted text-sm">
              View your loaded items organized by storage location with search
              and filtering.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary rounded-lg border border-border p-6">
        <h3 className="text-md font-bold text-text-primary mb-3">
          NPC Priority Levels
        </h3>
        <p className="text-text-secondary text-sm mb-3">
          NPCs are rated by priority (from the curated spreadsheet) indicating how useful they are:
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-accent/20 text-accent">
            P1 - Essential
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-success/20 text-success">
            P2 - Important
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-gold/20 text-gold">
            P3 - Useful
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-text-muted/20 text-text-muted">
            P4 - Niche
          </span>
        </div>
      </section>

      <p className="text-text-muted text-xs text-center">
        All processing happens in your browser. Your data never leaves your machine.
      </p>
    </div>
  );
}
