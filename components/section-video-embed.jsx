'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

/** Drive preview iframes often hit redirect/cookie pages on the first paint; a short defer avoids aborted loads (and dev Strict Mode double-mount) clashing with that flow. */
const DRIVE_IFRAME_MOUNT_MS = 220;

function getYoutubeVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const embed = u.pathname.match(/^\/embed\/([^/]+)/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }
  return null;
}

/** File id from share links like /file/d/ID/view or /file/u/0/d/ID/view or /open?id= */
function getGoogleDriveFileId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host !== 'drive.google.com') return null;

    const openId = u.searchParams.get('id');
    if (openId && (u.pathname === '/open' || u.pathname.startsWith('/open'))) {
      return openId;
    }
    if (openId && u.pathname === '/uc') {
      return openId;
    }

    const parts = u.pathname.split('/').filter(Boolean);
    const dIdx = parts.indexOf('d');
    if (dIdx !== -1 && parts[dIdx + 1]) {
      const id = parts[dIdx + 1];
      if (id !== 'view' && id !== 'edit' && id !== 'preview') return id;
    }
    return null;
  } catch {
    return null;
  }
}

export function SectionVideoEmbed({ videoUrl, videoCaption, videoSubcaption, coverImageUrl, coverAlt, priority }) {
  const [isPlaying, setIsPlaying] = useState(false);
  /** For Google Drive only: wait before attaching iframe src so redirects / RotateCookies are not torn down by React remounts. */
  const [driveEmbedMounted, setDriveEmbedMounted] = useState(false);

  const yt = videoUrl ? getYoutubeVideoId(videoUrl) : null;
  const drive = videoUrl && !yt ? getGoogleDriveFileId(videoUrl) : null;

  const youtubePoster = yt && !coverImageUrl ? `https://img.youtube.com/vi/${yt}/maxresdefault.jpg` : null;
  const posterSrc = coverImageUrl || youtubePoster;

  useEffect(() => {
    if (!isPlaying) {
      setDriveEmbedMounted(false);
      return undefined;
    }
    if (!drive) {
      return undefined;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setDriveEmbedMounted(true);
    }, DRIVE_IFRAME_MOUNT_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setDriveEmbedMounted(false);
    };
  }, [isPlaying, drive]);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const iframeTitle = videoCaption?.trim() || 'Video';

  const showDrivePoster =
    Boolean(drive) && isPlaying && !driveEmbedMounted;

  const embed = isPlaying ? (
    yt ? (
      <iframe
        key="yt"
        className="absolute inset-0 z-10 h-full w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    ) : drive && driveEmbedMounted ? (
      <iframe
        key={`drive-${drive}`}
        className="absolute inset-0 z-10 h-full w-full border-0"
        src={`https://drive.google.com/file/d/${drive}/preview`}
        title={iframeTitle}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    ) : null
  ) : null;

  return (
    <div className="relative mx-auto aspect-video w-full max-w-[560px] overflow-hidden rounded-3xl shadow-lg max-md:max-w-full">
      {embed}

      {!isPlaying || showDrivePoster ? (
        <>
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={coverAlt?.trim() || 'Video cover'}
              fill
              className={showDrivePoster ? 'object-cover object-center brightness-[0.92]' : 'object-cover object-center'}
              sizes="(max-width: 768px) 100vw, 560px"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" aria-hidden />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 p-4">
            {showDrivePoster ? (
              <p className="text-sm font-medium text-white/90" aria-live="polite">
                Loading player…
              </p>
            ) : null}
            {!isPlaying ? (
              yt || drive ? (
                <button
                  type="button"
                  onClick={onPlay}
                  className="border-none cursor-pointer flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/35 text-white shadow-lg backdrop-blur-[2px] transition-transform hover:scale-105 focus:outline-none max-md:h-16 max-md:w-16"
                  aria-label="Play video"
                >
                  <Image src="/images/icons/play.svg" alt="play" width={24} height={24} unoptimized className="h-6 w-6" />
                </button>
              ) : (
                <Link
                  href={videoUrl}
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/35 text-white shadow-lg backdrop-blur-[2px] transition-transform hover:scale-105 focus:outline-none max-md:h-16 max-md:w-16"
                  aria-label="Open video in new tab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ms-1 inline-block h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-white max-md:border-y-[12px] max-md:border-l-[18px]" aria-hidden />
                </Link>
              )
            ) : null}
          </div>

          {videoCaption?.trim() || videoSubcaption?.trim() ? (
            <div className="pointer-events-none absolute bottom-0 left-0 z-[2] w-full max-w-[90%] p-6 pb-7 max-md:p-4 max-md:pb-5">
              {videoCaption?.trim() ? (
                <p className="text-2xl font-bold leading-tight tracking-tight text-white max-md:text-xl">{videoCaption.trim()}</p>
              ) : null}
              {videoSubcaption?.trim() ? (
                <p className="mt-2 text-base font-normal leading-snug text-white/95 max-md:mt-1.5 max-md:text-sm">
                  {videoSubcaption.trim()}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
