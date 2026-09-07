export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, email, academic_level, research_domain, research_problem, feedback_session } = req.body || {};

  if (!full_name || !email || !research_problem) {
    return res.status(422).json({ error: 'Missing required fields' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!resendApiKey || !adminEmail) {
    return res.status(500).json({ error: 'Server configuration error (missing env variables)' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Axiom Waitlist <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `New Beta Application: ${full_name} (${academic_level || 'Researcher'})`,
        html: `
          <h3>New Axiom Closed Beta Application</h3>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Level:</strong> ${academic_level || 'N/A'}</p>
          <p><strong>Domain:</strong> ${research_domain || 'N/A'}</p>
          <p><strong>Thesis Problem:</strong><br/>${research_problem}</p>
          <p><strong>10-Min 1-on-1 Call:</strong> ${feedback_session ? 'Yes (Confirmed)' : 'No (Survey only)'}</p>
        `
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'Failed to send alert via Resend', details: errText });
    }

    return res.status(200).json({ status: 'success', message: 'Application submitted for review.' });
  } catch (err) {
    return res.status(503).json({ error: 'Network error', message: err.message });
  }
}