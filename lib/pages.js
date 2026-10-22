import { cache } from 'react';
import { createSupabaseServerClient } from './supabase/server';

const PAGE_SELECT = `
  title,
  slug,
  meta_title,
  meta_description,
  sections (
    id,
    type,
    position,
    internal_name,
    theme,
    layout,
    eyebrow,
    heading,
    heading_highlights,
    body,
    subheading,
    video_url,
    video_caption,
    video_subcaption,
    section_images (
      position,
      media (storage_path, alt_text, caption, mime_type)
    ),
    sub_blocks (position, title, body),
    ctas (position, label, url, open_in_new_tab, style),
    statistics (
      position,
      label,
      value,
      heading,
      body,
      cta_text,
      cta_url,
      grants (
        position,
        name,
        body,
        link_url,
        link_label,
        media (storage_path, alt_text, caption, mime_type)
      )
    ),
    events (
      position,
      title,
      description,
      date_time,
      media (storage_path, alt_text, caption, mime_type)
    ),
    testimonials (
      position,
      author,
      body,
      media (storage_path, alt_text, caption, mime_type)
    ),
    partnerships (
      position,
      name,
      media (storage_path, alt_text, caption, mime_type)
    )
  )
`;

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

function mapSection(section) {
  return {
    id: section.id,
    type: section.type,
    position: section.position,
    internalName: section.internal_name,
    theme: section.theme,
    layout: section.layout,
    eyebrow: section.eyebrow,
    heading: section.heading,
    headingHighlights: section.heading_highlights ?? [],
    body: section.body,
    subheading: section.subheading,
    videoUrl: section.video_url,
    videoCaption: section.video_caption,
    videoSubcaption: section.video_subcaption,
    images: byPosition(section.section_images)
      .map((row) => mediaFields(row.media))
      .filter(Boolean),
    subBlocks: byPosition(section.sub_blocks).map((block) => ({
      title: block.title,
      body: block.body,
    })),
    ctas: byPosition(section.ctas).map((cta) => ({
      label: cta.label,
      url: cta.url,
      openInNewTab: cta.open_in_new_tab,
      style: cta.style,
    })),
    statistics: byPosition(section.statistics).map((stat) => ({
      label: stat.label,
      value: stat.value,
      heading: stat.heading,
      body: stat.body,
      ctaText: stat.cta_text,
      ctaUrl: stat.cta_url,
      grants: byPosition(stat.grants).map((grant) => ({
        name: grant.name,
        body: grant.body,
        link: { url: grant.link_url, label: grant.link_label },
        image: mediaFields(grant.media),
      })),
    })),
    events: byPosition(section.events).map((event) => ({
      title: event.title,
      description: event.description,
      dateTime: event.date_time,
      image: mediaFields(event.media),
    })),
    testimonials: byPosition(section.testimonials).map((item) => ({
      author: item.author,
      body: item.body,
      image: mediaFields(item.media),
    })),
    partnerships: byPosition(section.partnerships).map((item) => ({
      name: item.name,
      image: mediaFields(item.media),
    })),
  };
}

function attachUrl(supabase, image) {
  if (!image?.storagePath) return null;
  const { data } = supabase.storage.from('site-media').getPublicUrl(image.storagePath);
  return { ...image, url: data.publicUrl };
}

function withPublicUrls(supabase, page) {
  if (!page) return null;

  return {
    ...page,
    sections: page.sections.map((section) => ({
      ...section,
      images: section.images.map((image) => attachUrl(supabase, image)).filter(Boolean),
      statistics: section.statistics.map((stat) => ({
        ...stat,
        grants: stat.grants.map((grant) => ({
          ...grant,
          image: attachUrl(supabase, grant.image),
        })),
      })),
      events: section.events.map((event) => ({
        ...event,
        image: attachUrl(supabase, event.image),
      })),
      testimonials: section.testimonials.map((item) => ({
        ...item,
        image: attachUrl(supabase, item.image),
      })),
      partnerships: section.partnerships.map((item) => ({
        ...item,
        image: attachUrl(supabase, item.image),
      })),
    })),
  };
}

async function loadPageBySlug(slug) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from('pages').select(PAGE_SELECT).eq('slug', slug).maybeSingle();
  if (error) {
    console.error(`Failed to load page "${slug}"`, error.message);
    return null;
  }
  if (!data) return null;

  return withPublicUrls(supabase, {
    title: data.title,
    slug: data.slug,
    seo: {
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
    },
    sections: byPosition(data.sections).map(mapSection),
  });
}

export const getPageBySlug = cache(loadPageBySlug);

async function loadSocialLinks(supabase) {
  const { data, error } = await supabase
    .from('social_links')
    .select('platform, label, url, position')
    .order('position');

  if (error) {
    console.error('Failed to load social links', error.message);
    return null;
  }

  return (data ?? [])
    .filter((link) => link.platform && link.url)
    .map((link) => ({
      platform: link.platform,
      label: link.label,
      url: link.url,
    }));
}

const EMPTY_FOOTER = { blurb: '', copyright: '', links: [], details: [] };

export const getSiteFooter = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return EMPTY_FOOTER;

  const [footerResult, linksResult, detailsResult] = await Promise.all([
    supabase.from('site_footer').select('blurb, copyright').eq('id', true).maybeSingle(),
    supabase.from('footer_links').select('label, url, position').order('position'),
    supabase.from('footer_details').select('label, body, position').order('position'),
  ]);

  if (footerResult.error) console.error('Failed to load site footer', footerResult.error.message);
  if (linksResult.error) console.error('Failed to load footer links', linksResult.error.message);
  if (detailsResult.error) console.error('Failed to load footer details', detailsResult.error.message);

  return {
    blurb: footerResult.data?.blurb ?? '',
    copyright: footerResult.data?.copyright ?? '',
    links: (linksResult.data ?? [])
      .filter((link) => link.label && link.url)
      .map((link) => ({ label: link.label, url: link.url })),
    details: (detailsResult.data ?? [])
      .filter((detail) => detail.label && detail.body)
      .map((detail) => ({ label: detail.label, body: detail.body })),
  };
});

export const getSocialLinks = cache(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const links = await loadSocialLinks(supabase);
  return links ?? [];
});
