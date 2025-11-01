
import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import {Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye, MapPin, Calendar, AlertTriangle, Leaf, RefreshCw} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface WeatherData {
  location: string
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    visibility: number
    condition: string
    icon: string
    feelsLike: number
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
    rainfall: number
  }>
  agriculture: {
    soilMoisture: string
    plantingAdvice: string
    harvestingAdvice: string
    pestAlert: string
    irrigationAdvice: string
  }
}

const WeatherForecast: React.FC = () => {
  const { t, language } = useLanguage()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('')
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)

  // Mock weather data - Replace with real API call when Functions are enabled
  const mockWeatherData: WeatherData = {
    location: language === 'hi' ? 'दिल्ली, भारत' : 'Delhi, India',
    current: {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      condition: language === 'hi' ? 'आंशिक बादल' : 'Partly Cloudy',
      icon: 'partly-cloudy',
      feelsLike: 32
    },
    forecast: [
      {
        date: '2025-01-09',
        day: language === 'hi' ? 'आज' : 'Today',
        high: 28,
        low: 18,
        condition: language === 'hi' ? 'आंशिक बादल' : 'Partly Cloudy',
        icon: 'partly-cloudy',
        humidity: 65,
        windSpeed: 12,
        rainfall: 0
      },
      {
        date: '2025-01-10',
        day: language === 'hi' ? 'कल' : 'Tomorrow',
        high: 26,
        low: 16,
        condition: language === 'hi' ? 'बारिश की संभावना' : 'Light Rain',
        icon: 'rain',
        humidity: 78,
        windSpeed: 15,
        rainfall: 5
      },
      {
        date: '2025-01-11',
        day: language === 'hi' ? 'शुक्रवार' : 'Friday',
        high: 24,
        low: 14,
        condition: language === 'hi' ? 'बादल छाए रहेंगे' : 'Cloudy',
        icon: 'cloudy',
        humidity: 72,
        windSpeed: 10,
        rainfall: 2
      },
      {
        date: '2025-01-12',
        day: language === 'hi' ? 'शनिवार' : 'Saturday',
        high: 27,
        low: 17,
        condition: language === 'hi' ? 'धूप' : 'Sunny',
        icon: 'sunny',
        humidity: 58,
        windSpeed: 8,
        rainfall: 0
      },
      {
        date: '2025-01-13',
        day: language === 'hi' ? 'रविवार' : 'Sunday',
        high: 29,
        low: 19,
        condition: language === 'hi' ? 'साफ आसमान' : 'Clear Sky',
        icon: 'sunny',
        humidity: 52,
        windSpeed: 6,
        rainfall: 0
      },
      {
        date: '2025-01-14',
        day: language === 'hi' ? 'सोमवार' : 'Monday',
        high: 25,
        low: 15,
        condition: language === 'hi' ? 'हल्की बारिश' : 'Light Showers',
        icon: 'rain',
        humidity: 80,
        windSpeed: 18,
        rainfall: 8
      },
      {
        date: '2025-01-15',
        day: language === 'hi' ? 'मंगलवार' : 'Tuesday',
        high: 23,
        low: 13,
        condition: language === 'hi' ? 'तेज हवा' : 'Windy',
        icon: 'windy',
        humidity: 68,
        windSpeed: 22,
        rainfall: 0
      }
    ],
    agriculture: {
      soilMoisture: language === 'hi' ? 'मध्यम - सिंचाई की आवश्यकता हो सकती है' : 'Moderate - May need irrigation',
      plantingAdvice: language === 'hi' 
        ? 'रबी फसलों के लिए अच्छा समय है। गेहूं, जौ, और मटर बो सकते हैं।'
        : 'Good time for Rabi crops. You can plant wheat, barley, and peas.',
      harvestingAdvice: language === 'hi'
        ? 'सरसों और चना की कटाई का समय है। मौसम साफ रहने पर कटाई करें।'
        : 'Time to harvest mustard and chickpea. Harvest when weather is clear.',
      pestAlert: language === 'hi'
        ? 'माहू और सफेद मक्खी का खतरा। नियमित निगरानी करें।'
        : 'Risk of aphids and whiteflies. Monitor crops regularly.',
      irrigationAdvice: language === 'hi'
        ? 'हल्की सिंचाई करें। बारिश के बाद 2-3 दिन प्रतीक्षा करें।'
        : 'Light irrigation needed. Wait 2-3 days after rainfall.'
    }
  }

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-300" />
      case 'windy':
        return <Wind className="w-8 h-8 text-gray-600" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
          // Here you would call the weather API with coordinates
          // For now, using mock data
          setTimeout(() => {
            setWeatherData(mockWeatherData)
            setLoading(false)
          }, 1000)
        },
        (error) => {
          console.error('Geolocation error:', error)
          toast.error(language === 'hi' ? 'स्थान प्राप्त नहीं हो सका' : 'Could not get location')
          // Use default mock data
          setTimeout(() => {
            setWeatherData(mockWeatherData)
            setLoading(false)
          }, 1000)
        }
      )
    } else {
      toast.error(language === 'hi' ? 'जीपीएस समर्थित नहीं है' : 'Geolocation not supported')
      setTimeout(() => {
        setWeatherData(mockWeatherData)
        setLoading(false)
      }, 1000)
    }
  }

  const searchLocation = async () => {
    if (!location.trim()) return
    
    setLoading(true)
    // Here you would call the weather API with location name
    // For now, using mock data with updated location
    setTimeout(() => {
      setWeatherData({
        ...mockWeatherData,
        location: location
      })
      setLoading(false)
      toast.success(language === 'hi' ? 'मौसम डेटा अपडेट हो गया' : 'Weather data updated')
    }, 1000)
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">
            {language === 'hi' ? 'मौसम की जानकारी लोड हो रही है...' : 'Loading weather information...'}
          </p>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">
            {language === 'hi' ? 'मौसम डेटा लोड नहीं हो सका' : 'Could not load weather data'}
          </p>
          <button
            onClick={getCurrentLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {language === 'hi' ? 'फिर कोशिश करें' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Forecast'}
          </h1>
          <p className="text-xl text-blue-100">
            {language === 'hi' 
              ? 'किसानों के लिए विस्तृत मौसम जानकारी और कृषि सलाह'
              : 'Detailed weather information and agricultural advice for farmers'
            }
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={language === 'hi' ? 'शहर या जिला नाम डालें...' : 'Enter city or district name...'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                />
              </div>
            </div>
            <button
              onClick={searchLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              {language === 'hi' ? 'खोजें' : 'Search'}
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {language === 'hi' ? 'मेरी जगह' : 'My Location'}
            </button>
          </div>
        </motion.div>

        {/* Current Weather */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                {weatherData.location}
              </h2>
              <p className="text-gray-600">
                {language === 'hi' ? 'वर्तमान मौसम' : 'Current Weather'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {weatherData.current.temperature}°C
              </div>
              <p className="text-gray-600">
                {language === 'hi' ? 'महसूस होता है' : 'Feels like'} {weatherData.current.feelsLike}°C
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {getWeatherIcon(weatherData.current.icon)}
              <span className="ml-3 text-xl text-gray-700">
                {weatherData.current.condition}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{weatherData.current.humidity}%</p>
              <p className="text-gray-600">{language === 'hi' ? 'नमी' : 'Humidity'}</p>
            </div>
            <div className="text-center">
              <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{weatherData.current.windSpeed} km/h</p>
              <p className="text-gray-600">{language === 'hi' ? 'हवा की गति' : 'Wind Speed'}</p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{weatherData.current.visibility} km</p>
              <p className="text-gray-600">{language === 'hi' ? 'दृश्यता' : 'Visibility'}</p>
            </div>
            <div className="text-center">
              <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {Math.round((weatherData.current.temperature * 9/5) + 32)}°F
              </p>
              <p className="text-gray-600">{language === 'hi' ? 'फारेनहाइट में' : 'Fahrenheit'}</p>
            </div>
          </div>
        </motion.div>

        {/* 7-Day Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            {language === 'hi' ? '7 दिन का पूर्वानुमान' : '7-Day Forecast'}
          </h3>

          <div className="grid gap-4">
            {weatherData.forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <div className="w-16 text-center">
                    <p className="font-semibold text-gray-800">{day.day}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="flex items-center ml-6">
                    {getWeatherIcon(day.icon)}
                    <span className="ml-3 text-gray-700">{day.condition}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="text-center">
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <p>{day.humidity}%</p>
                  </div>
                  <div className="text-center">
                    <Wind className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                    <p>{day.windSpeed}km/h</p>
                  </div>
                  <div className="text-center">
                    <CloudRain className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <p>{day.rainfall}mm</p>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <p className="text-xl font-bold text-gray-800">{day.high}°</p>
                  <p className="text-gray-600">{day.low}°</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Agricultural Advisory */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Leaf className="w-6 h-6 mr-2" />
            {language === 'hi' ? 'कृषि सलाह' : 'Agricultural Advisory'}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Droplets className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'मिट्टी की नमी' : 'Soil Moisture'}
              </h4>
              <p className="text-green-100">{weatherData.agriculture.soilMoisture}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'बुआई सलाह' : 'Planting Advice'}
              </h4>
              <p className="text-green-100">{weatherData.agriculture.plantingAdvice}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'कटाई सलाह' : 'Harvesting Advice'}
              </h4>
              <p className="text-green-100">{weatherData.agriculture.harvestingAdvice}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'कीट चेतावनी' : 'Pest Alert'}
              </h4>
              <p className="text-green-100">{weatherData.agriculture.pestAlert}</p>
            </div>
          </div>

          <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-6">
            <h4 className="font-semibold mb-3 flex items-center">
              <Droplets className="w-5 h-5 mr-2" />
              {language === 'hi' ? 'सिंचाई सलाह' : 'Irrigation Advice'}
            </h4>
            <p className="text-green-100">{weatherData.agriculture.irrigationAdvice}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WeatherForecast
