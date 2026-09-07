from http.server import BaseHTTPRequestHandler
import json
import os
import httpx


class handler(BaseHTTPRequestHandler):
    """
    Vercel Serverless Function Handler for Axiom Research AI Closed Beta Waitlist.
    Dispatches notifications via Resend API directly without external database dependencies.
    """

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_POST(self):
        """Process waitlist application and dispatch alert to ADMIN_EMAIL via Resend."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length <= 0:
                self._send_json(400, {"status": "error", "message": "Empty request body."})
                return

            raw_body = self.rfile.read(content_length)
            data = json.loads(raw_body.decode("utf-8"))
        except Exception as exc:
            self._send_json(400, {"status": "error", "message": f"Malformed JSON: {str(exc)}"})
            return

        full_name = str(data.get("full_name", "")).strip()
        email = str(data.get("email", "")).strip()
        academic_level = str(data.get("academic_level", "")).strip()
        research_domain = str(data.get("research_domain", "")).strip()
        research_problem = str(data.get("research_problem", "")).strip()
        feedback_session = bool(data.get("feedback_session", False))

        if not full_name or not email or not research_problem:
            self._send_json(422, {
                "status": "error",
                "message": "Missing required fields: full_name, email, and research_problem are required."
            })
            return

        resend_api_key = os.environ.get("RESEND_API_KEY", "").strip()
        admin_email = os.environ.get("ADMIN_EMAIL", "").strip()

        # If Resend credentials are set, dispatch email notification
        if resend_api_key and admin_email:
            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
            }
            email_payload = {
                "from": "Axiom Waitlist <onboarding@resend.dev>",
                "to": [admin_email],
                "subject": f"New Beta Application: {full_name} ({academic_level or 'Researcher'})",
                "html": (
                    f"<h3>New Axiom Closed Beta Application</h3>"
                    f"<p><strong>Name:</strong> {full_name}</p>"
                    f"<p><strong>Email:</strong> {email}</p>"
                    f"<p><strong>Level:</strong> {academic_level}</p>"
                    f"<p><strong>Domain:</strong> {research_domain}</p>"
                    f"<p><strong>Thesis Problem:</strong> {research_problem}</p>"
                    f"<p><strong>Willing to do Feedback Session:</strong> {'Yes' if feedback_session else 'No'}</p>"
                ),
            }

            try:
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(
                        "https://api.resend.com/emails",
                        headers=headers,
                        json=email_payload
                    )
                    if resp.status_code >= 400:
                        self._send_json(502, {
                            "status": "error",
                            "message": f"Resend notification error: {resp.text}"
                        })
                        return
            except httpx.RequestError as exc:
                self._send_json(503, {
                    "status": "error",
                    "message": f"Network error connecting to Resend: {str(exc)}"
                })
                return

        # Return clean HTTP 200 response
        self._send_json(200, {
            "status": "success",
            "message": "Application submitted for review."
        })

    def _send_json(self, status_code: int, data: dict):
        """Helper to send JSON response with CORS headers."""
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
