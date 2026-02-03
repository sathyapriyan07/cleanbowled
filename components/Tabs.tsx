"use client";
import { useState } from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="rounded-2xl bg-cardAlt/70 px-4">
        <div className="flex gap-6 overflow-x-auto border-b border-white/10 text-sm">
          {tabs.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`tab-underline relative whitespace-nowrap pb-3 pt-3 text-xs uppercase tracking-wide transition ${
                  selected ? "tab-underline-active text-ink" : "text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6">{tabs[active].content}</div>
    </div>
  );
}
