'use client';

import { motion } from 'framer-motion';
import { Share2, Download, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { shareQuote, downloadQuoteImage, shareToTwitter, shareToFacebook, shareToLinkedIn } from '@/lib/social-sharing';

interface SentencePairProps {
  start: string;
  completion: string;
  mood: string;
  index: number;
}

// Mood color mapping
const getMoodColor = (mood: string) => {
  const colors = {
    sad: '#6B7280', // gray
    nostalgic: '#8B7CF6', // purple
    hopeful: '#10B981', // emerald
    grateful: '#F59E0B', // amber
    frustrated: '#DC2626', // red
    angry: '#B91C1C', // dark red
    anxious: '#7C3AED', // violet
    joyful: '#EC4899', // pink
  };
  return colors[mood as keyof typeof colors] || 'var(--accent-rose)';
};

// Generate realistic timestamps based on mood and content
const generateTimeAgo = (index: number, mood: string, content: string) => {
  // Create a pseudo-random seed based on content and mood
  const seed = (content.length + mood.length + index) % 13;
  
  const timeOptions = [
    'just now', '2m ago', '5m ago', '11m ago', '23m ago', '37m ago', '52m ago',
    '1h ago', '2h ago', '3h ago', '5h ago', '7h ago', '11h ago', 
    '1d ago', '2d ago', '3d ago', '5d ago', '1w ago', '2w ago', '3w ago'
  ];
  
  // Newer content for positive moods, older for reflective moods
  let timeIndex;
  if (['joyful', 'hopeful'].includes(mood)) {
    timeIndex = seed % 10; // Recent times (0-9: just now to 2h ago)
  } else if (['sad', 'nostalgic'].includes(mood)) {
    timeIndex = (seed + 8) % timeOptions.length; // Older times, more spread
  } else if (['grateful'].includes(mood)) {
    timeIndex = (seed + 5) % 15; // Medium range
  } else if (['angry', 'frustrated'].includes(mood)) {
    timeIndex = seed % 8; // Recent times (fresh emotions)
  } else if (['anxious'].includes(mood)) {
    timeIndex = (seed + 2) % 12; // Recent to medium range
  } else {
    timeIndex = (seed + 3) % timeOptions.length; // Default spread
  }
  
  return timeOptions[timeIndex];
};

export default function SentencePair({ start, completion, mood, index }: SentencePairProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const moodColor = getMoodColor(mood);
  const timeAgo = generateTimeAgo(index, mood, start + completion);





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
      className="group floating-card p-6 h-fit"
    >
      <div className="space-y-4 text-center">
        <p className="text-base font-serif leading-relaxed quote-start text-[var(--foreground)]">
          &ldquo;{start}&rdquo;
        </p>
        <div className="divider max-w-20 mx-auto opacity-50"></div>
        <p className="text-sm font-serif leading-relaxed quote-completion italic text-[var(--muted)]">
          &ldquo;{completion}&rdquo;
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span 
            className="capitalize font-medium px-3 py-1 rounded-full text-xs"
            style={{ 
              color: moodColor, 
              backgroundColor: `${moodColor}15` 
            }}
          >
            {mood}
          </span>
          <span className="text-[var(--muted)] opacity-60 text-xs">
            {timeAgo}
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative">
            <motion.button
              className="p-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
              title="Share this quote"
            >
              <Share2 size={14} />
            </motion.button>

            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)] p-2 min-w-[200px] z-10"
              >
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--highlight)] rounded-md transition-colors"
                >
                  <Share2 size={16} />
                  Share Quote
                </button>
                
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--highlight)] rounded-md transition-colors"
                >
                  <Download size={16} />
                  Download Image
                </button>
                
                <div className="border-t border-[var(--border)] my-2" />
                
                <button
                  onClick={() => shareToTwitter(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--highlight)] rounded-md transition-colors"
                >
                  <Twitter size={16} />
                  Share on Twitter
                </button>
                
                <button
                  onClick={() => shareToFacebook(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--highlight)] rounded-md transition-colors"
                >
                  <Facebook size={16} />
                  Share on Facebook
                </button>
                
                <button
                  onClick={() => shareToLinkedIn(quote)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--highlight)] rounded-md transition-colors"
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