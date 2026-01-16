export default async function fetchDev(tech) {
  try {
    const res = await fetch(`https://dev.to/api/articles?per_page=10&tag=${encodeURIComponent(tech)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(a => ({
      text: a.title + ' ' + (a.description || ''),
      link: a.url,
      source: 'Dev.to'
    }));
  } catch (err) {
    console.error('Dev.to fetch error:', err);
    return [];
  }
}
