# The Best Estimator LLC

Marketing and lead-generation website for **The Best Estimator LLC**, a construction quantity takeoff and cost estimation service. Built with Flask, deployed on Railway.

Live site: [thebestestimatorllc.com](https://thebestestimatorllc.com)

## Tech Stack

- **Backend:** Python 3.12, Flask
- **Server:** Gunicorn (production)
- **Email:** Resend (HTTPS API) — not SMTP, since most PaaS hosts (including Railway below the Pro tier) block outbound SMTP ports
- **Frontend:** Vanilla HTML/CSS/JS + GSAP for animations, no frontend framework
- **Data:** Flat JSON files (`services.json`, `samples.json`) — no database
- **Package management:** [uv](https://docs.astral.sh/uv/)

## Project Structure
main.py Flask app — all routes and the email-sending logic
services.json Single source of truth for all services (homepage cards,
/services flashcards, and the navbar dropdown all read
from this one file — edit here, not in the templates)
samples.json Downloadable sample takeoff files shown on /samples
templates/ Jinja2 templates
static/css/ Split by section (variables, navbar, footer, main_page,
other_pages, about) — all imported via style.css
static/js/main.js All site JavaScript — scroll effects, nav dropdown,
mobile menu, form submission, service flashcard logic
static/images/ Site images. Photos are WebP (compressed); the logo
and favicon are PNG

## Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/services` | Service flashcards (CSI trade divisions) |
| `/bim-modelling` | Dedicated page for the BIM Modelling service hub |
| `/pricing` | Pricing plans + FAQ |
| `/samples` | Downloadable sample takeoffs, filterable by trade |
| `/about` | Leadership/team page |
| `/contact` | Quote request form |
| `/privacy` | Privacy policy |
| `/submit-quote` | POST — handles quote form submissions, sends email via Resend |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Local Development

**Requirements:** Python 3.12+, [uv](https://docs.astral.sh/uv/getting-started/installation/)

```bash
# Install dependencies
uv sync

# Set up environment variables
cp .env.example .env
# then fill in the real values — see below

# Run the dev server
uv run python main.py
```

Visit `http://127.0.0.1:5000`.

## Environment Variables

Create a `.env` file in the project root (never commit this — it's gitignored):

- **`RESEND_API_KEY`** — from [resend.com](https://resend.com). The account should be signed up using the same address as `CEO_EMAIL`, since Resend's default `onboarding@resend.dev` sender can only deliver to the account's own signup email until a custom domain is verified.
- **`CEO_EMAIL`** — where quote-request notifications are sent.
- **`RESEND_FROM`** *(optional)* — defaults to `The Best Estimator <onboarding@resend.dev>` if not set.

On Railway (or any host), set these same variables in the platform's environment variable settings — the `.env` file itself never gets deployed.

## Editing Content

- **Services** (homepage cards, `/services` flashcards, navbar dropdown): edit `services.json`. Every place services appear reads from this one file.
- **Samples**: edit `samples.json`. Each entry's `trade` field must exactly match a service's `sample_trade_match` value (same spelling/capitalization) for the "View Sample" deep-links to work correctly.
- **About page team bios**: edited directly in `main.py`'s `/about` route.

## Deployment

Deployed on [Railway](https://railway.app). Push to `main` and Railway redeploys automatically. Uses `gunicorn` as the production server (see `Procfile`/Railway start command).

**Known platform constraint:** Railway blocks outbound SMTP on all plans below Pro — this is why email sends over Resend's HTTPS API instead of SMTP.
