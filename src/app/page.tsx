'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ArrowRight } from 'lucide-react';
import SentencePair from '@/components/SentencePair';
import FloatingQuote from '@/components/FloatingQuote';
import DailyTheme from '@/components/DailyTheme';
import BuyMeCoffee from '@/components/BuyMeCoffee';
import { 
  getRandomUnfinishedSentence, 
  addUnfinishedSentence, 
  addCompletedPair,
  subscribeToCompletedPairs 
} from '@/lib/database';
import { 
  analyzeSentimentAndSuggestMood,
  getTodaysTheme 
} from '@/lib/ai-suggestions';

// Mock data for demonstration
const mockUnfinishedSentences = [
  "I never got to tell you that...",
  "The last time I saw them, I...",
  "If I had one more moment, I would...",
  "Sometimes I wonder what would happen if...",
  "The thing I regret most is...",
  "When I close my eyes, I can still...",
  "I wish I had the courage to...",
  "In my dreams, we still...",
  "I'm so tired of pretending that...",
  "What really pisses me off is...",
  "I can't shake this feeling that...",
  "Every time I see their face, I...",
  "I'm scared that people will find out...",
  "The chaos in my head sounds like...",
  "I exploded with joy when...",
  "Nobody understands that I..."
];

const mockCompletedPairs = [
  {
    start: "I never got to tell you that...",
    completion: "...I still check your name in my contacts, just to feel close to you.",
    mood: "sad"
  },
  {
    start: "If I had one more moment, I would...",
    completion: "...tell you that your laugh was the soundtrack to my happiest days.",
    mood: "nostalgic"
  },
  {
    start: "Sometimes I wonder what would happen if...",
    completion: "...we met in a different lifetime, where timing wasn't our enemy.",
    mood: "hopeful"
  },
  {
    start: "When I close my eyes, I can still...",
    completion: "...feel your hand in mine on that cold December night.",
    mood: "nostalgic"
  },
  {
    start: "The thing I'm most grateful for is...",
    completion: "...how you taught me that love doesn't always need words.",
    mood: "grateful"
  },
  {
    start: "In my dreams, we still...",
    completion: "...dance in that kitchen to no music at all.",
    mood: "sad"
  },
  {
    start: "I wish I had the courage to...",
    completion: "...tell everyone how much you changed my understanding of home.",
    mood: "hopeful"
  },
  {
    start: "I'm so tired of pretending that...",
    completion: "...everything is fine when my world is falling apart inside.",
    mood: "frustrated"
  },
  {
    start: "What really pisses me off is...",
    completion: "...how they act like they care but never actually listen.",
    mood: "angry"
  },
  {
    start: "I can't shake this feeling that...",
    completion: "...everyone is moving forward while I'm stuck in the same place.",
    mood: "anxious"
  },
  {
    start: "Every time I see their face, I...",
    completion: "...remember why I fell in love with life again.",
    mood: "joyful"
  },
  {
    start: "I feel most alive when...",
    completion: "...I'm doing something that terrifies and thrills me simultaneously.",
    mood: "joyful"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'complete' | 'browse' | 'themes'>('themes');

  // Handle tab switching from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['create', 'complete', 'browse', 'themes'].includes(tab)) {
      setActiveTab(tab as 'create' | 'complete' | 'browse' | 'themes');
    }
  }, []);
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [completedPairs, setCompletedPairs] = useState(mockCompletedPairs);
  const [currentRandomIndex, setCurrentRandomIndex] = useState(0);
  const [isLoadingNewSentence, setIsLoadingNewSentence] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [todaysTheme] = useState(getTodaysTheme());
  const [activeMoodFilter, setActiveMoodFilter] = useState<string>('all');
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);
  const [rotationInterval, setRotationInterval] = useState<NodeJS.Timeout | null>(null);

  const loadRandomSentence = useCallback(async () => {
    try {
      const sentence = await getRandomUnfinishedSentence();
      if (sentence) {
        setCurrentSentence(sentence.text);
      } else {
        // Fallback to mock data
        setCurrentSentence(mockUnfinishedSentences[currentRandomIndex]);
      }
    } catch (error) {
      console.error('Error loading sentence:', error);
      setCurrentSentence(mockUnfinishedSentences[currentRandomIndex]);
    }
  }, [currentRandomIndex]);

  useEffect(() => {
    if (activeTab === 'complete') {
      loadRandomSentence();
    }
  }, [activeTab, currentRandomIndex, loadRandomSentence]);

  // Auto-rotation effect for Complete tab
  useEffect(() => {
    if (activeTab === 'complete' && autoRotateEnabled && !userInput.trim()) {
      const interval = setInterval(() => {
        setCurrentRandomIndex((prev) => (prev + 1) % mockUnfinishedSentences.length);
      }, 8000); // Change sentence every 8 seconds
      
      setRotationInterval(interval);
      
      return () => {
        clearInterval(interval);
        setRotationInterval(null);
      };
    } else if (rotationInterval) {
      clearInterval(rotationInterval);
      setRotationInterval(null);
    }
  }, [activeTab, autoRotateEnabled, userInput, rotationInterval]);

  // Pause auto-rotation when user starts typing
  useEffect(() => {
    if (userInput.trim() && rotationInterval) {
      clearInterval(rotationInterval);
      setRotationInterval(null);
    } else if (!userInput.trim() && activeTab === 'complete' && autoRotateEnabled && !rotationInterval) {
      const interval = setInterval(() => {
        setCurrentRandomIndex((prev) => (prev + 1) % mockUnfinishedSentences.length);
      }, 8000);
      setRotationInterval(interval);
    }
  }, [userInput, activeTab, autoRotateEnabled, rotationInterval]);

  useEffect(() => {
    // Load real-time completed pairs
    const unsubscribe = subscribeToCompletedPairs((pairs) => {
      setCompletedPairs(pairs.map(pair => ({
        start: pair.startText,
        completion: pair.completionText,
        mood: pair.mood
      })));
    });

    return () => unsubscribe();
  }, []);

  const handleNewRandom = async () => {
    setIsLoadingNewSentence(true);
    setCurrentRandomIndex((prev) => (prev + 1) % mockUnfinishedSentences.length);
    setUserInput('');
    try {
      await loadRandomSentence();
    } finally {
      setIsLoadingNewSentence(false);
    }
  };

  const handleSubmitCompletion = async () => {
    if (userInput.trim()) {
      try {
        const completionText = userInput.startsWith('...') ? userInput : `...${userInput}`;
        const suggestedMood = analyzeSentimentAndSuggestMood(currentSentence + ' ' + completionText);
        
        // Save to Firebase
        await addCompletedPair(
          currentSentence,
          completionText,
          selectedMood || suggestedMood,
          todaysTheme.title
        );

        setUserInput('');
        handleNewRandom();
      } catch (error) {
        console.error('Error submitting completion:', error);
        // Fallback to local state
        const newPair = {
          start: currentSentence,
          completion: userInput.startsWith('...') ? userInput : `...${userInput}`,
          mood: selectedMood || 'hopeful'
        };
        setCompletedPairs([newPair, ...completedPairs]);
        setUserInput('');
        handleNewRandom();
      }
    }
  };

  const handleSubmitStart = async () => {
    if (userInput.trim()) {
      try {
        await addUnfinishedSentence(userInput, todaysTheme.title);
        setUserInput('');
      } catch (error) {
        console.error('Error submitting sentence start:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* Header */}
      <header className="relative">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-light text-[var(--foreground)] mb-8 tracking-tight text-balance">
              Unfinished
              <span className="block font-medium text-[var(--accent-rose)] italic">
                Sentences
              </span>
            </h1>
            <div className="divider max-w-xs mx-auto"></div>
            <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed font-light">
              Share your unfinished thoughts with strangers who help complete them.
              <br />
              <span className="italic text-[var(--accent)]">Create poetry from vulnerability.</span>
            </p>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex flex-wrap justify-center gap-1">
          {[
            { id: 'themes', label: "Today's Theme" },
            { id: 'browse', label: 'Browse' },
            { id: 'complete', label: 'Complete' },
            { id: 'create', label: 'Create' }
          ].map(({ id, label }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id as 'create' | 'complete' | 'browse' | 'themes')}
              className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 ${
                activeTab === id
                  ? 'text-[var(--accent-rose)] border-[var(--accent-rose)]'
                  : 'text-[var(--muted)] border-transparent hover:text-[var(--accent)] hover:border-[var(--highlight)]'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <DailyTheme />
            </motion.div>
          )}

          {activeTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-light text-[var(--foreground)] mb-4">
                  Recent Completions
                </h2>
                <div className="divider max-w-md mx-auto"></div>
                <p className="text-[var(--muted)] font-light italic max-w-2xl mx-auto">
                  Poetry created through shared vulnerability. Each completion represents a moment of human connection across the digital divide.
                </p>
              </div>

              {/* Mood Filter Tabs */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap gap-2 p-2 bg-[var(--highlight)] rounded-lg border border-[var(--border)] max-w-4xl">
                  {['all', 'sad', 'nostalgic', 'hopeful', 'grateful', 'frustrated', 'angry', 'anxious', 'joyful'].map((filterMood) => (
                    <motion.button
                      key={filterMood}
                      onClick={() => setActiveMoodFilter(filterMood)}
                      className={`px-3 py-1.5 text-xs capitalize transition-all duration-200 rounded-md font-medium whitespace-nowrap relative ${
                        activeMoodFilter === filterMood
                          ? 'bg-[var(--accent)] text-white shadow-md'
                          : 'hover:bg-[var(--card)] hover:text-[var(--accent)] text-[var(--muted)]'
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                      animate={activeMoodFilter === filterMood ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {filterMood}
                      {activeMoodFilter === filterMood && filterMood !== 'all' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({completedPairs.filter(pair => pair.mood === filterMood).length})
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Filter Results Info */}
              <motion.div 
                className="text-center mb-8"
                key={activeMoodFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-[var(--muted)] italic">
                  {activeMoodFilter === 'all' 
                    ? `Showing all ${completedPairs.length} completions`
                    : `${completedPairs.filter(pair => pair.mood === activeMoodFilter).length} ${activeMoodFilter} ${completedPairs.filter(pair => pair.mood === activeMoodFilter).length === 1 ? 'completion' : 'completions'}`
                  }
                </p>
              </motion.div>

              {/* Masonry-style Grid for Better Visual Flow */}
              <div className="max-w-6xl mx-auto">
                {(() => {
                  const filteredPairs = completedPairs.filter(pair => activeMoodFilter === 'all' || pair.mood === activeMoodFilter);
                  
                  if (filteredPairs.length === 0) {
                    return (
                      <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                          <p className="text-lg text-[var(--muted)] mb-4">
                            No {activeMoodFilter} completions yet
                          </p>
                          <p className="text-sm text-[var(--muted)] opacity-75 mb-6">
                            Be the first to create a {activeMoodFilter} completion by switching to the Complete tab
                          </p>
                          <motion.button
                            onClick={() => setActiveTab('complete')}
                            className="btn-secondary"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0 }}
                          >
                            Complete a Sentence
                          </motion.button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPairs.map((pair, index) => (
                        <motion.div
                          key={`${pair.mood}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="break-inside-avoid"
                        >
                          <SentencePair
                            start={pair.start}
                            completion={pair.completion}
                            mood={pair.mood}
                            index={index}
                          />
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Load More Section */}
              <div className="text-center pt-12">
                <motion.button
                  className="btn-secondary"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  Load More Stories
                </motion.button>
                <p className="text-xs text-[var(--muted)] mt-4 italic">
                  Discover more beautiful completions from our community
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-light text-[var(--foreground)] mb-4">
                  Complete a Thought
                </h2>
                <div className="divider max-w-md mx-auto"></div>
                <p className="text-[var(--muted)] font-light italic">
                  Help finish what someone else started
                </p>
              </div>

              <div className="floating-card p-8">
                <div className="space-y-6">
                  {/* Current sentence display with refresh option */}
                  <div className="relative">
                    <div className="p-6 bg-[var(--highlight)] rounded-lg border border-[var(--border)] text-center">
                      <motion.p 
                        className="text-xl font-serif text-[var(--foreground)] leading-relaxed italic mb-4"
                        key={currentSentence}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        &ldquo;{currentSentence}&rdquo;
                      </motion.p>
                      <div className="flex items-center justify-center gap-3">
                        <motion.button
                          onClick={handleNewRandom}
                          disabled={isLoadingNewSentence}
                          className="btn-secondary text-sm disabled:opacity-50"
                          whileHover={{ y: -1 }}
                          whileTap={{ y: 0 }}
                        >
                          <Shuffle size={14} className={`mr-2 ${isLoadingNewSentence ? 'animate-spin' : ''}`} />
                          {isLoadingNewSentence ? 'Loading...' : 'Try Another'}
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setAutoRotateEnabled(!autoRotateEnabled)}
                          className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                            autoRotateEnabled
                              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                              : 'bg-transparent text-[var(--muted)] border-[var(--border)] hover:bg-[var(--highlight)]'
                          }`}
                          whileHover={{ y: -1 }}
                          whileTap={{ y: 0 }}
                        >
                          {autoRotateEnabled ? '⏸️ Pause' : '▶️ Auto'}
                        </motion.button>
                      </div>
                      
                      {autoRotateEnabled && !userInput.trim() && (
                        <motion.div 
                          className="flex items-center justify-center gap-2 text-xs text-[var(--muted)]"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="w-20 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[var(--accent)] rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                              key={currentRandomIndex}
                            />
                          </div>
                          <span>Next in 8s</span>
                        </motion.div>
                      )}
                      
                      <span className="text-xs text-[var(--muted)] italic">
                        {autoRotateEnabled && !userInput.trim() ? 'Auto-changing every 8 seconds' : 'or complete this one below'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <label className="block text-lg font-serif text-[var(--foreground)] mb-2">
                        Your completion
                      </label>
                      <p className="text-sm text-[var(--muted)] italic">
                        How would you finish this thought?
                      </p>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="...type your completion here"
                        className="w-full p-6 text-lg font-serif bg-[var(--card)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none h-32 text-center leading-relaxed placeholder:text-[var(--muted)] placeholder:italic"
                        maxLength={200}
                      />
                      <div className="absolute bottom-2 right-3 text-xs text-[var(--muted)]">
                        {userInput.length}/200
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-[var(--muted)] italic">
                        Trust your instincts and authentic voice
                      </p>
                    </div>



                    {/* Mood selector */}
                    <div className="text-center">
                      <p className="text-sm text-[var(--muted)] mb-3 italic">
                        Choose the emotional tone (optional):
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['sad', 'nostalgic', 'hopeful', 'grateful', 'frustrated', 'angry', 'anxious', 'joyful'].map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                            className={`px-4 py-2 text-sm transition-colors capitalize border rounded-full ${
                              selectedMood === mood
                                ? 'bg-[var(--accent-rose)] text-[var(--card)] border-[var(--accent-rose)]'
                                : 'bg-transparent text-[var(--muted)] border-[var(--border)] hover:bg-[var(--highlight)] hover:text-[var(--accent)]'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleSubmitCompletion}
                      disabled={!userInput.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Completion
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                    <p className="text-xs text-[var(--muted)] mt-3 italic">
                      Your completion will be shared anonymously
                    </p>
                  </div>
                </div>
              </div>

              {/* Helpful tips section */}
              <motion.div 
                className="mt-8 floating-card p-6 bg-[var(--highlight)] text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-serif text-[var(--accent)] mb-4 italic">
                  Completion Tips
                </h3>
                <div className="divider max-w-xs mx-auto mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <motion.div 
                    className="text-[var(--muted)] italic"
                    whileHover={{ y: -1 }}
                  >
                    💭 Trust your first instinct - it&rsquo;s usually the most honest
                  </motion.div>
                  <motion.div 
                    className="text-[var(--muted)] italic"
                    whileHover={{ y: -1 }}
                  >
                    ❤️ Write from the heart, not the head
                  </motion.div>
                  <motion.div 
                    className="text-[var(--muted)] italic"
                    whileHover={{ y: -1 }}
                  >
                    🌱 Every human story matters and deserves completion
                  </motion.div>
                  <motion.div 
                    className="text-[var(--muted)] italic"
                    whileHover={{ y: -1 }}
                  >
                    🤝 You&rsquo;re connecting with a real person&rsquo;s vulnerability
                  </motion.div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted)] italic">
                    Every human completion creates authentic, shared poetry
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-light text-[var(--foreground)] mb-4">
                  Begin Something New
                </h2>
                <div className="divider max-w-md mx-auto"></div>
                <p className="text-[var(--muted)] font-light italic">
                  Share something you never got to say
                </p>
              </div>

              <div className="floating-card p-8">
                <div className="space-y-6">
                                      <div className="space-y-6">
                      <div className="text-center">
                        <label className="block text-lg font-serif text-[var(--foreground)] mb-2">
                          Your unfinished sentence
                        </label>
                        <p className="text-sm text-[var(--muted)] italic">
                          Begin something that asks to be completed...
                        </p>
                      </div>
                      
                      <div className="relative">
                        <textarea
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="I never got to tell you that..."
                          className="w-full p-6 text-lg font-serif bg-[var(--card)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none h-32 text-center leading-relaxed placeholder:text-[var(--muted)] placeholder:italic"
                          maxLength={150}
                        />
                        <div className="absolute bottom-2 right-3 text-xs text-[var(--muted)]">
                          {userInput.length}/150
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-[var(--muted)] italic">
                          Let your authentic voice guide you
                        </p>
                      </div>

                                          {/* Mood selector */}
                      <div className="text-center">
                        <p className="text-sm text-[var(--muted)] mb-3 italic">
                          Choose your emotional tone (optional):
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {['sad', 'nostalgic', 'hopeful', 'grateful', 'frustrated', 'angry', 'anxious', 'joyful'].map((mood) => (
                            <button
                              key={mood}
                              onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                              className={`px-4 py-2 text-sm transition-colors capitalize border rounded-full ${
                                selectedMood === mood
                                  ? 'bg-[var(--accent-rose)] text-[var(--card)] border-[var(--accent-rose)]'
                                  : 'bg-transparent text-[var(--muted)] border-[var(--border)] hover:bg-[var(--highlight)] hover:text-[var(--accent)]'
                              }`}
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>

                    
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleSubmitStart}
                      disabled={!userInput.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Share Anonymously
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>

                              {/* Inspiration section */}
                <div className="mt-12 floating-card p-6 bg-[var(--highlight)] text-center">
                  <h3 className="text-lg font-serif text-[var(--accent)] mb-4 italic">
                    Gentle Inspirations
                  </h3>
                  <div className="divider max-w-xs mx-auto mb-4"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      "I wish I had said...",
                      "The thing I miss most is...",
                      "If time could stop, I would...",
                      "In another life, we..."
                    ].map((inspiration, index) => (
                      <motion.div
                        key={index}
                        className="text-[var(--muted)] font-serif italic hover:text-[var(--accent)] transition-colors cursor-pointer"
                        whileHover={{ y: -1 }}
                        onClick={() => setUserInput(inspiration)}
                      >
                        &ldquo;{inspiration}&rdquo;
                      </motion.div>
                    ))}
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating inspirational quotes */}
      <FloatingQuote />
      
      {/* Buy me a coffee support button */}
      <BuyMeCoffee />
    </div>
  );
}
