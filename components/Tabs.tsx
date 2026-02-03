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
      <div className="rounded-2xl bg-cardAlt px-4">
        <div className="flex gap-6 border-b border-white/10 text-sm">
        {tabs.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`tab-underline relative pb-3 pt-3 transition ${
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
