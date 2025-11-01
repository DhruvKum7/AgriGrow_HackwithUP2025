import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface MandiPrice {
  _id: string
  cropName: string
  hindiName: string
  marketName: string
  state: string
  district: string
  pricePerKg: number
  pricePerQuintal: number
  minPrice: number
  maxPrice: number
  avgPrice: number
  quality: string
  trend: 'rising' | 'falling' | 'stable'
  date: string
}

const MandiPrices: React.FC = () => {
  const { language, t } = useLanguage()
  const [prices, setPrices] = useState<MandiPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('all')

  const fetchMandiPrices = useCallback(async () => {
    try {
      setLoading(true)
      const { list } = await lumi.entities.mandi_prices.list({ sort: { date: -1 } })
      setPrices(list || [])
    } catch (error) {
      console.error('Failed to fetch mandi prices:', error)
      toast.error(language === 'hi' ? 'मंडी कीमतें लोड नहीं हो सकीं' : 'Failed to load mandi prices')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchMandiPrices()
  }, [fetchMandiPrices])

  const filteredPrices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return prices.filter((price) => {
      const matchesSearch =
        !q ||
        price.cropName.toLowerCase().includes(q) ||
        price.hindiName.toLowerCase().includes(q) ||
        price.marketName.toLowerCase().includes(q) ||
        price.district.toLowerCase().includes(q)
      const matchesState = selectedState === 'all' || price.state === selectedState
      return matchesSearch && matchesState
    })
  }, [prices, searchTerm, selectedState])

  const states = useMemo(() => {
    const uniqueStates = [...new Set(prices.map((p) => p.state))].sort()
    return uniqueStates
  }, [prices])

  const getTrendIcon = (trend: MandiPrice['trend']) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: MandiPrice['trend']) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600 bg-green-50'
      case 'falling':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-700 bg-green-100'
      case 'good':
        return 'text-blue-700 bg-blue-100'
      case 'average':
        return 'text-yellow-700 bg-yellow-100'
      case 'poor':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('prices.title')}</h1>
        <p className="text-gray-600 mb-6">
          {language === 'hi'
            ? 'भारत के प्रमुख मंडियों से वास्तविक समय की बाजार दरें'
            : 'Real-time market prices from major mandis across India'}
        </p>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('prices.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{language === 'hi' ? 'सभी राज्य' : 'All States'}</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">
              {language === 'hi' ? 'कुल प्रविष्टियाँ' : 'Total Entries'}
            </h3>
            <p className="text-2xl font-bold text-blue-900">{prices.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">
              {language === 'hi' ? 'कीमतें बढ़ रहीं' : 'Rising Prices'}
            </h3>
            <p className="text-2xl font-bold text-green-900">
              {prices.filter((p) => p.trend === 'rising').length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800">
              {language === 'hi' ? 'कीमतें घट रहीं' : 'Falling Prices'}
            </h3>
            <p className="text-2xl font-bold text-red-900">
              {prices.filter((p) => p.trend === 'falling').length}
            </p>
          </div>
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'hi' ? 'फसल' : 'Crop'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'hi' ? 'मंडी' : 'Market'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'hi' ? 'कीमत (₹/किलो)' : `Price (₹/${t('prices.per_kg')})`}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'hi' ? 'कीमत (₹/क्विंटल)' : `Price (₹/${t('prices.per_quintal')})`}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('prices.quality')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('prices.trend')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.map((price) => (
                <tr key={price._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{price.cropName}</div>
                      <div className="text-sm text-gray-500">{price.hindiName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{price.marketName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {price.district}, {price.state}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₹{price.pricePerKg.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {language === 'hi' ? 'न्यूनतम' : 'Min'}: ₹{price.minPrice} |{' '}
                      {language === 'hi' ? 'अधिकतम' : 'Max'}: ₹{price.maxPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₹{price.pricePerQuintal.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {language === 'hi' ? 'औसत' : 'Avg'}: ₹{price.avgPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getQualityColor(price.quality)}`}>
                      {price.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize ${getTrendColor(price.trend)}`}>
                      {getTrendIcon(price.trend)}
                      <span className="ml-1">{price.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'hi' ? 'आपके फ़िल्टर से कोई डेटा मेल नहीं खा रहा' : 'No prices found matching your criteria'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>
          {language === 'hi'
            ? 'कीमतें रोज़ाना विभिन्न मंडियों से अपडेट होती हैं। सबसे मौजूदा दरों के लिए कृपया अपनी स्थानीय मंडी से संपर्क करें।'
            : 'Prices are updated daily from various mandis. For the most current rates, please check with your local mandi.'}
        </p>
      </div>
    </div>
  )
}

export default MandiPrices
