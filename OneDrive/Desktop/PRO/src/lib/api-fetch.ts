/**
 * Authenticated Fetch Utility
 * Automatically includes CSRF token and credentials for all API calls.
 */

/**
 * Read the CSRF token from the _csrf_token cookie.
 */
function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )_csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Wrapper around fetch that automatically includes:
 * - credentials: 'include' (sends cookies)
 * - x-csrf-token header (for POST/PATCH/PUT/DELETE)
 * - Content-Type: application/json (when body is provided)
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  // Add CSRF token for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }
  }

  // Set Content-Type if body is provided and header not already set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
