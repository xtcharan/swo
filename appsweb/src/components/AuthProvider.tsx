'use client';

import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      // initialSession={pageProps.initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
