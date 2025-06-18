// AI-powered sentence suggestions and completions
// In a real app, you'd integrate with OpenAI API or similar

export interface SentenceSuggestion {
  text: string;
  mood: 'melancholy' | 'nostalgic' | 'hopeful' | 'grateful';
  category: string;
}

export interface CompletionSuggestion {
  text: string;
  style: 'poetic' | 'direct' | 'metaphorical' | 'gentle';
}

// Curated sentence starters organized by emotion and theme
const sentenceTemplates = {
  melancholy: [
    "I never got to tell you that...",
    "The last time I saw you, I...",
    "In my dreams, we still...",
    "I keep your memory alive by...",
    "The hardest part was when...",
    "I wish you knew that...",
    "Every song reminds me of...",
    "I still catch myself wanting to...",
  ],
  nostalgic: [
    "Remember when we used to...",
    "If I could go back, I would...",
    "The smell of [something] takes me to...",
    "I can still hear your voice saying...",
    "That summer when we...",
    "Your laugh still echoes in...",
    "I found an old photo of us...",
    "The way you used to...",
  ],
  hopeful: [
    "Someday I hope to...",
    "I believe that we can still...",
    "Tomorrow I want to...",
    "If I had the courage, I would...",
    "The future holds space for...",
    "I'm learning to...",
    "Maybe one day you'll...",
    "I choose to believe that...",
  ],
  grateful: [
    "Thank you for teaching me...",
    "I'm grateful that you...",
    "You showed me how to...",
    "Because of you, I now...",
    "I carry your wisdom in...",
    "The gift you gave me was...",
    "I appreciate how you...",
    "Your love taught me that...",
  ]
};

const completionStyles = {
  poetic: [
    "...like morning dew on forgotten petals.",
    "...in the space between heartbeats.",
    "...where silence speaks louder than words.",
    "...like stars scattered across my thoughts.",
    "...in the echo of what could have been.",
  ],
  direct: [
    "...and I needed you to know.",
    "...because it changed everything.",
    "...and I'm still processing that.",
    "...which is why I'm telling you now.",
    "...even though it's difficult to say.",
  ],
  metaphorical: [
    "...like trying to hold water in my hands.",
    "...as if you were the sun and I was learning to see.",
    "...like a book with pages I never got to read.",
    "...as though time was a river flowing backwards.",
    "...like building castles in the air.",
  ],
  gentle: [
    "...and that's okay now.",
    "...with all the tenderness I can muster.",
    "...knowing you would understand.",
    "...in the gentlest way possible.",
    "...with love and without expectation.",
  ]
};

// Daily themes that rotate
const dailyThemes = [
  {
    title: "Messages to Lost Connections",
    description: "Write to someone who disappeared from your life",
    prompt: "Start a sentence for someone you lost touch with...",
    examples: [
      "I hope you're happy wherever...",
      "I still wonder if you remember...",
      "That day you left, I..."
    ]
  },
  {
    title: "Letters to Your Younger Self",
    description: "Share wisdom with who you used to be",
    prompt: "What would you tell your younger self?",
    examples: [
      "Dear younger me, you don't need to...",
      "I wish I could tell you that...",
      "The thing I learned too late was..."
    ]
  },
  {
    title: "Unspoken Gratitude",
    description: "Express appreciation you never shared",
    prompt: "Thank someone you never properly thanked...",
    examples: [
      "I never thanked you for...",
      "Your kindness when I...",
      "You'll never know how much..."
    ]
  },
  {
    title: "Dreams and Hopes",
    description: "Share your deepest aspirations",
    prompt: "Express a dream you've kept secret...",
    examples: [
      "Someday I want to...",
      "My biggest dream is to...",
      "If I wasn't afraid, I would..."
    ]
  },
  {
    title: "Moments in Time",
    description: "Capture a fleeting moment you treasure",
    prompt: "Describe a moment you want to preserve forever...",
    examples: [
      "There was this moment when...",
      "I want to remember how...",
      "Time stopped when you..."
    ]
  },
  {
    title: "Forgiveness and Healing",
    description: "Release what you've been carrying",
    prompt: "Let go of something that's been weighing on you...",
    examples: [
      "I forgive myself for...",
      "I'm ready to release...",
      "It's time to let go of..."
    ]
  },
  {
    title: "Love in All Forms",
    description: "Celebrate the love in your life",
    prompt: "Express love you feel but rarely say...",
    examples: [
      "I love how you...",
      "The way you love me by...",
      "Love means to me..."
    ]
  }
];

