import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-medium tracking-tight">
              StyleSync
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              Your AI-powered fashion companion. Organize, style, and shop smarter.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/wardrobe" className="hover:text-foreground transition-colors">Wardrobe</Link></li>
              <li><Link to="/outfits" className="hover:text-foreground transition-colors">Outfits</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StyleSync. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
