import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { SEOHead } from '../../components/seo/SEOHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Data Protection & Privacy Notice"
        description="Review our comprehensive privacy policy governing data protection, information processing, cookies, and regulatory compliance."
        path="/privacy-policy"
      />

      <section className="bg-slate-900 text-white py-14 sm:py-16 border-b border-slate-800">
        <div className="content-container">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Privacy Policy
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
              <span>NOTICE TO CLIENT & LEGAL ADVISORS</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              This document is a standardized corporate privacy template provided for frontend development review. Specific clauses marked with <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-xs text-amber-950">[BRACKETS]</code> must be formally vetted and approved by your legal counsel before production deployment.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction & Overview</h2>
              <p>
                <strong>{siteConfig.brand.companyName}</strong> (referred to in this policy as "we", "us", or "our") is dedicated to safeguarding the privacy and confidential information of individuals and business representatives who access our website and utilize our commercial services.
              </p>
              <p>
                This Privacy Policy outlines how we collect, store, process, and protect your personal data in accordance with applicable data protection regulations, including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and EU GDPR standards where applicable.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data Controller Information</h2>
              <p>
                For the purposes of data protection legislation, the designated data controller is:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1 my-3">
                <p><strong>Entity Name:</strong> {siteConfig.brand.companyName}</p>
                <p><strong>Registration Number:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded">[CLIENT COMPANY NUMBER REQUIRED]</span></p>
                <p><strong>Registered Address:</strong> {siteConfig.brand.displayAddress}</p>
                <p><strong>Data Protection Officer:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded">[DPO NAME / EMAIL REQUIRED]</span></p>
                <p><strong>General Inquiries:</strong> {siteConfig.brand.contactEmail}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Categories of Data We Collect</h2>
              <p>We may collect and process the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Identity Data:</strong> Full name, professional title, and organization affiliation.</li>
                <li><strong>Contact Data:</strong> Corporate email address, telephone numbers, and geographic location/postcode.</li>
                <li><strong>Enquiry & Project Data:</strong> Service preferences, scope notes, timelines, and communications exchanged via web forms.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, operating system, and platform access timestamps.</li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. How We Use Your Personal Data</h2>
              <p>We only use your data when the law allows us to. Most commonly, we process data under:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Legitimate Interests:</strong> To evaluate enquiry requests, prepare requested commercial quotations, and communicate feasibility scopes.</li>
                <li><strong>Contract Performance:</strong> Where processing is necessary for taking steps prior to entering into a formal services contract.</li>
                <li><strong>Legal Obligation:</strong> Where we must comply with statutory financial or regulatory reporting requirements.</li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or trade your personal data to third-party marketing organizations.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Retention & Security</h2>
              <p>
                We maintain appropriate administrative, technical, and physical safeguards designed to protect personal data against accidental loss, unauthorized access, alteration, or disclosure.
              </p>
              <p>
                Lead enquiries and quote submissions are retained for a period of <span className="bg-amber-100 text-amber-900 px-1 rounded">[e.g. 24 MONTHS]</span> from the date of the last active communication, after which they are securely purged or anonymized.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Your Statutory Rights</h2>
              <p>
                Under applicable data protection legislation, you possess distinct rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Right of Access:</strong> You may request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You may request correction of inaccurate or incomplete records.</li>
                <li><strong>Right to Erasure:</strong> You may request deletion of data where no compelling commercial or legal reason exists for its continued processing.</li>
                <li><strong>Right to Restriction or Objection:</strong> You may object to processing based upon legitimate interests.</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, please contact our compliance desk at{' '}
                <a href={`mailto:${siteConfig.brand.contactEmail}`} className="text-brand-600 underline">
                  {siteConfig.brand.contactEmail}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