export const getSentenceSuggestions = (mood?: string, count: number = 3): SentenceSuggestion[] => {
  const selectedMood = mood as keyof typeof sentenceTemplates || 'hopeful';
  const templates = sentenceTemplates[selectedMood] || sentenceTemplates.hopeful;
  
  // Randomly select suggestions
  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(text => ({
    text,
    mood: selectedMood,
    category: selectedMood
  }));
};

export const getCompletionSuggestions = (startText: string, count: number = 3): CompletionSuggestion[] => {
  // Simple AI-like logic to suggest completion styles based on the start
  let suggestedStyle: keyof typeof completionStyles = 'gentle';
  
  if (startText.toLowerCase().includes('dream') || startText.toLowerCase().includes('hope')) {
    suggestedStyle = 'poetic';
  } else if (startText.toLowerCase().includes('thank') || startText.toLowerCase().includes('grateful')) {
    suggestedStyle = 'gentle';
  } else if (startText.toLowerCase().includes('never') || startText.toLowerCase().includes('wish')) {
    suggestedStyle = 'metaphorical';
  } else if (startText.toLowerCase().includes('tell') || startText.toLowerCase().includes('say')) {
    suggestedStyle = 'direct';
  }
  
  const completions = completionStyles[suggestedStyle];
  const shuffled = [...completions].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, count).map(text => ({
    text,
    style: suggestedStyle
  }));
};

export const getTodaysTheme = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyThemes[dayOfYear % dailyThemes.length];
};

export const getThemeBasedSuggestions = (theme: string): SentenceSuggestion[] => {
  const todaysTheme = getTodaysTheme();
  return todaysTheme.examples.map(text => ({
    text,
    mood: 'hopeful' as const,
    category: theme
  }));
};

// Simulated AI completion (in real app, this would call OpenAI API)
export const generateAICompletion = async (startText: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple pattern matching for demo purposes
  const completionMap: { [key: string]: string[] } = {
    'never got to tell': [
      '...how much your friendship changed my life.',
      '...that you were the reason I kept going.',
      '...I think about you every single day.',
      '...you made me believe in love again.'
    ],
    'last time': [
      '...I wanted to hug you tighter.',
      '...I memorized every detail of your face.',
      '...I felt like we had forever.',
      '...I should have said goodbye properly.'
    ],
    'if I had one more': [
      '...I would listen to you breathe.',
      '...I would tell you all my secrets.',
      '...I would make you laugh until you cried.',
      '...I would hold your hand in silence.'
    ],
    'wish I had': [
      '...told you how proud I was.',
      '...been braver in that moment.',
      '...asked you to stay.',
      '...danced with you longer.'
    ]
  };
  
  // Find matching pattern
  const lowerStart = startText.toLowerCase();
  for (const [pattern, completions] of Object.entries(completionMap)) {
    if (lowerStart.includes(pattern)) {
      const randomCompletion = completions[Math.floor(Math.random() * completions.length)];
      return randomCompletion;
    }
  }
  
  // Default poetic completion
  const defaultCompletions = [
    '...and now I carry that weight like a secret.',
    '...but maybe silence was its own kind of love.',
    '...in the space between what was and what could be.',
    '...like trying to hold starlight in my palms.'
  ];
  
  return defaultCompletions[Math.floor(Math.random() * defaultCompletions.length)];
};

export const analyzeSentimentAndSuggestMood = (text: string): 'melancholy' | 'nostalgic' | 'hopeful' | 'grateful' => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('thank') || lowerText.includes('grateful') || lowerText.includes('appreciate')) {
    return 'grateful';
  } else if (lowerText.includes('hope') || lowerText.includes('dream') || lowerText.includes('future')) {
    return 'hopeful';
  } else if (lowerText.includes('remember') || lowerText.includes('used to') || lowerText.includes('back then')) {
    return 'nostalgic';
  } else {
    return 'melancholy';
  }
}; 