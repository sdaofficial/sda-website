import { TestimonialsEditor } from '@/components/admin/testimonials-editor';
import { getAdminTestimonials } from '@/lib/admin/load';

export const metadata = { title: 'Testimonials' };

export default async function AdminTestimonialsPage() {
  const data = await getAdminTestimonials();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <TestimonialsEditor data={data} />;
}
