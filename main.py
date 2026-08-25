import os
import json
import base64
import requests
from pathlib import Path
from flask import Flask, render_template, request, jsonify, Response, url_for, redirect
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-123')

# --- Resend (HTTPS email API) Configuration ---
# Switched from SMTP because Railway blocks all outbound SMTP ports on every
# plan below Pro. Resend sends over HTTPS instead, so no blocked-port issue.
RESEND_API_KEY = os.getenv('RESEND_API_KEY')
RESEND_FROM = os.getenv('RESEND_FROM', 'The Best Estimator <onboarding@resend.dev>')
CEO_EMAIL = os.getenv('CEO_EMAIL', 'support@thebestestimatorllc.com')

# Single source of truth for the canonical domain — used in base.html's
# canonical/OG tags and in the sitemap. If the preferred domain ever
# changes (e.g. adding www), update it here only.
SITE_DOMAIN = 'https://thebestestimatorllc.com'

# Max upload size: 15MB, to keep blueprint attachments within typical email/API limits
app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024

def send_via_resend(payload):
    """POST an email to Resend's HTTPS API.

    Uses the `requests` library rather than urllib — on at least one real
    dev machine, raw urllib's SSL stack failed to complete a TLS handshake
    with Resend's Cloudflare-fronted endpoint (curl to the same URL from
    the same machine worked perfectly, isolating it to Python's own SSL
    module rather than any network/firewall issue). requests/urllib3
    handles this TLS 1.3 + session-resumption combination more robustly
    in practice. Raises on any failure so the caller's existing
    try/except handles it exactly as before.
    """
    response = requests.post(
        'https://api.resend.com/emails',
        json=payload,
        headers={'Authorization': f'Bearer {RESEND_API_KEY}'},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()

def load_samples():
    try:
        with open(BASE_DIR / 'samples.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        app.logger.error("Unable to load samples.json: %s", e)
        return []

def load_services():
    try:
        with open(BASE_DIR / 'services.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        app.logger.error("Unable to load services.json: %s", e)
        return []

@app.before_request
def redirect_trailing_slash():
    # The previous WordPress site used trailing-slash URLs (e.g. /about/)
    # as its default permalink structure. Our routes don't have trailing
    # slashes, so Flask returns a plain 404 for the old indexed URLs
    # instead of connecting them to the real page — meaning any ranking
    # signal those old URLs had gets thrown away rather than transferred.
    # This 301-redirects any trailing-slash URL to its real counterpart,
    # so Google (and anyone with an old bookmark/link) lands on the
    # correct page and the redirect properly consolidates SEO value.
    if request.path != '/' and request.path.endswith('/'):
        return redirect(request.path.rstrip('/'), code=301)

@app.context_processor
def inject_nav_services():
    # Makes the services list (and the canonical site domain, used for
    # SEO tags in base.html) available on every page, without needing
    # to pass them from every single route.
    return {'nav_services': load_services(), 'site_domain': SITE_DOMAIN}

@app.route('/')
def index():
    all_services = load_services()
    return render_template('index.html', services=all_services)

@app.route('/samples')
def samples():
    all_samples = load_samples()
    return render_template('samples.html', samples=all_samples)

@app.route('/services')
def services_page():
    all_services = load_services()
    # The "BIM Modelling" entry is a hub — it has its own dedicated page
    # (/bim-modelling) instead of a flashcard here, so it's excluded.
    visible_services = [s for s in all_services if not s.get('is_hub')]
    return render_template('services.html', services=visible_services)

@app.route('/bim-modelling')
def bim_modelling():
    all_services = load_services()
    hub = next((s for s in all_services if s.get('is_hub')), None)
    sub_services = hub['sub_services'] if hub else []
    return render_template('bim_modelling.html', services=sub_services, hub=hub)

@app.route('/about')
def about():
    # Placeholder content — edit the strings below with the real name,
    # title, and bio copy. Keeping it here (rather than hardcoded in the
    # template) means future edits only need to happen in one place.
     cofounder= {
           'name': 'Mohsin Altaf',
           'title': 'Co-founder & Managing Director',
           'photo': 'images/team/ceo.webp',
           'bio_paragraphs': [
               'The Best Estimator LLC was built from a simple idea: construction '
               'professionals should be able to rely on their estimates before they '
               'commit to a project. What started as a focused estimating service '
               'has grown through hands-on project experience into a team supporting '
               'projects across multiple trades and scopes of work.',

               'Over the years, our work has been shaped by the projects themselves — '
               'each set of plans, every revision, and every scope requiring a '
               'different level of attention. We have now completed more than 3,000 '
               'projects, giving us practical experience across a wide range of '
               'construction work. Our approach remains straightforward: understand '
               'the plans, identify what the project actually requires, and deliver '
               'organized takeoffs and estimates that give our clients a clearer '
               'picture of their costs before the work begins.'
           ]
       }

     ceo= {
             'name': 'Ismail Ijaz',
             'title': 'Chief Executive Officer',
             'photo': 'images/team/ceo.webp',
             'bio_paragraphs': [
                 'Ismail leads The Best Estimator LLC as CEO, focused on the '
                 'direction and growth of the company as it takes on a wider range '
                 'of projects and trades.',

                 'His approach centers on building a team that clients can trust '
                 'with the numbers that matter most before a project begins. As '
                 'The Best Estimator LLC has grown alongside its cofounder\'s '
                 'hands-on estimating work, Ismail has focused on '
                 'strengthening client relationships, scaling the team, '
                 'expanding into new trades, and making sure the company\'s growth never comes at the cost of the '
                 'accuracy and reliability clients depend on.'
             ],
         }
    # Team section (3rd section) — placeholder identities until real names/
    # titles/bios are provided. Each entry's photo path is pre-set to where
    # the real file should eventually live; if that file doesn't exist yet,
    # the template shows a clean "Photo Coming Soon" placeholder instead of
    # a broken image. The moment a correctly-named file is saved to that
    # path, it starts rendering automatically — no code changes needed.
     team_raw = [
        {
            'name': 'Hizbullah Mashwani',
            'title': 'Sales Representative',
            'photo_path': 'images/team/Hizbullah.webp',
            'bio': 'Hizbullah works with prospective clients to understand their project needs and match them with the right estimating services. He supports the sales process from first contact through follow-up, helping ensure client questions are answered clearly at every stage.'
        },
        {
            'name': 'Abdullah Fazal',
            'title': 'IT Specialist',
            'photo_path': 'images/team/donnie.webp',
            'bio': "Abdullah manages the company's websites and IT infrastructure, keeping our systems running smoothly behind the scenes so the team can stay focused on delivering accurate, timely estimates to clients."
        },
        {
            'name': 'Areeba Ali',
            'title': 'Team Lead',
            'photo_path': 'images/team/kylie_final.webp',
            'bio': 'Areeba leads the estimating team day to day, keeping every project moving smoothly from initial scope through to a finished takeoff. She works closely with the team to keep deliverables accurate, consistent, and on schedule for every client.'
        },
    ]
     team = []
     for member in team_raw:
        photo_exists = (BASE_DIR / 'static' / member['photo_path']).exists()
        team.append({
            'name': member['name'],
            'title': member['title'],
            'bio': member['bio'],
            'photo': member['photo_path'] if photo_exists else None,
        })
     return render_template('about.html', cofounder=cofounder, ceo=ceo, team=team)

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/robots.txt')
def robots_txt():
    lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /submit-quote',
        '',
        f'Sitemap: {SITE_DOMAIN}/sitemap.xml',
    ]
    return Response('\n'.join(lines), mimetype='text/plain')

@app.route('/sitemap.xml')
def sitemap_xml():
    # Static pages only — samples/services detail pages are anchor-based
    # (#svc-...) on their parent pages, not separate crawlable URLs, so
    # they're intentionally not listed here individually.
    pages = [
        {'loc': url_for('index'), 'priority': '1.0', 'changefreq': 'weekly'},
        {'loc': url_for('services_page'), 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': url_for('bim_modelling'), 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': url_for('samples'), 'priority': '0.7', 'changefreq': 'monthly'},
        {'loc': url_for('pricing'), 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': url_for('about'), 'priority': '0.6', 'changefreq': 'monthly'},
        {'loc': url_for('contact'), 'priority': '0.7', 'changefreq': 'monthly'},
        {'loc': url_for('privacy'), 'priority': '0.3', 'changefreq': 'yearly'},
    ]
    xml = render_template('sitemap.xml', pages=pages, site_domain=SITE_DOMAIN)
    return Response(xml, mimetype='application/xml')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/submit-quote', methods=['POST'])
def submit_quote():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    organization = request.form.get('org', '').strip()
    project_type = request.form.get('project_type')
    services = request.form.get('services')
    message = request.form.get('message')

    # Basic server-side validation — never trust the client alone
    if not name or not email:
        return jsonify({
            "status": "error",
            "message": "Name and email are required."
        }), 400

    file = request.files.get('blueprint')
    has_attachment = bool(file and file.filename)

    body_lines = [
        "New Lead Submitted!",
        f"Contractor: {name} ({email})",
        f"Company: {organization or 'Not provided'}",
        f"Project Trade: {project_type}",
        f"Requested Services: {services}",
        f"Message: {message}",
    ]
    body = "\n".join(body_lines)
    print(body)  # keep server-log visibility for debugging

    try:
        html_body = render_template(
            'email/quote_notification.html',
            name=name,
            email=email,
            organization=organization,
            project_type=project_type,
            services=services,
            message=message,
            has_attachment=has_attachment,
        )

        attachments = []

        # Embed the logo directly in the email (Content-ID) rather than linking
        # to a URL — displays correctly regardless of hosting status, and the
        # HTML template already references it as cid:tbe_logo, unchanged.
        logo_path = BASE_DIR / 'static' / 'images' / 'logo.png'
        if logo_path.exists():
            with open(logo_path, 'rb') as logo_file:
                attachments.append({
                    "filename": "logo.png",
                    "content": base64.b64encode(logo_file.read()).decode('ascii'),
                    "content_id": "tbe_logo",
                })

        # Attach the blueprint directly to the email — read into memory,
        # never written to disk, so nothing depends on the server's filesystem.
        if has_attachment:
            file_bytes = file.read()
            attachments.append({
                "filename": file.filename,
                "content": base64.b64encode(file_bytes).decode('ascii'),
            })

        payload = {
            "from": RESEND_FROM,
            "to": [CEO_EMAIL],
            "subject": f"New Quote Request — {name or 'Unknown'}",
            "text": body,       # plain-text fallback for clients that don't render HTML
            "html": html_body,  # branded version most clients will actually display
        }
        if email:
            payload["reply_to"] = email
        if attachments:
            payload["attachments"] = attachments

        send_via_resend(payload)

        # Only report success when the email genuinely sent — the frontend
        # relies on this to decide which banner to show.
        return jsonify({
            "status": "success",
            "message": "Your quote request was sent successfully."
        })

    except Exception as e:
        # Don't pretend this succeeded. Log the real error server-side,
        # send back a distinct failure status so the UI can show it honestly.
        print(f"Email send failed: {e}")
        return jsonify({
            "status": "error",
            "message": "We couldn't send your request right now. Please try again, or email us directly if your file is bigger than 50MB."
        }), 502

if __name__ == '__main__':
    app.run(debug=True)
