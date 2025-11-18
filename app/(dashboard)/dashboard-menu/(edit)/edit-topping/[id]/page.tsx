import EditToppingDashboard from "@/app/components/dashboard/menu/edit/edittopping";

export default async function EditToppingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditToppingDashboard id={id} />;
} 