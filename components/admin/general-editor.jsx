'use client';

import { useEffect, useState } from 'react';

import { deleteSocialLink, saveGeneral } from '@/app/admin/actions';
import { AddButton, AdminScreen, Card, Field, moveItem, newId, RowActions, useAdminForm } from '@/components/admin/ui';

const LINK_LABELS = {
  become_a_member: 'Become a member',
  donate: 'Give to the Cause',
  get_involved: 'Get Involved',
  newsletter: 'Newsletter',
  JOURNEY_0: 'Watch our Story',
  JOIN_US_0: 'Home community button',
  JOIN_US_HERO_0: 'Join Us hero button',
  JOIN_US_MEMBER_0: 'Join Us member button',
  ABOUT_HERO_0: 'About hero button',
  ABOUT_JOIN_US_0: 'About community button',
  CONTACT_0: 'Contact link 1',
  CONTACT_1: 'Contact link 2',
  CONTACT_2: 'Contact link 3',
  CONTACT_3: 'Contact link 4',
};

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
];

const selectClass =
  'mt-1 w-full rounded-lg border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary';

export function GeneralEditor({ data }) {
  const { status, setStatus, saving, run } = useAdminForm();
  const [contact, setContact] = useState(data.contact);
  const [links, setLinks] = useState(data.links);
  const [socials, setSocials] = useState(data.socials);

  useEffect(() => {
    setContact(data.contact);
    setLinks(data.links);
    setSocials(data.socials);
  }, [data]);

  async function removeSocial(id) {
    if (!String(id).startsWith('new:')) {
      const result = await deleteSocialLink(id);
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
    }
    setSocials((current) => current.filter((link) => link.id !== id));
    setStatus('Deleted.');
  }

  return (
    <AdminScreen
      title="General"
      status={status}
      saving={saving}
      onSave={() => run(() => saveGeneral({ contact, links, socials }))}
    >
      <Card title="Contact" hint="Shown in the site footer.">
        <Field
          label="Office address"
          value={contact.officeAddress}
          multiline
          onChange={(officeAddress) => setContact({ ...contact, officeAddress })}
        />
        <Field label="Email" value={contact.email} onChange={(email) => setContact({ ...contact, email })} />
        <Field label="Phone" value={contact.phone} multiline onChange={(phone) => setContact({ ...contact, phone })} />
      </Card>

      <Card title="Links" hint="Button destinations. The label on the page stays in the code. The journey video URL is on Media.">
        {links.map((link, index) => (
          <div key={link.key} className="rounded-xl border border-solid border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">{LINK_LABELS[link.key] || link.key}</p>
            <p className="mt-1 text-xs text-gray-400">{link.key}</p>
            <div className="mt-3">
              <Field
                label="URL"
                value={link.url}
                onChange={(url) => setLinks(links.map((item, itemIndex) => (itemIndex === index ? { ...item, url } : item)))}
              />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={link.openInNewTab}
                onChange={(event) =>
                  setLinks(links.map((item, itemIndex) => (itemIndex === index ? { ...item, openInNewTab: event.target.checked } : item)))
                }
              />
              Open in a new tab
            </label>
          </div>
        ))}
      </Card>

      <Card title="Social links" hint="Instagram, X, LinkedIn, and YouTube icons in the footer.">
        {socials.map((link, index) => (
          <div key={link.id} className="rounded-xl border border-solid border-gray-200 p-4">
            <RowActions
              index={index}
              count={socials.length}
              onMove={(itemIndex, direction) => setSocials(moveItem(socials, itemIndex, direction))}
              onDelete={() => removeSocial(link.id)}
            />
            <label className="mt-3 block text-sm font-medium text-gray-700">
              Platform
              <select
                value={link.platform}
                onChange={(event) =>
                  setSocials(socials.map((item, itemIndex) => (itemIndex === index ? { ...item, platform: event.target.value } : item)))
                }
                className={selectClass}
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-3 flex flex-col gap-3">
              <Field
                label="Label"
                value={link.label}
                onChange={(label) => setSocials(socials.map((item, itemIndex) => (itemIndex === index ? { ...item, label } : item)))}
              />
              <Field
                label="URL"
                value={link.url}
                onChange={(url) => setSocials(socials.map((item, itemIndex) => (itemIndex === index ? { ...item, url } : item)))}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() => setSocials([...socials, { id: newId(), platform: 'instagram', label: 'Instagram', url: 'https://' }])}
        >
          Add social link
        </AddButton>
      </Card>
    </AdminScreen>
  );
}
