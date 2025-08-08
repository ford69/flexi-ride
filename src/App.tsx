import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CarListingPage from './pages/car/CarListingPage';
import CarDetailPage from './pages/car/CarDetailPage';
import AddCarPage from './pages/car/AddCarPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { AlertContainer } from './components/ui/AlertContainer';
import TestPayment from './components/TestPayment';
import { HelmetProvider } from 'react-helmet-async';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/auth/ProfilePage';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('user' | 'owner' | 'admin')[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    case 'owner':
      return <Navigate to="/owner/dashboard" />;
    default:
      return <Navigate to="/dashboard" />;
  }
};

function App() {
  return (
    <HelmetProvider>
      <AlertProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-background text-white">
            <AlertContainer />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarListingPage />} />
                <Route path="/cars/:id" element={<CarDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Dashboard redirect */}
                <Route 
                  path="/dashboard-router" 
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* User dashboard */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Owner routes */}
                <Route 
                  path="/owner/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['owner']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/add-car" 
                  element={
                    <ProtectedRoute allowedRoles={['owner']}>
                      <AddCarPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Test payment */}
                <Route path="/test-payment" element={<TestPayment />} />
                
                {/* Verify email */}
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                
                {/* Forgot password */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Reset password */}
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Profile */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </AlertProvider>
    </HelmetProvider>
  );
}

export default App;