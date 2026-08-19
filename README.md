# Workly AI — AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application that helps professionals automate everyday workplace tasks with AI. Workly AI combines a clean dashboard, sidebar navigation, and five specialized AI tools into one fast, keyboard-friendly workspace.

**Live preview:** https://productivity-ally-ai.lovable.app

---

## Features

| Tool | What it does |
| --- | --- |
| **Smart Email Generator** | Turn a few inputs (recipient, purpose, tone, key points) into a polished, ready-to-send email. |
| **Meeting Notes Summarizer** | Paste raw notes and get a concise summary with action items and key takeaways. |
| **AI Task Planner** | Describe a goal or project and receive a structured, prioritized task plan with deadlines and rationale. |
| **AI Research Assistant** | Generate quick research briefs, pros/cons lists, and source suggestions on any topic. |
| **AI Chatbot** | Have a threaded conversation with Workly, the workplace assistant, for ad-hoc questions and drafts. |

All tools:
- use **structured prompts** so you don't have to engineer prompts yourself,
- produce **editable markdown** outputs with a live preview,
- include a **responsible AI disclaimer** reminding users to review before acting on generated content.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start/) (full-stack React with SSR/SSG)
- **Router:** [TanStack Router](https://tanstack.com/router/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom OKLCH theme tokens
- **UI Components:** shadcn/ui + [AI Elements](https://elements.ai-sdk.dev/) (conversation, message, prompt input, shimmer)
- **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/react` + `ai` v7)
- **AI Gateway:** Lovable AI Gateway (`ai.gateway.lovable.dev`) with `google/gemini-3.7-flash`
- **Chat Storage:** Browser localStorage (threaded conversations)

---

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd <repository-name>
```

2. **Install dependencies**

```bash
npm install
# or
bun install
```

3. **Run the development server**

```bash
npm run dev
```

Open http://localhost:8080 to view the app.

4. **Set up the AI gateway** (required for AI responses)

The app uses the Lovable AI Gateway. Make sure your project has a valid `LOVABLE_API_KEY` configured in the Lovable Cloud / project settings. Without it, AI generation requests will fail.

---

## Project Structure

```text
src/
├── components/          # Shared UI components (AppSidebar, AiToolWorkspace, ChatWorkspace, etc.)
├── components/ui/       # shadcn/ui primitives
├── components/ai-elements/  # AI chat primitives
├── lib/                 # Utilities, AI gateway helpers, and thread storage
├── routes/              # TanStack file-based routes
│   ├── index.tsx        # Dashboard
│   ├── email.tsx        # Smart Email Generator
│   ├── notes.tsx        # Meeting Notes Summarizer
│   ├── planner.tsx      # AI Task Planner
│   ├── research.tsx     # AI Research Assistant
│   ├── chat.tsx         # Chat shell layout
│   ├── chat.index.tsx   # Chat redirect
│   ├── chat.$threadId.tsx  # Individual thread
│   └── api/chat.ts      # Streaming chat API endpoint
├── styles.css           # Tailwind theme, fonts, and design tokens
└── assets/              # Logo and brand assets
```

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |

---

## Design Notes

- **Theme:** "Cloud White" — clean, airy, professional SaaS palette using OKLCH color tokens.
- **Typography:** Space Grotesk for headings, DM Sans for body text.
- **Layout:** Collapsible sidebar with a responsive main content area; tools use a two-column prompt/output layout on desktop and stack on mobile.
- **Accessibility:** Inputs are labeled, focus states are visible, and the sidebar uses a standard disclosure pattern.

---

## Responsible AI

Workly AI generates drafts to help you move faster, not to replace human judgment. Always review, fact-check, and edit any AI-generated email, plan, summary, research, or chat response before sending or acting on it. A disclaimer is shown in every tool to reinforce this.

---

## License

This project is your own code generated through Lovable. Use it, modify it, and deploy it as you see fit.
