import { useEffect } from "react";
import { useNavStore } from "./stores/nav-store";
import { useDataStore } from "./stores/data-store";
import { loadCdnData } from "./lib/cdn";
import Header from "./components/layout/Header";
import TabBar from "./components/layout/TabBar";
import Footer from "./components/layout/Footer";
import FileImport from "./components/import/FileImport";
import HowToUse from "./components/how-to-use/HowToUse";
import SellGuide from "./components/sell-guide/SellGuide";
import FavorGuide from "./components/favor-guide/FavorGuide";
import NpcDirectory from "./components/npc-directory/NpcDirectory";
import Inventory from "./components/inventory/Inventory";

export default function App() {
  const activeTab = useNavStore((s) => s.activeTab);
  const { setCdnData, setCdnLoading, setCdnError } = useDataStore();

  // Load CDN data on mount
  useEffect(() => {
    setCdnLoading(true);
    loadCdnData()
      .then(({ items, npcs, version }) => {
        setCdnData(items, npcs, version);
        setCdnLoading(false);
      })
      .catch((err) => {
        setCdnError(
          `CDN unavailable: ${err instanceof Error ? err.message : "Unknown error"}. Matching will use spreadsheet data only.`
        );
        setCdnLoading(false);
      });
  }, [setCdnData, setCdnLoading, setCdnError]);

  return (
    <>
      <Header />
      <TabBar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <FileImport />

          {/* Persistent tabs: all mounted, shown/hidden via CSS */}
          <div className={activeTab === "how-to-use" ? "" : "hidden"}>
            <HowToUse />
          </div>
          <div className={activeTab === "sell-guide" ? "" : "hidden"}>
            <SellGuide />
          </div>
          <div className={activeTab === "favor-guide" ? "" : "hidden"}>
            <FavorGuide />
          </div>
          <div className={activeTab === "npc-directory" ? "" : "hidden"}>
            <NpcDirectory />
          </div>
          <div className={activeTab === "inventory" ? "" : "hidden"}>
            <Inventory />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
