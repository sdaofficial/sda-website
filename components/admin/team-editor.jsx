'use client';

import { useEffect, useState } from 'react';

import { deleteTeamMember, saveTeam } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, Field, ImagePicker, moveItem, newId, RowActions, useAdminForm } from '@/components/admin/ui';

const GROUPS = [
  { key: 'founding', label: 'FOUNDING MEMBER' },
  { key: 'executives', label: 'EXECUTIVE' },
  { key: 'active', label: 'ACTIVE MEMBER' },
];

function groupFor(member) {
  const key = (member.groupKey || '').toLowerCase();
  const label = (member.groupLabel || '').toLowerCase();
  if (key.includes('found') || label.includes('found')) return GROUPS[0];
  if (key.includes('exec') || label.includes('exec')) return GROUPS[1];
  if (key.includes('active') || label.includes('active')) return GROUPS[2];
  return GROUPS[0];
}

export function TeamEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [members, setMembers] = useState(data.members);

  useEffect(() => {
    setMembers(data.members);
  }, [data]);

  function update(index, change) {
    setMembers(members.map((member, memberIndex) => (memberIndex === index ? { ...member, ...change } : member)));
  }

  function setGroup(index, key) {
    const group = GROUPS.find((item) => item.key === key) ?? GROUPS[0];
    update(index, { groupKey: group.key, groupLabel: group.label });
  }

  async function remove(id) {
    if (!String(id).startsWith('new:')) {
      const result = await deleteTeamMember(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    setMembers((current) => current.filter((member) => member.id !== id));
    setStatus('Deleted.');
  }

  return (
    <AdminScreen
      title="Team"
      status={status}
      saving={saving}
      onSave={() =>
        run(() =>
          saveTeam(
            members.map((member) => {
              const group = groupFor(member);
              return { ...member, groupKey: group.key, groupLabel: group.label };
            }),
          ),
        )
      }
    >
      <Card title="Team members" hint="Order is the carousel order.">
        {members.map((member, index) => (
          <div key={member.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={members.length}
              onMove={(itemIndex, direction) => setMembers(moveItem(members, itemIndex, direction))}
              onDelete={() => remove(member.id)}
            />
            <div className="mt-3 flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Group
                <select
                  value={groupFor(member).key}
                  onChange={(event) => setGroup(index, event.target.value)}
                  className="mt-1 w-full rounded-lg border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary"
                >
                  {GROUPS.map((group) => (
                    <option key={group.key} value={group.key}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Name" value={member.name} onChange={(name) => update(index, { name })} />
              <Field label="Title" value={member.title} onChange={(title) => update(index, { title })} />
              <Field label="Profile URL" value={member.profileUrl} onChange={(profileUrl) => update(index, { profileUrl })} />
              <ImagePicker
                media={data.media}
                label="Portrait"
                value={member.mediaId}
                onChange={(mediaId) => update(index, { mediaId })}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() =>
            setMembers([
              ...members,
              {
                id: newId(),
                groupKey: GROUPS[0].key,
                groupLabel: GROUPS[0].label,
                name: '',
                title: '',
                profileUrl: '',
                mediaId: '',
              },
            ])
          }
        >
          Add member
        </AddButton>
      </Card>
    </AdminScreen>
  );
}
