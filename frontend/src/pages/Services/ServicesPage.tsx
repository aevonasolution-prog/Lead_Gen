import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { IconResolver } from '../../components/common/IconResolver';
import { SEOHead } from '../../components/seo/SEOHead';

export const ServicesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Services & Solutions | Strategic Advisory & Technical Execution"
        description="Browse our complete suite of business services including strategic consulting, managed operational services, enterprise architecture, and bespoke technical solutions."
        path="/services"
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="content-container">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Professional Capabilities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Our Professional Services
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              We provide tailored capabilities designed to solve operational challenges, enhance technical infrastructure, and establish predictable, scalable business processes.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Service Anchor Navigation */}
      <section className="bg-white border-b border-slate-200 py-3 sticky top-[73px] z-30 shadow-xs hidden md:block">
        <div className="content-container">
          <div className="flex items-center space-x-2 overflow-x-auto text-xs py-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider shrink-0 pr-2">
              Jump To:
            </span>
            {siteConfig.services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                {service.title.split(' ')[0]} {service.title.split(' ')[1] || ''}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services List Detail Cards */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="content-container space-y-12">
          {siteConfig.services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-10 scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Service Information */}
                  <div className={`lg:col-span-7 space-y-5 ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <IconResolver name={service.iconName} className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                          Capability 0{index + 1}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      {service.tagline}
                    </p>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features Grid */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Key Service Inclusions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enquire CTA */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/contact?service=${service.id}#quote`}
                        className="btn-primary text-sm py-2.5 px-5 shadow-xs"
                      >
                        <span>Enquire About {service.title.split(' ')[0]}</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                      <span className="text-xs text-slate-500">
                        Complimentary initial feasibility scoping
                      </span>
                    </div>
                  </div>

                  {/* Service Graphic / Meta Overview Block */}
                  <div className={`lg:col-span-5 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-mono uppercase text-brand-400">
                          Scope & Engagement
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          Standard SLA
                        </span>
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Delivery Model:</span>
                          <span className="font-medium text-white">Dedicated / Hybrid</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Governance:</span>
                          <span className="font-medium text-white">Weekly Cadence</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Deliverables:</span>
                          <span className="font-medium text-white">Full SOW & Sign-off</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Initial Response:</span>
                          <span className="font-medium text-white">≤ 24 Hours</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800">
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                          "Each engagement includes a dedicated lead specialist and milestone sign-offs to guarantee project accountability."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom Requirement Callout */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="content-container">
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                <HelpCircle className="w-3.5 h-3.5" />
                Unsure Which Service You Need?
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Schedule an Exploratory Scoping Call
              </h3>
              <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
                If your requirements span multiple domains or need custom tailoring, our advisory team is available to evaluate your scope and recommend a tailored statement of work.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to="/contact?service=other#quote"
                className="btn-secondary bg-white text-brand-900 hover:bg-slate-100 font-semibold text-center"
              >
                Request Custom Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
