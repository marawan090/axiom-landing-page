import dns from 'dns/promises';

// قائمة الدومينات المجانية الشائعة لمنع الحسابات الشخصية الوهمية
const BLOCKED_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'icloud.com', 'protonmail.com', 'mail.com', 'aol.com',
  'zoho.com', 'yandex.com', 'tempmail.com', '10minutemail.com'
]);

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

  const { full_name, email, delivery_email, academic_level, research_domain, research_problem, feedback_session } = req.body || {};

  if (!full_name || !email || !research_problem) {
    return res.status(422).json({ error: 'Missing required fields' });
  }

  // 1. فحص صيغة الإيميل (Regex Validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid institutional email syntax.' });
  }

  if (delivery_email && !emailRegex.test(delivery_email)) {
    return res.status(400).json({ error: 'Invalid delivery email syntax.' });
  }

  const domain = email.split('@')[1].toLowerCase().trim();
  const deliveryDomain = delivery_email ? delivery_email.split('@')[1].toLowerCase().trim() : '';

  // 2. التحقق من أنه إيميل مؤسسي/أكاديمي وليس إيميل تجاري مجاني للإيميل الأكاديمي
  if (BLOCKED_DOMAINS.has(domain)) {
    return res.status(400).json({ 
      error: 'Please provide a valid institutional, research lab, or academic email (e.g., .edu or university domain) instead of a generic email.' 
    });
  }

  // منع الإيميلات الوهمية والمؤقتة لإيميل الاستلام
  const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com', 'throwawaymail.com', 'trashmail.com'
  ]);
  if (deliveryDomain && DISPOSABLE_DOMAINS.has(deliveryDomain)) {
    return res.status(400).json({ error: 'Disposable email addresses are not permitted for delivery.' });
  }

  // 3. فحص هل الدومين حقيقي وله سيرفر إيميلات نشط (DNS MX Check)
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return res.status(400).json({ error: 'The email domain does not have valid mail server (MX) records.' });
    }
  } catch (dnsErr) {
    return res.status(400).json({ error: 'The provided email domain does not exist or cannot receive mail.' });
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
          <p><strong>Verified Institutional Email:</strong> ${email}</p>
          <p><strong>Primary Delivery Email:</strong> ${delivery_email || email}</p>
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