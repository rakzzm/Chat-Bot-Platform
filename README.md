# Chat Bot Platform

AI-powered chatbot platform built on [Hexabot](https://github.com/Hexastack/Hexabot) — an open-source solution for creating and managing chatbots across multiple channels with advanced AI conversational capabilities.

## Tech Stack

- **Backend**: NestJS, TypeScript, MongoDB, Mongoose, Socket.IO
- **Frontend**: Next.js 15, React 18, TypeScript, Material-UI, React Flow
- **Database**: MongoDB 7.0
- **AI**: OpenAI-compatible API integration, multi-model support

## Project Structure

```
├── packages/
│   ├── backend/          # Hexabot NestJS API
│   │   ├── src/
│   │   │   ├── analytics/    # Analytics module
│   │   │   ├── attachment/   # File attachments
│   │   │   ├── channel/      # Channel integrations
│   │   │   ├── chat/         # Chat & conversation management
│   │   │   ├── cms/          # Content management
│   │   │   ├── nlp/          # NLP & intent recognition
│   │   │   ├── setting/      # Platform settings
│   │   │   ├── user/         # User management & auth
│   │   │   ├── websocket/    # Real-time communication
│   │   │   └── ...
│   │   └── test/         # E2E & unit tests
│   └── frontend/         # Hexabot Next.js UI
│       ├── src/
│       │   ├── app-components/  # Reusable UI components
│       │   ├── components/      # Feature components
│       │   ├── pages/           # Route pages
│       │   ├── services/        # API services
│       │   └── types/           # TypeScript types
│       └── public/         # Static assets
├── docker-compose.yml
├── .env.example
└── package.json
```

## Features

- **Visual Flow Editor** — Drag-and-drop conversation builder with React Flow
- **Multi-Channel Support** — Web, WhatsApp, Telegram, and more
- **NLP & AI** — Intent recognition, entity extraction, AI-powered responses
- **Content Management** — FAQ, product catalogs, knowledge base
- **Analytics** — Conversation metrics, user engagement, message stats
- **Subscriber Management** — Audience segmentation and labeling
- **Inbox** — Real-time conversation monitoring
- **Settings** — Widget themes, channel config, fallback rules

## Getting Started

### Prerequisites

- Node.js 20.x
- Docker & Docker Compose
- npm >= 10

### Local Development (Docker)

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker compose up --build
```

- **API**: http://localhost:4000
- **Frontend**: http://localhost:8080
- **Mongo Express**: http://localhost:9000

### Manual Setup

```bash
# Install dependencies
npm install

# Start backend (NestJS)
npm run dev:backend

# Start frontend (Next.js) — in another terminal
npm run dev:frontend
```

## Environment Variables

See `.env.example` for all available configuration options. Key variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `API_PORT` — Backend port (default: 4000)
- `APP_FRONTEND_PORT` — Frontend port (default: 8080)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run dev:backend` | Start NestJS API with hot reload |
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run build` | Build both packages |
| `npm run lint` | Lint all packages |

## License

AGPL-3.0 (via Hexabot)
