'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { publishHomeHero } from '@/app/admin/actions';

const DRAFT_KEY = 'sda-admin-draft';

const inputClass =
  'mt-1 w-full rounded-lg border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary';

function Field({ label, value, onChange, multiline }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className={inputClass} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}
    </label>
  );
}

function updateMetric(metrics, index, patch) {
  return metrics.map((metric, metricIndex) => (metricIndex === index ? { ...metric, ...patch } : metric));
}

function updateGrant(metrics, metricIndex, grantIndex, patch) {
  return metrics.map((metric, index) => {
    if (index !== metricIndex) return metric;
    return {
      ...metric,
      grants: metric.grants.map((grant, current) => (current === grantIndex ? { ...grant, ...patch } : grant)),
    };
  });
}

export function GeneralEditor({ hero }) {
  const [draft, setDraft] = useState(hero);
  const [status, setStatus] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      if (saved?.general) setDraft(saved.general);
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  function save() {
    let current = {};
    try {
      current = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || '{}');
    } catch {
      current = {};
    }
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...current, general: draft }));
    setStatus('Saved. These changes stay stashed until you publish.');
  }

  async function publish() {
    setPublishing(true);
    setStatus('');
    const result = await publishHomeHero(draft);
    setPublishing(false);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }
    window.localStorage.removeItem(DRAFT_KEY);
    setStatus('Published. The live homepage is using these changes.');
  }

  if (!draft) {
    return <p className="p-8 text-sm text-gray-600">The homepage hero is not in Supabase yet.</p>;
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b border-solid border-gray-200 bg-white px-8 py-4">
        <h1 className="text-lg font-semibold text-gray-900">General</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className="cursor-pointer rounded-lg border border-solid border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={publishing}
            className="cursor-pointer rounded-lg border-0 bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        {status ? <p className="text-sm text-gray-600">{status}</p> : null}

        <section className="rounded-2xl border border-solid border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">Volunteer form</h2>
          <p className="mt-1 text-sm text-gray-500">The button label stays “Become a member”. This is the link it opens.</p>
          <div className="mt-4">
            <Field label="Become a member link" value={draft.ctaUrl} onChange={(ctaUrl) => setDraft({ ...draft, ctaUrl })} />
          </div>
          {draft.images?.length ? (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700">Images</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {draft.images.map((slot) =>
                  slot.image?.url ? (
                    <div key={slot.id} className="relative h-28 w-24 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={slot.image.url} alt={slot.image.alt || ''} fill className="object-cover" sizes="96px" />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-solid border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">Impact</h2>
          <div className="mt-5 flex flex-col gap-4">
            {draft.metrics.map((metric, index) => (
              <article key={metric.id} className="rounded-xl border border-solid border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {metric.value} {metric.label}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Value"
                    value={metric.value}
                    onChange={(value) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { value }) })}
                  />
                  <Field
                    label="Label"
                    value={metric.label}
                    onChange={(label) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { label }) })}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <Field
                    label="Modal heading"
                    value={metric.heading}
                    onChange={(heading) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { heading }) })}
                  />
                  <Field
                    label="Modal description"
                    value={metric.body}
                    multiline
                    onChange={(body) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { body }) })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Modal link label"
                      value={metric.ctaText}
                      onChange={(ctaText) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { ctaText }) })}
                    />
                    <Field
                      label="Modal link"
                      value={metric.ctaUrl}
                      onChange={(ctaUrl) => setDraft({ ...draft, metrics: updateMetric(draft.metrics, index, { ctaUrl }) })}
                    />
                  </div>
                </div>
                {metric.grants?.length ? (
                  <div className="mt-5 flex flex-col gap-4 border-t border-solid border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700">Grants</p>
                    {metric.grants.map((grant, grantIndex) => (
                      <div key={grant.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex gap-3">
                          {grant.image?.url ? (
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                              <Image src={grant.image.url} alt="" fill className="object-cover" sizes="56px" />
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <Field
                              label="Name"
                              value={grant.name}
                              onChange={(name) =>
                                setDraft({ ...draft, metrics: updateGrant(draft.metrics, index, grantIndex, { name }) })
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <Field
                            label="Description"
                            value={grant.body}
                            multiline
                            onChange={(body) =>
                              setDraft({ ...draft, metrics: updateGrant(draft.metrics, index, grantIndex, { body }) })
                            }
                          />
                        </div>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Link label"
                            value={grant.linkLabel}
                            onChange={(linkLabel) =>
                              setDraft({ ...draft, metrics: updateGrant(draft.metrics, index, grantIndex, { linkLabel }) })
                            }
                          />
                          <Field
                            label="Link"
                            value={grant.linkUrl}
                            onChange={(linkUrl) =>
                              setDraft({ ...draft, metrics: updateGrant(draft.metrics, index, grantIndex, { linkUrl }) })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
