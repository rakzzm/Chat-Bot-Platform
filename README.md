# Chat Bot Platform

AI-powered chat bot platform builder for SMEs. Create, configure, and deploy custom AI chatbots with a visual builder interface.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, WebSocket
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Zustand
- **Database**: SQLite (dev), PostgreSQL (prod-ready)
- **AI**: OpenRouter API (Qwen, Gemini, Llama, Claude, GPT), multi-model support

## Project Structure

```
├── packages/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── routes/   # API route handlers
│   │   │   ├── middleware/ # Auth middleware
│   │   │   ├── services/ # OpenAI integration
│   │   │   ├── websocket/ # Real-time connections
│   │   │   └── utils/    # Database & helpers
│   │   └── prisma/       # Database schema
│   └── frontend/         # React SPA
│       └── src/
│           ├── components/ # Reusable UI
│           ├── pages/      # Route pages
│           ├── context/    # Auth state
│           └── types/      # TypeScript types
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install dependencies
npm install

# Run interactive setup (prompts for OpenRouter API key)
npm run setup

# Initialize database
npm run db:generate
npm run db:push

# Start development servers
npm run dev
```

Or set the API key manually:

```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env and add your OPENROUTER_API_KEY (get one at https://openrouter.ai)
```

**Quick CLI one-liner to set the API key:**

```bash
echo 'OPENROUTER_API_KEY="sk-or-v1-your-key-here"' > packages/backend/.env
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

### Docker

```bash
docker compose up --build
```

## Features

- User authentication (register/login with JWT)
- Bot builder with custom system prompts
- Multiple AI model support via OpenRouter (Qwen, Gemini, Llama, Claude, GPT)
- Real-time chat via WebSocket
- Conversation history
- Responsive UI with TailwindCSS

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/bots | List user's bots |
| POST | /api/bots | Create a bot |
| GET | /api/bots/:id | Get bot details |
| PATCH | /api/bots/:id | Update bot |
| DELETE | /api/bots/:id | Delete bot |
| GET | /api/conversations | List conversations |
| POST | /api/conversations | Send message |
| GET | /api/conversations/:id/messages | Get messages |
| GET | /api/health | Health check |

## License

MIT
