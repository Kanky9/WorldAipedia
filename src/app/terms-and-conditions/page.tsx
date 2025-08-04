
// src/app/terms-and-conditions/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions - WorldAIPedia',
  description: 'Terms and Conditions for WorldAIPedia, your guide to Artificial Intelligence.',
};

export default function TermsAndConditionsPage() {
  const lastUpdatedDate = "July 26, 2024"; // Update this date whenever the terms change
  const contactEmail = "lacelabswebs@gmail.com"; // Updated contact email

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-headline font-bold text-primary mb-6">Terms and Conditions for WorldAIPedia</h1>
      <p className="text-sm text-muted-foreground mb-6">Last Updated: {lastUpdatedDate}</p>

      <section className="space-y-4 mb-8">
        <p>Welcome to WorldAIPedia! We're excited to have you explore our blog dedicated to the fascinating world of Artificial Intelligence. Our site is currently in a beta phase, meaning we are continuously testing and improving features. By accessing and using WorldAIPedia ("Site", "we", "us", "our"), you agree to comply with and be bound by the following terms and conditions ("Terms").</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">1. General Use of the Site</h2>
        <p>WorldAIPedia provides informational content, articles, news, and insights about Artificial Intelligence. Most of our content is available free of charge.</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">2. Optional PRO Access</h2>
        <p>We offer an optional "PRO Access" tier, which can be acquired via a one-time payment for a set period (e.g., one month). This is not an automatically recurring subscription.</p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-foreground/80">
          <li>
            <strong>Benefits:</strong> PRO Access grants you extra benefits which may include, but are not limited to, the ability to comment on posts, access to exclusive content sections, and an ad-reduced or ad-free browsing experience. Specific benefits will be detailed on the purchase page.
          </li>
          <li>
            <strong>Payment:</strong> Payments for PRO Access are processed through third-party payment processors like PayPal. By making a purchase, you agree to the terms and conditions of the respective payment processor. We do not store your full payment card details.
          </li>
          <li>
            <strong>Access Period:</strong> Your PRO Access is valid for the period specified at the time of purchase (e.g., one month). It does not automatically renew. To continue your PRO access, a new payment is required at the end of the term.
          </li>
          <li>
            <strong>No Refunds:</strong> Payments for PRO Access are non-refundable. We do not provide refunds or credits for any partial access periods or unused benefits.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">3. Content and Use of AI</h2>
        <p>The content provided on WorldAIPedia is for general informational purposes only. Some content, including articles, summaries, or images, may be assisted by or generated using Artificial Intelligence tools. While we strive for accuracy and usefulness, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of any information, products, services, or related graphics contained on the Site for any purpose. Any reliance you place on such information is therefore strictly at your own risk.</p>
      </section>
      
      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">4. User Conduct</h2>
        <p>You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Site. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Site.</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">5. Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, WorldAIPedia shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Site; (b) any conduct or content of any third party on the Site; or (c) unauthorized access, use, or alteration of your transmissions or content. As the Site is in a beta phase, you acknowledge that it may contain bugs, errors, and other problems that could cause system or other failures and data loss.</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">6. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. If we make changes that are material, we will provide you with reasonable notice prior to the changes taking effect, such as by posting a notification on our Site or sending an email to the address associated with your account. Your continued use of the Site after such changes become effective constitutes your acceptance of the new Terms.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold text-primary/90 mb-3">7. Contact Us</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us at: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></p>
      </section>
    </div>
  );
}
