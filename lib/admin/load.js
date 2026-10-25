import { cache } from 'react';

import { createSupabaseServerClient } from '@/lib/supabase/server';

function contentDb(supabase) {
  return supabase.schema('content');
}

function mediaUrl(supabase, path) {
  if (!path) return '';
  const { data } = supabase.storage.from('site-media').getPublicUrl(path);
  return data?.publicUrl ?? '';
}

const getMediaLibrary = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('media')
    .select('id, storage_path, alt_text, mime_type')
    .order('created_at');

  if (error) {
    console.error('Failed to load media library', error.message);
    return [];
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    alt: item.alt_text ?? '',
    mimeType: item.mime_type ?? '',
    url: mediaUrl(supabase, item.storage_path),
  }));
});

export const getAdminGeneral = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);

  const [contactResult, linksResult, socialResult] = await Promise.all([
    db.from('contact').select('office_address, email, phone').eq('id', true).maybeSingle(),
    db.from('links').select('key, url, open_in_new_tab').order('key'),
    supabase.from('social_links').select('id, platform, label, url, position').order('position'),
  ]);

  if (contactResult.error) console.error('Failed to load contact', contactResult.error.message);
  if (linksResult.error) console.error('Failed to load links', linksResult.error.message);
  if (socialResult.error) console.error('Failed to load social links', socialResult.error.message);

  return {
    contact: {
      officeAddress: contactResult.data?.office_address ?? '',
      email: contactResult.data?.email ?? '',
      phone: contactResult.data?.phone ?? '',
    },
    links: (linksResult.data ?? [])
      .filter((link) => link.key !== 'youtube_story')
      .map((link) => ({
        key: link.key,
        url: link.url ?? '',
        openInNewTab: Boolean(link.open_in_new_tab),
      })),
    socials: (socialResult.data ?? []).map((link) => ({
      id: link.id,
      platform: link.platform,
      label: link.label ?? '',
      url: link.url ?? '',
    })),
  };
});

export const getAdminMedia = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);

  const [media, slotsResult, videoResult] = await Promise.all([
    getMediaLibrary(),
    db.from('section_images').select('id, section_key, position, media_id').order('section_key').order('position'),
    db.from('links').select('url').eq('key', 'youtube_story').maybeSingle(),
  ]);

  if (slotsResult.error) console.error('Failed to load section images', slotsResult.error.message);
  if (videoResult.error) console.error('Failed to load journey video', videoResult.error.message);

  return {
    media,
    videoUrl: videoResult.data?.url ?? '',
    slots: (slotsResult.data ?? []).map((slot) => ({
      id: slot.id,
      sectionKey: slot.section_key,
      mediaId: slot.media_id ?? '',
    })),
  };
});

export const getAdminEvents = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);
  const media = await getMediaLibrary();

  const [eventsResult, volunteerResult, activityResult] = await Promise.all([
    db.from('events').select('id, position, title, description, starts_at, media_id').order('position'),
    db.from('volunteer_opportunities').select('id, position, title, body, media_id').order('position'),
    db
      .from('club_activities')
      .select(
        'id, position, title, body, involvement_title, involvement_body, perks_title, perks_body, cta_label, cta_url, media_id',
      )
      .order('position'),
  ]);

  for (const result of [eventsResult, volunteerResult, activityResult]) {
    if (result.error) console.error('Failed to load events tab', result.error.message);
  }

  return {
    media,
    events: (eventsResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title ?? '',
      description: row.description ?? '',
      startsAt: row.starts_at ?? '',
      mediaId: row.media_id ?? '',
    })),
    volunteers: (volunteerResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title ?? '',
      body: row.body ?? '',
      mediaId: row.media_id ?? '',
    })),
    activities: (activityResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title ?? '',
      body: row.body ?? '',
      involvementTitle: row.involvement_title ?? '',
      involvementBody: row.involvement_body ?? '',
      perksTitle: row.perks_title ?? '',
      perksBody: row.perks_body ?? '',
      ctaLabel: row.cta_label ?? '',
      ctaUrl: row.cta_url ?? '',
      mediaId: row.media_id ?? '',
    })),
  };
});

export const getAdminImpact = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);

  const [media, partnershipsResult, metricsResult] = await Promise.all([
    getMediaLibrary(),
    db.from('partnerships').select('id, position, name, media_id').order('position'),
    db
      .from('impact_metrics')
      .select('id, position, value, label, heading, body, cta_text, cta_url, grants(id, position, name, body, link_label, link_url, media_id)')
      .order('position'),
  ]);

  if (partnershipsResult.error) console.error('Failed to load partnerships', partnershipsResult.error.message);
  if (metricsResult.error) console.error('Failed to load impact metrics', metricsResult.error.message);

  return {
    media,
    partnerships: (partnershipsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? '',
      mediaId: row.media_id ?? '',
    })),
    metrics: (metricsResult.data ?? []).map((row) => ({
      id: row.id,
      value: row.value ?? '',
      label: row.label ?? '',
      heading: row.heading ?? '',
      body: row.body ?? '',
      ctaText: row.cta_text ?? '',
      ctaUrl: row.cta_url ?? '',
      grants: [...(row.grants ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((grant) => ({
          id: grant.id,
          name: grant.name ?? '',
          body: grant.body ?? '',
          linkLabel: grant.link_label ?? '',
          linkUrl: grant.link_url ?? '',
          mediaId: grant.media_id ?? '',
        })),
    })),
  };
});

export const getAdminSpeeches = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);
  const [media, result] = await Promise.all([
    getMediaLibrary(),
    db.from('speeches').select('role, name, role_label, body, media_id'),
  ]);

  if (result.error) console.error('Failed to load speeches', result.error.message);

  const byRole = new Map((result.data ?? []).map((row) => [row.role, row]));

  return {
    media,
    speeches: ['president', 'staff_adviser'].map((role) => {
      const row = byRole.get(role);
      return {
        role,
        name: row?.name ?? '',
        roleLabel: row?.role_label ?? '',
        body: row?.body ?? '',
        mediaId: row?.media_id ?? '',
      };
    }),
  };
});

export const getAdminTeam = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);
  const [media, result] = await Promise.all([
    getMediaLibrary(),
    db
      .from('team_members')
      .select('id, position, group_key, group_label, name, title, profile_url, media_id')
      .order('position'),
  ]);

  if (result.error) console.error('Failed to load team', result.error.message);

  return {
    media,
    members: (result.data ?? []).map((row) => ({
      id: row.id,
      groupKey: row.group_key ?? '',
      groupLabel: row.group_label ?? '',
      name: row.name ?? '',
      title: row.title ?? '',
      profileUrl: row.profile_url ?? '',
      mediaId: row.media_id ?? '',
    })),
  };
});

export const getAdminTestimonials = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const db = contentDb(supabase);
  const [media, result] = await Promise.all([
    getMediaLibrary(),
    db.from('testimonials').select('id, position, author, body, media_id').order('position'),
  ]);

  if (result.error) console.error('Failed to load testimonials', result.error.message);

  return {
    media,
    testimonials: (result.data ?? []).map((row) => ({
      id: row.id,
      author: row.author ?? '',
      body: row.body ?? '',
      mediaId: row.media_id ?? '',
    })),
  };
});
