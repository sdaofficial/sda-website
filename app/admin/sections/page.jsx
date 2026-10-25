import { SectionImagesEditor } from '@/components/admin/section-images-editor';
import { getAdminMedia } from '@/lib/admin/load';

export const metadata = { title: 'Section images' };

export default async function AdminSectionsPage() {
  const data = await getAdminMedia();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <SectionImagesEditor data={data} />;
}
