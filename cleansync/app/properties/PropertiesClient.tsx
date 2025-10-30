"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { AddPropertyModal } from "./components/AddPropertyModal";
import { PropertyList, type Property } from "./components/PropertyList";
import type { PropertyPayload } from "@/components/forms/PropertyForm";

export function PropertiesClient({
  email,
  initialProperties,
}: {
  email?: string | null;
  initialProperties: Property[];
}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProperties = async () => {
    const response = await fetch("/api/properties", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load properties");
    }
    const data = (await response.json()) as Property[];
    setProperties(data);
  };

  const handleCreate = async (payload: PropertyPayload) => {
    setError(null);
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const { error: message } = await response.json();
      throw new Error(message ?? "Unable to create property");
    }

    await refreshProperties();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const response = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const { error: message } = await response.json();
      setError(message ?? "Unable to delete property");
    } else {
      setProperties((prev) => prev.filter((property) => property.id !== id));
    }
  };

  const handleUpdate = async (id: string, payload: PropertyPayload) => {
    setError(null);
    const response = await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const { error: message } = await response.json();
      throw new Error(message ?? "Unable to update property");
    }

    await refreshProperties();
  };

  const handleSync = async (id: string) => {
    setError(null);
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id }),
    });

    if (!response.ok) {
      const { error: message } = await response.json();
      setError(message ?? "Unable to sync property");
    }
  };

  return (
    <AppShell email={email}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Properties</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage each rental and its connected calendar feed.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add property</Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <PropertyList
        properties={properties}
        onDelete={handleDelete}
        onSync={handleSync}
        onUpdate={handleUpdate}
      />

      <AddPropertyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </AppShell>
  );
}
