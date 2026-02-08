#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Имя корня проекта
const ROOT = path.join(process.cwd(), "noema_start_v0.1");

// Создаём корень
if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT);
console.log("✅ Создан корень проекта:", ROOT);

// Создаём core/
const CORE = path.join(ROOT, "core");
if (!fs.existsSync(CORE)) fs.mkdirSync(CORE);
console.log("✅ Создана папка core");

// ---------------- package.json ----------------
const PACKAGE_JSON = {
  name: "noema_start_v0.1",
  version: "0.1.0",
  type: "module",
  dependencies: {
    "js-yaml": "^4.1.0",
    "@langchain/core": "^0.0.1",
    "@langchain/openai": "^0.0.1"
  }
};

fs.writeFileSync(path.join(ROOT, "package.json"), JSON.stringify(PACKAGE_JSON, null, 2));
console.log("✅ package.json создан");

// ---------------- noema_child.yaml ----------------
const YAML_CONTENT = `
purpose: "Электронный помощник, диалог с пользователем"
permissions:
  telegram: true
  whatsapp: false
  web: true
safety:
  max_tokens: 1000
`;
fs.writeFileSync(path.join(ROOT, "noema_child.yaml"), YAML_CONTENT.trim());
console.log("✅ noema_child.yaml создан");

// ---------------- core/index.js ----------------
const INDEX_JS = `
import './agent_runner.js';
console.log("🟢 Noema-Child v0.1 запущена");
`;
fs.writeFileSync(path.join(CORE, "index.js"), INDEX_JS.trim());
console.log("✅ core/index.js создан");

// ---------------- core/agent_runner.js ----------------
const AGENT_JS = `
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import readline from "readline";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const ROOT = process.cwd();
const YAML_PATH = path.join(ROOT, "noema_child.yaml");
if (!fs.existsSync(YAML_PATH)) {
  console.error("❌ Файл noema_child.yaml не найден в корне проекта");
  process.exit(1);
}

const noemaConfig = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));

function buildSystemPrompt(cfg) {
  return \`Ты — Noema-Child. Имя владельца: Alex. Роль: \${cfg.purpose || ""}.
Ограничения: \${JSON.stringify(cfg.permissions || {}, null, 2)}.
Безопасность: \${JSON.stringify(cfg.safety || {}, null, 2)}.\`;
}

const systemPrompt = buildSystemPrompt(noemaConfig);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🟢 Noema-Child v0.1 запущена");
console.log("🧠 Режим: диалог");
console.log("Напиши сообщение и нажми Enter (Ctrl+C — выход)\\n");

async function ask(question) {
  const messages = [new SystemMessage(systemPrompt), new HumanMessage(question)];
  const response = await model.invoke(messages);
  return response.content;
}

function loop() {
  rl.question("👤 Alex: ", async (input) => {
    try {
      const answer = await ask(input);
      console.log("\\n🤖 Noema-Child:", answer, "\\n");
    } catch (err) {
      console.error("❌ Ошибка:", err.message);
    }
    loop();
  });
}

loop();
`;
fs.writeFileSync(path.join(CORE, "agent_runner.js"), AGENT_JS.trim());
console.log("✅ core/agent_runner.js создан");

// ---------------- Готово ----------------
console.log("\n🎉 Проект noema_start_v0.1 готов! Перейди в него и запускай:");
console.log(`cd ${ROOT}`);
console.log("npm install");
console.log("node core/index.js");

