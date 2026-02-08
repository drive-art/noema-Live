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
  return `Ты — Noema-Child. Имя владельца: Alex. Роль: ${cfg.purpose || ""}.
Ограничения: ${JSON.stringify(cfg.permissions || {}, null, 2)}.
Безопасность: ${JSON.stringify(cfg.safety || {}, null, 2)}.`;
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
console.log("Напиши сообщение и нажми Enter (Ctrl+C — выход)\n");

async function ask(question) {
  const messages = [new SystemMessage(systemPrompt), new HumanMessage(question)];
  const response = await model.invoke(messages);
  return response.content;
}

function loop() {
  rl.question("👤 Alex: ", async (input) => {
    try {
      const answer = await ask(input);
      console.log("\n🤖 Noema-Child:", answer, "\n");
    } catch (err) {
      console.error("❌ Ошибка:", err.message);
    }
    loop();
  });
}

loop();