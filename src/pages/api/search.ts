import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { articles, events, profiles, products, championships, teams } from '@/data/db/schema';
import { like, or } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ results: [] }), { status: 200 });
    }

    const searchTerm = `%${query}%`;

    // Parallell queries for Global Search
    const [
      articlesResults,
      eventsResults,
      profilesResults,
      productsResults,
      champResults,
      teamsResults
    ] = await Promise.all([
      db.select({ id: articles.id, title: articles.title, slug: articles.slug, type: articles.type })
        .from(articles)
        .where(like(articles.title, searchTerm))
        .limit(5),

      db.select({ id: events.id, title: events.title })
        .from(events)
        .where(like(events.title, searchTerm))
        .limit(5),

      db.select({ id: profiles.userId, fullName: profiles.fullName, slug: profiles.slug })
        .from(profiles)
        .where(or(like(profiles.fullName, searchTerm), like(profiles.slug, searchTerm)))
        .limit(5),

      db.select({ id: products.id, name: products.name, slug: products.slug })
        .from(products)
        .where(like(products.name, searchTerm))
        .limit(5),

      db.select({ id: championships.id, name: championships.name, slug: championships.slug })
        .from(championships)
        .where(like(championships.name, searchTerm))
        .limit(5),

      db.select({ id: teams.id, name: teams.name, slug: teams.slug })
        .from(teams)
        .where(like(teams.name, searchTerm))
        .limit(5)
    ]);

    const aggregated = [
      ...articlesResults.map(a => ({ type: a.type === 'NEWS' ? 'Noticia' : 'Comunicado', label: a.title, url: `/noticias/${a.slug}` })),
      ...eventsResults.map(e => ({ type: 'Evento', label: e.title, url: `/app/eventos/${e.id}` })),
      ...profilesResults.map(p => ({ type: 'Miembro', label: p.fullName, url: `/@${p.slug}` })),
      ...productsResults.map(p => ({ type: 'Producto', label: p.name, url: `/catalogo/${p.slug}` })),
      ...champResults.map(c => ({ type: 'Campeonato', label: c.name, url: `/campeonatos/${c.slug}` })),
      ...teamsResults.map(t => ({ type: 'Equipo', label: t.name, url: `/equipos/${t.slug}` }))
    ];

    return new Response(JSON.stringify({ results: aggregated }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};