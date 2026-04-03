#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, 'packages', 'backend', '.env');
const envExamplePath = path.join(__dirname, 'packages', 'backend', '.env.example');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\n🤖 Chat Bot Platform - Setup Wizard\n');

  let openrouterKey = '';
  let jwtSecret = '';
  let port = '3001';

  if (fs.existsSync(envPath)) {
    console.log('Found existing .env file. Current values will be used as defaults.\n');
    const existing = fs.readFileSync(envPath, 'utf-8');
    const lines = existing.split('\n');
    for (const line of lines) {
      if (line.startsWith('OPENROUTER_API_KEY=')) {
        openrouterKey = line.split('=').slice(1).join('=').replace(/"/g, '');
      }
      if (line.startsWith('JWT_SECRET=')) {
        jwtSecret = line.split('=').slice(1).join('=').replace(/"/g, '');
      }
      if (line.startsWith('PORT=')) {
        port = line.split('=')[1]?.replace(/"/g, '') || '3001';
      }
    }
  }

  console.log('Get your OpenRouter API key at: https://openrouter.ai/keys\n');
  const answer1 = await question(
    `OpenRouter API Key [${openrouterKey || 'required'}]: `
  );
  openrouterKey = answer1 || openrouterKey;

  if (!openrouterKey) {
    console.log('\n⚠️  OpenRouter API key is required.');
    const retry = await question('Enter API key (or press Ctrl+C to cancel): ');
    openrouterKey = retry;
    if (!openrouterKey) {
      console.log('❌ Setup cancelled. API key is required.');
      rl.close();
      process.exit(1);
    }
  }

  const answer2 = await question(`JWT Secret [${jwtSecret || 'auto-generate'}]: `);
  jwtSecret = answer2 || jwtSecret || require('crypto').randomBytes(32).toString('hex');

  const answer3 = await question(`Backend Port [${port}]: `);
  port = answer3 || port;

  const envContent = `DATABASE_URL="file:./dev.db"
PORT=${port}
JWT_SECRET="${jwtSecret}"
FRONTEND_URL="http://localhost:5173"
OPENROUTER_API_KEY="${openrouterKey}"
APP_URL="http://localhost:${port}"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file created at packages/backend/.env');
  console.log('\nNext steps:');
  console.log('  1. npm install');
  console.log('  2. npm run db:generate');
  console.log('  3. npm run db:push');
  console.log('  4. npm run dev');

  rl.close();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  rl.close();
  process.exit(1);
});
