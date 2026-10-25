'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const inputClass =
  'mt-1 w-full rounded-lg border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary';

const quietButton =
  'cursor-pointer rounded-lg border border-solid border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 disabled:cursor-not-allowed disabled:opacity-40';

export function newId() {
  return `new:${crypto.randomUUID()}`;
}

export function moveItem(items, index, direction) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

export function useAdminForm() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function run(action, message = 'Saved.') {
    setSaving(true);
    setStatus('');
    const result = await action();
    setSaving(false);
    if (!result?.ok) {
      setStatus(result?.error || 'Supabase rejected the change.');
      return false;
    }
    setStatus(message);
    router.refresh();
    return true;
  }

  return { status, setStatus, saving, run };
}

export function AdminScreen({ title, status, saving, onSave, children }) {
  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-8 py-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer rounded-lg border-0 bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </header>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        {status ? <p className="text-sm text-gray-600">{status}</p> : null}
        {children}
      </div>
    </div>
  );
}

export function Card({ title, hint, children }) {
  return (
    <section className="rounded-2xl border border-solid border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-gray-500">{hint}</p> : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function Field({ label, value, onChange, multiline }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}
    </label>
  );
}

const iconButton =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-solid border-gray-300 bg-white p-0 disabled:cursor-not-allowed disabled:opacity-40';

export function OrderButtons({ index, count, onMove }) {
  return (
    <div className="flex gap-2">
      <button type="button" className={iconButton} aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>
        <Image src="/images/icons/chevron-up-black.svg" alt="" width={16} height={16} />
      </button>
      <button
        type="button"
        className={iconButton}
        aria-label="Move down"
        disabled={index === count - 1}
        onClick={() => onMove(index, 1)}
      >
        <Image src="/images/icons/chevron-down-black.svg" alt="" width={16} height={16} />
      </button>
    </div>
  );
}

export function DeleteButton({ onClick, label = 'Delete' }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={iconButton}>
      <Image src="/images/icons/trash.svg" alt="" width={16} height={16} />
    </button>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={quietButton}>
      {children}
    </button>
  );
}

export function ImagePicker({ media, value, onChange, label = 'Image' }) {
  const current = media.find((item) => item.id === value);

  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <select value={value || ''} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="">No image</option>
        {media.map((item) => (
          <option key={item.id} value={item.id}>
            {item.alt || 'Untitled image'}
          </option>
        ))}
      </select>
      {current?.url ? (
        <span className="relative mt-2 block h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
          <Image src={current.url} alt="" fill className="object-cover" sizes="96px" />
        </span>
      ) : null}
    </label>
  );
}

export function RowActions({ index, count, onMove, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <OrderButtons index={index} count={count} onMove={onMove} />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

export function formatAdminDateTime(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(/\u202f/g, ' ');
}

export function DateTimeField({ label, value, onChange }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <span className="relative mt-1 block">
        <span className="block w-full rounded-lg border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900">
          {formatAdminDateTime(value) || 'Choose a date'}
        </span>
        <input
          type="datetime-local"
          value={toLocalInput(value)}
          onChange={(event) => onChange(fromLocalInput(event.target.value))}
          aria-label={label}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </span>
    </label>
  );
}

export function toLocalInput(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromLocalInput(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
