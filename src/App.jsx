// Main Application Component
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import MobileNav from './components/MobileNav.jsx';

// Pages
import WelcomePage from './pages/WelcomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfileSetupPage from './pages/ProfileSetupPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import LearnerProfilePage from './pages/LearnerProfilePage.jsx';
import PartnerRequestsPage from './pages/PartnerRequestsPage.jsx';
import ActivePartnershipPage from './pages/ActivePartnershipPage.jsx';
import MessagingPage from './pages/MessagingPage.jsx';
import QuranPage from './pages/QuranPage.jsx';
import AyahFinderPage from './pages/AyahFinderPage.jsx';
import DailyTrackerPage from './pages/DailyTrackerPage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GroupsDirectoryPage from './pages/GroupsDirectoryPage.jsx';
import GroupRoomPage from './pages/GroupRoomPage.jsx';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[var(--text-muted)]">Loading Quran Mate...</p>
        </div>
      </div>
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
      <main className="flex-1 pb-16 sm:pb-0">
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
          <Route
            path="/groups/:id"
            element={
              <ProtectedRoute>
                <GroupRoomPage />
              </ProtectedRoute>
            }
          />

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
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
