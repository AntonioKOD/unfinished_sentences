'use client';

import { motion } from 'framer-motion';
import { Coffee, Heart } from 'lucide-react';

export default function BuyMeCoffee() {
  return (
    <motion.div
      className="fixed bottom-8 left-8 z-50"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 4, duration: 1 }}
    >
      <motion.a
        href="https://coff.ee/codewithtoni"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-card p-4 flex items-center gap-3 group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-[var(--card)] to-[var(--highlight)]"
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Coffee className="text-[var(--accent-rose)] group-hover:text-[var(--accent)]" size={20} />
        </motion.div>
        
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              Buy me a coffee
            </span>
            <Heart className="text-[var(--accent-rose)] fill-current" size={12} />
          </div>
          <p className="text-xs text-[var(--muted)] italic">
            Support this free app
          </p>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent-rose)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.a>
    </motion.div>
  );
} 