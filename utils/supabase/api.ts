import { createServerClient, serializeCookieHeader, type SetAllCookies } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';

export function createClient(request: NextApiRequest, response: NextApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(request.cookies).map(([name, value]) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          const existing = response.getHeader('Set-Cookie');
          const headers = existing
            ? Array.isArray(existing)
              ? existing.map(String)
              : [String(existing)]
            : [];
          response.setHeader('Set-Cookie', [
            ...headers,
            ...cookiesToSet.map(({ name, value, options }) => {
              request.cookies[name] = value;
              return serializeCookieHeader(name, value, options);
            }),
          ]);
        },
      },
    },
  );
}
