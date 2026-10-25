'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@supabase/supabase-js';

const SOCIAL_PLATFORMS = new Set(['instagram', 'x', 'linkedin', 'youtube']);

const MEDIA_USES = [
  ['section_images', 'section images'],
  ['events', 'events'],
  ['volunteer_opportunities', 'volunteer opportunities'],
  ['club_activities', 'club activities'],
  ['testimonials', 'testimonials'],
  ['partnerships', 'partnerships'],
  ['speeches', 'speeches'],
  ['team_members', 'team members'],
  ['grants', 'grants'],
  ['blog_posts', 'blog posts'],
];

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function contentDb(supabase) {
  return supabase.schema('content');
}

function fail(error) {
  const message = typeof error === 'string' ? error : error?.message;
  return { ok: false, error: message || 'Supabase rejected the change.' };
}

function ok() {
  revalidatePath('/', 'layout');
  return { ok: true };
}

function removed() {
  return { ok: true };
}

function requireDb() {
  const supabase = adminClient();
  if (!supabase) return { error: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local before saving.' };
  return { db: contentDb(supabase), supabase };
}

function isNew(id) {
  return String(id).startsWith('new:');
}

function text(value) {
  return typeof value === 'string' ? value : '';
}

function mediaId(value) {
  return value ? value : null;
}

async function placeRows(db, table, ids) {
  for (let index = 0; index < ids.length; index += 1) {
    const { error } = await db.from(table).update({ position: 100000 + index }).eq('id', ids[index]);
    if (error) return error.message;
  }
  for (let index = 0; index < ids.length; index += 1) {
    const { error } = await db.from(table).update({ position: index }).eq('id', ids[index]);
    if (error) return error.message;
  }
  return null;
}

async function syncOrdered(db, table, rows, toPayload) {
  const ids = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const payload = { ...toPayload(row), position: 100000 + index };
    if (isNew(row.id)) {
      const { data, error } = await db.from(table).insert(payload).select('id').single();
      if (error) return { error: error.message };
      ids.push(data.id);
    } else {
      const { error } = await db.from(table).update(payload).eq('id', row.id);
      if (error) return { error: error.message };
      ids.push(row.id);
    }
  }
  const positionError = await placeRows(db, table, ids);
  if (positionError) return { error: positionError };
  return { ids };
}

export async function saveGeneral({ contact, links, socials }) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db, supabase } = client;

  for (const link of links ?? []) {
    if (link.key === 'youtube_story') continue;
    if (!text(link.url).trim()) return fail(`Add a URL for ${link.key}.`);
  }
  for (const link of socials ?? []) {
    if (!SOCIAL_PLATFORMS.has(link.platform)) return fail('Choose Instagram, X, LinkedIn, or YouTube.');
    if (!text(link.label).trim()) return fail('Every social link needs a label.');
    if (!text(link.url).trim()) return fail('Every social link needs a URL.');
  }

  const { error: contactError } = await db.from('contact').upsert({
    id: true,
    office_address: text(contact?.officeAddress),
    email: text(contact?.email),
    phone: text(contact?.phone),
  });
  if (contactError) return fail(contactError);

  for (const link of links ?? []) {
    if (link.key === 'youtube_story') continue;
    const { error } = await db
      .from('links')
      .update({ url: text(link.url).trim(), open_in_new_tab: Boolean(link.openInNewTab) })
      .eq('key', link.key);
    if (error) return fail(error);
  }

  const socialResult = await syncOrdered(supabase, 'social_links', socials ?? [], (link) => ({
    platform: link.platform,
    label: text(link.label).trim(),
    url: text(link.url).trim(),
  }));
  if (socialResult.error) return fail(socialResult.error);

  return ok();
}

export async function deleteSocialLink(id) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  if (isNew(id)) return removed();
  const { error } = await client.supabase.from('social_links').delete().eq('id', id);
  if (error) return fail(error);
  return removed();
}

export async function saveMediaLibrary({ media, videoUrl }) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db, supabase } = client;

  const url = text(videoUrl).trim();
  if (!url) return fail('Add the journey video URL.');
  const { error: videoError } = await db.from('links').update({ url }).eq('key', 'youtube_story');
  if (videoError) return fail(videoError);

  for (const item of media ?? []) {
    const { error } = await supabase.from('media').update({ alt_text: text(item.alt) }).eq('id', item.id);
    if (error) return fail(error);
  }

  return ok();
}

