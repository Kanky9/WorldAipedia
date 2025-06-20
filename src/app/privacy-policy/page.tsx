// src/app/privacy-policy/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - WorldAIPedia',
  description: 'Privacy Policy for WorldAIPedia, your guide to Artificial Intelligence.',
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "July 26, 2024"; // Update this date whenever the policy changes
  const contactEmail = "lacelabswebs@gmail.com"; // Updated contact email

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-headline font-bold text-primary mb-6">Privacy Policy for WorldAIPedia</h1>
      <p className="text-sm text-muted-foreground mb-6">Last Updated: {lastUpdatedDate}</p>

      <section className="space-y-4 mb-8">
        <p>Welcome to WorldAIPedia! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/80">
          <li>
            <strong>Personal Information:</strong>
            <ul className="list-disc list-inside space-y-1 pl-6">
              <li><strong>Email Address:</strong> When you subscribe to our newsletter, create an account, or opt for our PRO subscription (USD 1 per month).</li>
            </ul>
          </li>
          <li>
            <strong>Usage Data:</strong>
            <ul className="list-disc list-inside space-y-1 pl-6">
              <li><strong>IP Address:</strong> Collected automatically for security and analytical purposes.</li>
              <li><strong>Navigation Data:</strong> Information about how you use our website (pages visited, time spent, links clicked), collected via cookies and similar technologies (e.g., Google Analytics).</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/80">
          <li>Provide and manage our services, including your PRO subscription and newsletters.</li>
          <li>Analyze website usage (e.g., through Google Analytics) to improve our content and user experience.</li>
          <li>Communicate with you, respond to inquiries, and provide customer support.</li>
          <li>Process payments for PRO subscriptions through our third-party payment processor (Stripe). We do not store your full credit card details.</li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">3. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/80">
          <li><strong>Stripe:</strong> To process payments for our PRO subscription. Stripe has its own privacy policy regarding the information it collects.</li>
          <li><strong>Google Analytics:</strong> To collect and analyze website traffic and usage data. You can learn more about Google's practices at Google's Privacy & Terms page.</li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">4. Data Security and Sharing</h2>
        <p>We implement reasonable security measures to protect your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties for their marketing purposes. We may share information with trusted third parties who assist us in operating our website or servicing you (like Stripe), provided they agree to keep this information confidential.</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">5. Your Rights</h2>
        <p>You have the right to access, request correction of, or request deletion of your personal information. To exercise these rights, please contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>. We will respond to your request within a reasonable timeframe.</p>
      </section>
      
      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">6. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></p>
      </section>
    </div>
  );
}
