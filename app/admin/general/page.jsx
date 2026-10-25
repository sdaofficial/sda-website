import { GeneralEditor } from '@/components/admin/general-editor';
import { getAdminGeneral } from '@/lib/admin/load';

export const metadata = { title: 'General' };

export default async function AdminGeneralPage() {
  const data = await getAdminGeneral();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <GeneralEditor data={data} />;
}
