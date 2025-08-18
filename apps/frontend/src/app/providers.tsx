import type { PropsWithChildren } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
