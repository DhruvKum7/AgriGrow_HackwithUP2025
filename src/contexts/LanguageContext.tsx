
import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'hi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.disease': 'Disease Detection',
    'nav.prices': 'Mandi Prices',
    'nav.voice': 'Voice Commands',
    'nav.weather': 'Weather Forecast',
    'nav.profile': 'Profile',
    
    // Home Page
    'home.title': 'AgriGrow',
    'home.subtitle': 'AI-Powered Smart Farming Platform',
    'home.description': 'Helping Indian farmers with AI crop disease detection, live mandi prices, weather forecasting, and voice-powered assistance',
    'home.identify': 'Identify Disease',
    'home.check_prices': 'Check Mandi Prices',
    'home.voice_help': 'Voice Assistant',
    'home.weather_forecast': 'Weather Forecast',
    
    // Disease Detection
    'disease.title': 'AI Crop Disease Detection',
    'disease.upload': 'Upload Leaf Image',
    'disease.analyzing': 'Analyzing Image...',
    'disease.result': 'Analysis Result',
    'disease.confidence': 'Confidence',
    'disease.treatment': 'Treatment',
    'disease.prevention': 'Prevention',
    'disease.severity': 'Severity',
    
    // Mandi Prices
    'prices.title': 'Live Mandi Prices',
    'prices.search': 'Search crops...',
    'prices.per_kg': 'per kg',
    'prices.per_quintal': 'per quintal',
    'prices.trend': 'Trend',
    'prices.quality': 'Quality',
    
    // Voice Commands
    'voice.title': 'Voice Assistant',
    'voice.listening': 'Listening...',
    'voice.start': 'Start Voice Command',
    'voice.stop': 'Stop Listening',
    'voice.not_supported': 'Voice recognition not supported in your browser',
    
    // Weather
    'weather.title': 'Weather Forecast',
    'weather.current': 'Current Weather',
    'weather.forecast': '7-Day Forecast',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind Speed',
    'weather.visibility': 'Visibility',
    'weather.feels_like': 'Feels like',
    
    // Profile
    'profile.title': 'User Profile',
    'profile.personal_info': 'Personal Information',
    'profile.farming_info': 'Farming Information',
    'profile.account_security': 'Account Security',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.try_again': 'Try Again',
    'common.language': 'Language',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.welcome': 'Welcome'
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.disease': 'रोग पहचान',
    'nav.prices': 'मंडी भाव',
    'nav.voice': 'आवाज कमांड',
    'nav.weather': 'मौसम पूर्वानुमान',
    'nav.profile': 'प्रोफाइल',
    
    // Home Page
    'home.title': 'एग्रीग्रो',
    'home.subtitle': 'AI-संचालित स्मार्ट खेती प्लेटफॉर्म',
    'home.description': 'भारतीय किसानों की AI फसल रोग पहचान, लाइव मंडी भाव, मौसम पूर्वानुमान, और आवाज सहायता से मदद',
    'home.identify': 'रोग पहचानें',
    'home.check_prices': 'मंडी भाव देखें',
    'home.voice_help': 'आवाज सहायक',
    'home.weather_forecast': 'मौसम पूर्वानुमान',
    
    // Disease Detection
    'disease.title': 'AI फसल रोग पहचान',
    'disease.upload': 'पत्ती की फोटो अपलोड करें',
    'disease.analyzing': 'फोटो का विश्लेषण हो रहा है...',
    'disease.result': 'विश्लेषण परिणाम',
    'disease.confidence': 'विश्वसनीयता',
    'disease.treatment': 'इलाज',
    'disease.prevention': 'बचाव',
    'disease.severity': 'गंभीरता',
    
    // Mandi Prices
    'prices.title': 'लाइव मंडी भाव',
    'prices.search': 'फसल खोजें...',
    'prices.per_kg': 'प्रति किलो',
    'prices.per_quintal': 'प्रति क्विंटल',
    'prices.trend': 'रुझान',
    'prices.quality': 'गुणवत्ता',
    
    // Voice Commands
    'voice.title': 'आवाज सहायक',
    'voice.listening': 'सुन रहा है...',
    'voice.start': 'आवाज कमांड शुरू करें',
    'voice.stop': 'सुनना बंद करें',
    'voice.not_supported': 'आपके ब्राउज़र में आवाज पहचान समर्थित नहीं है',
    
    // Weather
    'weather.title': 'मौसम पूर्वानुमान',
    'weather.current': 'वर्तमान मौसम',
    'weather.forecast': '7 दिन का पूर्वानुमान',
    'weather.humidity': 'नमी',
    'weather.wind': 'हवा की गति',
    'weather.visibility': 'दृश्यता',
    'weather.feels_like': 'महसूस होता है',
    
    // Profile
    'profile.title': 'उपयोगकर्ता प्रोफाइल',
    'profile.personal_info': 'व्यक्तिगत जानकारी',
    'profile.farming_info': 'कृषि जानकारी',
    'profile.account_security': 'खाता सुरक्षा',
    'profile.edit': 'प्रोफाइल एडिट करें',
    'profile.save': 'सेव करें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.try_again': 'फिर कोशिश करें',
    'common.language': 'भाषा',
    'common.login': 'लॉगिन',
    'common.logout': 'लॉगआउट',
    'common.welcome': 'स्वागत है'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('agrigrow-language') as Language
    if (savedLanguage && (savedLanguage === 'hi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('agrigrow-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
