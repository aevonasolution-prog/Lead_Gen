import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-shadow duration-200">
      {/* Top micro-bar for quick contact info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <a
              href={`tel:${siteConfig.brand.formattedPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>{siteConfig.brand.contactPhone}</span>
            </a>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-block text-slate-300">
              {siteConfig.brand.businessHours}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-brand-300 transition-colors"
              title="Admin Lead Management Dashboard (Preview)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Admin Preview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <nav
        className={`bg-white transition-all duration-200 ${
          isScrolled ? 'shadow-md py-3' : 'border-b border-slate-200 py-4'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand Name placeholder */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-brand-700 transition-colors">
              YB
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 leading-tight tracking-tight">
                {siteConfig.brand.tradingName}
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Professional Services
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50/80 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/contact#quote"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-150"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200">
              <Link
                to="/contact#quote"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 text-white font-medium shadow-sm"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
