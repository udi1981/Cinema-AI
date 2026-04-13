import LegalLayout from './LegalLayout';

const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy" updated="April 13, 2026">
    <h2>1. Introduction</h2>
    <p>
      Cinema AI Studio ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy
      explains how we collect, use, store, and share information when you use our AI video creation
      platform.
    </p>

    <h2>2. Information We Collect</h2>

    <h3>2.1 Account Information</h3>
    <p>When you create an account, we collect:</p>
    <ul>
      <li>Email address</li>
      <li>Display name</li>
      <li>Profile picture (if signing in with Google)</li>
      <li>Authentication tokens (managed by Supabase)</li>
    </ul>

    <h3>2.2 Usage Data</h3>
    <p>We may collect information about how you use the Service:</p>
    <ul>
      <li>Number of scenes generated</li>
      <li>Subscription plan and billing history</li>
      <li>Feature usage patterns (anonymized)</li>
    </ul>

    <h3>2.3 Data Stored Locally</h3>
    <p>
      The following data is stored only on your device (localStorage / IndexedDB) and is <strong>never
      sent to our servers</strong>:
    </p>
    <ul>
      <li>API keys (Google Gemini)</li>
      <li>Generated video and audio files</li>
      <li>Movie scripts and prompts</li>
      <li>Reference images</li>
      <li>Application preferences and settings</li>
    </ul>

    <h2>3. How We Use Your Information</h2>
    <p>We use collected information to:</p>
    <ul>
      <li>Provide and maintain your account</li>
      <li>Process subscription billing</li>
      <li>Send important service notifications</li>
      <li>Improve the Service based on anonymized usage patterns</li>
      <li>Comply with legal obligations</li>
    </ul>

    <h2>4. Third-Party Services</h2>
    <p>The Service integrates with the following third-party services:</p>
    <ul>
      <li><strong>Supabase</strong> — Authentication and user profile storage</li>
      <li><strong>Google OAuth</strong> — Social sign-in</li>
      <li><strong>Google AI APIs</strong> — Video and audio generation (using your own API keys, called directly from your browser)</li>
      <li><strong>Stripe</strong> — Payment processing (coming soon)</li>
      <li><strong>Cloudflare</strong> — Hosting and CDN</li>
    </ul>
    <p>
      Each third-party service has its own privacy policy. We encourage you to review them.
      Importantly, AI generation requests are sent directly from your browser to Google's APIs —
      they do not pass through our servers.
    </p>

    <h2>5. Data Retention</h2>
    <p>
      We retain your account information for as long as your account is active. If you delete your
      account, we will remove your personal data within 30 days. Anonymized usage data may be retained
      for analytics purposes. Locally stored data (videos, scripts, API keys) is under your control
      and can be cleared at any time via your browser.
    </p>

    <h2>6. Data Security</h2>
    <p>
      We implement industry-standard security measures to protect your information, including encrypted
      connections (TLS), secure authentication (Supabase Auth with RLS), and minimal data collection.
      However, no method of transmission or storage is 100% secure.
    </p>

    <h2>7. Your Rights</h2>
    <h3>GDPR (European Users)</h3>
    <p>If you are in the European Economic Area, you have the right to:</p>
    <ul>
      <li>Access your personal data</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Export your data (data portability)</li>
      <li>Object to processing</li>
      <li>Withdraw consent at any time</li>
    </ul>

    <h3>CCPA (California Users)</h3>
    <p>If you are a California resident, you have the right to:</p>
    <ul>
      <li>Know what personal information is collected</li>
      <li>Request deletion of your personal information</li>
      <li>Opt out of the sale of personal information (we do not sell your data)</li>
      <li>Non-discrimination for exercising your rights</li>
    </ul>

    <h2>8. Cookies</h2>
    <p>
      We use essential cookies only for authentication and session management. We do not use
      advertising cookies or third-party tracking cookies. You can manage cookies through your
      browser settings.
    </p>

    <h2>9. Children's Privacy</h2>
    <p>
      The Service is not directed at children under 13. We do not knowingly collect personal
      information from children under 13. If we learn that we have collected such information,
      we will delete it promptly.
    </p>

    <h2>10. Changes to This Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. We will notify you of material changes
      via email or in-app notification. The "Last updated" date at the top indicates when the policy
      was last revised.
    </p>

    <h2>11. Contact Us</h2>
    <p>
      For privacy-related questions or to exercise your rights, contact us at{' '}
      <a href="mailto:privacy@cinema-ai.studio">privacy@cinema-ai.studio</a>.
    </p>
  </LegalLayout>
);

export default PrivacyPage;
