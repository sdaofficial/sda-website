import { cache } from 'react';

import { createSupabaseServerClient } from '@/lib/supabase/server';

function byPosition(items) {
  return [...(items ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function mediaFields(media) {
  if (!media?.storage_path) return null;
  return {
    storagePath: media.storage_path,
    alt: media.alt_text ?? null,
    caption: media.caption ?? null,
    mimeType: media.mime_type ?? null,
  };
}

function attachUrl(supabase, image) {
  if (!image?.storagePath) return null;
  const { data } = supabase.storage.from('site-media').getPublicUrl(image.storagePath);
  return { ...image, url: data.publicUrl };
}

async function loadMediaMap(supabase, ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();

  const { data, error } = await supabase
    .from('media')
    .select('id, storage_path, alt_text, caption, mime_type')
    .in('id', unique);

  if (error) {
    console.error('Failed to load media', error.message);
    return new Map();
  }

  return new Map(
    (data ?? []).map((row) => [row.id, attachUrl(supabase, mediaFields(row))]).filter((entry) => entry[1])
  );
}

function contentDb(supabase) {
  return supabase.schema('content');
}

export const getLinks = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return {};

  const { data, error } = await contentDb(supabase).from('links').select('key, url, open_in_new_tab');
  if (error) {
    console.error('Failed to load links', error.message);
    return {};
  }

  return Object.fromEntries(
    (data ?? [])
      .filter((link) => link.key && link.url)
      .map((link) => [link.key, { url: link.url, openInNewTab: link.open_in_new_tab }])
  );
});

export function linkCta(links, key, label, style) {
  const link = links?.[key];
  return {
    label,
    url: link?.url || '#',
    openInNewTab: Boolean(link?.openInNewTab),
    style: style ?? '',
  };
}

export const getSectionImageMap = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return {};

  const { data, error } = await contentDb(supabase)
    .from('section_images')
    .select('section_key, position, media_id');

  if (error) {
    console.error('Failed to load section images', error.message);
    return {};
  }

  const media = await loadMediaMap(supabase, (data ?? []).map((row) => row.media_id));
  const grouped = {};

  for (const row of data ?? []) {
    const image = media.get(row.media_id);
    if (!image) continue;
    const list = grouped[row.section_key] ?? [];
    list.push({ position: row.position, image });
    grouped[row.section_key] = list;
  }

  return Object.fromEntries(
    Object.entries(grouped).map(([key, list]) => [key, byPosition(list).map((item) => item.image)])
  );
});

async function loadCollection(table, select, mapRow) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await contentDb(supabase).from(table).select(select);
  if (error) {
    console.error(`Failed to load ${table}`, error.message);
    return [];
  }

  const rows = byPosition(data);
  const media = await loadMediaMap(supabase, rows.map((row) => row.media_id));
  return rows.map((row) => mapRow(row, media.get(row.media_id) ?? null));
}

export const getEvents = cache(() =>
  loadCollection(
    'events',
    'position, title, description, starts_at, media_id',
    (row, image) => ({
      title: row.title,
      description: row.description,
      dateTime: row.starts_at,
      image,
    })
  )
);

export const getVolunteerOpportunities = cache(() =>
  loadCollection(
    'volunteer_opportunities',
    'position, title, body, media_id',
    (row, image) => ({
      title: row.title,
      body: row.body,
      image,
    })
  )
);

export const getClubActivities = cache(() =>
  loadCollection(
    'club_activities',
    'position, title, body, involvement_title, involvement_body, perks_title, perks_body, cta_label, cta_url, media_id',
    (row, image) => ({
      title: row.title,
      body: row.body,
      involvementTitle: row.involvement_title,
      involvementBody: row.involvement_body,
      perksTitle: row.perks_title,
      perksBody: row.perks_body,
      ctaLabel: row.cta_label,
      ctaUrl: row.cta_url,
      image,
    })
  )
);

export const getTestimonials = cache(() =>
  loadCollection(
    'testimonials',
    'position, author, body, media_id',
    (row, image) => ({
      author: row.author,
      body: row.body,
      image,
    })
  )
);

export const getPartnerships = cache(() =>
  loadCollection('partnerships', 'position, name, media_id', (row, image) => ({
    name: row.name,
    image,
  }))
);

export const getTeamMembers = cache(() =>
  loadCollection(
    'team_members',
    'position, group_key, group_label, name, title, profile_url, media_id',
    (row, image) => ({
      groupKey: row.group_key,
      groupLabel: row.group_label,
      name: row.name,
      title: row.title,
      profileUrl: row.profile_url,
      image,
    })
  )
);

export const getBlogPosts = cache(() =>
  loadCollection(
    'blog_posts',
    'position, featured, title, body, cta_label, cta_url, media_id',
    (row, image) => ({
      featured: row.featured,
      title: row.title,
      body: row.body,
      ctaLabel: row.cta_label,
      ctaUrl: row.cta_url,
      image,
    })
  )
);

export const getSpeeches = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return {};

  const { data, error } = await contentDb(supabase)
    .from('speeches')
    .select('role, name, role_label, body, media_id');

  if (error) {
    console.error('Failed to load speeches', error.message);
    return {};
  }

  const media = await loadMediaMap(supabase, (data ?? []).map((row) => row.media_id));
  return Object.fromEntries(
    (data ?? []).map((row) => [
      row.role,
      {
        name: row.name,
        roleLabel: row.role_label,
        body: row.body,
        image: media.get(row.media_id) ?? null,
      },
    ])
  );
});

export const getImpactMetrics = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await contentDb(supabase)
    .from('impact_metrics')
    .select(
      'position, value, label, heading, body, cta_text, cta_url, grants (position, name, body, link_url, link_label, media_id)'
    );

  if (error) {
    console.error('Failed to load impact metrics', error.message);
    return [];
  }

  const media = await loadMediaMap(
    supabase,
    (data ?? []).flatMap((metric) => (metric.grants ?? []).map((grant) => grant.media_id))
  );

  return byPosition(data).map((metric) => ({
    value: metric.value,
    label: metric.label,
    heading: metric.heading,
    body: metric.body,
    ctaText: metric.cta_text,
    ctaUrl: metric.cta_url,
    grants: byPosition(metric.grants).map((grant) => ({
      name: grant.name,
      body: grant.body,
      link: { url: grant.link_url, label: grant.link_label },
      image: media.get(grant.media_id) ?? null,
    })),
  }));
});

export const getContact = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await contentDb(supabase)
    .from('contact')
    .select('office_address, email, phone')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Failed to load contact', error.message);
    return null;
  }

  if (!data) return null;

  return {
    officeAddress: data.office_address,
    email: data.email,
    phone: data.phone,
  };
});

export const getSocialLinks = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('social_links')
    .select('platform, label, url, position')
    .order('position');

  if (error) {
    console.error('Failed to load social links', error.message);
    return [];
  }

  return (data ?? [])
    .filter((link) => link.platform && link.url)
    .map((link) => ({
      platform: link.platform,
      label: link.label,
      url: link.url,
    }));
});
