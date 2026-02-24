export async function improveDMPitch(rawPitch) {
  try {
    const res = await fetch(
      "https://router.huggingface.co/models/KLUCKYR/phi3-dm-pitch-full",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: rawPitch,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("HF Router API error:", text);
      return "Model returned error";
    }

    const data = await res.json();
    console.log("HF Router raw response:", data);

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    }

    return "Model returned empty";
  } catch (err) {
    console.error("HF fetch error:", err);
    return "Model returned error";
  }
}