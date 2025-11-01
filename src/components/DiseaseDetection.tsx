
import React, { useState, useRef } from 'react'
import {Upload, Camera, Loader, AlertTriangle, CheckCircle, Info} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

interface DetectionResult {
  diseaseName: string
  confidence: number
  symptoms: string[]
  treatment: string
  prevention: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const DiseaseDetection: React.FC = () => {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock AI analysis - In real app, this would call your Flask API
  const mockDiseaseAnalysis = (): DetectionResult => {
    const diseases = [
      {
        diseaseName: 'Late Blight',
        confidence: 87.5,
        symptoms: ['Dark water-soaked spots', 'Brown patches on leaves', 'White fuzzy growth'],
        treatment: 'Apply copper-based fungicide immediately. Remove affected leaves and improve air circulation around plants.',
        prevention: 'Ensure proper plant spacing, avoid overhead watering, use resistant varieties, and maintain good garden hygiene.',
        severity: 'high' as const
      },
      {
        diseaseName: 'Leaf Rust',
        confidence: 92.3,
        symptoms: ['Orange pustules on leaf surface', 'Yellowing of leaves', 'Premature leaf drop'],
        treatment: 'Apply propiconazole or tebuconazole fungicide. Monitor weather conditions and reapply as needed.',
        prevention: 'Use resistant crop varieties, practice crop rotation, ensure timely sowing, and maintain field sanitation.',
        severity: 'medium' as const
      },
      {
        diseaseName: 'Powdery Mildew',
        confidence: 78.9,
        symptoms: ['White powdery coating', 'Leaf curling', 'Stunted growth'],
        treatment: 'Spray with sulfur-based fungicide or neem oil. Improve air circulation and reduce humidity.',
        prevention: 'Avoid overcrowding plants, water at soil level, and maintain proper plant nutrition.',
        severity: 'low' as const
      }
    ]
    
    return diseases[Math.floor(Math.random() * diseases.length)]
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const analysisResult = mockDiseaseAnalysis()
      setResult(analysisResult)
      setIsAnalyzing(false)
      toast.success('Analysis completed!')
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle size={16} />
      case 'medium': return <Info size={16} />
      case 'high': 
      case 'critical': return <AlertTriangle size={16} />
      default: return <Info size={16} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('disease.title')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a clear image of crop leaves to identify diseases and get treatment recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Uploaded crop"
                  className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-md"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {t('disease.upload')}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PNG, JPG up to 5MB
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {selectedImage && (
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  {t('disease.analyzing')}
                </>
              ) : (
                'Analyze Image'
              )}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Loader className="w-6 h-6 mr-3 animate-spin text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  {t('disease.analyzing')}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-200 h-2 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-700">
                  Processing image with AI model...
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t('disease.result')}
                </h3>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-red-600">
                    {result.diseaseName}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getSeverityColor(result.severity)}`}>
                    {getSeverityIcon(result.severity)}
                    <span className="ml-1 capitalize">{result.severity}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {t('disease.confidence')}: {result.confidence.toFixed(1)}%
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Symptoms Detected:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">{t('disease.treatment')}:</h5>
                  <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
                    {result.treatment}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">{t('disease.prevention')}:</h5>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                    {result.prevention}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is an AI-based analysis. For critical cases, 
                  please consult with agricultural experts or extension officers.
                </p>
              </div>
            </div>
          )}

          {!result && !isAnalyzing && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Upload an image to see AI analysis results here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiseaseDetection
