'use client';

import { motion } from 'framer-motion';
import { Calendar, Lightbulb, Sparkles, Copy } from 'lucide-react';
import { getTodaysTheme, getThemeBasedSuggestions } from '@/lib/ai-suggestions';
import { useState, useEffect } from 'react';

export default function DailyTheme() {
  const [theme, setTheme] = useState(getTodaysTheme());
  const [suggestions, setSuggestions] = useState(getThemeBasedSuggestions(theme.title));
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const currentTheme = getTodaysTheme();
    setTheme(currentTheme);
    setSuggestions(getThemeBasedSuggestions(currentTheme.title));
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    // In a real app, this could auto-fill the input field
    navigator.clipboard.writeText(suggestion);
    // Clear the selection after 2 seconds
    setTimeout(() => setSelectedSuggestion(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="floating-card p-10 max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          className="inline-flex items-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar className="text-[var(--accent)]" size={18} />
          <span className="text-sm text-[var(--muted)] font-light">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric'
            })}
          </span>
        </motion.div>
        
        <h3 className="text-2xl font-serif font-light text-[var(--foreground)] mb-4">
          Today&rsquo;s Theme
        </h3>
        <div className="divider max-w-xs mx-auto"></div>
      </div>

      <div className="space-y-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-3xl font-serif font-light text-[var(--accent-rose)] mb-6 italic leading-relaxed">
            {theme.title}
          </h4>
          <p className="text-[var(--muted)] text-lg leading-relaxed max-w-lg mx-auto font-light">
            {theme.description}
          </p>
        </motion.div>

        <motion.div 
          className="floating-card p-6 bg-[var(--highlight)] border border-[var(--border)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="text-[var(--accent)]" size={16} />
            <span className="text-sm font-serif text-[var(--accent)] italic">
              Writing Prompt
            </span>
          </div>
          <div className="divider max-w-24 mx-auto mb-4"></div>
          <p className="text-[var(--foreground)] font-serif italic text-center leading-relaxed">
            &ldquo;{theme.prompt}&rdquo;
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-[var(--accent-rose)]" size={16} />
            <span className="text-sm font-serif text-[var(--accent-rose)] italic">
              Suggested Starters
            </span>
            <Copy className="text-[var(--muted)]" size={12} />
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className={`w-full text-center p-4 rounded-lg transition-all duration-300 border group ${
                  selectedSuggestion === suggestion.text
                    ? 'bg-[var(--accent-rose)]/10 border-[var(--accent-rose)] text-[var(--accent-rose)]'
                    : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--highlight)] hover:border-[var(--accent)] text-[var(--foreground)]'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="font-serif italic leading-relaxed">
                  &ldquo;{suggestion.text}&rdquo;
                </span>
                {selectedSuggestion === suggestion.text && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-[var(--accent-rose)] mt-2 font-light"
                  >
                    ✓ Copied to clipboard
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="pt-6 border-t border-[var(--border)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-[var(--muted)] text-center font-light italic">
            New themes rotate daily to inspire different kinds of vulnerability and connection
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
} 