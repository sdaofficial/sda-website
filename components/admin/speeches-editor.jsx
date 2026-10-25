'use client';

import { useEffect, useState } from 'react';

import { saveSpeeches } from '@/app/admin/actions';
import { AdminScreen, Card, Field, ImagePicker, useAdminForm } from '@/components/admin/ui';

const TITLES = {
  president: 'President',
  staff_adviser: 'Staff adviser',
};

export function SpeechesEditor({ data }) {
  const { status, saving, run } = useAdminForm();
  const [speeches, setSpeeches] = useState(data.speeches);

  useEffect(() => {
    setSpeeches(data.speeches);
  }, [data]);

  function update(role, change) {
    setSpeeches(speeches.map((speech) => (speech.role === role ? { ...speech, ...change } : speech)));
  }

  return (
    <AdminScreen title="Speeches" status={status} saving={saving} onSave={() => run(() => saveSpeeches(speeches))}>
      {speeches.map((speech) => (
        <Card key={speech.role} title={TITLES[speech.role] || speech.role}>
          <Field label="Name" value={speech.name} onChange={(name) => update(speech.role, { name })} />
          <Field label="Role label" value={speech.roleLabel} onChange={(roleLabel) => update(speech.role, { roleLabel })} />
          <Field label="Letter" value={speech.body} multiline onChange={(body) => update(speech.role, { body })} />
          <ImagePicker
            media={data.media}
            label="Portrait"
            value={speech.mediaId}
            onChange={(mediaId) => update(speech.role, { mediaId })}
          />
        </Card>
      ))}
    </AdminScreen>
  );
}
