"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📋" },
  { href: "/properties", label: "Properties", icon: "🏠" },
  { href: "/logs", label: "Sync Logs", icon: "🧾" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white p-6 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold text-slate-900">
        <span role="img" aria-label="broom">
          🧹
        </span>
        CleanSync
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <p className="mt-auto text-xs text-slate-400">Smart cleaning schedules for every turnover.</p>
    </aside>
  );
}
