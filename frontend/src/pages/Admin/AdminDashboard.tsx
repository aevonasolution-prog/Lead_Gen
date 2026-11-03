import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { LeadRecord, LeadStatus } from '../../types';
import { SAMPLE_DEV_LEADS } from '../../services/mockData';
import { downloadCsvFile, generateLeadsCsv } from '../../utils/exportCsv';
import { SEOHead } from '../../components/seo/SEOHead';
import { siteConfig } from '../../config/siteConfig';

export const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>(SAMPLE_DEV_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [statusUpdateNotice, setStatusUpdateNotice] = useState<string | null>(null);

  // Status badge style helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            ● New
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            ● In Review
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            ● Contacted
          </span>
        );
      case 'qualified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ● Qualified
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            ● Closed
          </span>
        );
      default:
        return null;
    }
  };

  // Filter and search computation
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }
      // Service filter
      if (serviceFilter !== 'all' && lead.serviceRequired !== serviceFilter) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.fullName.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesPhone = lead.phone.toLowerCase().includes(query);
        const matchesLocation = lead.location.toLowerCase().includes(query);
        const matchesMessage = lead.message.toLowerCase().includes(query);
        const matchesId = lead.id.toLowerCase().includes(query);

        return (
          matchesName ||
          matchesEmail ||
          matchesPhone ||
          matchesLocation ||
          matchesMessage ||
          matchesId
        );
      }
      return true;
    });
  }, [leads, statusFilter, serviceFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter((l) => l.status === 'new').length,
      inReview: leads.filter((l) => l.status === 'in_review').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      closed: leads.filter((l) => l.status === 'closed').length,
    };
  }, [leads]);

  // Handle CSV export of currently visible / filtered leads
  const handleExportCsv = () => {
    const csvData = generateLeadsCsv(filteredLeads);
    downloadCsvFile(csvData, `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    setExportNotice(
      `Successfully exported ${filteredLeads.length} lead record(s) to CSV based on current filters.`
    );
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Handle in-memory status change for development preview
  const handleStatusChange = (newStatus: LeadStatus) => {
    if (!selectedLead) return;
    const updated = leads.map((l) =>
      l.id === selectedLead.id
        ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
        : l
    );
    setLeads(updated);
    setSelectedLead({ ...selectedLead, status: newStatus, updatedAt: new Date().toISOString() });
    setStatusUpdateNotice(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}". (In-memory development preview update)`);
    setTimeout(() => setStatusUpdateNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      <SEOHead
        title="Admin Portal | Lead Management Dashboard"
        description="Internal administrative portal for managing customer inquiries, reviewing lead specifications, and exporting pipeline reports."
        noIndex={true}
      />

      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem] py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
                <span>Lead Management Console</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">
                  Development Preview
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {siteConfig.brand.tradingName} • Pipeline Administration
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/"
              className="text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Exit to Main Website
            </Link>
          </div>
        </div>
      </header>

      {/* Development Banner Notice */}
      <div className="bg-amber-500/10 border-b border-amber-300/60 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-amber-950 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              Development Phase Architecture Notice for Backend Team:
            </p>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              This dashboard utilizes <strong>clearly labeled sample development records</strong> for UI verification and layout testing. Real database persistence, JWT/Session authentication, role-based access control (RBAC), and server-side pagination will be integrated in Phase 2 via <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">GET /api/leads</code> and <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">PATCH /api/leads/:id</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Leads
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              New
            </span>
            <p className="text-2xl font-extrabold text-blue-700 mt-1">{stats.newLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              In Review
            </span>
            <p className="text-2xl font-extrabold text-purple-700 mt-1">{stats.inReview}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Contacted
            </span>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.contacted}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Qualified
            </span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.qualified}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Closed
            </span>
            <p className="text-2xl font-extrabold text-slate-700 mt-1">{stats.closed}</p>
          </div>
        </div>

        {/* Action Banner Notifications */}
        {exportNotice && (
          <div
            role="status"
            className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, phone, location..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Export */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <label htmlFor="status-filter" className="font-medium">
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="all">All Statuses ({leads.length})</option>
                  <option value="new">New ({stats.newLeads})</option>
                  <option value="in_review">In Review ({stats.inReview})</option>
                  <option value="contacted">Contacted ({stats.contacted})</option>
                  <option value="qualified">Qualified ({stats.qualified})</option>
                  <option value="closed">Closed ({stats.closed})</option>
                </select>
              </div>

              {/* Service Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <label htmlFor="service-filter" className="font-medium">
                  Service:
                </label>
                <select
                  id="service-filter"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="all">All Services</option>
                  {siteConfig.services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredLeads.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                title="Export filtered records to RFC-4180 CSV"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV ({filteredLeads.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Lead ID / Customer
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Contact Details
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Location
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Service Required
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Submitted Date
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">No leads match your search criteria</p>
                        <p className="text-xs text-slate-500">
                          Try adjusting your search terms or clearing status filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Name / ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {lead.fullName}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          {lead.id}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.location}</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <span className="inline-block text-xs font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded max-w-xs truncate">
                          {lead.serviceName}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(lead.status)}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-medium transition-colors"
                          aria-label={`View details for ${lead.fullName}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredLeads.length} of {leads.length} recorded preview leads
            </span>
            <span className="italic">
              Sample Data Only • Real-time DB sync pending Phase 2 API integration
            </span>
          </div>
        </div>
      </div>

      {/* Lead Details Modal / Drawer */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {selectedLead.id}
                  </span>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedLead.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted on {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close lead details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Memory Status Changer for Development Testing */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label
                htmlFor="modal-status-select"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Update Lead Pipeline Status:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(['new', 'in_review', 'contacted', 'qualified', 'closed'] as LeadStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                        selectedLead.status === st
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
              {statusUpdateNotice && (
                <p className="text-xs text-emerald-700 font-medium pt-1">
                  ✓ {statusUpdateNotice}
                </p>
              )}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 uppercase font-semibold">Email</span>
                <p className="font-medium text-slate-900 mt-0.5 break-all">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-brand-600 hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 uppercase font-semibold">Phone</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-brand-600 hover:underline"
                  >
                    {selectedLead.phone}
                  </a>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  Location / Postcode
                </span>
                <p className="font-medium text-slate-900 mt-0.5">{selectedLead.location}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  Service Category
                </span>
                <p className="font-medium text-slate-900 mt-0.5">{selectedLead.serviceName}</p>
              </div>
            </div>

            {/* Full Message */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Customer Enquiry Message:
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedLead.message || 'No additional project notes provided by customer.'}
              </div>
            </div>

            {/* Notes if available */}
            {selectedLead.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Internal Administrative Notes:
                </h4>
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
                  {selectedLead.notes}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                PATCH /api/leads/{selectedLead.id} API ready
              </span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
