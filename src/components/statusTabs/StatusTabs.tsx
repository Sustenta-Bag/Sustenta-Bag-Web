// src/components/pedidos/StatusTabs.tsx
import React from "react";

export type ActiveTabType = "todos" | "pendentes" | "aceitos" | "concluidos";

interface StatusTabsProps {
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: {
    key: ActiveTabType;
    label: string;
    icon: string;
    colorClass: string;
    activeColorClass: string;
  }[] = [
    {
      key: "todos",
      label: "Todos",
      icon: "bx-list-ul",
      colorClass: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
      activeColorClass: "border-[#037335] text-[#037335] bg-green-50",
    },
    {
      key: "pendentes",
      label: "Pendentes",
      icon: "bx-time",
      colorClass: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
      activeColorClass: "border-amber-500 text-amber-700 bg-amber-50",
    },
    {
      key: "aceitos",
      label: "Em Processo",
      icon: "bx-cycling",
      colorClass: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
      activeColorClass: "border-blue-500 text-blue-700 bg-blue-50",
    },
    {
      key: "concluidos",
      label: "Concluídos",
      icon: "bx-check-circle",
      colorClass: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
      activeColorClass: "border-green-500 text-green-700 bg-green-50",
    },
  ];

  return (
    <div className="mb-6 bg-white rounded-t-xl shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? tab.activeColorClass
                : `border-transparent ${tab.colorClass}`
            }`}
          >
            <i className={`bx ${tab.icon} mr-1.5`}></i> {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;
