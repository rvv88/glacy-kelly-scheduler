
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import RoleGuard from "@/components/auth/RoleGuard";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import ClinicsPage from "./pages/ClinicsPage";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AdminCalendarConfigPage from "./pages/AdminCalendarConfigPage";
import AdminAppointmentRequestsPage from "./pages/AdminAppointmentRequestsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="auth" element={<AuthPage />} />
                
                {/* Rotas protegidas para usuários autenticados */}
                <Route 
                  path="dashboard" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Dashboard />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="calendar" 
                  element={
                    <RoleGuard allowedRoles={['admin', 'user']}>
                      <CalendarPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="patients" 
                  element={
                    <RoleGuard allowedRoles={['admin', 'user']}>
                      <PatientsPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="patients/new" 
                  element={
                    <RoleGuard allowedRoles={['admin', 'user']}>
                      <PatientFormPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="patients/edit/:id" 
                  element={
                    <RoleGuard allowedRoles={['admin', 'user']}>
                      <PatientFormPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="services" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <ServicesPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="services/new" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <ServiceFormPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="services/edit/:id" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <ServiceFormPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="clinics" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <ClinicsPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <RoleGuard allowedRoles={['admin', 'user']}>
                      <ProfilePage />
                    </RoleGuard>
                  } 
                />
                
                {/* Rotas administrativas */}
                <Route 
                  path="admin/calendar-config" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <AdminCalendarConfigPage />
                    </RoleGuard>
                  } 
                />
                <Route 
                  path="admin/appointment-requests" 
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <AdminAppointmentRequestsPage />
                    </RoleGuard>
                  } 
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
