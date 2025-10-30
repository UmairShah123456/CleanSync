"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PropertyForm, PropertyPayload } from "@/components/forms/PropertyForm";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";

export type Property = {
  id: string;
  name: string;
  ical_url: string;
  created_at?: string;
};

export function PropertyList({
  properties,
  onDelete,
  onSync,
  onUpdate,
}: {
  properties: Property[];
  onDelete: (id: string) => Promise<void>;
  onSync: (id: string) => Promise<void>;
  onUpdate: (id: string, payload: PropertyPayload) => Promise<void>;
}) {
  const [actionId, setActionId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleDelete = async (id: string) => {
    setLoadingAction(id);
    try {
      await onDelete(id);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSync = async (id: string) => {
    setActionId(id);
    try {
      await onSync(id);
    } finally {
      setActionId(null);
    }
  };

  const handleUpdate = async (payload: PropertyPayload) => {
    if (!editing) return;
    setUpdating(true);
    try {
      await onUpdate(editing.id, payload);
      setEditing(null);
    } finally {
      setUpdating(false);
    }
  };

  if (!properties.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        Add your first property to start syncing cleans.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {properties.map((property) => (
          <Card key={property.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {property.name}
                </h3>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {property.ical_url}
                </p>
                {property.created_at ? (
                  <p className="mt-2 text-xs text-slate-400">
                    Added {formatDateTime(property.created_at)}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Button
                  variant="secondary"
                  onClick={() => handleSync(property.id)}
                  disabled={actionId === property.id}
                >
                  {actionId === property.id ? "Syncing..." : "Sync now"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setEditing(property)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(property.id)}
                  disabled={loadingAction === property.id}
                >
                  {loadingAction === property.id ? "Removing..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Edit property"
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        footer={null}
      >
        {editing ? (
          <PropertyForm
            initial={{ name: editing.name, ical_url: editing.ical_url }}
            onSubmit={handleUpdate}
            submitting={updating}
          />
        ) : null}
      </Modal>
    </>
  );
}
