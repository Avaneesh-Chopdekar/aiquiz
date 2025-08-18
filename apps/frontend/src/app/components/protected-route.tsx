import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '../store';

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}) {
  const { user, status } = useAuthStore();
  const location = useLocation();

  console.log({ user, status });

  if (status === 'unknown') {
    return <div className="p-4 text-center">Loading…</div>;
  }

  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && !(role === user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
