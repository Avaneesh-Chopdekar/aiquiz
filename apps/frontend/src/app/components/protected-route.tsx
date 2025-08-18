import { Navigate } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { Spinner } from '@heroui/react';
import useAuth from '../hooks/use-auth';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner
          classNames={{ label: 'text-foreground mt-4' }}
          label="Loading..."
          variant="gradient"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
