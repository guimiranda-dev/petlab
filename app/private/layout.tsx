import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className='bg-slate-100 min-h-screen'>{children}</div>;
}
