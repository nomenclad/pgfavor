import { useNavStore } from "../../stores/nav-store";
import type { TabId } from "../../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "how-to-use", label: "How to Use" },
  { id: "sell-guide", label: "Sell Guide" },
  { id: "favor-guide", label: "Favor Guide" },
  { id: "npc-directory", label: "NPC Directory" },
  { id: "inventory", label: "Inventory" },
];

export default function TabBar() {
  const { activeTab, setActiveTab } = useNavStore();

  return (
    <nav className="bg-bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto flex overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-bg-tertiary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
