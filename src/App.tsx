/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BlogsPage from './pages/BlogsPage';
import ProjectsPage from './pages/ProjectsPage';
import BooksPage from './pages/BooksPage';
import EventsPage from './pages/EventsPage';
import PartnersPage from './pages/PartnersPage';
import CommunityPage from './pages/CommunityPage';
import VideosPage from './pages/VideosPage';
import SponsorshipPage from './pages/SponsorshipPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black-deep font-sans selection:bg-gold selection:text-black-deep">
        <Navbar />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
