import EditMinumanDashboard from "@/app/components/dashboard/menu/edit/editminuman";

export default async function EditNyemilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditMinumanDashboard id={id} />;
}