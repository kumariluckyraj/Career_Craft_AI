export async function POST(req) {
  try {
    // 1️⃣ Parse uploaded image
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // 2️⃣ Create Replicate prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "gsk7rhhy4jabbnsmv2io2oq46u", // realistic-vision-v2.0
        input: {
          image: `data:image/png;base64,${base64Image}`,
          prompt:
            "Convert this selfie into a professional LinkedIn-style headshot, business casual attire, neutral background, soft lighting",
        },
      }),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      console.error("Replicate create prediction error:", text);
      return new Response(JSON.stringify({ error: "Failed to create prediction" }), {
        status: 500,
      });
    }

    const prediction = await createRes.json();

    // 3️⃣ Poll until the prediction finishes
    let outputUrl = null;
    let status = prediction.status;
    let attempts = 0;

    while (status !== "succeeded" && status !== "failed" && attempts < 30) {
      await new Promise((r) => setTimeout(r, 2000)); // wait 2 seconds
      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { Authorization: `Token ${process.env.REPLICATE_API_KEY}` } }
      );
      const updated = await pollRes.json();
      status = updated.status;
      if (status === "succeeded") {
        outputUrl = updated.output[0];
        break;
      } else if (status === "failed") {
        return new Response(JSON.stringify({ error: "Prediction failed" }), { status: 500 });
      }
      attempts++;
    }

    if (!outputUrl) {
      return new Response(JSON.stringify({ error: "AI did not return an image in time" }), {
        status: 500,
      });
    }

    // 4️⃣ Return the final professional headshot URL
    return new Response(JSON.stringify({ url: outputUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
