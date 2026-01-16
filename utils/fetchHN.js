export default async function fetchHN(tech) {
  try {
    // ✅ Project intent keywords (VERY IMPORTANT)
    const includeKeywords = [
      'show hn',
      'i built',
      'we built',
      'built',
      'launch',
      'side project',
      'open source',
      'project'
    ];

    // 🚫 Noise keywords
    const excludeKeywords = [
      'meme',
      'funny',
      'joke',
      'roast',
      'vs',
      'framework war'
    ];

    const query = encodeURIComponent(tech);

    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=40`
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.hits) return [];

    return data.hits
      .map(h => {
        const text = (h.title || '').toLowerCase();

        return {
          rawText: text,
          text: h.title,
          link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          source: 'Hacker News'
        };
      })

      // ✅ MUST contain at least ONE project intent keyword
      .filter(post =>
        includeKeywords.some(k => post.rawText.includes(k))
      )

      // 🚫 MUST NOT contain junk
      .filter(post =>
        !excludeKeywords.some(bad => post.rawText.includes(bad))
      )

      // 🧹 cleanup
      .map(({ rawText, ...rest }) => rest);

  } catch (err) {
    console.error('HN fetch error:', err);
    return [];
  }
}
