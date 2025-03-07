
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For admin-only routes, check if user has admin role
  // In a real app, this would check a claim or a database record
  if (adminOnly) {
    // This is a simplified check - in a real app, you'd check a claim or database
    const isAdmin = user.email?.includes('admin');
    
    if (!isAdmin) {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
