import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: propertiesData } = await supabase
    .from("properties")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const properties = propertiesData ?? [];

  let cleans: any[] = [];

  if (properties.length) {
    const propertyIds = properties.map((property) => property.id);
    const { data } = await supabase
      .from("cleans")
      .select("id, booking_uid, property_id, scheduled_for, status, notes")
      .in("property_id", propertyIds)
      .order("scheduled_for", { ascending: true });

    cleans = data ?? [];
  }

  const propertyLookup = new Map(properties.map((property) => [property.id, property.name]));

  const initialCleans = cleans.map((clean) => ({
    id: clean.id,
    booking_uid: clean.booking_uid,
    property_id: clean.property_id,
    property_name: propertyLookup.get(clean.property_id) ?? "Unknown property",
    scheduled_for: clean.scheduled_for,
    status: clean.status,
    notes: clean.notes,
  }));

  return (
    <DashboardClient
      email={user.email}
      properties={properties.map((property) => ({
        id: property.id,
        name: property.name,
      }))}
      initialCleans={initialCleans}
    />
  );
}
