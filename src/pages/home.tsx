
import React from 'react'
import { Link } from 'react-router-dom'
import {Camera, TrendingUp, Mic, Leaf, Users, Award, BarChart3} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { motion } from 'framer-motion'
import DeveloperProfile from '../components/DeveloperProfile'

const Home: React.FC = () => {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: Camera,
      title: t('home.identify'),
      description: language === 'hi' 
        ? 'फसल की पत्तियों की फोटो अपलोड करें और AI से रोग की पहचान करें'
        : 'Upload crop leaf images and identify diseases with AI analysis',
      link: '/disease-detection',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      icon: TrendingUp,
      title: t('home.check_prices'),
      description: language === 'hi'
        ? 'देश भर की मंडियों से लाइव भाव और कीमतों की जानकारी पाएं'
        : 'Get live prices and rates from mandis across the country',
      link: '/mandi-prices',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: Mic,
      title: t('home.voice_help'),
      description: language === 'hi'
        ? 'आवाज के जरिए कमांड दें और तुरंत जानकारी प्राप्त करें'
        : 'Give voice commands and get instant information',
      link: '/voice-assistant',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    }
  ]

  const stats = [
    { 
      number: '10K+', 
      label: language === 'hi' ? 'खुश किसान' : 'Happy Farmers',
      icon: Users 
    },
    { 
      number: '95%', 
      label: language === 'hi' ? 'सटीकता दर' : 'Accuracy Rate',
      icon: Award 
    },
    { 
      number: '50+', 
      label: language === 'hi' ? 'समर्थित फसलें' : 'Crops Supported',
      icon: Leaf 
    },
    { 
      number: '500+', 
      label: language === 'hi' ? 'मंडी कवरेज' : 'Mandi Coverage',
      icon: BarChart3 
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <Leaf className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-green-200 bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl font-semibold mb-4"
            >
              {t('home.subtitle')}
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-green-100"
            >
              {t('home.description')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/disease-detection"
                className="inline-flex items-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-6 h-6 mr-3" />
                {t('home.identify')}
              </Link>
              <Link
                to="/mandi-prices"
                className="inline-flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                {t('home.check_prices')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-ping"></div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Developer Profile Section */}
      <DeveloperProfile />

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'hi' 
                ? 'आधुनिक तकनीक के साथ खेती को बनाएं आसान और लाभदायक'
                : 'Making farming easier and more profitable with modern technology'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Link to={feature.link} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-green-200">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <div className={`inline-flex items-center text-white px-6 py-3 ${feature.color} ${feature.hoverColor} rounded-full font-semibold transition-all duration-300 group-hover:shadow-lg`}>
                      {language === 'hi' ? 'शुरू करें' : 'Get Started'}
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              {language === 'hi' 
                ? 'आज ही शुरू करें स्मार्ट खेती'
                : 'Start Smart Farming Today'
              }
            </h2>
            <p className="text-xl mb-8 text-green-100">
              {language === 'hi'
                ? 'हजारों किसान पहले से ही AgriGrow का उपयोग करके अपनी फसल की पैदावार बढ़ा रहे हैं'
                : 'Thousands of farmers are already using AgriGrow to improve their crop yields'
              }
            </p>
            <Link
              to="/voice-assistant"
              className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Mic className="w-6 h-6 mr-3" />
              {t('home.voice_help')}
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
