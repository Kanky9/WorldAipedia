
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
        <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
        <div className="mt-2 space-x-4">
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="text-primary hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
