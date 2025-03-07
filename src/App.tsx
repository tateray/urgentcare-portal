
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HospitalLocator from "./pages/HospitalLocator";
import MedicalHistory from "./pages/MedicalHistory";
import EmergencyContacts from "./pages/EmergencyContacts";
import AmbulanceBooking from "./pages/AmbulanceBooking";
import ChatWithDoctor from "./pages/ChatWithDoctor";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import FireEmergency from "./pages/FireEmergency";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/hospital-locator" element={<HospitalLocator />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/ambulance" element={<AmbulanceBooking />} />
          <Route path="/fire-emergency" element={<FireEmergency />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes for logged in users */}
          <Route path="/medical-history" element={
            <ProtectedRoute>
              <MedicalHistory />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatWithDoctor />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/user-dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
