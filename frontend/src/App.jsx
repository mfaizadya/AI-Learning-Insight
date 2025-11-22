import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import halaman-halaman dari file yang terpisah
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // DashboardPage masih menggunakan named export

// Inisialisasi QueryClient (opsional, tapi bagus untuk masa depan)
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            {/* Route untuk Halaman Login (Default) */}
            <Route path="/" element={<LoginPage />} />
            
            {/* Route untuk Halaman Register */}
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Route untuk Halaman Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          
          {/* Toaster untuk notifikasi global */}
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;