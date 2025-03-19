
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import EmergencyContacts from '@/pages/EmergencyContacts';
import HospitalLocator from '@/pages/HospitalLocator';
import AmbulanceBooking from '@/pages/AmbulanceBooking';
import ChatWithDoctor from '@/pages/ChatWithDoctor';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AiFeatures from '@/pages/AiFeatures';
import WearablesIntegration from '@/pages/WearablesIntegration';
import AppointmentScheduling from '@/pages/AppointmentScheduling';
import QueueManagement from '@/pages/QueueManagement';
import MedicalHistory from '@/pages/MedicalHistory';
import FireEmergency from '@/pages/FireEmergency';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomeRedesigned from '@/pages/HomeRedesigned';
import DesignSystem from '@/pages/DesignSystem';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home-redesigned" element={<HomeRedesigned />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/hospital-locator" element={<HospitalLocator />} />
        <Route path="/ambulance" element={<AmbulanceBooking />} />
        <Route path="/chat" element={<ChatWithDoctor />} />
        <Route path="/fire-emergency" element={<FireEmergency />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/ai-features" element={
          <ProtectedRoute>
            <AiFeatures />
          </ProtectedRoute>
        } />
        <Route path="/wearables" element={
          <ProtectedRoute>
            <WearablesIntegration />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppointmentScheduling />
          </ProtectedRoute>
        } />
        <Route path="/queue-management" element={
          <ProtectedRoute>
            <QueueManagement />
          </ProtectedRoute>
        } />
        <Route path="/medical-history" element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
