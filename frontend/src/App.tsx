import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home/HomePage';
import { AboutPage } from './pages/About/AboutPage';
import { ServicesPage } from './pages/Services/ServicesPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditions/TermsConditionsPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes wrapped in main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Standalone Admin Portal Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
