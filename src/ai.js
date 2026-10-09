// Optional Claude features. Runs only when the person saves their own API key in Settings.
import Anthropic from "@anthropic-ai/sdk";

let client = null, clientKey = null;
function getClient(apiKey) {
  if (!client || clientKey !== apiKey) {
    // The key is the person's own and never leaves their device except to call the API.
    client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    clientKey = apiKey;
  }
  return client;
}

// Sends one prompt that asks for JSON and returns the parsed object.
async function askJSON(prompt, apiKey) {
  const msg = await getClient(apiKey).beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{ role: "user", content: prompt }],
  });
  if (msg.stop_reason === "refusal") throw Object.assign(new Error("refused"), { code: "refusal" });
  const text = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw Object.assign(new Error("no JSON in reply"), { code: "bad_reply" });
  return JSON.parse(m[0]);
}

window.PlannerAI = { askJSON };
