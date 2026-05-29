# aiGTD — AI-Powered GTD + Second Brain

A React Native (Expo) app combining Getting Things Done task management with an
Obsidian-style connected knowledge base, powered by Claude AI and semantic search.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              iPhone App                  │
│                                          │
│  Tasks ──── iCloud KV ────► other iPhones│
│                                          │
│  Notes ──── Supabase ─────► pgvector    │
│               │                          │
│  AI Agent ◄──┘ (semantic context inject) │
│      │                                   │
│      └──► Claude API (claude-sonnet-4)  │
│                                          │
│  Embeddings: Voyage AI (voyage-3-lite)  │
└─────────────────────────────────────────┘
```

### Storage split
| Data | Where | Why |
|------|-------|-----|
| Tasks & projects | iCloud KV + AsyncStorage | Free, instant, offline-first |
| API keys | expo-secure-store (device keychain) | Encrypted, never leaves device |
| Notes | Supabase Postgres | Searchable, vector index |
| Note embeddings | Supabase pgvector | Semantic search |

---

## One-Time Setup (30 minutes)

### 1. Supabase (free)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open the **SQL Editor**
3. Paste and run the entire contents of `supabase/migrations/001_notes_schema.sql`
4. Go to **Settings → API** and copy:
   - Project URL (`https://xxxx.supabase.co`)
   - `anon` / `public` key

> **Disable RLS for initial testing**: In the SQL editor run:
> `alter table notes disable row level security;`
> Re-enable it before shipping.

### 2. Voyage AI (free — 200M tokens)

1. Go to [dash.voyageai.com](https://dash.voyageai.com) → Sign Up (free, no card)
2. Create an API key (`pa-…`)
3. You get 200M free tokens — at ~500 tokens/note, that's **400,000 notes** for free

### 3. Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key (`sk-ant-…`)
3. Claude Sonnet 4 costs ~$0.003/message — pennies per day of normal use

### 4. EAS (Expo cloud builds)

```bash
npm install -g eas-cli
eas login          # sign in with your Expo account
eas build:configure
```

### 5. .env file

Create `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_VOYAGE_API_KEY=pa-...
```

> The Anthropic key is entered inside the app (stored in device keychain, not in .env).

---

## Running the App

### Install dependencies
```bash
npm install
```

### Development build (runs on your iPhone via Expo Go equivalent)
```bash
# Cloud build — no Mac needed
eas build --profile development --platform ios

# Scan the QR code with your iPhone to install
```

### Production build → App Store
```bash
eas build --profile production --platform ios
eas submit --platform ios
```

---

## Features

### Tasks (GTD)
- **Inbox** — capture anything, AI auto-clarifies and routes it
- **Current Tasks** — filtered by urgency, bucket, done status
- **Task Detail** — AI analysis + GTD bucket routing
- **Weekly Review** — AI-generated insights

### Notes (Second Brain)
- **Markdown editor** with live `[[wikilink]]` and `#tag` highlighting
- **Link notes to tasks** via the task picker toolbar
- **AI Expand** — Claude suggests connections, missing context, next thoughts
- **Semantic search** — search by meaning ("what do I know about permits?")
  finds relevant notes even if those exact words don't appear
- **Hybrid search** — combines semantic + keyword for best results

### AI Agent
- **Every AI response** automatically searches your notes for relevant context
- Claude sees your second brain before answering — no need to repeat yourself
- **Daily digest** and **Weekly review** also pull relevant notes

---

## Second Brain Usage Guide

### Wikilinks
Connect notes to each other:
```
[[Contractor Background]]
[[Orlando Summit Notes]]
[[Task: Follow up on permit]]
```
Click any wikilink to open that note (coming in v1.1).

### Tags
Organize with inline hashtags:
```
This relates to the #permits process and #lennar workflow.
```

### AI Expand
Open any note → tap "✦ AI Expand" in the toolbar. Claude will:
- Suggest connections to your other notes
- Ask clarifying questions to deepen the note
- Identify missing context

### Search
The search bar uses **hybrid search** — a blend of:
- **Semantic search** (70%): finds notes by meaning, even with different words
- **Keyword search** (30%): exact term matching for precision

Example: searching "Orlando contractor" will find notes that mention
"Florida meeting", "building permit discussion", or "site visit" even without
those exact words, because they're semantically related.

---

## Cost Summary

| Service | Free Tier | After Free |
|---------|-----------|------------|
| Supabase | 500MB, 50k rows | $25/mo |
| Voyage AI | 200M tokens | $0.02/MTok |
| Anthropic | Pay per use | ~$0.003/msg |
| iCloud KV | 1MB per app | Free forever |
| EAS Build | 30 builds/mo | $29/mo |
| Apple Dev Program | — | $99/year |

**For personal use: effectively $99/year** (just Apple Developer Program).
