#!/usr/bin/env node

/**
 * Setup script for Chat Bot Platform (Megh EngageX)
 *
 * Validates prerequisites, copies .env.example to .env if missing,
 * and installs all dependencies.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ROOT = __dirname;
const ENV_FILE = path.join(ROOT, ".env");
const ENV_EXAMPLE = path.join(ROOT, ".env.example");

// --- Helpers ---

function log(msg) {
  console.log(`[setup] ${msg}`);
}

function warn(msg) {
  console.warn(`[setup] WARNING: ${msg}`);
}

function error(msg) {
  console.error(`[setup] ERROR: ${msg}`);
}

function run(cmd, opts = {}) {
  log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT, ...opts });
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  if (major < 20) {
    error(
      `Node.js 20+ is required. Current version: ${nodeVersion}. Please upgrade.`,
    );
    process.exit(1);
  }
  log(`Node.js ${nodeVersion} — OK`);
}

function checkDocker() {
  try {
    execSync("docker --version", { stdio: "ignore" });
    log("Docker — OK");
    return true;
  } catch {
    warn("Docker not found. Docker is required for docker-compose setup.");
    return false;
  }
}

function checkDockerCompose() {
  try {
    execSync("docker compose version", { stdio: "ignore" });
    log("Docker Compose — OK");
    return true;
  } catch {
    warn(
      "Docker Compose plugin not found. Run: docker compose up --build",
    );
    return false;
  }
}

function setupEnv() {
  if (fs.existsSync(ENV_FILE)) {
    log(".env already exists — skipping");
    return;
  }
  if (!fs.existsSync(ENV_EXAMPLE)) {
    error(".env.example not found. Cannot create .env.");
    process.exit(1);
  }
  fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
  log("Created .env from .env.example");
  log("Please review and update .env with your actual values (JWT_SECRET, OPENROUTER_API_KEY, etc.)");
}

function installDeps() {
  log("Installing dependencies...");
  run("npm install");
  log("Dependencies installed successfully");
}

function generateSecrets() {
  const crypto = require("crypto");
  const envPath = ENV_FILE;

  if (!fs.existsSync(envPath)) return;

  let envContent = fs.readFileSync(envPath, "utf8");

  // Replace dev_only JWT_SECRET if still default
  if (envContent.includes("JWT_SECRET=dev_only")) {
    const secret = crypto.randomBytes(32).toString("hex");
    envContent = envContent.replace(/JWT_SECRET=dev_only/g, `JWT_SECRET=${secret}`);
    log("Generated random JWT_SECRET");
  }

  if (envContent.includes("SESSION_SECRET=f661ff500fff6b0c8f91310b6fff6b0c")) {
    const secret = crypto.randomBytes(16).toString("hex");
    envContent = envContent.replace(
      /SESSION_SECRET=f661ff500fff6b0c8f91310b6fff6b0c/g,
      `SESSION_SECRET=${secret}`,
    );
    log("Generated random SESSION_SECRET");
  }

  if (envContent.includes("INVITATION_JWT_SECRET=dev_only")) {
    const secret = crypto.randomBytes(32).toString("hex");
    envContent = envContent.replace(
      /INVITATION_JWT_SECRET=dev_only/g,
      `INVITATION_JWT_SECRET=${secret}`,
    );
    log("Generated random INVITATION_JWT_SECRET");
  }

  if (envContent.includes("PASSWORD_RESET_JWT_SECRET=dev_only")) {
    const secret = crypto.randomBytes(32).toString("hex");
    envContent = envContent.replace(
      /PASSWORD_RESET_JWT_SECRET=dev_only/g,
      `PASSWORD_RESET_JWT_SECRET=${secret}`,
    );
    log("Generated random PASSWORD_RESET_JWT_SECRET");
  }

  if (envContent.includes("SIGNED_URL_SECRET=dev_only")) {
    const secret = crypto.randomBytes(32).toString("hex");
    envContent = envContent.replace(
      /SIGNED_URL_SECRET=dev_only/g,
      `SIGNED_URL_SECRET=${secret}`,
    );
    log("Generated random SIGNED_URL_SECRET");
  }

  if (envContent.includes("MONGO_PASSWORD=dev_only")) {
    const password = crypto.randomBytes(16).toString("hex");
    envContent = envContent.replace(
      /MONGO_PASSWORD=dev_only/g,
      `MONGO_PASSWORD=${password}`,
    );
    log("Generated random MONGO_PASSWORD");
  }

  fs.writeFileSync(envPath, envContent);
}

// --- Main ---

async function main() {
  console.log("\n========================================");
  console.log("  Chat Bot Platform — Setup (Megh EngageX)");
  console.log("========================================\n");

  // 1. Check prerequisites
  log("Checking prerequisites...");
  checkNodeVersion();
  const hasDocker = checkDocker();
  const hasCompose = checkDockerCompose();

  // 2. Setup .env
  log("\nSetting up environment...");
  setupEnv();
  generateSecrets();

  // 3. Install dependencies
  log("\nInstalling dependencies...");
  installDeps();

  // 4. Summary
  console.log("\n========================================");
  console.log("  Setup complete!");
  console.log("========================================\n");
  console.log("Next steps:");
  console.log("");
  console.log("  1. Review .env and set your OPENROUTER_API_KEY");
  console.log("  2. Start with Docker:");
  console.log("     docker compose up --build");
  console.log("");
  console.log("  3. Or start manually:");
  console.log("     npm run dev:backend   # Terminal 1");
  console.log("     npm run dev:frontend  # Terminal 2");
  console.log("");
  console.log("  API:      http://localhost:4000");
  console.log("  Frontend: http://localhost:8080");
  console.log("  Widget:   http://localhost:5173");
  console.log("");

  rl.close();
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
