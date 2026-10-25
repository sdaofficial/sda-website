'use client';

import { useEffect, useState } from 'react';

import { deleteGrant, deleteMetric, deletePartnership, saveImpact } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, Field, ImagePicker, moveItem, newId, RowActions, useAdminForm } from '@/components/admin/ui';

export function ImpactEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [partnerships, setPartnerships] = useState(data.partnerships);
  const [metrics, setMetrics] = useState(data.metrics);

  useEffect(() => {
    setPartnerships(data.partnerships);
    setMetrics(data.metrics);
  }, [data]);

  async function remove(id, action, apply) {
    if (!String(id).startsWith('new:')) {
      const result = await action(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    apply();
    setStatus('Deleted.');
  }

  function updateMetric(index, change) {
    setMetrics(metrics.map((metric, metricIndex) => (metricIndex === index ? { ...metric, ...change } : metric)));
  }

  function updateGrant(metricIndex, grantIndex, change) {
    setMetrics(
      metrics.map((metric, index) => {
        if (index !== metricIndex) return metric;
        return {
          ...metric,
          grants: metric.grants.map((grant, current) => (current === grantIndex ? { ...grant, ...change } : grant)),
        };
      }),
    );
  }

  return (
    <AdminScreen
      title="Partnerships and impact"
      status={status}
      saving={saving}
      onSave={() => run(() => saveImpact({ partnerships, metrics }))}
    >
      <Card title="Partnerships" hint="Logo row on the homepage.">
        {partnerships.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={partnerships.length}
              onMove={(itemIndex, direction) => setPartnerships(moveItem(partnerships, itemIndex, direction))}
              onDelete={() =>
                remove(item.id, deletePartnership, () => setPartnerships((current) => current.filter((row) => row.id !== item.id)))
              }
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field
                label="Name"
                value={item.name}
                onChange={(name) => setPartnerships(partnerships.map((row, rowIndex) => (rowIndex === index ? { ...row, name } : row)))}
              />
              <ImagePicker
                media={data.media}
                label="Logo"
                value={item.mediaId}
                onChange={(mediaId) =>
                  setPartnerships(partnerships.map((row, rowIndex) => (rowIndex === index ? { ...row, mediaId } : row)))
                }
              />
            </div>
          </div>
        ))}
        <AddButton onClick={() => setPartnerships([...partnerships, { id: newId(), name: '', mediaId: '' }])}>
          Add partnership
        </AddButton>
      </Card>

      <Card title="Impact metrics" hint="The numbers on the homepage, and the grant list inside each modal.">
        {metrics.map((metric, index) => (
          <div key={metric.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={metrics.length}
              onMove={(itemIndex, direction) => setMetrics(moveItem(metrics, itemIndex, direction))}
              onDelete={() => remove(metric.id, deleteMetric, () => setMetrics((current) => current.filter((row) => row.id !== metric.id)))}
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Value" value={metric.value} onChange={(value) => updateMetric(index, { value })} />
              <Field label="Label" value={metric.label} onChange={(label) => updateMetric(index, { label })} />
              <Field label="Modal heading" value={metric.heading} onChange={(heading) => updateMetric(index, { heading })} />
              <Field label="Modal description" value={metric.body} multiline onChange={(body) => updateMetric(index, { body })} />
              <Field label="Modal link label" value={metric.ctaText} onChange={(ctaText) => updateMetric(index, { ctaText })} />
              <Field label="Modal link" value={metric.ctaUrl} onChange={(ctaUrl) => updateMetric(index, { ctaUrl })} />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-gray-900">Grants</p>
              {metric.grants.map((grant, grantIndex) => (
                <div key={grant.id} className="rounded-lg bg-gray-50 p-3">
                  <RowActions
                    index={grantIndex}
                    count={metric.grants.length}
                    onMove={(itemIndex, direction) =>
                      updateMetric(index, { grants: moveItem(metric.grants, itemIndex, direction) })
                    }
                    onDelete={() =>
                      remove(grant.id, deleteGrant, () =>
                        updateMetric(index, { grants: metric.grants.filter((row) => row.id !== grant.id) }),
                      )
                    }
                  />
                  <div className="mt-3 flex flex-col gap-3">
                    <Field label="Name" value={grant.name} onChange={(name) => updateGrant(index, grantIndex, { name })} />
                    <Field label="Description" value={grant.body} multiline onChange={(body) => updateGrant(index, grantIndex, { body })} />
                    <Field
                      label="Link label"
                      value={grant.linkLabel}
                      onChange={(linkLabel) => updateGrant(index, grantIndex, { linkLabel })}
                    />
                    <Field label="Link" value={grant.linkUrl} onChange={(linkUrl) => updateGrant(index, grantIndex, { linkUrl })} />
                    <ImagePicker
                      media={data.media}
                      value={grant.mediaId}
                      onChange={(mediaId) => updateGrant(index, grantIndex, { mediaId })}
                    />
                  </div>
                </div>
              ))}
              <AddButton
                onClick={() =>
                  updateMetric(index, {
                    grants: [...metric.grants, { id: newId(), name: '', body: '', linkLabel: '', linkUrl: '', mediaId: '' }],
                  })
                }
              >
                Add grant
              </AddButton>
            </div>
          </div>
        ))}
        <AddButton
          onClick={() =>
            setMetrics([
              ...metrics,
              { id: newId(), value: '', label: '', heading: '', body: '', ctaText: '', ctaUrl: '', grants: [] },
            ])
          }
        >
          Add metric
        </AddButton>
      </Card>
    </AdminScreen>
  );
}
