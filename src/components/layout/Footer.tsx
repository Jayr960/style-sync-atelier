import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            StyleSync
          </Link>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <Link to="/wardrobe" className="hover:text-foreground transition-colors">Wardrobe</Link>
            <Link to="/outfits" className="hover:text-foreground transition-colors">Outfits</Link>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StyleSync
          </p>
        </div>
      </div>
    </footer>
  );
}
