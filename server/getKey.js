let cachedApiKey;
let cachedExpiresAt = 0;

class MindDoKeyError extends Error {
  constructor(message, fix) {
    super(message);
    this.name = "MindDoKeyError";
    this.fix = fix;
  }
}

/**
 * Get a cached MindDo API key, or request one when the cache is expired.
 * Pass { forceRefresh: true } after OpenAI rejects the current key.
 */
async function getKey({ forceRefresh = false } = {}) {
  if (!forceRefresh && cachedApiKey && Date.now() < cachedExpiresAt) {
    return cachedApiKey;
  }

  const url = process.env.KEYGEN_URL;
  const token = process.env.KEYGEN_TOKEN;

  if (!url || !token || url === "paste-here" || token === "paste-here") {
    throw new MindDoKeyError(
      "MindDo is not configured yet.",
      "Set KEYGEN_URL and KEYGEN_TOKEN in the server .env file."
    );
  }

  let response;
  try {
    response = await fetch(`${url.replace(/\/$/, "")}/api/lookup-key`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    throw new MindDoKeyError(
      "MindDo could not be reached.",
      error instanceof Error ? error.message : String(error)
    );
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new MindDoKeyError(
      "MindDo returned an invalid response.",
      `Expected JSON from ${response.url || "the key service"}.`
    );
  }

  if (!response.ok || body.error) {
    const message = body.error?.message || "MindDo could not provide an API key.";
    const fix = body.error?.fix || "Check the MindDo configuration and try again.";
    console.error(fix);
    throw new MindDoKeyError(message, fix);
  }

  if (!body.apiKey || !body.expiresAt) {
    throw new MindDoKeyError(
      "MindDo returned an incomplete API key response.",
      "The response must include apiKey and expiresAt."
    );
  }

  const expiresAt = Date.parse(body.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new MindDoKeyError(
      "MindDo returned an expired API key.",
      "Ask MindDo for a valid future expiresAt value."
    );
  }

  cachedApiKey = body.apiKey;
  cachedExpiresAt = expiresAt;
  return cachedApiKey;
}

module.exports = { getKey, MindDoKeyError };
