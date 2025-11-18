import EditNewsDashboard from "@/app/components/dashboard/news/edit/editnews";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditNewsDashboard id={id} />;
}