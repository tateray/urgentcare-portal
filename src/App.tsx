import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Root from "./pages/Root";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Facilities from "./pages/Facilities";
import Chat from "./pages/Chat";
import AIfeatures from "./pages/AIfeatures";
import Specialty from "./pages/Specialty";
import Wearables from "./pages/Wearables";

// Add the import for the new SelfHealthMonitoring page
import SelfHealthMonitoring from "./pages/SelfHealthMonitoring";

// Firebase configuration (if not already present)
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
          element: <Root />,
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
              path: "/facilities",
              element: (
                <ProtectedRoute>
                  <Facilities />
                </ProtectedRoute>
              ),
            },
            {
              path: "/chat",
              element: (
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              ),
            },
            {
              path: "/ai-features",
              element: (
                <ProtectedRoute>
                  <AIfeatures />
                </ProtectedRoute>
              ),
            },
            {
              path: "/specialty/:name",
              element: (
                <ProtectedRoute>
                  <Specialty />
                </ProtectedRoute>
              ),
            },
            {
              path: "/wearables",
              element: (
                <ProtectedRoute>
                  <Wearables />
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
