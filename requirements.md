# ClearNet Requirements

## 1. Core Platform Requirements

- [ ] User registration and authentication (email/password + OAuth)
- [ ] User profile with AI-assisted creation and editing
- [ ] Intent tagging on profiles (e.g., “seeking collaborators”, “open to mentoring”)
- [ ] Privacy settings per user (visibility, messaging preferences, agent opt-in)
- [ ] Consent-first messaging system (no unsolicited messages without opt-in)
- [ ] Recruiter search limited by intent and trust score filters

## 2. Networking and Messaging

- [ ] Inbox with AI triage (`InboxSentinel`):
  - Prioritizes messages based on trust, intent, and sentiment
  - Auto-collapses low-trust or spammy messages
  - User override and manual control for filters
- [ ] Message threading and context view
- [ ] AI-powered message drafting via `GhostwriterAgent`
- [ ] Opt-in for group invites and event notifications
- [ ] Blocking, reporting, and spam management system

## 3. AI Agent Framework

- [ ] Modular LangGraph-based AI agents using MCP coordination:
  - `BuilderAgent` for profile co-creation
  - `ScoutAgent` for discovery and matchmaking
  - `InboxSentinel` for inbox filtering
  - `GhostwriterAgent` for content drafting
  - `LearningAssistant` for course help
- [ ] Agent memory backed by vector DB (pgvector or Weaviate)
- [ ] Agent action logging and explainability UI
- [ ] Per-user and per-group agent configuration and control
- [ ] Agent onboarding guide for new users

## 4. Community & Learning

- [ ] Group creation, discovery, and join workflows
- [ ] Role-based group memberships (member, moderator, owner)
- [ ] Threaded discussion boards with Markdown support
- [ ] AI-generated thread summaries
- [ ] Course and lesson management with progress tracking
- [ ] AI tutor interaction per lesson
- [ ] Resource library within groups (documents, links, files)
- [ ] Event scheduling and RSVP (sync with Zoom/Google Calendar)

## 5. Trust & Moderation

- [ ] Transparent trust scoring system (earned, decaying, non-transferable)
- [ ] Trust-influenced content visibility and sorting
- [ ] Moderation tools with AI-assisted flagging
- [ ] Abuse and spam detection baked into messaging and community layers
- [ ] Trust dashboard UI for users and group admins

## 6. Technical & Infrastructure

- [ ] Open-source codebase with clear modular structure
- [ ] Supabase backend for Auth, Postgres DB, and Vector search
- [ ] Next.js frontend with Tailwind CSS
- [ ] LangGraph + LangChain orchestrator backend (FastAPI)
- [ ] CI/CD pipeline for tests, builds, and deployments
- [ ] Comprehensive logging, monitoring, and analytics
- [ ] Self-hosting support and deployment documentation

## 7. Security & Privacy

- [ ] GDPR-compliant user data handling
- [ ] Encrypted messaging storage and transmission
- [ ] User controls for data export and account deletion
- [ ] Agent data privacy and consent logs
