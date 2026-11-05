import { z } from 'zod';
import { LEAD_STATUSES, SERVICE_KEYS, SORT_COLUMNS, SortKey } from '../utils/constants';
import { cleanLine, cleanMultiline } from '../utils/sanitize';

const req = (label: string) => ({ required_error: `${label} is required`, invalid_type_error: `${label} must be text` });

const fullName = z
  .string(req('Full name'))
  .transform(cleanLine)
  .pipe(
    z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name must not exceed 100 characters')
      .regex(/^[\p{L}\p{M}\s'’\-.]+$/u, 'Name should only contain letters, spaces, hyphens, and apostrophes')
  );

const email = z
  .string(req('Email address'))
  .transform((v) => v.trim().toLowerCase())
  .pipe(
    z
      .string()
      .min(5, 'Please provide a valid email address')
      .max(150, 'Email must not exceed 150 characters')
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address')
  );

const phone = z
  .string(req('Phone number'))
  .transform(cleanLine)
  .pipe(
    z.string().refine(
      (v) => {
        const digits = v.replace(/\D/g, '');
        return digits.length >= 8 && digits.length <= 15 && /^\+?[0-9\s\-().]{8,25}$/.test(v) && !v.includes('++');
      },
      { message: 'Telephone number must contain between 8 and 15 digits' }
    )
  );

const location = z
  .string(req('Location or postcode'))
  .transform(cleanLine)
  .pipe(z.string().min(2, 'Please provide a valid city, region, or postcode').max(100, 'Location must not exceed 100 characters'));

const serviceRequired = z.enum(SERVICE_KEYS, {
  errorMap: () => ({ message: 'Please select a valid service' }),
});

const message = z
  .string({ invalid_type_error: 'Message must be text' })
  .max(2500, 'Message must not exceed 2,000 characters')
  .transform(cleanMultiline)
  .pipe(z.string().max(2000, 'Message must not exceed 2,000 characters'))
  .optional()
  .default('');

export const createLeadSchema = z.object({
  fullName,
  email,
  phone,
  location,
  serviceRequired,
  message,
  /** GDPR: the visitor ticked/acknowledged the privacy notice (optional until the form has a checkbox). */
  consent: z.boolean().optional().default(false),
  /** Honeypot: real users never see or fill this field. */
  website: z.string().max(500).optional(),
  /** Cloudflare Turnstile token (only enforced when TURNSTILE_SECRET_KEY is configured). */
  turnstileToken: z.string().max(4096).optional(),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

const dateParam = (endOfDay: boolean) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v, ctx) => {
      if (!v) return undefined;
      const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(v);
      const d = new Date(dateOnly ? `${v}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z` : v);
      if (Number.isNaN(d.getTime())) {
        ctx.addIssue({ code: 'custom', message: 'Use YYYY-MM-DD or an ISO 8601 date' });
        return z.NEVER;
      }
      return d;
    });

const allOr = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.literal('all'), z.literal('')])
    .optional()
    .transform((v) => (v === 'all' || v === '' ? undefined : v));

const filterShape = {
  status: allOr(LEAD_STATUSES),
  service: allOr(SERVICE_KEYS),
  search: z.string().trim().max(100).optional().transform((v) => v || undefined),
  startDate: dateParam(false),
  endDate: dateParam(true),
};

export const listLeadsQuerySchema = z.object({
  ...filterShape,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(Object.keys(SORT_COLUMNS) as [SortKey, ...SortKey[]]).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const exportLeadsQuerySchema = z.object(filterShape);

export const updateLeadSchema = z
  .object({
    status: z.enum(LEAD_STATUSES, { errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }) }).optional(),
    notes: z
      .string()
      .max(3000, 'Notes must not exceed 3,000 characters')
      .transform(cleanMultiline)
      .optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: 'Provide at least one of: status, notes',
    path: ['body'],
  });
