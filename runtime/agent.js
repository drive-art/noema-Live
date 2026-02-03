/**
 * noema-live runtime agent
 * Reads state and requests changes through a single allowed entry
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CORE_DIR = path.join(ROOT, "core");
const IDENTITY_PATH = path.join(CORE_DIR, "identity.json");

function readIdentity() {
  if (!fs.existsSync(IDENTITY_PATH)) {
    throw new Error("identity.json not found");
  }
  return JSON.parse(fs.readFileSync(IDENTITY_PATH, "utf-8"));
}

// single allowed entry point
// reads state only, does NOT mutate
export function requestChange(intent) {
  const identity = readIdentity();

  if (!identity.consent) {
    throw new Error("Consent not granted");
  }

  if (identity.channel !== "single-entry") {
    throw new Error("Invalid channel");
  }

  return {
    ok: true,
    mode: identity.mode,
    state: identity.state,
    intent,
    timestamp: Date.now()
  };
}

// runtime boot signal
console.log("[noema-agent] ready (single-entry)");
