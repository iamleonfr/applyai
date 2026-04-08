# German Career Assist

AI-powered CV optimization for the German job market. This project consists of two independent npm applications: a backend API and a React frontend.

## Architecture

- **Backend**: Express.js API with OpenAI integration, PDF generation, and CV analysis
- **Frontend**: React + Vite application for CV upload and optimization

## Prerequisites

- Node.js v20+
- npm (not pnpm)
- OPENAI_API_KEY environment variable

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on port `8000` by default (configurable via `PORT` env var).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on port `3000` by default (configurable via `PORT` env var).

## Running Both Servers

Open two terminals and run:

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The frontend proxy configuration automatically routes `/api/*` requests to `http://localhost:8000`.

## Environment Setup

Create a `.env` file in the `/backend` directory:

```
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
PORT=8000
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with tsx
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled backend

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Type check with TypeScript

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── app.ts           # Express app setup
│   │   ├── routes/          # API routes (/analyze, /download-pdf, etc.)
│   │   ├── services/        # Business logic (AI, PDF generation)
│   │   └── lib/             # Utilities (logger, PDF extraction)
│   ├── index.ts             # Server entrypoint
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # UI components (Radix UI)
│   │   ├── lib/             # API client and utilities
│   │   └── hooks/           # React hooks
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Features

- **AI CV Optimization**: Uses GPT-4o to analyze and optimize CVs for German job market
- **PDF Generation**: Creates professional PDF documents with optimized CV and cover letter
- **PDF Upload**: Extract text from user-provided CVs for analysis
- **CORS**: Frontend and backend can run independently with proxy support
- **TypeScript**: Type-safe development across both applications

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/analyze` - Analyze CV and generate optimized version (multipart form)
- `POST /api/download-pdf` - Generate PDF from CV and cover letter (JSON)

## Deployment

### Backend Deployment

```bash
npm run build
npm start
```

Ensure `OPENAI_API_KEY` and `PORT` environment variables are set.

### Frontend Deployment

```bash
npm run build
```

Output is in the `dist/` folder. Serve with any static HTTP server and configure the API proxy to point to your backend.

## Troubleshooting

**Port already in use:**

```bash
PORT=3001 npm run dev  # Frontend
PORT=8001 npm run dev  # Backend
```

**Module not found errors:**
Ensure you've run `npm install` in both backends and frontend directories.

**OpenAI API errors:**
Check that your `OPENAI_API_KEY` is valid and has available credits on https://platform.openai.com/settings/billing

## License

MIT
