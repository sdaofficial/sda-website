import { GeneralEditor } from '@/components/admin/general-editor';
import { getHomeHeroAdmin } from '@/lib/admin/home';

export default async function AdminGeneralPage() {
  const hero = await getHomeHeroAdmin();
  return <GeneralEditor hero={hero} />;
}
