import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { IconResolver } from '../../components/common/IconResolver';
import { LeadForm } from '../../components/forms/LeadForm';
import { SEOHead } from '../../components/seo/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Modern Business Solutions & Professional Advisory"
        description="Connect with trusted specialists for strategic consulting, managed operational services, and enterprise solutions. Get your free, confidential quote today."
        path="/"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38a5f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="content-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial Advisory & Operational Services</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Reliable Solutions For <span className="text-brand-400">Growing Enterprises</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                We deliver evidence-based consulting, managed operations, and tailored technical frameworks designed to streamline operations and produce measurable business results.
              </p>

              {/* Value Highlights Pill Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Transparent Scopes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Clearly Defined SLAs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Dedicated Account Lead
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#lead-capture"
                  className="w-full sm:w-auto btn-primary bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3.5 text-base shadow-lg shadow-brand-500/20"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-lg px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors text-base"
                >
                  <PhoneCall className="w-4 h-4 mr-2 text-brand-400" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Hero Right Quick Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-6">
                <div className="border-b border-slate-700/80 pb-4">
                  <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
                    Client Value Overview
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Structured Engagement Framework
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Predictable delivery milestones from initial discovery to ongoing support.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Discovery & Scoping</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Free initial consultation to evaluate requirements and timeline constraints.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Transparent Proposal</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Itemized deliverables, fixed pricing options, and clear performance targets.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Execution & Reporting</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Periodic status check-ins and direct escalation to your dedicated account manager.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#lead-capture"
                    className="block text-center text-xs font-semibold text-brand-400 hover:text-brand-300 py-2 border border-brand-500/30 rounded-lg hover:bg-brand-500/10 transition-colors"
                  >
                    Start an Enquiry Today →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Introduction Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
              About Our Approach
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              A Modern Partner Built for Measurable Impact
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              At <strong className="text-slate-800">{siteConfig.brand.tradingName}</strong>, we bridge the gap between high-level operational planning and reliable technical execution. Our structured methodology provides clarity, reduces operational risks, and delivers commercial value.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-surface p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Commercial Rigor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every project begins with understanding your commercial targets, ensuring resources are directed toward high-return initiatives.
              </p>
            </div>

            <div className="card-surface p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Governance & Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We embed data protection, risk mitigation, and compliance checkpoints into every workflow to safeguard your reputation.
              </p>
            </div>

            <div className="card-surface p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Predictable Execution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Reliable timelines, structured milestones, and proactive communications mean no surprises for your executive stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="content-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
                What We Offer
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
                Comprehensive Professional Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2">
                Explore our core capabilities engineered to support mid-market and enterprise organizations.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 font-semibold text-sm text-brand-600 hover:text-brand-700"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <IconResolver name={service.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs font-medium text-brand-600 mt-1">{service.tagline}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services#${service.id}`}
                    className="text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    Learn More
                  </Link>
                  <Link
                    to={`/contact?service=${service.id}#quote`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Enquire Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Why Organizations Choose {siteConfig.brand.tradingName}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              We focus on consistency, transparent accountability, and measurable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.whyChooseUs.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <IconResolver name={item.iconName} className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Generation Section (Main Conversion Anchor) */}
      <section
        id="lead-capture"
        className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-slate-100/80 scroll-mt-16"
      >
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Context Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                <TrendingUp className="w-3.5 h-3.5" />
                Ready to Discuss Your Project?
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Request a Confidential Consultation & Free Quote
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Submit your project specifications or exploratory questions. A dedicated senior advisor will evaluate your request and provide a detailed feasibility proposal without obligation.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Zero Commercial Obligation
                    </h4>
                    <p className="text-xs text-slate-500">
                      Discovery calls and quotations are completely complimentary.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Non-Disclosure Protection
                    </h4>
                    <p className="text-xs text-slate-500">
                      All scope notes and organizational details are strictly confidential.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      One Business Day Response
                    </h4>
                    <p className="text-xs text-slate-500">
                      Prompt review and assignment to an appropriate specialist.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Form */}
            <div className="lg:col-span-7">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
