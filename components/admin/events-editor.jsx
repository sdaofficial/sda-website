'use client';

import { useEffect, useState } from 'react';

import { deleteActivity, deleteEvent, deleteVolunteer, saveEvents } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, DateTimeField, Field, ImagePicker, moveItem, newId, RowActions, useAdminForm } from '@/components/admin/ui';

export function EventsEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [events, setEvents] = useState(data.events);
  const [volunteers, setVolunteers] = useState(data.volunteers);
  const [activities, setActivities] = useState(data.activities);

  useEffect(() => {
    setEvents(data.events);
    setVolunteers(data.volunteers);
    setActivities(data.activities);
  }, [data]);

  async function remove(id, action, setList) {
    if (!String(id).startsWith('new:')) {
      const result = await action(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    setList((current) => current.filter((item) => item.id !== id));
    setStatus('Deleted.');
  }

  return (
    <AdminScreen
      title="Events"
      status={status}
      saving={saving}
      onSave={() => run(() => saveEvents({ events, volunteers, activities }))}
    >
      <Card title="Events" hint="Upcoming events on the homepage.">
        {events.map((event, index) => (
          <div key={event.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={events.length}
              onMove={(itemIndex, direction) => setEvents(moveItem(events, itemIndex, direction))}
              onDelete={() => remove(event.id, deleteEvent, setEvents)}
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field
                label="Title"
                value={event.title}
                onChange={(title) => setEvents(events.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)))}
              />
              <Field
                label="Description"
                value={event.description}
                multiline
                onChange={(description) =>
                  setEvents(events.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)))
                }
              />
              <DateTimeField
                label="Start time"
                value={event.startsAt}
                onChange={(startsAt) =>
                  setEvents(events.map((item, itemIndex) => (itemIndex === index ? { ...item, startsAt } : item)))
                }
              />
              <ImagePicker
                media={data.media}
                value={event.mediaId}
                onChange={(mediaId) => setEvents(events.map((item, itemIndex) => (itemIndex === index ? { ...item, mediaId } : item)))}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() =>
            setEvents([...events, { id: newId(), title: '', description: '', startsAt: new Date().toISOString(), mediaId: '' }])
          }
        >
          Add event
        </AddButton>
      </Card>

      <Card title="Volunteer opportunities" hint="Shown on Join Us.">
        {volunteers.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={volunteers.length}
              onMove={(itemIndex, direction) => setVolunteers(moveItem(volunteers, itemIndex, direction))}
              onDelete={() => remove(item.id, deleteVolunteer, setVolunteers)}
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field
                label="Title"
                value={item.title}
                onChange={(title) => setVolunteers(volunteers.map((row, rowIndex) => (rowIndex === index ? { ...row, title } : row)))}
              />
              <Field
                label="Body"
                value={item.body}
                multiline
                onChange={(body) => setVolunteers(volunteers.map((row, rowIndex) => (rowIndex === index ? { ...row, body } : row)))}
              />
              <ImagePicker
                media={data.media}
                value={item.mediaId}
                onChange={(mediaId) => setVolunteers(volunteers.map((row, rowIndex) => (rowIndex === index ? { ...row, mediaId } : row)))}
              />
            </div>
          </div>
        ))}
        <AddButton onClick={() => setVolunteers([...volunteers, { id: newId(), title: '', body: '', mediaId: '' }])}>
          Add opportunity
        </AddButton>
      </Card>

      <Card title="Club activities" hint="Shown on Join Us.">
        {activities.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={activities.length}
              onMove={(itemIndex, direction) => setActivities(moveItem(activities, itemIndex, direction))}
              onDelete={() => remove(item.id, deleteActivity, setActivities)}
            />
            <div className="mt-3 flex flex-col gap-3">
              <Field
                label="Title"
                value={item.title}
                onChange={(title) => setActivities(patch(activities, index, { title }))}
              />
              <Field label="Body" value={item.body} multiline onChange={(body) => setActivities(patch(activities, index, { body }))} />
              <Field
                label="Involvement title"
                value={item.involvementTitle}
                onChange={(involvementTitle) => setActivities(patch(activities, index, { involvementTitle }))}
              />
              <Field
                label="Involvement body"
                value={item.involvementBody}
                multiline
                onChange={(involvementBody) => setActivities(patch(activities, index, { involvementBody }))}
              />
              <Field
                label="Perks title"
                value={item.perksTitle}
                onChange={(perksTitle) => setActivities(patch(activities, index, { perksTitle }))}
              />
              <Field
                label="Perks body"
                value={item.perksBody}
                multiline
                onChange={(perksBody) => setActivities(patch(activities, index, { perksBody }))}
              />
              <Field
                label="Button label"
                value={item.ctaLabel}
                onChange={(ctaLabel) => setActivities(patch(activities, index, { ctaLabel }))}
              />
              <Field label="Button URL" value={item.ctaUrl} onChange={(ctaUrl) => setActivities(patch(activities, index, { ctaUrl }))} />
              <ImagePicker
                media={data.media}
                value={item.mediaId}
                onChange={(mediaId) => setActivities(patch(activities, index, { mediaId }))}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() =>
            setActivities([
              ...activities,
              {
                id: newId(),
                title: '',
                body: '',
                involvementTitle: '',
                involvementBody: '',
                perksTitle: '',
                perksBody: '',
                ctaLabel: '',
                ctaUrl: '',
                mediaId: '',
              },
            ])
          }
        >
          Add activity
        </AddButton>
      </Card>
    </AdminScreen>
  );
}

function patch(items, index, change) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...change } : item));
}
