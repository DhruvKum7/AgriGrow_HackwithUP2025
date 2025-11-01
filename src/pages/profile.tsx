
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import {User, Mail, Phone, MapPin, Calendar, Leaf, Shield, Edit3, Save, Camera} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.userName || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    location: language === 'hi' ? 'दिल्ली, भारत' : 'Delhi, India',
    farmSize: '5',
    primaryCrops: language === 'hi' ? 'गेहूं, धान, मक्का' : 'Wheat, Rice, Corn',
    farmingExperience: '10',
    preferredLanguage: language
  })

  const handleSave = () => {
    // Here you would typically save to backend
    toast.success(language === 'hi' ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!')
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{user?.userName}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.userRole === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.userRole}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                {user?.email}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isEditing 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing 
                    ? (language === 'hi' ? 'रद्द करें' : 'Cancel')
                    : (language === 'hi' ? 'प्रोफाइल एडिट करें' : 'Edit Profile')
                  }
                </button>
                
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'सेव करें' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{profileData.fullName}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'ईमेल' : 'Email'}
              </label>
              <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-800">{profileData.email}</span>
                <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {language === 'hi' ? 'सत्यापित' : 'Verified'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{profileData.phone}</span>
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    {language === 'hi' ? 'सत्यापित' : 'Verified'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{profileData.location}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Farming Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            {language === 'hi' ? 'कृषि जानकारी' : 'Farming Information'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'खेत का आकार (एकड़)' : 'Farm Size (Acres)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{profileData.farmSize} {language === 'hi' ? 'एकड़' : 'acres'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'मुख्य फसलें' : 'Primary Crops'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.primaryCrops}
                  onChange={(e) => handleInputChange('primaryCrops', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <Leaf className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{profileData.primaryCrops}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'कृषि अनुभव (वर्ष)' : 'Farming Experience (Years)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.farmingExperience}
                  onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{profileData.farmingExperience} {language === 'hi' ? 'साल' : 'years'}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Account Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" />
            {language === 'hi' ? 'खाता सुरक्षा' : 'Account Security'}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">
                    {language === 'hi' ? 'ईमेल सत्यापन' : 'Email Verification'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'आपका ईमेल सत्यापित है' : 'Your email is verified'}
                  </p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">
                {language === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">
                    {language === 'hi' ? 'मोबाइल सत्यापन' : 'Mobile Verification'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' ? 'आपका मोबाइल नंबर सत्यापित है' : 'Your mobile number is verified'}
                  </p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">
                {language === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">
                  {language === 'hi' ? 'खाता बनाया गया' : 'Account Created'}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(user?.createdTime || Date.now()).toLocaleDateString(
                    language === 'hi' ? 'hi-IN' : 'en-IN',
                    { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
