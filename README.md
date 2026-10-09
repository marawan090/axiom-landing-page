# SWMP Labs — Official Website & Research Platform

> **AI-Powered Intelligence for Scientific Research** • [https://swmp-labs.tech](https://swmp-labs.tech) • [hello@swmp-labs.tech](mailto:hello@swmp-labs.tech)

Official website and Closed Beta Waitlist Application Portal for **SWMP Labs**, an early-stage, bootstrapped AI research startup building tools that help researchers explore scientific literature, uncover potential research gaps, connect findings, and develop research ideas more efficiently. Engineered for zero-friction serverless deployment on **Vercel** with direct **Resend** email alerts.

---

## 📁 Project Structure

```
swmp-labs-website/
├── api/
│   └── waitlist.js          # Vercel Serverless Function (handles POST /api/waitlist & Resend alerts)
├── index.html               # Main dark-themed Website & Early Access Modal
├── swmp_logo.jpg            # Official brand asset
├── vercel.json              # Vercel configuration for static routing & serverless api
├── package.json             # ES Module project metadata
├── waitlist.js              # Client-side form validation & dual-email intake handler
└── README.md                # Deployment documentation
```

---

## 🎨 Brand Identity & Mission

- **Company Name**: SWMP Labs
- **Website Domain**: [https://swmp-labs.tech](https://swmp-labs.tech)
- **Contact Email**: [hello@swmp-labs.tech](mailto:hello@swmp-labs.tech)
- **Founder & CEO**: Marawan Mohamed (Cloud Engineer)
- **Company Stage**: Early-stage, bootstrapped, in active development
- **Mission**: Making scientific exploration more structured, accessible, and efficient by developing workflows that help researchers analyze literature, organize evidence, and investigate potential research directions.

---

## ⚡ Product Positioning & Capabilities

1. **Multi-Source Literature Exploration**: Concurrently query papers across arXiv, Semantic Scholar, and OpenAlex by topic, author, or research domain.
2. **Structured Research Synthesis**: Extract problem statements, technical constraints, and uncover potential research gaps across findings.
3. **PlantUML Architecture Topologies**: Generate vector system diagrams and cross-paper comparison matrices via Kroki.
4. **NotebookLM Integration**: 1-click structured Markdown exporter formatted for podcast generator ingestion.
5. **Claude & AI Research Exploration**: Exploring Claude's capabilities for complex scientific reasoning, text analysis, and evidence synthesis.

---

## 📧 Resend Email Integration (`api/waitlist.js`)

When an applicant submits the early access modal:
1. `index.html` dispatches `POST /api/waitlist`.
2. Vercel executes `api/waitlist.js` (native Node.js ESM).
3. If `RESEND_API_KEY` and `ADMIN_EMAIL` are configured in Vercel Environment Variables, an email alert is sent to `ADMIN_EMAIL` via `https://api.resend.com/emails`:
   - **From**: `SWMP Labs <onboarding@resend.dev>`
   - **Subject**: `New SWMP Labs Beta Application: <Full Name> (<Academic Level>)`
   - **Body**: Formatted HTML containing applicant name, verified academic email, delivery email, domain, research problem, and feedback preference.

---

## 🚀 Vercel Deployment

### Step 1: Deploy via Vercel CLI or Git

```bash
git add .
git commit -m "chore: deploy SWMP Labs website"
git push origin main
```

### Step 2: Configure Environment Variables in Vercel

In your Vercel Project Dashboard (`Settings` -> `Environment Variables`), add:
- `RESEND_API_KEY`: Your API key from [resend.com](https://resend.com/api-keys) (`re_...`)
- `ADMIN_EMAIL`: Your verified destination email to receive new applicant alerts (`hello@swmp-labs.tech` or admin email)

Website is live at: [https://swmp-labs.tech](https://swmp-labs.tech)
