import { ImpactEditor } from '@/components/admin/impact-editor';
import { getAdminImpact } from '@/lib/admin/load';

export const metadata = { title: 'Partnerships and impact' };

export default async function AdminImpactPage() {
  const data = await getAdminImpact();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <ImpactEditor data={data} />;
}
