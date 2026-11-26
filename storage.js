const REPORTS_KEY = "npc-detector-reports";
const DETECTIONS_KEY = "npc-detector-detections";

const sampleReports = [
  {
    id: "sample-report-1",
    game: "Sample Arena",
    player: "Player Echo",
    reason: "Chat spam",
    details: "Repeated the same link in chat several times.",
    status: "Needs human review",
    createdAt: "Today",
  },
];

const sampleDetections = [
  {
    id: "sample-detection-1",
    label: "Possible bot",
    game: "Sample Arena",
    reason: "Repeated movement pattern",
    confidence: "Review suggested",
    reviewed: false,
  },
  {
    id: "sample-detection-2",
    label: "Chat warning",
    game: "Sample Arena",
    reason: "Message includes an unverified reward link",
    confidence: "Review suggested",
    reviewed: false,
  },
];

function read(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  loadReports() {
    return read(REPORTS_KEY, sampleReports);
  },

  saveReports(reports) {
    write(REPORTS_KEY, reports);
  },

  loadDetections() {
    return read(DETECTIONS_KEY, sampleDetections);
  },

  saveDetections(detections) {
    write(DETECTIONS_KEY, detections);
  },
};
