import React from 'react';
import { Home, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-top bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Shortlet</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium short-term rentals for the modern traveler. Experience luxury and comfort in every stay.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary">All Properties</Link>
              </li>
              <li>
                <Link to="/search?type=apartment" className="text-muted-foreground hover:text-primary">Apartments</Link>
              </li>
              <li>
                <Link to="/search?type=villa" className="text-muted-foreground hover:text-primary">Villas</Link>
              </li>
              <li>
                <Link to="/search?type=house" className="text-muted-foreground hover:text-primary">Houses</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 800 SHORTLET</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@shortlet.app</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-top pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Shortlet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
