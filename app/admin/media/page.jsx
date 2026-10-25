import { MediaEditor } from '@/components/admin/media-editor';
import { getAdminMedia } from '@/lib/admin/load';

export const metadata = { title: 'Media' };

export default async function AdminMediaPage() {
  const data = await getAdminMedia();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <MediaEditor data={data} />;
}
