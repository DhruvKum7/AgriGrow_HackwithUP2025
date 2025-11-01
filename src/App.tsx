
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './components/AuthProvider'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import DiseaseDetection from './components/DiseaseDetection'
import MandiPrices from './components/MandiPrices'
import VoiceAssistant from './components/VoiceAssistant'
import WeatherForecast from './components/WeatherForecast'
import GrainMarketplace from './components/GrainMarketplace'
import MedicalChatbot from './components/MedicalChatbot'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontSize: '14px',
                  borderRadius: '8px',
                  padding: '16px',
                },
                success: {
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#ef4444',
                  },
                },
              }}
            />
            
            <Navbar />
            
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/disease-detection" element={<DiseaseDetection />} />
                <Route path="/mandi-prices" element={<MandiPrices />} />
                <Route path="/voice-assistant" element={<VoiceAssistant />} />
                <Route path="/weather-forecast" element={<WeatherForecast />} />
                <Route path="/grain-marketplace" element={<GrainMarketplace />} />
                <Route path="/medical-chatbot" element={<MedicalChatbot />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-400">
                  © 2025 AgriGrow. Made with ❤️ for Indian farmers.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Empowering agriculture through AI and technology
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  )
}

export default App
