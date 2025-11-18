import EditNyemilDashboard from "@/app/components/dashboard/menu/edit/editnyemil";

export default async function EditNyemilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditNyemilDashboard id={id} />;
}