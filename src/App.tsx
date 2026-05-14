/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Home from '@/pages/Home';
import AdminDashboard from '@/pages/AdminDashboard';
import ManageProperties from '@/pages/admin/ManageProperties';
import PropertyForm from '@/pages/admin/PropertyForm';
import SearchPage from '@/pages/Search';
import PropertyDetails from '@/pages/PropertyDetails';
import AuthPage from '@/pages/Auth';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<ManageProperties />} />
              <Route path="/admin/properties/new" element={<PropertyForm />} />
              <Route path="/admin/properties/edit/:id" element={<PropertyForm />} />
              
              <Route path="/profile" element={<div className="container mx-auto py-20 text-center">Profile Page Coming Soon</div>} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}





