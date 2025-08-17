import type { PropsWithChildren } from 'react';
import { HeroUIProvider } from '@heroui/react';

export function Providers({ children }: PropsWithChildren) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
