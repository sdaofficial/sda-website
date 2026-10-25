'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { deleteMedia, saveMediaLibrary, uploadMedia } from '@/app/admin/actions';
import { AdminScreen, Card, DeleteButton, Field, inputClass, useAdminForm } from '@/components/admin/ui';

export function MediaEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [media, setMedia] = useState(data.media);
  const [videoUrl, setVideoUrl] = useState(data.videoUrl);
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMedia(data.media);
    setVideoUrl(data.videoUrl);
  }, [data]);

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setStatus('');
    const formData = new FormData();
    formData.set('file', file);
    formData.set('alt', alt);
    const result = await uploadMedia(formData);
    setUploading(false);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }
    setAlt('');
    if (result.media) setMedia((current) => [...current, result.media]);
    setStatus('Uploaded.');
  }

  async function removeFile(id) {
    const result = await deleteMedia(id);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }
    setMedia((current) => current.filter((item) => item.id !== id));
    setStatus('Deleted.');
  }

  return (
    <AdminScreen
      title="Media"
      status={status}
      saving={saving}
      onSave={() => run(() => saveMediaLibrary({ media, videoUrl }))}
    >
      <Card title="Journey video" hint="The only video the site plays. Paste a YouTube or Google Drive link.">
        <Field label="Video URL" value={videoUrl} onChange={setVideoUrl} />
      </Card>

      <Card title="Image library" hint="Upload a file here. Every other tab picks from this list.">
        <Field label="Title for the next upload" value={alt} onChange={setAlt} />
        <label className="block text-sm font-medium text-gray-700">
          Image file
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={upload}
            className={`${inputClass} cursor-pointer disabled:cursor-not-allowed`}
          />
        </label>
        {uploading ? <p className="text-sm text-gray-500">Uploading…</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {media.map((item) => (
            <div key={item.id} className="rounded-xl border border-solid border-gray-200 p-4">
              {item.url ? (
                <div className="relative mb-3 h-28 overflow-hidden rounded-lg bg-gray-100">
                  <Image src={item.url} alt="" fill className="object-cover" sizes="320px" />
                </div>
              ) : null}
              <Field
                label="Image Title"
                value={item.alt}
                onChange={(next) => setMedia(media.map((current) => (current.id === item.id ? { ...current, alt: next } : current)))}
              />
              <div className="mt-3">
                <DeleteButton onClick={() => removeFile(item.id)} label="Delete file" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminScreen>
  );
}
