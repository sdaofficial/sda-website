function supabaseStoragePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;

  try {
    return {
      protocol: 'https',
      hostname: new URL(raw).hostname,
      pathname: '/storage/v1/object/public/**',
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'img.youtube.com',
    pathname: '/**',
  },
];

const storagePattern = supabaseStoragePattern();
if (storagePattern) remotePatterns.push(storagePattern);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns,
  },
};

export default nextConfig;
