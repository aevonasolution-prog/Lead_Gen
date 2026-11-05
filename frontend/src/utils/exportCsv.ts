import { LeadRecord } from '../types';

/**
 * Escapes a single CSV cell value following RFC-4180
 */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  // If value contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

/**
 * Generates an RFC-4180 compliant CSV string from an array of LeadRecord items
 */
export function generateLeadsCsv(leads: LeadRecord[]): string {
  const headers = [
    'Lead ID',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Location / Postcode',
    'Service Category',
    'Service Name',
    'Status',
    'Enquiry Message',
    'Submitted At (UTC)',
    'Notes',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.fullName,
    lead.email,
    lead.phone,
    lead.location,
    lead.serviceRequired,
    lead.serviceName,
    lead.status,
    lead.message,
    lead.createdAt,
    lead.notes || '',
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];

  return csvLines.join('\r\n');
}

/**
 * Triggers a browser file download of CSV data
 */
export function downloadCsvFile(csvContent: string, fileName?: string): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const finalFileName = fileName || `leads_export_${dateStr}.csv`;

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', finalFileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
