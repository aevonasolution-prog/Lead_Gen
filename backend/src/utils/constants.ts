export const LEAD_STATUSES = ['new', 'in_review', 'contacted', 'qualified', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const SERVICE_NAMES = {
  consulting: 'Strategic Business Consulting',
  managed_services: 'Managed Operational Services',
  enterprise_solutions: 'Enterprise Infrastructure Solutions',
  digital_transformation: 'Digital Process Modernization',
  custom_development: 'Tailored Technical Solutions',
  other: 'Specialized Enquiries & Advisory',
} as const;

export type ServiceCategory = keyof typeof SERVICE_NAMES;
export const SERVICE_KEYS = Object.keys(SERVICE_NAMES) as [ServiceCategory, ...ServiceCategory[]];

export const SORT_COLUMNS = {
  createdAt: 'created_at',
  fullName: 'full_name',
  status: 'status',
} as const;
export type SortKey = keyof typeof SORT_COLUMNS;

/** Hard cap on rows in one CSV export to protect memory. */
export const MAX_EXPORT_ROWS = 50000;
