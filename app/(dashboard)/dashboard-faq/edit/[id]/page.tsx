import EditFaqDashboard from "@/app/components/dashboard/faq/edit/editfaq";

export default function DashboardEditFaqPage({ params }: { params: { id: string } }) {
  return <EditFaqDashboard id={params.id} />;
}
