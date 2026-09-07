# Axiom Research AI — Standalone Landing Page & Waitlist

> **An open-source initiative by SWMP Labs — Technology for a Smarter Tomorrow**

A completely standalone, sleek, high-converting dark-themed landing page and Closed Beta Waitlist Application Portal for **Axiom Research AI**. Engineered for zero-friction serverless deployment on **Vercel** with direct **Resend** email alerts.

---

## 📁 Project Structure

```
axiom-landing-page/
├── api/
│   └── waitlist.py          # Vercel Serverless Function (handles POST /api/waitlist & Resend alerts)
├── index.html               # Main dark-themed Landing Page & Closed Beta Modal
├── axiom_logo.jpg           # Official brand asset
├── swmp_logo.jpg            # Parent lab badge asset
├── requirements.txt         # Python dependencies for serverless function (httpx)
├── vercel.json              # Vercel rewrite configuration for serverless routing
├── .env.example             # Resend environment variables template
└── README.md                # Deployment documentation
```

---

## 🎨 Visual Identity & Architecture

- **Theme**: Premium Dark Mode (`slate-950` / `zinc-900` deep space backdrop, glassmorphism border card layers, subtle violet & emerald ambient glow highlights).
- **Typography**: Clean `Inter` body with `JetBrains Mono` telemetry badges, monospace status feeds, and code blocks.
- **Tone**: Focused, academic, engineering-first — tailored for distributed systems architects, HPC engineers, thesis candidates, and academic supervisors.
- **Self-Contained**: 100% decoupled from any backend or database.

---

## ⚡ Features & Content

1. **Hero Section**:
   - Status Badge: `🔒 Closed Beta Cohort (Batch 1: 30-40 Researchers)` with animated pulse ping.
   - Headline: **High-Signal Distributed Systems & AI Research, Synthesized in Seconds.**
   - Subheadline: *Stop drowning in 30-page papers. Search ArXiv, Semantic Scholar, and OpenAlex concurrently, uncover hidden thesis research gaps, render on-demand PlantUML architecture topologies, and export structured bundles to NotebookLM with one click.*
   - Primary CTA: `Apply for Closed Beta Access` (Opens modal).
   - Live Tech Badges: `DeepSeek-V4 via OrcaRouter` • `Kroki Diagram Engine` • `NotebookLM Exporter` • `KaTeX Math Rendering`.

2. **Interactive Terminal & Synthesis Preview**:
   - Tab 1: **Systems Synthesis** (4-stage paper breakdown + delta proposals).
   - Tab 2: **PlantUML Topology** (Disaggregated consensus flow rendered via Kroki).
   - Tab 3: **Ingestion Feed** (Concurrent ArXiv, OpenAlex, Semantic Scholar with GitHub matching).
   - Tab 4: **NotebookLM Pack** (1-click podcast & source bundle).

3. **Feature Grid (3 Compact Cards)**:
   - **Multi-Source Academic Pipeline**: Concurrently fetches, ranks, and deduplicates papers across ArXiv, Semantic Scholar, and OpenAlex with automatic GitHub repo matching.
   - **On-Demand Systems Synthesis**: DeepSeek-powered breakdowns extracting problem statements, technical bottlenecks, and actionable thesis extension proposals.
   - **Publication-Ready Assets**: Instant vector architecture diagrams (Kroki PlantUML), formatted BibTeX/IEEE citations, and 1-click Google NotebookLM packs.

4. **Closed Beta Waitlist Application Modal**:
   - Prominent Screening Disclaimer:
     > *"Batch 1 Closed Beta: Curated cohort of active researchers and systems engineers. Submissions are strictly reviewed before granting access."*
   - Screening Form Fields:
     1. Full Name (Required text)
     2. Institutional / Academic Email (Required email)
     3. Current Role / Academic Level (Dropdown)
     4. Primary Research Domain (Dropdown + custom Other field)
     5. Current Research Question or Thesis Problem (Textarea with character guidance)
     6. 10-Minute Technical Feedback Session Willingness (Radio: Yes / No)
   - Submission Feedback:
     > *"Application Received. Your submission is currently under technical review. You will receive an invitation if selected."*
     - Generates reference ID hash (`AXIOM-B1-XXXX`) with `Copy Reference ID` and `Download Receipt (.json)` buttons.

---

## 📧 Resend Email Integration (`api/waitlist.py`)

When an applicant submits the modal:
1. `index.html` sends a `POST /api/waitlist` request.
2. Vercel executes `api/waitlist.py` (using `httpx`).
3. If `RESEND_API_KEY` and `ADMIN_EMAIL` are configured in Vercel Environment Variables, an email alert is immediately sent to `ADMIN_EMAIL` via `https://api.resend.com/emails`:
   - **From**: `Axiom Waitlist <onboarding@resend.dev>`
   - **Subject**: `New Beta Application: <Full Name> (<Academic Level>)`
   - **Body**: Formatted HTML containing applicant name, email, academic standing, domain, thesis problem, and feedback preference.

---

## 🚀 Independent Vercel Deployment

### Step 1: Deploy with Vercel CLI or Git

#### Option A: Vercel CLI
```bash
cd axiom-landing-page
vercel
```

#### Option B: Push to a GitHub Repository
1. Initialize git inside `axiom-landing-page`:
   ```bash
   cd axiom-landing-page
   git init
   git add .
   git commit -m "Initial commit: Axiom Research AI Landing Page & Serverless Waitlist"
   ```
2. Import the repository into your [Vercel Dashboard](https://vercel.com/new).

### Step 2: Configure Environment Variables in Vercel
In your Vercel Project Dashboard (`Settings` -> `Environment Variables`), add:
- `RESEND_API_KEY`: Your API key from [resend.com](https://resend.com/api-keys) (`re_...`)
- `ADMIN_EMAIL`: Your verified destination email to receive new applicant alerts

That's it! Your landing page and serverless email waitlist are live with zero database configuration or ongoing maintenance required.
