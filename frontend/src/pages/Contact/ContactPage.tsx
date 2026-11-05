import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { LeadForm } from '../../components/forms/LeadForm';
import { SEOHead } from '../../components/seo/SEOHead';
import { ServiceCategory } from '../../types';

export const ContactPage: React.FC = () => {
  const location = useLocation();

  // Extract ?service= query param if present
  const initialService = useMemo<ServiceCategory>(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service') as ServiceCategory | null;
    const validServices: ServiceCategory[] = [
      'consulting',
      'managed_services',
      'enterprise_solutions',
      'digital_transformation',
      'custom_development',
      'other',
    ];
    if (serviceParam && validServices.includes(serviceParam)) {
      return serviceParam;
    }
    return '' as ServiceCategory;
  }, [location.search]);

  return (
    <>
      <SEOHead
        title="Contact Us & Request a Quote | Direct Advisory Team"
        description={`Get in touch with ${siteConfig.brand.tradingName}. Request a free, no-obligation quotation, submit project specifications, or contact our London headquarters directly.`}
        path="/contact"
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="content-container">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Contact Our Advisory Team
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Have a project in mind, an RFP to submit, or need immediate operational guidance? Reach out through our secure form below or via our direct communication channels.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Info & Operational Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Direct Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  We are here to assist your enterprise
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our senior advisory consultants review every submission personally to ensure appropriate technical and commercial resource allocation.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Telephone */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Telephone
                    </h3>
                    <a
                      href={`tel:${siteConfig.brand.formattedPhone}`}
                      className="text-base font-semibold text-slate-900 hover:text-brand-600 transition-colors block mt-0.5"
                    >
                      {siteConfig.brand.contactPhone}
                    </a>
                    <span className="text-xs text-slate-500">
                      Standard business hours support
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Official Enquiries
                    </h3>
                    <a
                      href={`mailto:${siteConfig.brand.contactEmail}`}
                      className="text-base font-semibold text-slate-900 hover:text-brand-600 transition-colors block mt-0.5 break-all"
                    >
                      {siteConfig.brand.contactEmail}
                    </a>
                    <span className="text-xs text-slate-500">
                      Guaranteed response within 24 hours
                    </span>
                  </div>
                </div>

                {/* Registered Address */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Registered Corporate Address
                    </h3>
                    <address className="not-italic text-sm font-medium text-slate-800 mt-0.5 leading-relaxed">
                      {siteConfig.brand.displayAddress}
                    </address>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Business Hours
                    </h3>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">
                      {siteConfig.brand.businessHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens Next Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-brand-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-wider">
                    Our Service Guarantee
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">What Happens After You Submit?</h3>
                <ol className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-brand-400">1.</span>
                    <span>Your enquiry is routed to the corresponding specialist lead.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-brand-400">2.</span>
                    <span>An initial feasibility review is conducted within 24 business hours.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-brand-400">3.</span>
                    <span>We schedule an introductory discovery call or deliver a preliminary quote.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right: Lead Generation Form (Anchor: #quote) */}
            <div className="lg:col-span-7" id="quote">
              <LeadForm
                initialService={initialService}
                title="Request a Detailed Project Quote"
                subtitle="Provide your project information below. All enquiries are covered by commercial non-disclosure."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
