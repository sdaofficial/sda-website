'use client';

import { useEffect, useState } from 'react';

import { deleteSectionImage, saveSectionImages } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, DeleteButton, Field, ImagePicker, moveItem, newId, OrderButtons, useAdminForm } from '@/components/admin/ui';

const SECTION_LABELS = {
  HOME_HERO: 'Home hero',
  ROOTED_COMMUNITY: 'Rooted in community',
  JOURNEY: 'Journey',
  JOIN_US: 'Home community band',
  ABOUT_HERO: 'About hero',
  ABOUT_HISTORY: 'About history',
  ABOUT_GOALS: 'About goals',
  ABOUT_PRESIDENT: 'President portrait slot',
  ABOUT_STAFF: 'Staff portrait slot',
  ABOUT_JOIN_US: 'About community band',
  JOIN_US_HERO: 'Join Us hero',
  JOIN_US_MEMBER: 'Join Us member',
};

export function SectionImagesEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [slots, setSlots] = useState(data.slots);
  const [sectionKey, setSectionKey] = useState('');

  useEffect(() => {
    setSlots(data.slots);
  }, [data]);

  const groups = new Map();
  for (const slot of slots) {
    const list = groups.get(slot.sectionKey) ?? [];
    list.push(slot);
    groups.set(slot.sectionKey, list);
  }

  async function removeSlot(id) {
    if (!String(id).startsWith('new:')) {
      const result = await deleteSectionImage(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    setSlots((current) => current.filter((slot) => slot.id !== id));
    setStatus('Deleted.');
  }

  function updateSlot(id, mediaId) {
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, mediaId } : slot)));
  }

  function moveSlot(section, index, direction) {
    setSlots((current) => {
      const group = current.filter((slot) => slot.sectionKey === section);
      const moved = moveItem(group, index, direction);
      const next = [];
      let inserted = false;
      for (const slot of current) {
        if (slot.sectionKey !== section) {
          next.push(slot);
          continue;
        }
        if (!inserted) {
          next.push(...moved);
          inserted = true;
        }
      }
      return next;
    });
  }

  function addSlot(key) {
    const clean = key.trim().toUpperCase().replace(/\s+/g, '_');
    if (!clean) {
      setStatus('Name the section before adding a slot.');
      return;
    }
    const first = data.media[0]?.id || '';
    setSlots((current) => [...current, { id: newId(), sectionKey: clean, mediaId: first }]);
    setSectionKey('');
  }

  return (
    <AdminScreen title="Section images" status={status} saving={saving} onSave={() => run(() => saveSectionImages({ slots }))}>
      <Card title="Section images" hint="Each slot points at a file in the media library. Removing a slot leaves the file in place.">
        {[...groups.entries()].map(([key, group]) => (
          <div key={key} className="rounded-xl border border-solid border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">{SECTION_LABELS[key] || key}</p>
            <p className="mt-1 text-xs text-gray-400">{key}</p>
            <div className="mt-4 flex flex-col gap-4">
              {group.map((slot, index) => (
                <div key={slot.id} className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <OrderButtons
                      index={index}
                      count={group.length}
                      onMove={(itemIndex, direction) => moveSlot(key, itemIndex, direction)}
                    />
                    <DeleteButton onClick={() => removeSlot(slot.id)} label="Remove slot" />
                  </div>
                  <ImagePicker media={data.media} value={slot.mediaId} onChange={(mediaId) => updateSlot(slot.id, mediaId)} label="File" />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <AddButton onClick={() => addSlot(key)}>Add slot</AddButton>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Field label="New section key" value={sectionKey} onChange={setSectionKey} />
          </div>
          <AddButton onClick={() => addSlot(sectionKey)}>Add section</AddButton>
        </div>
      </Card>
    </AdminScreen>
  );
}
