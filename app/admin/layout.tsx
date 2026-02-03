"use client";

import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-primary pb-16">
        <div className="mx-auto max-w-6xl px-4 py-6 md:flex md:gap-6">
          <aside className="hidden md:block md:w-64">
            <div className="glass-card-strong rounded-2xl p-5 sticky top-6">
              <h1 className="font-[var(--font-sora)] text-xl">Admin</h1>
              <p className="text-xs text-muted">Manual updates only</p>
              <div className="mt-4">
                <AdminNav />
              </div>
            </div>
          </aside>
          <main className="flex-1 space-y-4">
            <div className="glass-card-strong rounded-2xl px-5 py-4 md:hidden">
              <h1 className="font-[var(--font-sora)] text-xl">Admin Control Room</h1>
              <p className="text-xs text-muted">Manual updates only</p>
              <div className="mt-3">
                <AdminNav />
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
