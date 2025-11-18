import EditNewsDashboard from "@/app/components/dashboard/news/editnews";

export default function DashboardEditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditNewsDashboard id={params.id} />;
}
