import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { SEOHead } from '../../components/seo/SEOHead';

export const TermsConditionsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms & Conditions | Website Usage & Advisory Engagement"
        description="Review the terms and conditions governing the use of this website, online enquiry submissions, and commercial engagement guidelines."
        path="/terms-and-conditions"
      />

      <section className="bg-slate-900 text-white py-14 sm:py-16 border-b border-slate-800">
        <div className="content-container">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm text-slate-300">
              Last Updated: November 3, 2026 • Document Version: 1.0 (Draft Template)
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="content-container max-w-4xl space-y-8">
          {/* Client Notice Callout */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-950 text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>NOTICE TO CLIENT & COMMERCIAL COUNSEL</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              These terms constitute a standardized master terms template. Commercial terms, jurisdiction selections, liability caps, and payment schedules marked with <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-xs text-amber-950">[BRACKETS]</code> must be formally validated and signed off prior to commercial deployment.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
              <p>
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("Client", "User", or "you") and <strong>{siteConfig.brand.companyName}</strong> ("Company", "we", "us", or "our"), concerning your access to and use of this website as well as any associated service enquiry channels.
              </p>
              <p>
                By accessing this website or submitting an enquiry, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, you are expressly prohibited from using the site.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Nature of Online Quotations & Enquiries</h2>
              <p>
                The submission of a web form, quotation request, or exploratory message through this website does not constitute a binding commercial contract. All initial quotes, estimates, and scoping documents provided are purely indicative until formalized in a mutually executed Statement of Work (SOW).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Indicative quotes remain valid for <span className="bg-amber-100 text-amber-900 px-1 rounded">[e.g. 30 CALENDAR DAYS]</span> unless otherwise agreed in writing.</li>
                <li>Final pricing is subject to technical discovery and mutually accepted deliverables.</li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the website, source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site are our proprietary property and are protected by copyright, trademark, and intellectual property laws.
              </p>
              <p>
                Client confidential materials submitted during scoping discussions remain the sole intellectual property of the respective client.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
              <p>
                In no event will <strong>{siteConfig.brand.companyName}</strong> or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of this website.
              </p>
              <p>
                Liability in respect of contracted professional advisory services shall be solely governed by the limitation clauses specified in the formal master services agreement signed between the parties: <span className="bg-amber-100 text-amber-900 px-1 rounded">[SPECIFIC LIABILITY CAP, e.g. 100% OF ENGAGEMENT FEES]</span>.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Governing Law & Jurisdiction</h2>
              <p>
                These terms shall be governed by and defined following the laws of <span className="bg-amber-100 text-amber-900 px-1 rounded">[ENGLAND AND WALES / SPECIFIED JURISDICTION]</span>. <strong>{siteConfig.brand.companyName}</strong> and yourself irrevocably consent that the courts of <span className="bg-amber-100 text-amber-900 px-1 rounded">[LONDON, ENGLAND]</span> shall have exclusive jurisdiction to resolve any dispute.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Inquiries</h2>
              <p>
                In order to resolve a complaint regarding the website or to receive further information regarding commercial terms of service, please contact us at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1 my-3">
                <p><strong>{siteConfig.brand.companyName}</strong></p>
                <p>{siteConfig.brand.displayAddress}</p>
                <p>Email: {siteConfig.brand.contactEmail}</p>
                <p>Phone: {siteConfig.brand.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
