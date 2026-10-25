import { SpeechesEditor } from '@/components/admin/speeches-editor';
import { getAdminSpeeches } from '@/lib/admin/load';

export const metadata = { title: 'Speeches' };

export default async function AdminSpeechesPage() {
  const data = await getAdminSpeeches();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <SpeechesEditor data={data} />;
}
