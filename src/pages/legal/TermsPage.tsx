import LegalLayout from './LegalLayout';

const TermsPage = () => (
  <LegalLayout title="Terms of Service" updated="April 13, 2026">
    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using Cinema AI Studio ("the Service"), you agree to be bound by these Terms of Service.
      If you do not agree to these terms, do not use the Service.
    </p>

    <h2>2. Description of Service</h2>
    <p>
      Cinema AI Studio is an AI-powered video creation platform that enables users to generate cinematic
      content from text prompts using Google's Veo and Gemini APIs. The Service runs entirely in your
      browser and connects to third-party AI APIs using your own API keys.
    </p>

    <h2>3. Eligibility</h2>
    <p>
      You must be at least 13 years old to use the Service. If you are under 18, you must have parental
      or guardian consent. By using the Service, you represent that you meet these requirements.
    </p>

    <h2>4. User Accounts</h2>
    <p>
      You are responsible for maintaining the confidentiality of your account credentials. You agree to
      notify us immediately of any unauthorized use of your account. We are not liable for losses arising
      from unauthorized access to your account.
    </p>

    <h2>5. API Keys & Third-Party Services</h2>
    <p>
      The Service requires you to provide your own API keys for Google AI services. You are solely
      responsible for your API key usage, associated costs, and compliance with Google's terms of service.
      Your API keys are stored locally on your device and are never transmitted to our servers.
    </p>

    <h2>6. Content Ownership</h2>
    <p>
      You retain ownership of the text prompts, scripts, and creative inputs you provide. AI-generated
      video and audio content is subject to the terms of the underlying AI providers (Google). You are
      responsible for ensuring your use of generated content complies with applicable laws and third-party
      terms of service.
    </p>

    <h2>7. Prohibited Uses</h2>
    <p>You agree not to use the Service to:</p>
    <ul>
      <li>Generate content that is illegal, harmful, threatening, abusive, or hateful</li>
      <li>Create deepfakes or misleading content intended to deceive</li>
      <li>Infringe on intellectual property rights of others</li>
      <li>Generate content depicting minors in inappropriate contexts</li>
      <li>Attempt to circumvent safety filters or content policies</li>
      <li>Use the Service for any purpose that violates applicable law</li>
    </ul>
    <p>See our <a href="#/acceptable-use">Acceptable Use Policy</a> for full details.</p>

    <h2>8. Service Availability</h2>
    <p>
      The Service is provided "as is" without guarantees of uptime or availability. We may modify,
      suspend, or discontinue the Service at any time without notice. AI-generated content may vary
      in quality and is not guaranteed to meet specific expectations.
    </p>

    <h2>9. Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, Cinema AI Studio and its operators shall not be liable
      for any indirect, incidental, special, consequential, or punitive damages, including loss of
      profits, data, or goodwill, arising from your use of the Service. Our total liability shall not
      exceed the amount you paid for the Service in the 12 months preceding the claim.
    </p>

    <h2>10. Indemnification</h2>
    <p>
      You agree to indemnify and hold harmless Cinema AI Studio from any claims, damages, or expenses
      arising from your use of the Service, your content, or your violation of these Terms.
    </p>

    <h2>11. Privacy</h2>
    <p>
      Your use of the Service is also governed by our <a href="#/privacy">Privacy Policy</a>, which
      describes how we collect, use, and protect your information.
    </p>

    <h2>12. Modifications to Terms</h2>
    <p>
      We may update these Terms from time to time. We will notify users of material changes via email
      or in-app notification. Continued use of the Service after changes constitutes acceptance of the
      updated Terms.
    </p>

    <h2>13. Governing Law</h2>
    <p>
      These Terms shall be governed by and construed in accordance with applicable law, without regard
      to conflict of law principles. Any disputes arising from these Terms shall be resolved through
      binding arbitration.
    </p>

    <h2>14. Contact</h2>
    <p>
      For questions about these Terms, please contact us at{' '}
      <a href="mailto:legal@cinema-ai.studio">legal@cinema-ai.studio</a>.
    </p>
  </LegalLayout>
);

export default TermsPage;
