"use client";

import { FilterForm, FilterState } from "@/components/forms/FilterForm";
import { Button } from "@/components/ui/Button";

export function FilterBar({
  properties,
  onFilterChange,
  onSync,
  syncing,
}: {
  properties: { id: string; name: string }[];
  onFilterChange: (filters: FilterState) => void;
  onSync: () => Promise<void>;
  syncing: boolean;
}) {
  return (
    <div className="space-y-4">
      <FilterForm
        properties={properties}
        onChange={onFilterChange}
        onReset={() => onFilterChange({})}
      />
      <div className="flex justify-end">
        <Button onClick={onSync} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync now"}
        </Button>
      </div>
    </div>
  );
}
