'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({
  topbar,
  footer,
  whatsapp,
  motion,
  children
}: {
  topbar: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: React.ReactNode;
  motion: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/admin/login');

  return (
    <>
      {!isAuthPage && topbar}
      {!isAuthPage && motion}
      {children}
      {!isAuthPage && footer}
      {!isAuthPage && whatsapp}
    </>
  );
}
