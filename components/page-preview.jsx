const PREVIEWS = {
  blog: {
    eyebrow: 'Blog',
    heading: 'Stories from the SDA community',
    body: 'This preview stays in place until Blog sections are added in Supabase. Those sections will replace this screen, in position order.',
    cards: [
      { title: 'Notes from the field', body: 'What a campus project looks like from the team running it.' },
      { title: 'A member’s year', body: 'How joining SDA changed the way one student spends their time.' },
      { title: 'Partners in practice', body: 'Why collaboration sits at the centre of the work.' },
    ],
  },
};

export function PagePreview({ slug }) {
  const preview = PREVIEWS[slug];
  if (!preview) return null;

  return (
    <section className="bg-gray-50 px-20 py-[100px] text-gray-900 max-lg:px-[50px] max-lg:py-20 max-md:px-6 max-md:py-12">
      <p className="mb-2 text-base font-medium text-gray-600">{preview.eyebrow}</p>
      <h1 className="max-w-3xl text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[32px]">{preview.heading}</h1>
      <p className="mt-4 max-w-2xl text-lg font-medium leading-7 text-gray-600 max-md:text-sm max-md:leading-6">{preview.body}</p>
      <div className="mt-12 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        {preview.cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold">{card.title}</h2>
            <p className="mt-2 text-base leading-6 text-gray-600">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
