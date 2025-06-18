'use client';

import { motion } from 'framer-motion';
import { Heart, Share2, Bookmark, Download, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { shareQuote, downloadQuoteImage, shareToTwitter, shareToFacebook, shareToLinkedIn } from '@/lib/social-sharing';

interface SentencePairProps {
  start: string;
  completion: string;
  mood: string;
  index: number;
}

export default function SentencePair({ start, completion, mood, index }: SentencePairProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const moodColors = {
    melancholy: 'from-gray-500 to-blue-600',
    nostalgic: 'from-amber-500 to-orange-600',
    hopeful: 'from-green-500 to-blue-600',
    grateful: 'from-pink-500 to-purple-600'
  };

  const moodGradient = moodColors[mood as keyof typeof moodColors] || 'from-purple-500 to-blue-600';

  const quote = {
    startText: start,
    completionText: completion,
    mood
  };

  const handleShare = async () => {
    await shareQuote(quote);
  };

  const handleDownload = async () => {
    await downloadQuoteImage(quote);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group floating-card p-8 max-w-2xl mx-auto"
    >
      <div className="space-y-6 text-center">
        <p className="text-xl font-serif leading-relaxed quote-start">
          "{start}"
        </p>
        <div className="divider max-w-md mx-auto"></div>
        <p className="text-lg font-serif leading-relaxed quote-completion italic">
          "{completion}"
        </p>
      </div>
      
      <div className="mt-8 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-[var(--muted)] capitalize font-medium">
            {mood}
          </span>
          <span className="text-[var(--muted)] opacity-60">
            2h ago
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 text-sm transition-colors ${
              isLiked 
                ? 'text-[var(--accent-rose)]' 
                : 'text-[var(--muted)] hover:text-[var(--accent-rose)]'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          
          <motion.button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 text-sm transition-colors ${
              isBookmarked 
                ? 'text-[var(--accent)]' 
                : 'text-[var(--muted)] hover:text-[var(--accent)]'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
          </motion.button>

          <div className="relative">
            <motion.button
              className="p-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 size={14} />
            </motion.button>

            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-10"
              >
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Share2 size={16} />
                  Share Quote
                </button>
                
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Download size={16} />
                  Download Image
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-600 my-2" />
                
                <button
                  onClick={() => shareToTwitter(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Twitter size={16} />
                  Share on Twitter
                </button>
                
                <button
                  onClick={() => shareToFacebook(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Facebook size={16} />
                  Share on Facebook
                </button>
                
                <button
                  onClick={() => shareToLinkedIn(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Linkedin size={16} />
                  Share on LinkedIn
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 