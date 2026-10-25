import { TeamEditor } from '@/components/admin/team-editor';
import { getAdminTeam } from '@/lib/admin/load';

export const metadata = { title: 'Team' };

export default async function AdminTeamPage() {
  const data = await getAdminTeam();
  if (!data) return <p className="p-8 text-sm text-gray-600">Supabase is not configured.</p>;
  return <TeamEditor data={data} />;
}
