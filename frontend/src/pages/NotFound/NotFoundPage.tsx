import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Page Not Found (404)"
        description="The page you requested could not be located."
        noIndex={true}
      />
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-brand-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest">
              Error 404
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The page you are looking for does not exist or has been relocated.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/" className="btn-primary text-sm py-2.5 px-5">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Return to Home</span>
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary text-sm py-2.5 px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
