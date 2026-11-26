import { storage } from "./storage.js";

const state = {
  reports: storage.loadReports(),
  detections: storage.loadDetections(),
  screenshotDataUrl: "",
};

const $ = (selector) => document.querySelector(selector);

function showError(element, message = "") {
  element.textContent = message;
  element.style.display = message ? "block" : "none";
}

function renderReports() {
  const list = $("#report-list");
  list.innerHTML = state.reports.map((report) => `
    <article class="list-item">
      <div><strong>${escapeHtml(report.game)} · ${escapeHtml(report.reason)}</strong><small>${escapeHtml(report.details)}<br>${escapeHtml(report.player || "Unknown player")} · ${escapeHtml(report.createdAt)}</small></div>
      <span class="pill">${escapeHtml(report.status)}</span>
    </article>
  `).join("");
}

function renderDetections() {
  const list = $("#detection-list");
  list.innerHTML = state.detections.map((item) => `
    <article class="list-item">
      <div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.reason)} · ${escapeHtml(item.game)}</small></div>
      <span class="pill">${item.reviewed ? "Reviewed" : escapeHtml(item.confidence)}</span>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

async function askAI(message, imageDataUrl, button, resultElement, errorElement) {
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Thinking…";
  showError(errorElement);
  resultElement.style.display = "none";
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, imageDataUrl }),
    });
    const body = await response.json();
    if (!response.ok || body.error) throw new Error(body.error || "Please check the internet and try again.");
    resultElement.textContent = body.answer;
    resultElement.style.display = "block";
  } catch (error) {
    showError(errorElement, error.message || "Please check the internet and try again.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

$("#report-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.reports.unshift({
    id: crypto.randomUUID(), game: form.get("game"), player: form.get("player"), reason: form.get("reason"),
    details: form.get("details"), status: "Needs human review", createdAt: new Date().toLocaleString(),
  });
  storage.saveReports(state.reports);
  renderReports();
  event.currentTarget.reset();
  $("#report-success").textContent = "Report saved for human review.";
});

$("#screenshot").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.screenshotDataUrl = reader.result;
    $("#preview").src = state.screenshotDataUrl;
    $("#preview").style.display = "block";
    $("#screenshot-name").textContent = `${file.name} ready to check`;
  };
  reader.readAsDataURL(file);
});

$("#screenshot-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.screenshotDataUrl) return showError($("#screenshot-error"), "Choose a screenshot first.");
  askAI("Check this game screenshot for possible bot behavior or a bot scam. Return a short flag first, such as ‘Possible bot’ or ‘No clear bot signal’, then give one brief, safe reason. Do not identify or expose private information. A human must review serious cases.", state.screenshotDataUrl, $("#screenshot-button"), $("#screenshot-result"), $("#screenshot-error"));
});

$("#question-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const question = new FormData(event.currentTarget).get("question");
  if (!question.trim()) return;
  askAI(question, undefined, $("#question-button"), $("#question-result"), $("#question-error"));
});

renderReports();
renderDetections();
fetch("/api/health").catch(() => { $("#server-status").textContent = "AI server needs attention"; $("#server-status-dot").style.background = "var(--coral)"; });
