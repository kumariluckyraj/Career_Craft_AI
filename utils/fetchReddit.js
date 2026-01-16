export default async function fetchReddit(tech) {
  try {
    // 🚫 Remove only garbage
    const excludeKeywords = [
      'meme',
      'funny',
      'joke',
      'shitpost',
      'roast',
      'vs',
      'framework war'
    ];

    // 🔍 Better Reddit query (this is key)
    const query = encodeURIComponent(
      `${tech} (built OR building OR launched OR made OR app OR tool)`
    );

    const res = await fetch(
      `https://www.reddit.com/r/sideprojects/search.json?q=${query}&restrict_sr=1&sort=relevance&limit=25`,
      {
        headers: {
          'User-Agent': 'placement-project-idea-bot'
        }
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const posts = data?.data?.children || [];

    console.log(`[REDDIT] ${tech}: ${posts.length} raw posts`);

    return posts
      .filter(c => !c.data.stickied)
      .map(c => {
        const text =
          (c.data.title + ' ' + (c.data.selftext || '')).toLowerCase();

        return {
          rawText: text,
          text: (c.data.title + ' ' + (c.data.selftext || '')).slice(0, 600),
          link: `https://reddit.com${c.data.permalink}`,
          source: 'Reddit'
        };
      })
      // 🚫 Remove only obvious trash
      .filter(
        post => !excludeKeywords.some(bad => post.rawText.includes(bad))
      )
      .map(({ rawText, ...rest }) => rest);

  } catch (err) {
    console.error('Reddit fetch error:', err);
    return [];
  }
}
