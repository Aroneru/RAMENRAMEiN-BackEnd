interface MenuTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MenuTabs({ activeTab, setActiveTab }: MenuTabsProps) {
  const tabs = ["ramen", "nyemil", "minuman"];

  return (
    <div className="flex justify-center gap-8 text-lg font-semibold mt-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-1 transition-all ${
            activeTab === tab
              ? "text-white border-b-2 border-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
