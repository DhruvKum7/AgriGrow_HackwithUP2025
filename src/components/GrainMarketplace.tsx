import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import { Plus, Search, MapPin, Phone, Star, Package, IndianRupee, Users, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

interface GrainListing {
  _id: string
  seller_id: string
  grain_type: string
  quantity: number
  price_per_kg: number
  quality_grade: string
  location: {
    state: string
    district: string
    village: string
    pincode?: string
  }
  contact_info: {
    name: string
    phone: string
    whatsapp?: string
  }
  harvest_date: string
  organic_certified: boolean
  moisture_content: number
  status: string
  images: string[]
  description: string
  created_at: string
  updated_at?: string
}

interface GrainOrder {
  _id: string
  buyer_id: string
  listing_id: string
  quantity_ordered: number
  agreed_price: number
  total_amount: number
  order_status: string
  buyer_info: {
    name: string
    phone: string
    company?: string
  }
  delivery_address: {
    state: string
    district: string
    address: string
    pincode?: string
  }
  payment_terms: string
  delivery_date: string
  notes?: string
  created_at: string
  updated_at?: string
}

const GrainMarketplace: React.FC = () => {
  const { language } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<'browse' | 'sell' | 'orders'>('browse')
  const [listings, setListings] = useState<GrainListing[]>([])
  const [orders, setOrders] = useState<GrainOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrainType, setSelectedGrainType] = useState('')
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState<string | null>(null)

  const grainTypes = [
    { value: 'wheat', label: language === 'hi' ? 'गेहूं' : 'Wheat' },
    { value: 'rice', label: language === 'hi' ? 'चावल' : 'Rice' },
    { value: 'corn', label: language === 'hi' ? 'मक्का' : 'Corn' },
    { value: 'barley', label: language === 'hi' ? 'जौ' : 'Barley' },
    { value: 'bajra', label: language === 'hi' ? 'बाजरा' : 'Bajra' },
    { value: 'jowar', label: language === 'hi' ? 'ज्वार' : 'Jowar' }
  ]

  const qualityGrades = ['A+', 'A', 'B+', 'B', 'C']
  const paymentTerms = [
    { value: 'advance', label: language === 'hi' ? 'अग्रिम भुगतान' : 'Advance Payment' },
    { value: 'on_delivery', label: language === 'hi' ? 'डिलीवरी पर भुगतान' : 'Payment on Delivery' },
    { value: '30_days', label: language === 'hi' ? '30 दिन' : '30 Days' },
    { value: '60_days', label: language === 'hi' ? '60 दिन' : '60 Days' }
  ]

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await lumi.entities.grain_listings.list({
        filter: { status: 'available' },
        sort: { created_at: -1 }
      })
      setListings(response.list || [])
    } catch (error) {
      console.error('Failed to fetch listings:', error)
      toast.error(language === 'hi' ? 'লिस्टिंग लोड नहीं हो सकीं' : 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }, [language])

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) return
    try {
      const response = await lumi.entities.grain_orders.list({
        filter: { buyer_id: user.userId },
        sort: { created_at: -1 }
      })
      setOrders(response.list || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }, [isAuthenticated, user])

  const createListing = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isAuthenticated || !user?.userId) {
      await lumi.auth.signIn()
      return
    }

    const formData = new FormData(event.currentTarget)
    const now = new Date().toISOString()

    const listingData: Omit<GrainListing, '_id'> = {
      seller_id: user.userId,
      grain_type: String(formData.get('grain_type') || ''),
      quantity: Number(formData.get('quantity') || 0),
      price_per_kg: Number(formData.get('price_per_kg') || 0),
      quality_grade: String(formData.get('quality_grade') || ''),
      location: {
        state: String(formData.get('state') || ''),
        district: String(formData.get('district') || ''),
        village: String(formData.get('village') || ''),
        pincode: String(formData.get('pincode') || '')
      },
      contact_info: {
        name: String(formData.get('contact_name') || ''),
        phone: String(formData.get('phone') || ''),
        whatsapp: String(formData.get('whatsapp') || '')
      },
      harvest_date: String(formData.get('harvest_date') || ''),
      // checkbox -> boolean
      organic_certified: !!formData.get('organic_certified'),
      moisture_content: Number(formData.get('moisture_content') || 0),
      status: 'available',
      images: [String(formData.get('image_url') || '')].filter(Boolean) as string[],
      description: String(formData.get('description') || ''),
      created_at: now,
      updated_at: now
    }

    try {
      await lumi.entities.grain_listings.create(listingData)
      toast.success(language === 'hi' ? 'लिस्टिंग बनाई गई' : 'Listing created successfully')
      setShowCreateListing(false)
      fetchListings()
    } catch (error) {
      console.error('Failed to create listing:', error)
      toast.error(language === 'hi' ? 'लिस्टिंग बनाने में त्रुटि' : 'Failed to create listing')
    }
  }

  const createOrder = async (listingId: string, event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isAuthenticated || !user?.userId) {
      await lumi.auth.signIn()
      return
    }

    const formData = new FormData(event.currentTarget)
    const listing = listings.find(l => l._id === listingId)
    if (!listing) return

    const quantityOrdered = Number(formData.get('quantity_ordered') || 0)
    const agreedPrice = Number(formData.get('agreed_price') || 0)
    const now = new Date().toISOString()

    const orderData: Omit<GrainOrder, '_id'> = {
      buyer_id: user.userId,
      listing_id: listingId,
      quantity_ordered: quantityOrdered,
      agreed_price: agreedPrice,
      total_amount: quantityOrdered * agreedPrice,
      order_status: 'pending',
      buyer_info: {
        name: String(formData.get('buyer_name') || ''),
        phone: String(formData.get('buyer_phone') || ''),
        company: String(formData.get('company') || '')
      },
      delivery_address: {
        state: String(formData.get('delivery_state') || ''),
        district: String(formData.get('delivery_district') || ''),
        address: String(formData.get('delivery_address') || ''),
        pincode: String(formData.get('delivery_pincode') || '')
      },
      payment_terms: String(formData.get('payment_terms') || ''),
      delivery_date: String(formData.get('delivery_date') || ''),
      notes: String(formData.get('notes') || ''),
      created_at: now,
      updated_at: now
    }

    try {
      await lumi.entities.grain_orders.create(orderData)
      toast.success(language === 'hi' ? 'ऑर्डर दिया गया' : 'Order placed successfully')
      setShowOrderForm(null)
      fetchOrders()
    } catch (error) {
      console.error('Failed to create order:', error)
      toast.error(language === 'hi' ? 'ऑर्डर देने में त्रुटि' : 'Failed to place order')
    }
  }

  useEffect(() => {
    fetchListings()
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [fetchListings, fetchOrders, isAuthenticated])

  const filteredListings = listings.filter(listing => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      listing.grain_type?.toLowerCase().includes(q) ||
      listing.contact_info?.name?.toLowerCase().includes(q) ||
      listing.location?.district?.toLowerCase().includes(q)

    const matchesType = !selectedGrainType || listing.grain_type === selectedGrainType
    return matchesSearch && matchesType
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <Users className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {language === 'hi' ? 'अनाज मार्केटप्लेस' : 'Grain Marketplace'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'hi' ? 'अनाज खरीदने और बेचने के लिए लॉगिन करें' : 'Login to buy and sell grains'}
          </p>
          <button onClick={() => lumi.auth.signIn()} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            {language === 'hi' ? 'लॉगिन करें' : 'Login Now'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {language === 'hi' ? 'अनाज मार्केटप्लेस' : 'Grain Marketplace'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'hi' ? 'किसानों से सीधे अनाज खरीदें और बेचें' : 'Buy and sell grains directly from farmers'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'browse' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                {language === 'hi' ? 'खोजें' : 'Browse'}
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                {language === 'hi' ? 'बेचें' : 'Sell'}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                {language === 'hi' ? 'ऑर्डर' : 'Orders'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'अनाज या स्थान खोजें...' : 'Search grains or location...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedGrainType}
                    onChange={(e) => setSelectedGrainType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{language === 'hi' ? 'सभी अनाज' : 'All Grains'}</option>
                    {grainTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={listing.images?.[0] || 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'}
                      alt={listing.grain_type}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold capitalize">
                          {grainTypes.find(g => g.value === listing.grain_type)?.label || listing.grain_type}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.quality_grade === 'A+'
                              ? 'bg-green-100 text-green-800'
                              : listing.quality_grade === 'A'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {listing.quality_grade}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="w-4 h-4 mr-2" />
                          {listing.quantity} {language === 'hi' ? 'किलो उपलब्ध' : 'kg available'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <IndianRupee className="w-4 h-4 mr-2" />
                          ₹{listing.price_per_kg} {language === 'hi' ? 'प्रति किलो' : 'per kg'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {listing.location?.district}, {listing.location?.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {listing.contact_info?.name}
                        </div>
                      </div>

                      {listing.organic_certified && (
                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-xs text-green-600 font-medium">
                            {language === 'hi' ? 'जैविक प्रमाणित' : 'Organic Certified'}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

                      <button
                        onClick={() => setShowOrderForm(listing._id)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        {language === 'hi' ? 'ऑर्डर करें' : 'Place Order'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{language === 'hi' ? 'अनाज बेचें' : 'Sell Your Grain'}</h2>
                <button
                  onClick={() => setShowCreateListing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'नई लिस्टिंग' : 'New Listing'}
                </button>
              </div>

              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {language === 'hi' ? 'अपना अनाज बेचना शुरू करें' : 'Start Selling Your Grain'}
                </h3>
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'अपने अनाज की लिस्टिंग बनाएं और सीधे खरीदारों से जुड़ें'
                    : 'Create listings for your grain and connect directly with buyers'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {language === 'hi' ? 'कोई ऑर्डर नहीं' : 'No Orders Yet'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'अनाज खरीदने के लिए Browse टैब पर जाएं' : 'Go to Browse tab to start buying grains'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">
                          {language === 'hi' ? 'ऑर्डर' : 'Order'} #{order._id.slice(-6)}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.order_status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : order.order_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.order_status === 'delivered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{language === 'hi' ? 'मात्रा:' : 'Quantity:'}</span>
                          <p className="font-medium">{order.quantity_ordered} kg</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'hi' ? 'कुल राशि:' : 'Total Amount:'}</span>
                          <p className="font-medium">₹{order.total_amount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'hi' ? 'भुगतान:' : 'Payment:'}</span>
                          <p className="font-medium">
                            {paymentTerms.find(p => p.value === order.payment_terms)?.label || order.payment_terms}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'hi' ? 'डिलीवरी:' : 'Delivery:'}</span>
                          <p className="font-medium">{new Date(order.delivery_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{language === 'hi' ? 'नई लिस्टिंग बनाएं' : 'Create New Listing'}</h2>
                <button onClick={() => setShowCreateListing(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <form onSubmit={createListing} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="grain_type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">{language === 'hi' ? 'अनाज का प्रकार चुनें' : 'Select Grain Type'}</option>
                    {grainTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <input
                    name="quantity"
                    type="number"
                    placeholder={language === 'hi' ? 'मात्रा (किलो में)' : 'Quantity (in kg)'}
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />

                  <input
                    name="price_per_kg"
                    type="number"
                    step="0.01"
                    placeholder={language === 'hi' ? 'प्रति किलो कीमत' : 'Price per kg'}
                    required
                    min={0.01}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />

                  <select name="quality_grade" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">{language === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade'}</option>
                    {qualityGrades.map(grade => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="state" placeholder={language === 'hi' ? 'राज्य' : 'State'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="district" placeholder={language === 'hi' ? 'जिला' : 'District'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="village" placeholder={language === 'hi' ? 'गांव' : 'Village'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="pincode" placeholder={language === 'hi' ? 'পिन कोड' : 'PIN Code'} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="contact_name" placeholder={language === 'hi' ? 'संपर्क व्यक्ति का नाम' : 'Contact Person Name'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="phone" placeholder={language === 'hi' ? 'फोन नंबर' : 'Phone Number'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="harvest_date" type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input
                    name="moisture_content"
                    type="number"
                    step="0.1"
                    placeholder={language === 'hi' ? 'नमी की मात्रा (%)' : 'Moisture Content (%)'}
                    min={0}
                    max={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input name="organic_certified" type="checkbox" className="mr-2" />
                  <label className="text-sm">{language === 'hi' ? 'जैविक प्रमाणित' : 'Organic Certified'}</label>
                </div>

                <textarea name="description" placeholder={language === 'hi' ? 'विवरण' : 'Description'} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                <input name="image_url" placeholder={language === 'hi' ? 'फोटो URL (वैकल्पिक)' : 'Photo URL (optional)'} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    {language === 'hi' ? 'लिस्टिंग बनाएं' : 'Create Listing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateListing(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{language === 'hi' ? 'ऑर्डर दें' : 'Place Order'}</h2>
                <button onClick={() => setShowOrderForm(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => createOrder(showOrderForm, e)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="quantity_ordered"
                    type="number"
                    placeholder={language === 'hi' ? 'मात्रा (किलो)' : 'Quantity (kg)'}
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    name="agreed_price"
                    type="number"
                    step="0.01"
                    placeholder={language === 'hi' ? 'सहमत कीमत' : 'Agreed Price'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input name="buyer_name" placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="buyer_phone" placeholder={language === 'hi' ? 'फोन नंबर' : 'Phone Number'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <input name="company" placeholder={language === 'hi' ? 'कंपनी (वैकल्पिक)' : 'Company (optional)'} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                <div className="grid grid-cols-2 gap-4">
                  <input name="delivery_state" placeholder={language === 'hi' ? 'डिलीवरी राज्य' : 'Delivery State'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input name="delivery_district" placeholder={language === 'hi' ? 'डिलीवरी जिला' : 'Delivery District'} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <textarea name="delivery_address" placeholder={language === 'hi' ? 'डिलीवरी पता' : 'Delivery Address'} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                <div className="grid grid-cols-2 gap-4">
                  <select name="payment_terms" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">{language === 'hi' ? 'भुगतान की शर्तें' : 'Payment Terms'}</option>
                    {paymentTerms.map(term => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                  <input name="delivery_date" type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <textarea name="notes" placeholder={language === 'hi' ? 'अतिरिक्त जानकारी' : 'Additional Notes'} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    {language === 'hi' ? 'ऑर्डर दें' : 'Place Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GrainMarketplace
