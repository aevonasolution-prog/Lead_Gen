// ==============================================================================
// CORE TYPE DEFINITIONS - LEAD GENERATION PLATFORM
// ==============================================================================

/**
 * Valid lead statuses for the pipeline lifecycle
 */
export type LeadStatus = 'new' | 'in_review' | 'contacted' | 'qualified' | 'closed';

/**
 * Service options available for selection in the lead form
 */
export type ServiceCategory = 
  | 'consulting'
  | 'managed_services'
  | 'enterprise_solutions'
  | 'digital_transformation'
  | 'custom_development'
  | 'other';

/**
 * Raw Lead form input data collected on the frontend
 */
export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceRequired: ServiceCategory | '';
  message: string;
}

/**
 * Field-level validation errors
 */
export type FormValidationErrors = Partial<Record<keyof LeadFormData, string>>;

/**
 * Stored Lead entity returned by future backend / preview sample data
 */
export interface LeadRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceRequired: ServiceCategory;
  serviceName: string;
  message: string;
  status: LeadStatus;
  createdAt: string; // ISO 8601 string
  updatedAt: string;
  notes?: string;
}

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

/**
 * SEO metadata structure for pages
 */
export interface PageSeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Business contact and branding configuration
 */
export interface BusinessBrandConfig {
  companyName: string;
  tradingName: string;
  tagline: string;
  shortDescription: string;
  contactEmail: string;
  contactPhone: string;
  formattedPhone: string;
  displayAddress: string;
  businessHours: string;
  serviceAreas: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}
