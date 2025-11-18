import EditNewsDashboard from "@/app/components/dashboard/news/editnews";

export default async function DashboardEditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditNewsDashboard id={id} />;
}
