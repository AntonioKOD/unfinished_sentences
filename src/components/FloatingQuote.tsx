'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Quote, Heart } from 'lucide-react';

const inspiringQuotes = [
  "The most beautiful words are those we never finished saying.",
  "Every unfinished sentence holds a universe of possibility.",
  "Vulnerability is the birthplace of connection.",
  "Sometimes strangers understand our hearts better than we do.",
  "In incompleteness, we find our shared humanity.",
  "The poetry of the unsaid speaks louder than words.",
  "What we leave unfinished often finishes us.",
  "Every ellipsis is an invitation to connect.",
  "Words left hanging in the air find their wings in other voices.",
  "The silence between sentences holds infinite stories."
];

export default function FloatingQuote() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % inspiringQuotes.length);
        setIsVisible(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800); // Wait for fade-in to complete
      }, 800);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Only animate when visible and not transitioning
  const shouldAnimate = isVisible && !isTransitioning;

  return (
    <motion.div
      className="fixed bottom-8 right-8 max-w-sm z-50 pointer-events-none"
      initial={{ opacity: 0, x: 100, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 3, duration: 1, ease: "easeOut" }}
    >
      <motion.div
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
          y: isVisible ? 0 : 10
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="floating-card p-6 max-w-xs relative group bg-gradient-to-br from-[var(--card)] to-[var(--highlight)]"
      >
        {/* Decorative quote icon */}
        <motion.div
          className="absolute top-3 left-3"
          animate={shouldAnimate ? { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          } : {
            rotate: 0,
            scale: 1
          }}
          transition={{ 
            duration: 4,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <Quote className="text-[var(--accent)] opacity-40" size={16} />
        </motion.div>

        {/* Heart decoration */}
        <motion.div
          className="absolute top-3 right-3"
          animate={shouldAnimate ? { 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {
            scale: 1,
            opacity: 0.3
          }}
          transition={{ 
            duration: 3,
            repeat: shouldAnimate ? Infinity : 0,
            delay: shouldAnimate ? 1 : 0
          }}
        >
          <Heart className="text-[var(--accent-rose)] fill-current" size={12} />
        </motion.div>

        <motion.p 
          className="text-sm text-[var(--muted)] leading-relaxed font-serif italic text-center mt-4 mb-4"
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {inspiringQuotes[currentQuote]}
        </motion.p>
        
        <motion.div 
          className="divider max-w-16 mx-auto"
          animate={shouldAnimate ? { 
            scaleX: [0.5, 1, 0.8, 1],
            opacity: [0.3, 0.7, 0.5, 0.7]
          } : {
            scaleX: 0.7,
            opacity: 0.5
          }}
          transition={{ 
            duration: 2,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Subtle floating animation */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={shouldAnimate ? { 
            y: [0, -2, 0, -1, 0],
          } : {
            y: 0
          }}
          transition={{ 
            duration: 6,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Gentle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent-rose)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="flex justify-center mt-3 space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldAnimate ? 0.4 : 0.2 }}
        transition={{ delay: 4 }}
      >
        {inspiringQuotes.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 h-1 rounded-full transition-colors duration-500 ${
              index === currentQuote ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
            }`}
            animate={{ 
              scale: index === currentQuote ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
} 