// frontend/src/components/PrivateRoute.tsx
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }: PropsWithChildren) {
  const hasToken = !!localStorage.getItem('token');
  return hasToken ? <>{children}</> : <Navigate to="/login" replace />;
}
