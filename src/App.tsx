
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
                  {/* Páginas públicas sem Layout */}
                  <Route path="/" element={
                    <Layout>
                      <Index />
                    </Layout>
                  } />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/about" element={
                    <Layout>
                      <AboutPage />
                    </Layout>
                  } />
                  
                  {/* Rotas protegidas com Layout */}
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
                  
                  <Route path="/patients" element={
                    <Layout>
                      <PatientsPage />
                    </Layout>
                  } />
                  
                  <Route path="/profile" element={
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  } />
                  
                  {/* Rotas administrativas */}
                  <Route path="/clinics" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <ClinicsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/services" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <ServicesPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/services/new" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <ServiceFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/services/edit/:id" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <ServiceFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <PatientsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients/new" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <PatientFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/patients/edit/:id" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <PatientFormPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/calendar-config" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <AdminCalendarConfigPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/appointment-requests" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <AdminAppointmentRequestsPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/users" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <UsersPage />
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/settings" element={
                    <RoleGuard allowedRoles={['admin']}>
                      <Layout>
                        <div>Configurações</div>
                      </Layout>
                    </RoleGuard>
                  } />
                  
                  <Route path="/history" element={
                    <Layout>
                      <div>Histórico</div>
                    </Layout>
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
