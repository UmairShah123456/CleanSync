"use client";

import { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatsCards } from "./components/StatsCards";
import { CleanTable, type CleanRow } from "./components/CleanTable";
import { FilterBar } from "./components/FilterBar";
import type { FilterState } from "@/components/forms/FilterForm";
import { Spinner } from "@/components/ui/Spinner";

async function fetchCleansWithFilters(filters: FilterState) {
  const params = new URLSearchParams();

  if (filters.propertyId) params.append("property_id", filters.propertyId);
  if (filters.status) params.append("status", filters.status);
  if (filters.from) params.append("from", filters.from);
  if (filters.to) params.append("to", filters.to);

  const query = params.toString();
  const endpoint = query ? `/api/cleans?${query}` : "/api/cleans";

  const response = await fetch(endpoint, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cleans");
  }

  return (await response.json()) as CleanRow[];
}

const calculateStats = (cleans: CleanRow[]) => {
  const now = Date.now();
  const inThirtyDays = now + 30 * 24 * 60 * 60 * 1000;

  let upcoming = 0;
  let sameDay = 0;
  let cancelled = 0;

  for (const clean of cleans) {
    const scheduled = new Date(clean.scheduled_for).getTime();
    if (clean.status === "scheduled" && scheduled >= now && scheduled <= inThirtyDays) {
      upcoming += 1;
    }
    if (clean.status === "cancelled") {
      cancelled += 1;
    }
    if (clean.notes?.includes("⚠️")) {
      sameDay += 1;
    }
  }

  return { upcoming, sameDay, cancelled } as const;
};

export function DashboardClient({
  email,
  properties,
  initialCleans,
}: {
  email?: string | null;
  properties: { id: string; name: string }[];
  initialCleans: CleanRow[];
}) {
  const [cleans, setCleans] = useState(initialCleans);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(cleans), [cleans]);

  const handleFilterChange = useCallback(
    async (nextFilters: FilterState) => {
      setFilters(nextFilters);
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCleansWithFilters(nextFilters);
        setCleans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch cleans.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      if (!response.ok) {
        throw new Error("Sync failed");
      }
      const fresh = await fetchCleansWithFilters(filters);
      setCleans(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sync calendar.");
    } finally {
      setSyncing(false);
    }
  }, [filters]);

  return (
    <AppShell email={email}>
      <StatsCards stats={stats} />
      <FilterBar
        properties={properties}
        onFilterChange={handleFilterChange}
        onSync={handleSync}
        syncing={syncing}
      />
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500">
          <Spinner className="mr-3" size="sm" /> Loading cleans...
        </div>
      ) : (
        <CleanTable cleans={cleans} />
      )}
    </AppShell>
  );
}
