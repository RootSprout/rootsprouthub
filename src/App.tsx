/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LandingPage from './pages/LandingPage';
import BlogsPage from './pages/BlogsPage';
import ProjectsPage from './pages/ProjectsPage';
import BooksPage from './pages/BooksPage';
import EventsPage from './pages/EventsPage';
import PartnersPage from './pages/PartnersPage';
import CommunityPage from './pages/CommunityPage';
import VideosPage from './pages/VideosPage';
import SponsorshipPage from './pages/SponsorshipPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppShell = () => {
  const location = useLocation();
  const hideChrome =
    location.pathname.startsWith('/lesson') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/home');

  return (
    <div className="min-h-screen bg-black-deep font-sans selection:bg-gold selection:text-black-deep">
      {!hideChrome && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/sponsorship" element={<SponsorshipPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
          </Route>

          {/* Public/Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Catch-all Route: Redirect unknown endpoints to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}
