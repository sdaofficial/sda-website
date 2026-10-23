export function isVectorImage(image) {
  const mime = image?.mimeType ?? '';
  const path = `${image?.url ?? ''}${image?.storagePath ?? ''}`;
  return mime === 'image/svg+xml' || path.split('?')[0].endsWith('.svg');
}

export function imageAlt(image, fallback = '') {
  return image?.alt?.trim() || image?.caption?.trim() || fallback;
}
