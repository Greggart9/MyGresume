const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "qwen/qwen3-4b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryModel(model: string, prompt: string, maxTokens = 2048): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "MyGresume",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}::${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function generateContent(prompt: string, options?: { maxTokens?: number }): Promise<string> {
  let lastError = "";
  const maxTokens = options?.maxTokens ?? 2048;

  for (const model of FREE_MODELS) {
    try {
      console.log(`Trying: ${model}`);
      const result = await tryModel(model, prompt, maxTokens);
      console.log(`✓ Success: ${model}`);
      return result;
    } catch (error: any) {
      const msg = error?.message || "";
      const shouldSkip =
        msg.includes("429") || msg.includes("400") || msg.includes("404") ||
        msg.includes("rate") || msg.includes("quota") ||
        msg.includes("not enabled") || msg.includes("No endpoints") ||
        msg.includes("Provider returned error");

      if (shouldSkip) {
        console.log(`✗ Skipping ${model}`);
        await sleep(500);
        lastError = msg;
        continue;
      }
      throw error;
    }
  }

  throw new Error("All models unavailable. Please wait a minute and try again.");
}