"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const role =
        user?.app_metadata?.role ||
        user?.user_metadata?.role;

      if (role !== "admin") {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    };

    check();
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Verifying admin access...
      </div>
    );
  }

  return <>{children}</>;
}
