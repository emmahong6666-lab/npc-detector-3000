const fs = require("fs");
const http = require("http");
const path = require("path");
const { askAI } = require("./askAI");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 3000);

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadEnv();

function sendJson(response, status, data) {
  const body = JSON.stringify(data);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) reject(new Error("Request is too large."));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function serveFile(request, response) {
  const requested = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const filePath = path.resolve(root, `.${requested}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
  response.writeHead(200, { "Content-Type": `${types[path.extname(filePath)] || "application/octet-stream"}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && request.url === "/api/ask") {
    try {
      const input = JSON.parse(await readBody(request));
      if (!input.message || typeof input.message !== "string") {
        sendJson(response, 400, { error: "Please enter a question or description." });
        return;
      }
      const answer = await askAI({
        message: input.message.slice(0, 6_000),
        imageDataUrl: typeof input.imageDataUrl === "string" ? input.imageDataUrl : undefined,
      });
      sendJson(response, 200, { answer });
    } catch (error) {
      if (error.fix) console.error(error.fix);
      const message = error.message || "The AI could not answer right now. Please check the internet and try again.";
      sendJson(response, 502, { error: message });
    }
    return;
  }

  if (request.method === "GET") serveFile(request, response);
  else sendJson(response, 405, { error: "Method not allowed." });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Npc detector 3000 is running at http://localhost:${port}`);
});
