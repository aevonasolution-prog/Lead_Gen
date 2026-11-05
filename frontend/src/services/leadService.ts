import { siteConfig } from '../config/siteConfig';
import { LeadFormData, LeadRecord, LeadStatus } from '../types';
import { apiRequest } from './apiClient';
import { SAMPLE_DEV_LEADS } from './mockData';

export interface SubmitLeadResult {
  success: boolean;
  message: string;
  data?: LeadRecord;
  isBackendUnavailable?: boolean;
}

/**
 * Lead Service Layer
 * Bridges frontend user interactions with the future backend REST API.
 */
export const leadService = {
  /**
   * Submit a new lead enquiry to the backend API.
   * Expected API Endpoint: POST /api/leads
   */
  async submitLead(formData: LeadFormData): Promise<SubmitLeadResult> {
    try {
      const response = await apiRequest<LeadRecord>(siteConfig.api.endpoints.leads, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      return {
        success: true,
        message: response.message || 'Lead submitted successfully',
        data: response.data,
      };
    } catch (error: unknown) {
      const err = error as { message?: string; isBackendUnavailable?: boolean; statusCode?: number };
      
      return {
        success: false,
        message:
          err.message ||
          'Failed to connect to the backend server. The lead was not saved.',
        isBackendUnavailable: err.isBackendUnavailable ?? true,
      };
    }
  },

  /**
   * Fetch all leads for the admin dashboard.
   * Expected API Endpoint: GET /api/leads
   * If the backend is unavailable during frontend preview, returns development sample data
   * accompanied by a clear notice.
   */
  async fetchLeads(): Promise<{
    leads: LeadRecord[];
    isSampleData: boolean;
    notice?: string;
  }> {
    try {
      const response = await apiRequest<LeadRecord[]>(siteConfig.api.endpoints.leads, {
        method: 'GET',
      });

      return {
        leads: response.data || [],
        isSampleData: false,
      };
    } catch (err) {
      // Backend not yet available: return clearly labelled development sample data
      return {
        leads: SAMPLE_DEV_LEADS,
        isSampleData: true,
        notice:
          'Backend API is not yet running. Displaying labeled development sample data for UI layout evaluation and preview testing.',
      };
    }
  },

  /**
   * Fetch a single lead by ID
   * Expected API Endpoint: GET /api/leads/:id
   */
  async fetchLeadById(id: string): Promise<{
    lead: LeadRecord | null;
    isSampleData: boolean;
  }> {
    try {
      const response = await apiRequest<LeadRecord>(siteConfig.api.endpoints.leadDetail(id), {
        method: 'GET',
      });
      return {
        lead: response.data,
        isSampleData: false,
      };
    } catch (err) {
      const sample = SAMPLE_DEV_LEADS.find((l) => l.id === id) || null;
      return {
        lead: sample,
        isSampleData: true,
      };
    }
  },

  /**
   * Update lead status
   * Expected API Endpoint: PATCH /api/leads/:id
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<{
    success: boolean;
    updatedLead?: LeadRecord;
    message: string;
  }> {
    try {
      const response = await apiRequest<LeadRecord>(siteConfig.api.endpoints.leadDetail(id), {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      return {
        success: true,
        updatedLead: response.data,
        message: 'Status updated successfully',
      };
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      return {
        success: false,
        message: errorObj.message || 'Unable to update status: Backend endpoint not connected',
      };
    }
  },
};
