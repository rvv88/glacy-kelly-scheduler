
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import AuthRedirect from "@/components/auth/AuthRedirect";
import ProfileChecker from "@/components/auth/ProfileChecker";
import RoleGuard from "@/components/auth/RoleGuard";
import Layout from "@/components/layout/Layout";

// Lazy loading dos componentes de página
const Index = lazy(() => import("@/pages/Index"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ClinicsPage = lazy(() => import("@/pages/ClinicsPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceFormPage = lazy(() => import("@/pages/ServiceFormPage"));
const PatientsPage = lazy(() => import("@/pages/PatientsPage"));
const PatientFormPage = lazy(() => import("@/pages/PatientFormPage"));
const AdminCalendarConfigPage = lazy(() => import("@/pages/AdminCalendarConfigPage"));
const AdminAppointmentRequestsPage = lazy(() => import("@/pages/AdminAppointmentRequestsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AuthRedirect>
            <ProfileChecker>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  
                  {/* Rotas protegidas */}
                  <Route path="/dashboard" element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  } />
                  
                  <Route path="/calendar" element={
                    <Layout>
                      <CalendarPage />
                    </Layout>
                  } />
                  
                  <Route path="/profile" element={
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  } />
                  
                  {/* Rotas administrativas */}
                  <Route path="/admin/clinics" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <ClinicsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/services" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <ServicesPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/services/new" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <ServiceFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/services/edit/:id" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <ServiceFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <PatientsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients/new" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <PatientFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients/edit/:id" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <PatientFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/calendar-config" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <AdminCalendarConfigPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/appointment-requests" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <AdminAppointmentRequestsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/users" element={
                    <RoleGuard requiredRole="admin">
                      <Layout>
                        <UsersPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ProfileChecker>
          </AuthRedirect>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
