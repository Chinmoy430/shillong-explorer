// ============================================================
// Email Service — Welcome Emails via EmailJS
// ============================================================
// EmailJS lets you send emails from browser JS without a backend server.
// The credentials come from .env so they're not hardcoded in source code.
// ============================================================

import emailjs from '@emailjs/browser';

const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS once when this module first loads
if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY);

/**
 * Sends a welcome email to a newly registered user.
 * Non-critical — errors are logged but don't block registration.
 */
export const sendWelcomeEmail = async (toEmail, firstName) => {
  if (!toEmail || !PUBLIC_KEY) return;

  const templateParams = {
    to_email:  toEmail,
    to_name:   firstName || 'Explorer',
    from_name: 'SAWAIOM TRAVELS AGENCY',
    reply_to:  'hello@shillongexplorer.com',
    message:   `Welcome to SAWAIOM TRAVELS AGENCY! Your account has been created. Browse our tours at https://sawaiomtravels.netlify.app/tours`,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Welcome email sent ✓');
  } catch (err) {
    // Non-critical — don't let email failure break registration
    console.error('EmailJS error:', err);
  }
};
