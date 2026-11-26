const fs = require("fs");
const path = require("path");
const { getKey } = require("./getKey");

const projectRoot = path.resolve(__dirname, "..");
const notes = fs.readFileSync(path.join(projectRoot, "NOTES.md"), "utf8");
const model = notes.match(/OpenAI model available through MindDo:\s*([^\s]+)/)?.[1] || "gpt-5.6-luna";
const brief = fs.readFileSync(path.join(projectRoot, "BRIEF.md"), "utf8");
const instructions = brief.match(/## My AI’s instructions[\s\S]*?(?=\n## |$)/)?.[0] || "Follow the project safety rules and protect private information.";

function responseText(body) {
  if (typeof body.output_text === "string") return body.output_text.trim();
  return (body.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || "")
    .join("\n")
    .trim();
}

async function requestOpenAI(apiKey, message, imageDataUrl) {
  const userContent = [{ type: "input_text", text: message }];
  if (imageDataUrl) userContent.push({ type: "input_image", image_url: imageDataUrl });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: [{ type: "input_text", text: instructions }] },
        { role: "user", content: userContent },
      ],
      max_output_tokens: 500,
    }),
  });

  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function askAI({ message, imageDataUrl }) {
  let apiKey = await getKey();
  let result = await requestOpenAI(apiKey, message, imageDataUrl);

  // A rejected key gets exactly one fresh-key attempt.
  if (result.response.status === 401 || result.response.status === 403) {
    apiKey = await getKey({ forceRefresh: true });
    result = await requestOpenAI(apiKey, message, imageDataUrl);
  }

  if (!result.response.ok) {
    const providerMessage = result.body.error?.message;
    throw new Error(providerMessage || "The AI could not answer right now. Please check the internet and try again.");
  }

  const answer = responseText(result.body);
  if (!answer) throw new Error("The AI returned an empty answer. Please try again.");
  return answer;
}

module.exports = { askAI, model };
