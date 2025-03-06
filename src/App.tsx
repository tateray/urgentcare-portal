
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hospital-locator" element={<HospitalLocator />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/ambulance" element={<AmbulanceBooking />} />
          <Route path="/chat" element={<ChatWithDoctor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
