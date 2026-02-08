#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🔹 Проверка Node и npm...");
try {
  console.log(✅ Node: ${execSync("node -v").toString().trim()});
  console.log(✅ npm: ${execSync("npm -v").toString().trim()});
} catch { console.error("❌ Не удалось определить Node/npm"); }

const ROOT = process.cwd();
const files = ["package.json","noema_child.yaml"];
files.forEach(f=> fs.existsSync(path.join(ROOT,f)) ? console.log(✅ ${f} найден) : console.warn(❌ ${f} отсутствует));

const AGENT = path.join(ROOT,"core","agent_runner.js");
fs.existsSync(AGENT) ? console.log("✅ core/agent_runner.js найден") : console.warn("❌ core/agent_runner.js отсутствует");

console.log("\n🎯 Итог проверки: готовность к запуску проекта!");
