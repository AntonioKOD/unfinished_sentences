'use client';


import { motion } from 'framer-motion';
import { Share2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { shareQuote, downloadQuoteImage } from '@/lib/social-sharing';

interface SharedQuoteClientProps {
  start: string;
  completion: string;
  mood: string;
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

export default function SharedQuoteClient({ start, completion, mood }: SharedQuoteClientProps) {
  const moodColor = getMoodColor(mood);

  const quote = {
    startText: start,
    completionText: completion,
    mood: mood
  };

  const handleShare = async () => {
    await shareQuote(quote);
  };

  const handleDownload = async () => {
    await downloadQuoteImage(quote);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Unfinished Sentences
          </Link>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleShare}
              className="p-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <Share2 size={18} />
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="p-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <Download size={18} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="floating-card p-12 text-center"
        >
          <div className="space-y-8">
            {/* Quote */}
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-serif leading-relaxed text-[var(--foreground)]">
                &ldquo;{start}&rdquo;
              </p>
              <div className="divider max-w-md mx-auto"></div>
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-[var(--foreground)] italic opacity-90">
                &ldquo;{completion}&rdquo;
              </p>
            </div>

            {/* Mood Badge */}
            <div className="flex items-center justify-center pt-8 border-t border-[var(--border)]">
              <span 
                className="capitalize font-medium px-4 py-2 rounded-full text-sm"
                style={{ 
                  color: moodColor, 
                  backgroundColor: `${moodColor}15` 
                }}
              >
                {mood}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-serif font-light text-[var(--foreground)] mb-4">
            Create Your Own
          </h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl mx-auto">
            Join our community of writers and help complete someone else&rsquo;s unfinished thought, 
            or share your own for others to finish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/?tab=complete" className="btn-primary">
              Complete a Sentence
            </Link>
            <Link href="/?tab=create" className="btn-secondary">
              Start Something New
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 