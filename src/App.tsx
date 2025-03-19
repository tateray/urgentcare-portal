
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SelfHealthMonitoring from "./pages/SelfHealthMonitoring";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <div className="app-container">{/* Root component content */}</div>,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Navigate to="/auth" replace />,
            },
            {
              path: "/auth",
              element: <Auth />,
            },
            {
              path: "/user-dashboard",
              element: (
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin-dashboard",
              element: (
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              ),
            },
            {
              path: "/self-health-monitoring",
              element: (
                <ProtectedRoute>
                  <SelfHealthMonitoring />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ])}
    />
  );
}

export default App;
