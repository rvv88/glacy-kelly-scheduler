
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import ClinicsPage from "./pages/ClinicsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import RoleGuard from "./components/auth/RoleGuard";

import { cn } from "@/lib/utils";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="auth" element={<AuthPage />} />
              
              {/* Rotas que requerem login */}
              <Route path="calendar" element={
                <RoleGuard allowedRoles={['admin', 'user']}>
                  <CalendarPage />
                </RoleGuard>
              } />
              <Route path="patients" element={
                <RoleGuard allowedRoles={['admin', 'user']}>
                  <PatientsPage />
                </RoleGuard>
              } />
              <Route path="patients/new" element={
                <RoleGuard allowedRoles={['admin', 'user']}>
                  <PatientFormPage />
                </RoleGuard>
              } />
              <Route path="patients/edit/:id" element={
                <RoleGuard allowedRoles={['admin', 'user']}>
                  <PatientFormPage />
                </RoleGuard>
              } />
              
              {/* Rotas apenas para admin */}
              <Route path="dashboard" element={
                <RoleGuard allowedRoles={['admin']}>
                  <Dashboard />
                </RoleGuard>
              } />
              <Route path="services" element={
                <RoleGuard allowedRoles={['admin']}>
                  <ServicesPage />
                </RoleGuard>
              } />
              <Route path="services/new" element={
                <RoleGuard allowedRoles={['admin']}>
                  <ServiceFormPage />
                </RoleGuard>
              } />
              <Route path="services/edit/:id" element={
                <RoleGuard allowedRoles={['admin']}>
                  <ServiceFormPage />
                </RoleGuard>
              } />
              <Route path="clinics" element={
                <RoleGuard allowedRoles={['admin']}>
                  <ClinicsPage />
                </RoleGuard>
              } />
              <Route path="profile" element={
                <RoleGuard allowedRoles={['admin']}>
                  <ProfilePage />
                </RoleGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
