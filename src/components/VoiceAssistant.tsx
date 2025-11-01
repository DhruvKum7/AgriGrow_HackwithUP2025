
import React, { useEffect, useState, useCallback } from 'react'
import {Mic, MicOff, Volume2, VolumeX} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useTextToSpeech from '../hooks/useTextToSpeech'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

const VoiceAssistant: React.FC = () => {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const [lastCommand, setLastCommand] = useState('')

  const speechLang = language === 'hi' ? 'hi-IN' : 'en-US'
  const { isListening, transcript, startListening, stopListening, isSupported, error } = 
    useSpeechRecognition(speechLang)
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech(speechLang)

  const processVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase()
    
    // Hindi commands
    if (language === 'hi') {
      if (lowerCommand.includes('मंडी भाव') || lowerCommand.includes('भाव देखें') || lowerCommand.includes('कीमत')) {
        navigate('/prices')
        speak('मंडी भाव दिखा रहे हैं')
        return
      }
      
      if (lowerCommand.includes('रोग') || lowerCommand.includes('बीमारी') || lowerCommand.includes('पहचान')) {
        navigate('/disease-detection')
        speak('फसल रोग पहचान खोल रहे हैं')
        return
      }
      
      if (lowerCommand.includes('होम') || lowerCommand.includes('घर') || lowerCommand.includes('मुख्य')) {
        navigate('/')
        speak('होम पेज खोल रहे हैं')
        return
      }
      
      speak('मुझे समझ नहीं आया। कृपया फिर कोशिश करें।')
    } 
    // English commands
    else {
      if (lowerCommand.includes('mandi') || lowerCommand.includes('price') || lowerCommand.includes('market')) {
        navigate('/prices')
        speak('Opening mandi prices')
        return
      }
      
      if (lowerCommand.includes('disease') || lowerCommand.includes('identify') || lowerCommand.includes('detect')) {
        navigate('/disease-detection')
        speak('Opening disease detection')
        return
      }
      
      if (lowerCommand.includes('home') || lowerCommand.includes('main')) {
        navigate('/')
        speak('Opening home page')
        return
      }
      
      speak('I did not understand that command. Please try again.')
    }
  }, [language, navigate, speak])

  useEffect(() => {
    if (transcript && transcript !== lastCommand && !isListening) {
      setLastCommand(transcript)
      processVoiceCommand(transcript)
    }
  }, [transcript, isListening, lastCommand, processVoiceCommand])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">{t('voice.not_supported')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('voice.title')}</h2>
        <p className="text-gray-600">
          {language === 'hi' 
            ? 'कमांड बोलें: "मंडी भाव देखें" या "रोग पहचान करें"'
            : 'Say commands like "check mandi prices" or "identify disease"'
          }
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-green-500 hover:bg-green-600'
            } text-white shadow-lg`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          {isListening && (
            <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isListening ? t('voice.listening') : (isListening ? t('voice.stop') : t('voice.start'))}
          </p>
          
          {transcript && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-800">"{transcript}"</p>
            </div>
          )}
        </div>

        {isSpeaking && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Volume2 size={16} className="animate-pulse" />
            <span className="text-sm">Speaking...</span>
            <button
              onClick={stopSpeaking}
              className="text-red-500 hover:text-red-600"
            >
              <VolumeX size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          {language === 'hi' 
            ? 'उदाहरण: "मंडी भाव देखें", "रोग पहचान करें", "होम जाएं"'
            : 'Examples: "check mandi prices", "identify disease", "go home"'
          }
        </p>
      </div>
    </div>
  )
}

export default VoiceAssistant
