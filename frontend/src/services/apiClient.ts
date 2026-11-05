import { siteConfig } from '../config/siteConfig';
import { ApiErrorResponse, ApiSuccessResponse } from '../types';

export class ApiConnectionError extends Error {
  public isBackendUnavailable: boolean;
  public statusCode: number;

  constructor(message: string, isBackendUnavailable = true, statusCode = 503) {
    super(message);
    this.name = 'ApiConnectionError';
    this.isBackendUnavailable = isBackendUnavailable;
    this.statusCode = statusCode;
  }
}

/**
 * Standard HTTP Request Options
 */
export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Reusable API Client with typed responses, timeout, and connection failure handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const { timeoutMs = siteConfig.api.timeoutMs, params, ...fetchOptions } = options;

  // Build full URL
  const baseUrl = siteConfig.api.baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let fullUrl = `${baseUrl}${cleanEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  // Setup AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: defaultHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      let errorPayload: ApiErrorResponse | null = null;
      if (isJson) {
        try {
          errorPayload = (await response.json()) as ApiErrorResponse;
        } catch {
          // Non-parsable json error
        }
      }

      const errorMessage =
        errorPayload?.message ||
        `Backend API returned error status ${response.status}: ${response.statusText}`;

      throw new ApiConnectionError(errorMessage, false, response.status);
    }

    if (isJson) {
      const data = (await response.json()) as ApiSuccessResponse<T>;
      return data;
    }

    // Fallback if plain text or empty body
    return {
      success: true,
      statusCode: response.status,
      message: 'OK',
      data: (await response.text()) as unknown as T,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiConnectionError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiConnectionError(
        `Request to backend API timed out after ${timeoutMs}ms. Please verify the backend service is responding at ${siteConfig.api.baseUrl}.`,
        true,
        408
      );
    }

    // Network error: backend is unavailable or not running
    throw new ApiConnectionError(
      `Cannot connect to backend API at '${siteConfig.api.baseUrl}'. The backend server is currently offline or unreachable. (Phase: Frontend Development Only)`,
      true,
      503
    );
  }
}
