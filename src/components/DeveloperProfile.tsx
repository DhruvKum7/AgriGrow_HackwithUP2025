import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Code, Github, Linkedin, Mail, Star, Zap, Coffee, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const DeveloperProfile: React.FC = () => {
  const { language } = useLanguage()
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    })
  }, [controls])

  const floatingIcons: { icon: React.ComponentType<{ className?: string }>; delay: number; color: string }[] = [
    { icon: Code, delay: 0, color: 'text-blue-500' },
    { icon: Zap, delay: 0.5, color: 'text-yellow-500' },
    { icon: Star, delay: 1, color: 'text-purple-500' },
    { icon: Coffee, delay: 1.5, color: 'text-orange-500' },
    { icon: Heart, delay: 2, color: 'text-red-500' }
  ]

  const skills: string[] = ['React.js', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'MongoDB']

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Code Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {['<', '>', '{', '}', '(', ')', '[', ']'].map((symbol, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl font-mono text-white opacity-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 8, delay: index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: `${10 + index * 12}%`, top: `${20 + index * 8}%` }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            {language === 'hi' ? 'डेवलपर से मिलें' : 'Meet the Developer'}
          </h2>
          <p className="text-xl text-gray-300">
            {language === 'hi' ? 'AgriGrow के पीछे की रचनात्मक शक्ति' : 'The Creative Force Behind AgriGrow'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Developer Image with 3D Animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Floating Icons Around Photo */}
              {floatingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  className={`absolute w-12 h-12 ${item.color} opacity-80`}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360], y: [0, -20, 0] }}
                  transition={{ duration: 4, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ left: `${20 + index * 15}%`, top: `${10 + index * 20}%` }}
                >
                  <item.icon className="w-full h-full" />
                </motion.div>
              ))}

              {/* Main Photo Container */}
              <motion.div
                animate={controls}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative mx-auto w-80 h-80"
              >
                {/* 3D Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-full p-2">
                    <motion.img
                      src="/api/placeholder/320/320"
                      alt="Developer"
                      className="w-full h-full object-cover rounded-full shadow-xl"
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                      style={{ filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1)' }}
                    />
                  </div>
                </div>

                {/* Glowing Ring Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 40px rgba(147, 51, 234, 0.5)',
                      '0 0 20px rgba(236, 72, 153, 0.5)',
                      '0 0 40px rgba(59, 130, 246, 0.5)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Orbiting Elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute -top-6 left-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -right-6 w-3 h-3 bg-purple-500 rounded-full shadow-lg"></div>
                  <div className="absolute -bottom-6 left-1/2 w-5 h-5 bg-pink-500 rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -left-6 w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Developer Information */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
              <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {language === 'hi' ? 'आपका नाम' : 'Your Name'}
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                {language === 'hi' ? 'फुल स्टैक डेवलपर & AI इंजीनियर' : 'Full Stack Developer & AI Engineer'}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              {language === 'hi'
                ? 'भारतीय कृषि को आधुनिक तकनीक से सशक्त बनाने के जुनून के साथ, मैंने AgriGrow को किसानों के लिए एक व्यापक समाधान के रूप में विकसित किया है। AI, मशीन लर्निंग और वेब टेक्नोलॉजी का उपयोग करके, यह प्लेटफॉर्म किसानों को स्मार्ट खेती की दिशा में आगे बढ़ने में मदद करता है।'
                : 'Passionate about empowering Indian agriculture with modern technology, I developed AgriGrow as a comprehensive solution for farmers. Using AI, machine learning, and web technologies, this platform helps farmers advance towards smart farming practices.'}
            </motion.p>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }} className="mb-8">
              <h4 className="text-xl font-semibold mb-4 text-blue-400">
                {language === 'hi' ? 'तकनीकी कौशल' : 'Technical Skills'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              {[
                { icon: Github, label: 'GitHub', color: 'hover:text-gray-400' },
                { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
                { icon: Mail, label: 'Email', color: 'hover:text-red-400' }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 bg-white/10 rounded-full backdrop-blur-sm transition-all duration-300 ${social.color} hover:bg-white/20`}
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: '5+', label: language === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience' },
            { number: '20+', label: language === 'hi' ? 'प्रोजेक्ट्स' : 'Projects' },
            { number: '1000+', label: language === 'hi' ? 'खुश उपयोगकर्ता' : 'Happy Users' },
            { number: '24/7', label: language === 'hi' ? 'सपोर्ट' : 'Support' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom CSS for blob animation - use <style>, not <style jsx> */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  )
}

export default DeveloperProfile