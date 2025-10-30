"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useState } from "react";

export function Topbar({ email }: { email?: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">CleanSync</h1>
        <p className="text-sm text-slate-500">Automated turnovers for your rentals</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        {email ? <span className="hidden text-slate-500 md:block">{email}</span> : null}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={loading}
          className="text-slate-500 hover:text-slate-900"
        >
          {loading ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </header>
  );
}
