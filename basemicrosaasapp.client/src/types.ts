// src/types.ts

export interface Tab {
    id: string;
    label: string;
    contentComponent: React.ComponentType; // Or a more specific type if needed
}

export interface SidebarProps {
    tabs: Tab[];
    activeTabId: string;
    onTabClick: (tabId: string) => void;
}

export interface ContentAreaProps {
    activeTabId: string;
    tabs: Tab[];
}
