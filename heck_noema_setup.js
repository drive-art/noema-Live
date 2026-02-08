#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// 1️⃣ Проверяем Node.js и npm
try {
  const nodeVersion = execSync("node -v").toString().trim();
  const npmVersion = execSync("npm -v").toString().trim();
  console.log(`✅ Node.js версия: ${nodeVersion}`);
  console.log(`✅ npm версия: ${npmVersion}`);
} catch (err) {
  console.error("❌ Не удалось определить версию Node или npm");
}

// 2️⃣ Проверяем корневые файлы
const ROOT = process.cwd();
const requiredRootFiles = ["package.json", "noema_child.yaml"];
requiredRootFiles.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Найден файл: ${file}`);
  } else {
    console.warn(`❌ Файл отсутствует: ${file}`);
  }
});

// 3️⃣ Проверяем core/agent_runner.js
const AGENT_PATH = path.join(ROOT, "core", "agent_runner.js");
if (fs.existsSync(AGENT_PATH)) {
  console.log(`✅ Найден файл: core/agent_runner.js`);
} else {
  console.warn(`❌ Файл отсутствует: core/agent_runner.js`);
}

// 4️⃣ Итог
const allGood =
  requiredRootFiles.every(f => fs.existsSync(path.join(ROOT, f))) &&
  fs.existsSync(AGENT_PATH);

if (allGood) {
  console.log("\n🎉 Всё готово! Проект можно запускать:");
  console.log("cd " + ROOT);
  console.log("npm install");
  console.log("node core/index.js");
} else {
  console.log("\n⚠️ Проект не готов к запуску. Исправьте отсутствующие файлы.");
}
