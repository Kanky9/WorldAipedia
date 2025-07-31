
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      {/* <div id="ads-footer" className="text-center my-4 container mx-auto min-h-[100px] flex items-center justify-center">
        Placeholder para el anuncio del pie de página
      </div> */}
      <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
          <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
          <p className="mt-2 text-xs">Este sitio usa cookies. Al continuar navegando, aceptás su uso.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
            <Link href="/cookie-policy" className="text-primary hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
