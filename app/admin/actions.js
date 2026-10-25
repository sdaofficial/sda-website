'use server';

import { createClient } from '@supabase/supabase-js';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function publishHomeHero(draft) {
  const supabase = adminClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        'These edits are saved in this browser. Publishing them to the live site needs SUPABASE_SERVICE_ROLE_KEY on the server.',
    };
  }

  const db = supabase.schema('content');
  const memberUrl = draft?.ctaUrl?.trim();
  if (!memberUrl) return { ok: false, error: 'The Become a member link needs a URL.' };

  const { error: linkError } = await db.from('links').update({ url: memberUrl }).eq('key', 'become_a_member');
  if (linkError) return { ok: false, error: linkError.message };

  for (const metric of draft?.metrics ?? []) {
    if (!metric?.id) continue;
    const { error } = await db
      .from('impact_metrics')
      .update({
        value: metric.value,
        label: metric.label,
        heading: metric.heading,
        body: metric.body,
        cta_text: metric.ctaText,
        cta_url: metric.ctaUrl,
      })
      .eq('id', metric.id);
    if (error) return { ok: false, error: error.message };

    for (const grant of metric.grants ?? []) {
      if (!grant?.id) continue;
      const { error: grantError } = await db
        .from('grants')
        .update({
          name: grant.name,
          body: grant.body,
          link_label: grant.linkLabel,
          link_url: grant.linkUrl,
        })
        .eq('id', grant.id);
      if (grantError) return { ok: false, error: grantError.message };
    }
  }

  return { ok: true };
}
