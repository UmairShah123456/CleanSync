import { Table, THead, TH, TBody, TRow, TD } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/utils";

export type LogRow = {
  id: string;
  property_name: string;
  run_at: string;
  bookings_added: number;
  bookings_removed: number;
  bookings_updated: number;
};

export function LogTable({ logs }: { logs: LogRow[] }) {
  if (!logs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        No sync activity yet. Trigger a sync to populate this list.
      </div>
    );
  }

  return (
    <Table>
      <THead>
        <TH>Run at</TH>
        <TH>Property</TH>
        <TH>Added</TH>
        <TH>Updated</TH>
        <TH>Cancelled</TH>
      </THead>
      <TBody>
        {logs.map((log) => (
          <TRow key={log.id}>
            <TD>{formatDateTime(log.run_at)}</TD>
            <TD>{log.property_name}</TD>
            <TD>{log.bookings_added}</TD>
            <TD>{log.bookings_updated}</TD>
            <TD>{log.bookings_removed}</TD>
          </TRow>
        ))}
      </TBody>
    </Table>
  );
}
