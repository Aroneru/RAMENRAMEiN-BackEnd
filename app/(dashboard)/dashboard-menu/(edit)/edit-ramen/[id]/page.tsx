import EditRamenDashboard from "@/app/components/dashboard/menu/edit/editramen";

export default async function EditRamenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditRamenDashboard id={id} />;
}