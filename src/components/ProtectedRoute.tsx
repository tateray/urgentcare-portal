
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

  // List of public AI feature paths that don't require authentication
  const publicAiFeaturePaths = [
    '/ai-features',
    '/chat',
  ];

  // Check if current path is a public AI feature
  const isPublicAiFeature = publicAiFeaturePaths.some(path => 
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    // If it's a public AI feature path, we don't need to check authentication
    if (isPublicAiFeature) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isPublicAiFeature]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If it's a public AI feature, allow access without authentication
  if (isPublicAiFeature) {
    return <>{children}</>;
  }

  // For other routes, check authentication
  if (!user) {
    // Redirect to login but save the location they tried to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For admin-only routes, check if user has admin role
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
