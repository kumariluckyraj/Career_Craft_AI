export async function callOllama(prompt) {
  const controller = new AbortController();

  // 5 minutes (resume can take time)
  const timeout = setTimeout(() => controller.abort(), 300000);

  try {
    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
     body: JSON.stringify({
  model: "phi3",
  prompt,
  stream: false,
  keep_alive: -1, // keeps model active
  options: {
    num_predict: 700,
    temperature: 0.3,
  },
}),

    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || `Ollama failed with status ${res.status}`);
    }

    return data.response;
  } finally {
    clearTimeout(timeout);
  }
}