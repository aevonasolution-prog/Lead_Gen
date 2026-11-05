import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900" aria-label="Footer">
      {/* Top Banner Notice inside footer regarding development phase */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-3 px-4 text-xs text-center text-slate-400">
        <span className="font-semibold text-slate-300">Phase 1 Development Prototype:</span>{' '}
        All branding, company credentials, and contact details shown are placeholders awaiting finalized client assets.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                YB
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white leading-tight tracking-tight">
                  {siteConfig.brand.tradingName}
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                  Professional Services
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.brand.shortDescription}
            </p>
            <div className="pt-2">
              <Link
                to="/contact#quote"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300 uppercase tracking-wider"
              >
                <span>Request an Enquiry Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services list */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.id}`}
                    className="hover:text-white transition-colors line-clamp-1"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{siteConfig.brand.displayAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.brand.formattedPhone}`}
                  className="hover:text-white transition-colors text-xs"
                >
                  {siteConfig.brand.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.brand.contactEmail}`}
                  className="hover:text-white transition-colors text-xs break-all"
                >
                  {siteConfig.brand.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="text-xs">{siteConfig.brand.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} {siteConfig.brand.companyName}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">v1.0.0 (Frontend Prototype)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
