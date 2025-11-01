import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useTextToSpeech from '../hooks/useTextToSpeech'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Bot,
  User,
  Stethoscope,
  Leaf,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Treatment {
  treatment_name: string
  dosage: string
  application_method: string
  frequency: string
  precautions: string
}

interface MedicalConsultation {
  _id: string
  user_id: string
  query_text: string
  query_language: string
  consultation_type: string
  crop_type?: string
  disease_identified?: string
  ai_response: string
  recommended_treatments: Treatment[]
  voice_query: boolean
  voice_response_generated: boolean
  confidence_score: number
  follow_up_needed: boolean
  created_at: string
  updated_at?: string
}

const MedicalChatbot: React.FC = () => {
  const { language } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const speechLang = language === 'hi' ? 'hi-IN' : 'en-US'
  const { isListening, transcript, startListening, stopListening, isSupported } =
    useSpeechRecognition(speechLang)
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech(speechLang)

  // Simple demo knowledge base (extend/replace with real model/backend)
  const medicalKnowledge = {
    hi: {
      diseases: {
        'पत्ती का जंग': {
          treatments: ['प्रोपिकोनाज़ोल 25% EC', 'टेबुकोनाज़ोल 10% + सल्फर 65% WG'],
          symptoms: 'पत्तियों पर भूरे धब्बे, पीलापन',
          prevention: 'बीज उपचार, उचित दूरी, संतुलित उर्वरक'
        },
        'तना गलन': {
          treatments: ['कार्बेन्डाजिम 50% WP', 'थायोफैनेट मिथाइल 70% WP'],
          symptoms: 'तने का काला होना, पौधे का मुरझाना',
          prevention: 'जल निकासी, बीज उपचार'
        },
        'पत्ती धब्बा': {
          treatments: ['मैंकोज़ेब 75% WP', 'कॉपर ऑक्सीक्लोराइड 50% WP'],
          symptoms: 'पत्तियों पर गोल धब्बे',
          prevention: 'फसल चक्र, स्वच्छता'
        }
      },
      crops: {
        'गेहूं': ['पत्ती का जंग', 'तना गलन', 'पाउडरी मिल्ड्यू'],
        'चावल': ['पत्ती धब्बा', 'बैक्टीरियल ब्लाइट', 'शीथ ब्लाइट'],
        'मक्का': ['पत्ती धब्बा', 'तना बोरर', 'कॉब रॉट']
      }
    },
    en: {
      diseases: {
        'leaf rust': {
          treatments: ['Propiconazole 25% EC', 'Tebuconazole 10% + Sulfur 65% WG'],
          symptoms: 'Brown spots on leaves, yellowing',
          prevention: 'Seed treatment, proper spacing, balanced fertilizer'
        },
        'stem rot': {
          treatments: ['Carbendazim 50% WP', 'Thiophanate Methyl 70% WP'],
          symptoms: 'Stem blackening, plant wilting',
          prevention: 'Drainage, seed treatment'
        },
        'leaf spot': {
          treatments: ['Mancozeb 75% WP', 'Copper Oxychloride 50% WP'],
          symptoms: 'Round spots on leaves',
          prevention: 'Crop rotation, sanitation'
        }
      },
      crops: {
        wheat: ['leaf rust', 'stem rot', 'powdery mildew'],
        rice: ['leaf spot', 'bacterial blight', 'sheath blight'],
        corn: ['leaf spot', 'stem borer', 'cob rot']
      }
    }
  } as const

  const fetchConsultations = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) return
    try {
      const response = await lumi.entities.medical_consultations.list({
        filter: { user_id: user.userId },
        sort: { created_at: -1 }
      })
      setConsultations(response.list || [])
    } catch (error) {
      console.error('Failed to fetch consultations:', error)
    }
  }, [isAuthenticated, user])

  // Lightweight rule-based analyzer (replace with backend/LLM)
  const analyzeQuery = (query: string, langCode: string): Partial<MedicalConsultation> => {
    const langKey = langCode === 'hi' ? 'hi' : 'en'
    const knowledge = medicalKnowledge[langKey]
    const lower = query.toLowerCase()

    let detectedDisease = ''
    let detectedCrop = ''
    const treatments: Treatment[] = []
    let confidence = 0.4

    // detect crop
    Object.keys(knowledge.crops).forEach((crop) => {
      if (lower.includes(crop.toLowerCase())) {
        detectedCrop = crop
        confidence += 0.25
      }
    })

    // detect disease via symptom keywords
    Object.entries(knowledge.diseases).forEach(([disease, info]) => {
      const symptoms = info.symptoms.toLowerCase().split(',').map((s) => s.trim())
      if (symptoms.some((s) => lower.includes(s))) {
        detectedDisease = disease
        info.treatments.forEach((tr) =>
          treatments.push({
            treatment_name: tr,
            dosage: langKey === 'hi' ? '1–2 मिली/लीटर' : '1–2 ml per liter',
            application_method: langKey === 'hi' ? 'फोलियर स्प्रे' : 'Foliar spray',
            frequency: langKey === 'hi' ? 'हर 15 दिन' : 'Every 15 days',
            precautions: langKey === 'hi' ? 'सुरक्षा उपकरण पहनें' : 'Wear protective equipment'
          })
        )
        confidence += 0.35
      }
    })

    let response: string
    if (langKey === 'hi') {
      if (detectedCrop && detectedDisease) {
        response = `आपकी ${detectedCrop} की फसल में "${detectedDisease}" की समस्या संभावित है। सुझाए गए उपचार अपनाएँ और सुरक्षा उपायों का पालन करें।`
      } else {
        response = 'कुछ और विवरण दें (फसल, लक्षण, पत्तियों/तनों का रंग, नमी) ताकि सही सलाह दी जा सके।'
      }
    } else {
      if (detectedCrop && detectedDisease) {
        response = `Your ${detectedCrop} crop may have "${detectedDisease}". Please follow the suggested treatments and safety measures.`
      } else {
        response = 'Please share more details (crop, symptoms, leaf/stem color, moisture) for a precise recommendation.'
      }
    }

    return {
      crop_type: detectedCrop || undefined,
      disease_identified: detectedDisease || undefined,
      ai_response: response,
      recommended_treatments: treatments,
      confidence_score: Math.min(confidence, 1),
      follow_up_needed: confidence < 0.7
    }
  }

  const submitQuery = async (queryText: string, isVoiceQuery = false) => {
    const text = queryText.trim()
    if (!text || !isAuthenticated || !user?.userId) return

    setIsProcessing(true)
    try {
      // simulate processing
      await new Promise((r) => setTimeout(r, 1200))

      const analysis = analyzeQuery(text, language)
      const now = new Date().toISOString()

      const consultationData: Omit<MedicalConsultation, '_id'> = {
        user_id: user.userId,
        query_text: text,
        query_language: language,
        consultation_type: 'disease_treatment',
        voice_query: isVoiceQuery,
        voice_response_generated: false,
        created_at: now,
        updated_at: now,
        ai_response: analysis.ai_response || (language === 'hi' ? 'सलाह उपलब्ध नहीं' : 'No advice available'),
        recommended_treatments: analysis.recommended_treatments || [],
        confidence_score: analysis.confidence_score ?? 0.4,
        follow_up_needed: analysis.follow_up_needed ?? true,
        crop_type: analysis.crop_type,
        disease_identified: analysis.disease_identified
      }

      const created = await lumi.entities.medical_consultations.create(consultationData)
      setConsultations((prev) => [created, ...prev])

      if (isVoiceQuery && consultationData.ai_response) {
        speak(consultationData.ai_response)
        await lumi.entities.medical_consultations.update(created._id, { voice_response_generated: true })
      }

      setCurrentQuery('')
      toast.success(language === 'hi' ? 'सलाह प्राप्त हुई' : 'Medical advice received')
    } catch (err) {
      console.error('Failed to process query:', err)
      toast.error(language === 'hi' ? 'त्रुटि हुई' : 'Error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = useCallback(() => {
    if (!isSupported) return
    if (isListening) {
      stopListening()
      if (transcript?.trim()) {
        setCurrentQuery(transcript)
        submitQuery(transcript, true)
      }
    } else {
      startListening()
    }
  }, [isSupported, isListening, transcript, startListening, stopListening])

  useEffect(() => {
    if (isAuthenticated) fetchConsultations()
  }, [fetchConsultations, isAuthenticated])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [consultations])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <Stethoscope className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {language === 'hi' ? 'कृषि चिकित्सक' : 'Agricultural Doctor'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'hi' ? 'फसल रोग सलाह के लिए लॉगिन करें' : 'Login to get AI advice for crop diseases'}
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{language === 'hi' ? 'कृषि चिकित्सक AI' : 'Agricultural Doctor AI'}</h1>
                <p className="text-gray-600">{language === 'hi' ? 'फसल के रोगों के लिए तुरंत सलाह' : 'Get instant advice for crop diseases'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory((s) => !s)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Clock className="w-4 h-4 inline mr-2" />
              {language === 'hi' ? 'इतिहास' : 'History'}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm min-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {consultations.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {language === 'hi' ? 'कृषि चिकित्सक से बात करें' : 'Chat with Agricultural Doctor'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'hi' ? 'अपनी फसल की समस्या बताएं' : 'Describe your crop problem'}
                </p>
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p className="font-medium mb-2">{language === 'hi' ? 'उदाहरण प्रश्न:' : 'Example questions:'}</p>
                  <ul className="space-y-1 text-left">
                    <li>• {language === 'hi' ? 'गेहूं की पत्तियों पर भूरे धब्बे' : 'Brown spots on wheat leaves'}</li>
                    <li>• {language === 'hi' ? 'चावल के पौधे पीले हो रहे हैं' : 'Rice plants turning yellow'}</li>
                    <li>• {language === 'hi' ? 'मक्के के तनों में कीड़े' : 'Insects in corn stems'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {consultations.map((c) => (
                  <div key={c._id}>
                    {/* User bubble */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-gray-800">{c.query_text}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(c.created_at).toLocaleString()}
                            {c.voice_query && (
                              <>
                                <Mic className="w-3 h-3 ml-2 mr-1" />
                                {language === 'hi' ? 'आवाज़' : 'Voice'}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bot bubble */}
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Bot className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Leaf className="w-4 h-4 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">
                              {language === 'hi' ? 'कृषि चिकित्सक' : 'Agricultural Doctor'}
                            </span>
                            <div className="flex items-center ml-auto">
                              {c.confidence_score >= 0.8 ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : c.confidence_score >= 0.6 ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs text-gray-500 ml-1">{Math.round(c.confidence_score * 100)}%</span>
                            </div>
                          </div>

                          <p className="text-gray-800 mb-3">{c.ai_response}</p>

                          {c.disease_identified && (
                            <div className="bg-white rounded-lg p-3 mb-3">
                              <h4 className="font-medium text-gray-800 mb-2">
                                {language === 'hi' ? 'पहचाना गया रोग:' : 'Identified Disease:'}
                              </h4>
                              <p className="text-gray-700">{c.disease_identified}</p>
                            </div>
                          )}

                          {c.recommended_treatments?.length > 0 && (
                            <div className="bg-white rounded-lg p-3">
                              <h4 className="font-medium text-gray-800 mb-3">
                                {language === 'hi' ? 'सुझाए गए उपचार:' : 'Recommended Treatments:'}
                              </h4>
                              {c.recommended_treatments.map((t, idx) => (
                                <div key={idx} className="border-l-4 border-green-500 pl-3 mb-3 last:mb-0">
                                  <h5 className="font-medium text-green-800">{t.treatment_name}</h5>
                                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                                    <p>
                                      <strong>{language === 'hi' ? 'मात्रा:' : 'Dosage:'}</strong> {t.dosage}
                                    </p>
                                    <p>
                                      <strong>{language === 'hi' ? 'विधि:' : 'Method:'}</strong> {t.application_method}
                                    </p>
                                    <p>
                                      <strong>{language === 'hi' ? 'आवृत्ति:' : 'Frequency:'}</strong> {t.frequency}
                                    </p>
                                    <p>
                                      <strong>{language === 'hi' ? 'सावधानी:' : 'Precautions:'}</strong> {t.precautions}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {c.follow_up_needed && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                              <div className="flex items-center">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                <span className="text-yellow-800 text-sm font-medium">
                                  {language === 'hi' ? 'फॉलो-अप की सलाह दी जाती है' : 'Follow-up recommended'}
                                </span>
                              </div>
                            </div>
                          )}

                          {c.voice_response_generated && (
                            <div className="flex items-center mt-3 text-xs text-gray-500">
                              <Volume2 className="w-3 h-3 mr-1" />
                              {language === 'hi' ? 'आवाज़ में उत्तर दिया गया' : 'Voice response provided'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    placeholder={language === 'hi' ? 'अपनी फसल की समस्या लिखें...' : 'Describe your crop problem...'}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isProcessing) submitQuery(currentQuery)
                    }}
                    disabled={isProcessing}
                    aria-label={language === 'hi' ? 'प्रश्न इनपुट' : 'Question input'}
                  />
                  {isProcessing && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {isSupported && (
                <button
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg transition-colors ${
                    isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                  } disabled:opacity-50`}
                  aria-label={isListening ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'रिकॉर्ड' : 'Record')}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  aria-label={language === 'hi' ? 'आवाज़ रोकें' : 'Stop speaking'}
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => submitQuery(currentQuery)}
                disabled={!currentQuery.trim() || isProcessing}
                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                aria-label={language === 'hi' ? 'भेजें' : 'Send'}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {isListening && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  {language === 'hi' ? 'सुन रहा है...' : 'Listening...'}
                </div>
                {transcript && <p className="mt-2 text-gray-600 text-sm">"{transcript}"</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalChatbot
