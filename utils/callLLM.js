export default async function callLLM(prompt) {
  const HF_API_KEY = process.env.HF_API_KEY;
  const HF_MODEL = 'meta-llama/Meta-Llama-3-8B-Instruct';

  try {
    const res = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: HF_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are a strict JSON generator. Output ONLY valid JSON. No markdown. No explanation.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 400,
        }),
      }
    );

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      console.error('LLM returned empty response');
      return null;
    }

    // 🔐 extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('No JSON found:', text);
      return null;
    }

    return JSON.parse(match[0]);
  } catch (err) {
    console.error('LLM error:', err);
    return null;
  }
}
