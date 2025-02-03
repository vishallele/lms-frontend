// app/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NexthemesProvider } from 'next-themes';

export function NextUiProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider className='h-full'>
      <NexthemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NexthemesProvider>
    </HeroUIProvider>
  )
}