export async function saveSectionImages({ slots }) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db } = client;

  const groups = new Map();
  for (const slot of slots ?? []) {
    const list = groups.get(slot.sectionKey) ?? [];
    list.push(slot);
    groups.set(slot.sectionKey, list);
  }

  for (const [sectionKey, list] of groups) {
    const ids = [];
    for (let index = 0; index < list.length; index += 1) {
      const slot = list[index];
      if (!slot.mediaId) return fail(`Choose an image for ${sectionKey}.`);
      const payload = {
        section_key: sectionKey,
        media_id: slot.mediaId,
        position: 100000 + index,
      };
      if (isNew(slot.id)) {
        const { data, error } = await db.from('section_images').insert(payload).select('id').single();
        if (error) return fail(error);
        ids.push(data.id);
      } else {
        const { error } = await db.from('section_images').update(payload).eq('id', slot.id);
        if (error) return fail(error);
        ids.push(slot.id);
      }
    }
    const positionError = await placeRows(db, 'section_images', ids);
    if (positionError) return fail(positionError);
  }

  return ok();
}

export async function uploadMedia(formData) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const file = formData.get('file');
  const alt = text(formData.get('alt')).trim();
  if (!file || typeof file === 'string' || file.size === 0) return fail('Choose an image file.');
  if (!file.type?.startsWith('image/')) return fail('Upload an image file.');

  const extension = file.name?.includes('.') ? file.name.split('.').pop().toLowerCase() : 'bin';
  const path = `${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await client.supabase.storage.from('site-media').upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return fail(uploadError);

  const { data, error } = await client.supabase
    .from('media')
    .insert({
      storage_path: path,
      alt_text: alt,
      mime_type: file.type,
    })
    .select('id, storage_path, alt_text, mime_type')
    .single();
  if (error) {
    await client.supabase.storage.from('site-media').remove([path]);
    return fail(error);
  }

  const { data: stored } = client.supabase.storage.from('site-media').getPublicUrl(data.storage_path);
  return {
    ok: true,
    media: {
      id: data.id,
      alt: data.alt_text ?? '',
      mimeType: data.mime_type ?? '',
      url: stored?.publicUrl ?? '',
    },
  };
}

export async function deleteMedia(id) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db, supabase } = client;

  const used = [];
  for (const [table, label] of MEDIA_USES) {
    const { count, error } = await db.from(table).select('id', { count: 'exact', head: true }).eq('media_id', id);
    if (error) return fail(error);
    if (count) used.push(label);
  }
  if (used.length) return fail(`This file is still used by ${used.join(', ')}.`);

  const { data, error: lookupError } = await supabase.from('media').select('storage_path').eq('id', id).maybeSingle();
  if (lookupError) return fail(lookupError);
  if (!data) return fail('That file is already gone.');

  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) return fail(error);
  if (data.storage_path) {
    await supabase.storage.from('site-media').remove([data.storage_path]);
  }
  return removed();
}

export async function deleteSectionImage(id) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  if (isNew(id)) return removed();
  const { error } = await client.db.from('section_images').delete().eq('id', id);
  if (error) return fail(error);
  return removed();
}

export async function saveEvents({ events, volunteers, activities }) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db } = client;

  for (const event of events ?? []) {
    if (!text(event.title).trim()) return fail('Every event needs a title.');
    if (!event.startsAt) return fail('Every event needs a start time.');
  }
  for (const item of volunteers ?? []) {
    if (!text(item.title).trim()) return fail('Every volunteer opportunity needs a title.');
  }
  for (const item of activities ?? []) {
    if (!text(item.title).trim()) return fail('Every club activity needs a title.');
  }

  const eventResult = await syncOrdered(db, 'events', events ?? [], (event) => ({
    title: text(event.title),
    description: text(event.description),
    starts_at: event.startsAt,
    media_id: mediaId(event.mediaId),
  }));
  if (eventResult.error) return fail(eventResult.error);

  const volunteerResult = await syncOrdered(db, 'volunteer_opportunities', volunteers ?? [], (item) => ({
    title: text(item.title),
    body: text(item.body),
    media_id: mediaId(item.mediaId),
  }));
  if (volunteerResult.error) return fail(volunteerResult.error);

  const activityResult = await syncOrdered(db, 'club_activities', activities ?? [], (item) => ({
    title: text(item.title),
    body: text(item.body),
    involvement_title: text(item.involvementTitle),
    involvement_body: text(item.involvementBody),
    perks_title: text(item.perksTitle),
    perks_body: text(item.perksBody),
    cta_label: text(item.ctaLabel),
    cta_url: text(item.ctaUrl),
    media_id: mediaId(item.mediaId),
  }));
  if (activityResult.error) return fail(activityResult.error);

  return ok();
}

async function deleteRow(table, id) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  if (isNew(id)) return removed();
  const { error } = await client.db.from(table).delete().eq('id', id);
  if (error) return fail(error);
  return removed();
}

export async function deleteEvent(id) {
  return deleteRow('events', id);
}

export async function deleteVolunteer(id) {
  return deleteRow('volunteer_opportunities', id);
}

export async function deleteActivity(id) {
  return deleteRow('club_activities', id);
}

export async function saveImpact({ partnerships, metrics }) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const { db } = client;

  const partnershipResult = await syncOrdered(db, 'partnerships', partnerships ?? [], (item) => ({
    name: text(item.name),
    media_id: mediaId(item.mediaId),
  }));
  if (partnershipResult.error) return fail(partnershipResult.error);

  const metricIds = [];
  for (let index = 0; index < (metrics ?? []).length; index += 1) {
    const metric = metrics[index];
    if (!text(metric.value).trim() || !text(metric.label).trim()) {
      return fail('Every impact metric needs a value and a label.');
    }
    const payload = {
      position: 100000 + index,
      value: text(metric.value),
      label: text(metric.label),
      heading: text(metric.heading),
      body: text(metric.body),
      cta_text: text(metric.ctaText),
      cta_url: text(metric.ctaUrl),
    };
    let metricId = metric.id;
    if (isNew(metricId)) {
      const { data, error } = await db.from('impact_metrics').insert(payload).select('id').single();
      if (error) return fail(error);
      metricId = data.id;
    } else {
      const { error } = await db.from('impact_metrics').update(payload).eq('id', metricId);
      if (error) return fail(error);
    }
    metricIds.push(metricId);

    const grantIds = [];
    for (let grantIndex = 0; grantIndex < (metric.grants ?? []).length; grantIndex += 1) {
      const grant = metric.grants[grantIndex];
      if (!text(grant.name).trim()) return fail('Every grant needs a name.');
      const grantPayload = {
        metric_id: metricId,
        position: 100000 + grantIndex,
        name: text(grant.name),
        body: text(grant.body),
        link_label: text(grant.linkLabel),
        link_url: text(grant.linkUrl),
        media_id: mediaId(grant.mediaId),
      };
      if (isNew(grant.id)) {
        const { data, error } = await db.from('grants').insert(grantPayload).select('id').single();
        if (error) return fail(error);
        grantIds.push(data.id);
      } else {
        const { error } = await db.from('grants').update(grantPayload).eq('id', grant.id);
        if (error) return fail(error);
        grantIds.push(grant.id);
      }
    }
    const grantError = await placeRows(db, 'grants', grantIds);
    if (grantError) return fail(grantError);
  }

  const metricError = await placeRows(db, 'impact_metrics', metricIds);
  if (metricError) return fail(metricError);
  return ok();
}

export async function deletePartnership(id) {
  return deleteRow('partnerships', id);
}

export async function deleteMetric(id) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  if (isNew(id)) return removed();
  const { error: grantError } = await client.db.from('grants').delete().eq('metric_id', id);
  if (grantError) return fail(grantError);
  const { error } = await client.db.from('impact_metrics').delete().eq('id', id);
  if (error) return fail(error);
  return removed();
}

export async function deleteGrant(id) {
  return deleteRow('grants', id);
}

export async function saveSpeeches(speeches) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  const allowed = new Set(['president', 'staff_adviser']);

  for (const speech of speeches ?? []) {
    if (!allowed.has(speech.role)) return fail('Speeches stay limited to the president and the staff adviser.');
    if (!text(speech.name).trim()) return fail('Each speech needs a name.');
    const payload = {
      name: text(speech.name),
      role_label: text(speech.roleLabel),
      body: text(speech.body),
      media_id: mediaId(speech.mediaId),
    };
    const { data: existing, error: lookupError } = await client.db
      .from('speeches')
      .select('id')
      .eq('role', speech.role)
      .maybeSingle();
    if (lookupError) return fail(lookupError);
    const { error } = existing
      ? await client.db.from('speeches').update(payload).eq('role', speech.role)
      : await client.db.from('speeches').insert({ ...payload, role: speech.role });
    if (error) return fail(error);
  }

  return ok();
}

export async function saveTeam(members) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  for (const member of members ?? []) {
    if (!text(member.name).trim()) return fail('Every team member needs a name.');
    if (!text(member.groupKey).trim()) return fail('Every team member needs a group.');
  }
  const result = await syncOrdered(client.db, 'team_members', members ?? [], (member) => ({
    group_key: text(member.groupKey).trim(),
    group_label: text(member.groupLabel),
    name: text(member.name),
    title: text(member.title),
    profile_url: text(member.profileUrl),
    media_id: mediaId(member.mediaId),
  }));
  if (result.error) return fail(result.error);
  return ok();
}

export async function deleteTeamMember(id) {
  return deleteRow('team_members', id);
}

export async function saveTestimonials(testimonials) {
  const client = requireDb();
  if (client.error) return fail(client.error);
  for (const item of testimonials ?? []) {
    if (!text(item.author).trim()) return fail('Every testimonial needs an author.');
  }
  const result = await syncOrdered(client.db, 'testimonials', testimonials ?? [], (item) => ({
    author: text(item.author),
    body: text(item.body),
    media_id: mediaId(item.mediaId),
  }));
  if (result.error) return fail(result.error);
  return ok();
}

export async function deleteTestimonial(id) {
  return deleteRow('testimonials', id);
}
