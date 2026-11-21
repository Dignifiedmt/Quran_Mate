// Main Application Component
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import MobileNav from './components/MobileNav.jsx';
import PWAInstallBanner from './components/PWAInstallBanner.jsx';
import BismillahLoader from './components/BismillahLoader.jsx';

// Lazy-loaded Pages for fast initial bundle & smooth navigation
const WelcomePage = lazy(() => import('./pages/WelcomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ProfileSetupPage = lazy(() => import('./pages/ProfileSetupPage.jsx'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage.jsx'));
const LearnerProfilePage = lazy(() => import('./pages/LearnerProfilePage.jsx'));
const PartnerRequestsPage = lazy(() => import('./pages/PartnerRequestsPage.jsx'));
const ActivePartnershipPage = lazy(() => import('./pages/ActivePartnershipPage.jsx'));
const MessagingPage = lazy(() => import('./pages/MessagingPage.jsx'));
const QuranPage = lazy(() => import('./pages/QuranPage.jsx'));
const AyahFinderPage = lazy(() => import('./pages/AyahFinderPage.jsx'));
const DailyTrackerPage = lazy(() => import('./pages/DailyTrackerPage.jsx'));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const GroupsDirectoryPage = lazy(() => import('./pages/GroupsDirectoryPage.jsx'));
const GroupRoomPage = lazy(() => import('./pages/GroupRoomPage.jsx'));

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <BismillahLoader
        message="Entering Quran Mate..."
        submessage="In the name of Allah, the Entirely Merciful, the Especially Merciful"
        fullScreen={true}
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pb-20 sm:pb-24">
        <Suspense
          fallback={
            <BismillahLoader
              message="Loading Quran Mate..."
              submessage="In the name of Allah, the Entirely Merciful, the Especially Merciful"
              fullScreen={false}
            />
          }
        >
          <Routes>
          {/* Public or Accessible Home Routes */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <WelcomePage />}
          />
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/profile/setup" replace /> : <RegisterPage />}
          />

          {/* Main Learner Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Holy Qur'an Suite & Ayah Finder */}
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/ayah-finder" element={<AyahFinderPage />} />

          {/* Collaborative Circles & Group Halaqah Rooms */}
          <Route path="/groups" element={<GroupsDirectoryPage />} />
          <Route path="/circles" element={<Navigate to="/groups" replace />} />
          <Route path="/groups/:id" element={<GroupRoomPage />} />

          {/* Daily Quran Habit Tracker */}
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <DailyTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route path="/daily-tracker" element={<Navigate to="/tracker" replace />} />

          {/* Protected Routes */}
          <Route
            path="/profile/setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learners/:id"
            element={
              <ProtectedRoute>
                <LearnerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <PartnerRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partnership"
            element={
              <ProtectedRoute>
                <ActivePartnershipPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partnership/:id/messages"
            element={
              <ProtectedRoute>
                <MessagingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* PWA Phone Install Prompt Banner (like 3MTT Mobile App) */}
      <PWAInstallBanner />
    </div>
  );
}
