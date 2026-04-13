import LegalLayout from './LegalLayout';

const AcceptableUsePage = () => (
  <LegalLayout title="Acceptable Use Policy" updated="April 13, 2026">
    <h2>1. Purpose</h2>
    <p>
      This Acceptable Use Policy ("AUP") defines the rules and guidelines for using Cinema AI Studio.
      All users must comply with this policy in addition to our <a href="#/terms">Terms of Service</a>.
    </p>

    <h2>2. Prohibited Content</h2>
    <p>You may not use the Service to generate, distribute, or promote content that:</p>
    <ul>
      <li>Depicts or promotes violence, gore, or torture</li>
      <li>Contains or sexualizes minors in any way (CSAM)</li>
      <li>Promotes hate speech, discrimination, or harassment based on race, ethnicity, gender, religion, sexual orientation, disability, or other protected characteristics</li>
      <li>Is defamatory, libelous, or intended to harm the reputation of individuals</li>
      <li>Contains non-consensual intimate imagery or deepfakes of real individuals</li>
      <li>Promotes terrorism, extremism, or radicalization</li>
      <li>Facilitates fraud, scams, or deceptive practices</li>
      <li>Infringes on copyrights, trademarks, or other intellectual property rights</li>
    </ul>

    <h2>3. Prohibited Activities</h2>
    <p>You may not:</p>
    <ul>
      <li>Attempt to bypass, disable, or circumvent content safety filters</li>
      <li>Use automated tools to mass-generate content in violation of this policy</li>
      <li>Share or distribute API keys or account credentials</li>
      <li>Reverse engineer, decompile, or extract source code from the Service</li>
      <li>Use the Service to compete with or replicate the Service</li>
      <li>Impersonate other users, companies, or public figures</li>
      <li>Use the Service to generate spam or unsolicited communications</li>
    </ul>

    <h2>4. AI-Generated Content Disclosure</h2>
    <p>
      When sharing AI-generated content publicly, we strongly encourage you to disclose that the
      content was created using AI. Misrepresenting AI-generated content as real footage may violate
      applicable laws and platform policies.
    </p>

    <h2>5. Fair Use</h2>
    <p>
      To ensure fair access for all users, the following limits apply:
    </p>
    <ul>
      <li>Free tier: limited to demo scenes for evaluation purposes</li>
      <li>Paid plans: subject to the generation limits of your subscription tier</li>
      <li>Excessive automated usage may be throttled or suspended</li>
    </ul>
    <p>
      <strong>Important:</strong> Your subscription pays for access to the Cinema AI Studio platform
      and tools. Costs for AI generation (Google Veo, Gemini, etc.) are billed separately by Google
      based on your own API key usage.
    </p>

    <h2>6. Reporting Violations</h2>
    <p>
      If you encounter content or behavior that violates this policy, please report it to{' '}
      <a href="mailto:abuse@cinema-ai.studio">abuse@cinema-ai.studio</a>. Include as much detail
      as possible, including URLs, screenshots, and a description of the violation.
    </p>

    <h2>7. Enforcement</h2>
    <p>
      Violations of this policy may result in:
    </p>
    <ul>
      <li>Warning and content removal</li>
      <li>Temporary account suspension</li>
      <li>Permanent account termination</li>
      <li>Reporting to law enforcement when required by law</li>
    </ul>
    <p>
      We reserve the right to determine, at our sole discretion, whether content or behavior violates
      this policy. Decisions may be appealed by contacting{' '}
      <a href="mailto:appeals@cinema-ai.studio">appeals@cinema-ai.studio</a>.
    </p>

    <h2>8. Changes to This Policy</h2>
    <p>
      We may update this AUP as needed. Material changes will be communicated via email or in-app
      notification. Continued use of the Service after changes constitutes acceptance.
    </p>
  </LegalLayout>
);

export default AcceptableUsePage;
