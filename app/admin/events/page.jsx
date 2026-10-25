import { EventsEditor } from '@/components/admin/events-editor';
import { getAdminEvents } from '@/lib/admin/load';

export const metadata = { title: 'Events' };

export default async function AdminEventsPage() {
  const data = await getAdminEvents();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <EventsEditor data={data} />;
}
