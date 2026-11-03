import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { SEOHead } from '../../components/seo/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About Us | Corporate Profile & Advisory Mission"
        description={`Learn more about ${siteConfig.brand.tradingName}, our structured engagement methodology, operating principles, and commitment to delivering reliable commercial solutions.`}
        path="/about"
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="content-container">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Company Overview
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              About {siteConfig.brand.tradingName}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Founded on the belief that commercial advisory should be practical, accountable, and clearly scoped, we provide comprehensive operational support to organizations navigating growth and operational transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview & Background */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
                Our Narrative
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Engineering Practical Pathways for Sustainable Growth
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p>
                  In a commercial landscape defined by rapid shifts in technology and regulation, organizations require partners who deliver execution clarity rather than abstract theories. <strong>{siteConfig.brand.companyName}</strong> was established to provide exactly that: dependable operational expertise, transparent project governance, and hands-on implementation support.
                </p>
                <p>
                  Whether conducting detailed operational audits, modernizing legacy digital workflows, or delivering ongoing managed services, our team applies structured standards to ensure every milestone aligns directly with client commercial objectives.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-sm">Pragmatic Execution</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Solutions tailored around your existing team capacity, budget parameters, and systems.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-sm">Accountable Partnership</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Clear SLAs, single points of contact, and measurable milestones at every phase.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Company Snapshot
                </h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">Trading Entity</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{siteConfig.brand.companyName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">Registered Headquarters</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{siteConfig.brand.displayAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">Operating Hours</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">{siteConfig.brand.businessHours}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">Coverage Scope</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">
                      {siteConfig.brand.serviceAreas.join(' • ')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Placeholders */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
              Strategic Direction
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Our Mission, Vision & Guiding Principles
            </h2>
            <p className="text-sm text-slate-600">
              Clear organizational intent anchored in professional integrity and delivery excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To empower commercial enterprises with dependable advisory frameworks, streamlined operational workflows, and scalable technical solutions that reduce complexity, protect profitability, and foster sustainable growth.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Prioritize actionable implementation over theoretical reports.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Provide transparent pricing structures with zero hidden contingencies.
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be recognized as a premier operational partner for organizations seeking disciplined execution, trusted governance, and enduring commercial resilience in a continuously changing business environment.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Continuous refinement of industry-aligned operational standards.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Long-term client relationships based on mutual trust and accountability.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Engagement Lifecycle */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-bold text-brand-600 tracking-wider">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How We Engage With Every Client
            </h2>
            <p className="text-sm text-slate-600">
              A structured four-phase workflow designed to provide transparency from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Phase 01
              </span>
              <h3 className="text-base font-bold text-slate-900">Discovery & Alignment</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We review your current challenges, operating constraints, timelines, and commercial parameters.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Phase 02
              </span>
              <h3 className="text-base font-bold text-slate-900">Scope Definition</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A formal Statement of Work is drafted, outlining deliverables, SLAs, and clear milestone dates.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Phase 03
              </span>
              <h3 className="text-base font-bold text-slate-900">Disciplined Delivery</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Execution commences with weekly status reviews, testing checkpoints, and direct communication channels.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Phase 04
              </span>
              <h3 className="text-base font-bold text-slate-900">Review & Ongoing Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Post-launch verification, formal stakeholder sign-off, and structured transition into ongoing SLA support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="content-container max-w-3xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Interested in exploring how we can support your business?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Contact our advisory team to arrange a confidential, no-obligation discovery discussion.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact#quote"
              className="btn-primary bg-brand-500 hover:bg-brand-600 text-white font-semibold"
            >
              <span>Request a Consultation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/services"
              className="btn-secondary bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Explore Our Capabilities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
