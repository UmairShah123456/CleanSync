"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/schedule", label: "Schedule", icon: CalendarIcon },
  { href: "/properties", label: "Properties", icon: BuildingOfficeIcon },
  { href: "/cleaners", label: "Cleaners", icon: UserGroupIcon },
  { href: "/reports", label: "Reports", icon: ChartBarIcon },
];

export function Sidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-gradient-to-b from-[#01161E] to-[#124559] p-6 md:flex md:flex-col">
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#124559]/50">
          <svg
            className="h-5 w-5 text-[#EFF6E0]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold text-[#EFF6E0]">CleanSync</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[#124559]/70 text-[#EFF6E0]"
                  : "text-[#EFF6E0]/70 hover:bg-[#124559]/40 hover:text-[#EFF6E0]"
              )}
            >
              <Icon
                className={clsx(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  active ? "text-[#EFF6E0]" : "text-[#EFF6E0]/70"
                )}
              />
              <span
                className={clsx(
                  active
                    ? "text-[#EFF6E0]"
                    : "text-[#EFF6E0]/70 group-hover:text-[#EFF6E0]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Items */}
      <div className="mt-auto space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#EFF6E0]/70 transition-all duration-200 hover:bg-[#124559]/40 hover:text-[#EFF6E0]"
        >
          <Cog6ToothIcon className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
          Settings
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#EFF6E0]/70 transition-all duration-200 hover:bg-[#124559]/40 hover:text-[#EFF6E0]"
        >
          <QuestionMarkCircleIcon className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
          Help
        </Link>

        {/* User Avatar Section */}
        <div className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#598392] flex items-center justify-center text-sm font-semibold text-[#EFF6E0]">
            {email ? email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#EFF6E0]">
              {email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-[#EFF6E0]/70">Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
