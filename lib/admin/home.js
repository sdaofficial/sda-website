import { createSupabaseServerClient } from '@/lib/supabase/server';

function byPosition(items) {
  return [...(items ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

async function mediaMap(supabase, ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();

  const { data, error } = await supabase
    .from('media')
    .select('id, storage_path, alt_text')
    .in('id', unique);

  if (error) {
    console.error('Failed to load admin media', error.message);
    return new Map();
  }

  return new Map(
    (data ?? []).map((media) => {
      const { data: file } = supabase.storage.from('site-media').getPublicUrl(media.storage_path);
      return [
        media.id,
        {
          id: media.id,
          url: file.publicUrl,
          alt: media.alt_text ?? '',
          storagePath: media.storage_path,
        },
      ];
    })
  );
}

export async function getHomeHeroAdmin() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const db = supabase.schema('content');
  const [linkResult, imageResult, metricResult] = await Promise.all([
    db.from('links').select('url').eq('key', 'become_a_member').maybeSingle(),
    db.from('section_images').select('id, position, media_id').eq('section_key', 'HOME_HERO'),
    db
      .from('impact_metrics')
      .select(
        'id, position, label, value, heading, body, cta_text, cta_url, grants (id, position, name, body, link_label, link_url, media_id)'
      ),
  ]);

  if (linkResult.error) console.error('Failed to load member link for admin', linkResult.error.message);
  if (imageResult.error) console.error('Failed to load hero images for admin', imageResult.error.message);
  if (metricResult.error) console.error('Failed to load impact metrics for admin', metricResult.error.message);
  if (linkResult.error && imageResult.error && metricResult.error) return null;

  const media = await mediaMap(supabase, [
    ...(imageResult.data ?? []).map((row) => row.media_id),
    ...(metricResult.data ?? []).flatMap((metric) => (metric.grants ?? []).map((grant) => grant.media_id)),
  ]);

  return {
    ctaUrl: linkResult.data?.url ?? '',
    images: byPosition(imageResult.data).map((row) => ({
      id: row.id,
      position: row.position,
      image: media.get(row.media_id) ?? null,
    })),
    metrics: byPosition(metricResult.data).map((stat) => ({
      id: stat.id,
      value: stat.value ?? '',
      label: stat.label ?? '',
      heading: stat.heading ?? '',
      body: stat.body ?? '',
      ctaText: stat.cta_text ?? '',
      ctaUrl: stat.cta_url ?? '',
      grants: byPosition(stat.grants).map((grant) => ({
        id: grant.id,
        name: grant.name ?? '',
        body: grant.body ?? '',
        linkLabel: grant.link_label ?? '',
        linkUrl: grant.link_url ?? '',
        image: media.get(grant.media_id) ?? null,
      })),
    })),
  };
}
