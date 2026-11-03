import React, { useState } from 'react';
import {
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { FormValidationErrors, LeadFormData, ServiceCategory } from '../../types';
import { validateLeadForm } from '../../utils/validation';
import { leadService, SubmitLeadResult } from '../../services/leadService';

interface LeadFormProps {
  initialService?: ServiceCategory | '';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialService = '',
  title = 'Request a Free, No-Obligation Quote',
  subtitle = 'Complete the form below and our professional advisory team will review your requirements and respond within one business day.',
  className = '',
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    serviceRequired: initialService as ServiceCategory | '',
    message: '',
  });

  // Sync initialService when navigated from different service CTA buttons
  React.useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        serviceRequired: initialService as ServiceCategory | '',
      }));
    }
  }, [initialService]);

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmitLeadResult | null>(null);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);

  // Field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // If field was already touched, re-validate that field
    if (touched[name as keyof LeadFormData]) {
      const validation = validateLeadForm(updatedData);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name as keyof LeadFormData],
      }));
    }
  };

  // Field blur handler
  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateLeadForm(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field],
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<keyof LeadFormData, boolean> = {
      fullName: true,
      email: true,
      phone: true,
      location: true,
      serviceRequired: true,
      message: true,
    };
    setTouched(allTouched);

    // Full validation
    const validation = validateLeadForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Call API integration service
    const result = await leadService.submitLead(formData);

    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      serviceRequired: initialService as ServiceCategory | '',
      message: '',
    });
    setErrors({});
    setTouched({});
    setSubmissionResult(null);
  };

  return (
    <div
      id="lead-form-container"
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 sm:p-8 lg:p-10 ${className}`}
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-3">
          <Info className="w-3.5 h-3.5" />
          Quick Response Guaranteed
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Backend Integration Notification Banner if submission resulted in backend unavailable */}
      {submissionResult && submissionResult.isBackendUnavailable && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm space-y-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">
                Backend API Offline (Phase 1 Frontend Development)
              </p>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Frontend validation passed successfully, but the backend server at{' '}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-mono text-xs">
                  {siteConfig.api.baseUrl}
                </code>{' '}
                is currently offline. As required, <strong>no lead was permanently stored</strong>, and no fake success was declared.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowPayloadInspector(!showPayloadInspector)}
              className="inline-flex items-center gap-1 font-medium text-amber-900 hover:text-amber-950 underline"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showPayloadInspector ? 'Hide' : 'Inspect'} Validated API Payload</span>
              {showPayloadInspector ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="text-amber-700">Ready for POST /api/leads integration</span>
          </div>

          {showPayloadInspector && (
            <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* Success View if backend returns positive response */}
      {submissionResult && submissionResult.success && (
        <div
          role="status"
          className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-4"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-emerald-950">
              Enquiry Received Successfully
            </h3>
            <p className="text-sm text-emerald-800">
              {submissionResult.message || 'Thank you. Our advisory team will be in touch shortly.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-sm"
          >
            Submit Another Enquiry
          </button>
        </div>
      )}

      {/* Main Form Fields */}
      {(!submissionResult || !submissionResult.success) && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Eleanor Vance"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.fullName && touched.fullName
                    ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                }`}
              />
              {errors.fullName && touched.fullName && (
                <p id="fullName-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. name@company.com"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.email && touched.email
                    ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                }`}
              />
              {errors.email && touched.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Telephone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="e.g. +44 20 7946 0192"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.phone && touched.phone
                    ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                }`}
              />
              {errors.phone && touched.phone && (
                <p id="phone-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Location / Postcode */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Location / Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={() => handleBlur('location')}
                placeholder="e.g. London, EC1A or Manchester"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? 'location-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.location && touched.location
                    ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                }`}
              />
              {errors.location && touched.location && (
                <p id="location-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Service Required */}
          <div>
            <label
              htmlFor="serviceRequired"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Type of Service Required <span className="text-red-500">*</span>
            </label>
            <select
              id="serviceRequired"
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={handleChange}
              onBlur={() => handleBlur('serviceRequired')}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.serviceRequired}
              aria-describedby={errors.serviceRequired ? 'serviceRequired-error' : undefined}
              className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                errors.serviceRequired && touched.serviceRequired
                  ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
              }`}
            >
              <option value="">-- Please select an area of interest --</option>
              {siteConfig.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.serviceRequired && touched.serviceRequired && (
              <p
                id="serviceRequired-error"
                className="mt-1 text-xs text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.serviceRequired}</span>
              </p>
            )}
          </div>

          {/* Additional Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Additional Project Details / Scope Notes{' '}
              <span className="text-xs text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur('message')}
              placeholder="Outline your timeline, estimated scope, or specific challenges..."
              disabled={isSubmitting}
              maxLength={2000}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
            />
            {errors.message && touched.message && (
              <p id="message-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 text-right">
              {formData.message.length} / 2,000 characters
            </p>
          </div>

          {/* Privacy statement notice */}
          <p className="text-xs text-slate-500 leading-normal">
            By submitting this enquiry, you agree to our{' '}
            <a href="/privacy-policy" className="text-brand-600 underline hover:text-brand-800">
              Privacy Policy
            </a>
            . We treat your corporate information with strict confidentiality.
          </p>

          {/* Submit Action Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 group transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Validating & Connecting...</span>
                </>
              ) : (
                <>
                  <span>Submit Free Quote Request</span>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
