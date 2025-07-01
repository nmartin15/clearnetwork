# 📘 ClearNet – Open Source LinkedIn + Skool Alternative

## 🌟 Product Vision
ClearNet is a consent-first, AI-augmented professional network that fuses the best of LinkedIn (profiles, opportunities) and Skool (learning, groups, community)—without the noise, spam, or attention hijacking.

---

## 🧭 Guiding Principles
- Education > clout
- Consent > cold messages
- AI agents > inbox overload
- Open-source > closed ecosystems
- Contribution > engagement farming

---

## 📌 Current Status
- Phase: Planning
- Codebase: Monorepo planned (Next.js, Supabase, LangGraph, pgvector)
- Docs: `planning.md`, `requirements.txt`, `task.md`, `docs/agents.md`
- Stack: TypeScript + Python (LangGraph), Vercel + Supabase
- Project Owner: Nathan Martinez

---

## 📅 Roadmap

### ✅ Phase 0 — Planning & Architecture
- [x] Define product epic + README
- [x] Define AI agent architecture using MCPs
- [x] Draft `requirements.txt` and planning.md
- [x] Create `docs/agents.md`
- [ ] Setup repo + scaffolding

---

### 🔲 Phase 1 — Core Network MVP

**Goal**: Deploy the foundational professional graph + consent-first messaging.

- [ ] Public landing page + waitlist
- [ ] Supabase DB: users, profiles, intents, permissions
- [ ] Profile builder UI w/ AI agent
- [ ] Messaging system (InboxSentinel agent mediation)
- [ ] Recruiter flow: intent search, no cold messages
- [ ] Opt-in messaging controls
- [ ] Minimal feed: AI-tagged, educational-first content

---

### 🔲 Phase 2 — AI Agent System

**Goal**: Launch LangGraph-based agents using Multi-Agent Coordination Protocols (MCPs)

- [ ] Set up LangGraph orchestration backend
- [ ] Implement:
  - `BuilderAgent` (profile co-creation)
  - `InboxSentinel` (triage + filtering)
  - `ScoutAgent` (intent match discovery)
  - `GhostwriterAgent` (response + content)
  - `OnboardingGuide` (first-time flow)

- [ ] Embed memory store via pgvector
- [ ] Log agent decisions in vector memory
- [ ] Build `agent_config.yaml` and extension pattern

---

### 🔲 Phase 3 — Community & Learning Layer (Skool-inspired)

**Goal**: Introduce learning-first community spaces and structured education.

- [ ] `groups` table + join/invite system
- [ ] Group landing pages
- [ ] Threaded discussion boards
- [ ] AI-generated summaries of active threads
- [ ] `courses` + `lessons` data models
- [ ] Learning track UI + lesson progress tracking
- [ ] Optional group-based leaderboards (trust-weighted)
- [ ] Library/resource sharing
- [ ] Events calendar (Zoom, async, cohort-based)

---

## ⚙️ Architecture Summary

- **Frontend**: Next.js 14, Tailwind, TypeScript
- **Backend**: Supabase (Postgres, pgvector), LangGraph, FastAPI
- **Agents**: LangGraph + LangChain, modular via config
- **AI Infra**: OpenAI / Claude / Ollama pluggable LLMs
- **Messaging**: Permissioned only, no cold DMs
- **Groups**: Topic-based, private or public, AI moderation optional
- **Courses**: Group-scoped learning paths with AI co-pilots

---

## ⚠️ Constraints
- No cold outreach
- No ad-based monetization
- Spam = blocked at the architecture level
- All AI decisions must be explainable
- Open-source friendly: self-hostable, agent pluggable

---

## 🤝 Stakeholders (In Progress)
- AI ethics collaborators
- Recruiting firms valuing signal > volume
- Course creators looking for meaningful communities
- Devs and contributors for agent layer

---

## 🔁 Development Rhythm
- Weekly roadmap review
- Monthly “what’s shipped” report
- Open issues and RFCs through GitHub
