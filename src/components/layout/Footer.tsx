const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} WorldAIpedia. All rights reserved.</p>
        <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
      </div>
    </footer>
  );
};

export default Footer;
