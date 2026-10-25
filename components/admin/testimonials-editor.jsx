'use client';

import { useEffect, useState } from 'react';

import { deleteTestimonial, saveTestimonials } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, Field, ImagePicker, moveItem, newId, RowActions, useAdminForm } from '@/components/admin/ui';

export function TestimonialsEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [testimonials, setTestimonials] = useState(data.testimonials);

  useEffect(() => {
    setTestimonials(data.testimonials);
  }, [data]);

  function update(index, change) {
    setTestimonials(testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, ...change } : item)));
  }

  async function remove(id) {
    if (!String(id).startsWith('new:')) {
      const result = await deleteTestimonial(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    setTestimonials((current) => current.filter((item) => item.id !== id));
    setStatus('Deleted.');
  }

  return (
    <AdminScreen title="Testimonials" status={status} saving={saving} onSave={() => run(() => saveTestimonials(testimonials))}>
      <Card title="Testimonials" hint="Quotes on the homepage.">
        {testimonials.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={testimonials.length}
              onMove={(itemIndex, direction) => setTestimonials(moveItem(testimonials, itemIndex, direction))}
              onDelete={() => remove(item.id)}
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Author" value={item.author} onChange={(author) => update(index, { author })} />
              <Field label="Quote" value={item.body} multiline onChange={(body) => update(index, { body })} />
              <ImagePicker
                media={data.media}
                label="Portrait"
                value={item.mediaId}
                onChange={(mediaId) => update(index, { mediaId })}
              />
            </div>
          </div>
        ))}
        <AddButton onClick={() => setTestimonials([...testimonials, { id: newId(), author: '', body: '', mediaId: '' }])}>
          Add testimonial
        </AddButton>
      </Card>
    </AdminScreen>
  );
}
