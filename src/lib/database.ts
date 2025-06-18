import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where, 
  serverTimestamp,
  updateDoc,
  increment,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface UnfinishedSentence {
  id?: string;
  text: string;
  createdAt: Timestamp;
  isCompleted: boolean;
  theme?: string;
  mood?: string;
}

export interface CompletedPair {
  id?: string;
  startText: string;
  completionText: string;
  mood: string;
  theme?: string;
  createdAt: Timestamp;
  likes: number;
  shares: number;
}

export interface DailyTheme {
  id?: string;
  title: string;
  description: string;
  prompt: string;
  date: string;
  isActive: boolean;
}

// Collection references
const unfinishedSentencesRef = collection(db, 'unfinished-sentences');
const completedPairsRef = collection(db, 'completed-pairs');
const dailyThemesRef = collection(db, 'daily-themes');

// Unfinished Sentences Operations
export const addUnfinishedSentence = async (text: string, theme?: string): Promise<string> => {
  try {
    const docRef = await addDoc(unfinishedSentencesRef, {
      text,
      createdAt: serverTimestamp(),
      isCompleted: false,
      theme: theme || null,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding unfinished sentence:', error);
    throw error;
  }
};

export const getRandomUnfinishedSentence = async (): Promise<UnfinishedSentence | null> => {
  try {
    const q = query(
      unfinishedSentencesRef, 
      where('isCompleted', '==', false),
      limit(20)  // Get 20 and pick random to avoid always getting the same one
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const sentences = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UnfinishedSentence[];
    
    // Return random sentence from the batch
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  } catch (error) {
    console.error('Error getting random sentence:', error);
    // Return a fallback sentence if database fails
    return {
      text: "I never got to tell you that...",
      createdAt: Timestamp.now(),
      isCompleted: false
    };
  }
};

// Completed Pairs Operations
export const addCompletedPair = async (
  startText: string, 
  completionText: string, 
  mood: string,
  theme?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(completedPairsRef, {
      startText,
      completionText,
      mood,
      theme: theme || null,
      createdAt: serverTimestamp(),
      likes: 0,
      shares: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding completed pair:', error);
    throw error;
  }
};

export const getRecentCompletedPairs = async (limitCount: number = 10): Promise<CompletedPair[]> => {
  try {
    const q = query(
      completedPairsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CompletedPair[];
  } catch (error) {
    console.error('Error getting completed pairs:', error);
    return []; // Return empty array on error
  }
};

export const likeCompletedPair = async (pairId: string): Promise<void> => {
  try {
    const pairRef = doc(db, 'completed-pairs', pairId);
    await updateDoc(pairRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking pair:', error);
  }
};

export const shareCompletedPair = async (pairId: string): Promise<void> => {
  try {
    const pairRef = doc(db, 'completed-pairs', pairId);
    await updateDoc(pairRef, {
      shares: increment(1)
    });
  } catch (error) {
    console.error('Error sharing pair:', error);
  }
};

// Daily Themes Operations
export const getTodaysTheme = async (): Promise<DailyTheme | null> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const q = query(
      dailyThemesRef,
      where('date', '==', today),
      where('isActive', '==', true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as DailyTheme;
  } catch (error) {
    console.error('Error getting today\'s theme:', error);
    return null;
  }
};

// Real-time listeners
export const subscribeToCompletedPairs = (
  callback: (pairs: CompletedPair[]) => void,
  limitCount: number = 10
) => {
  const q = query(
    completedPairsRef,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(q, (snapshot) => {
    const pairs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CompletedPair[];
    callback(pairs);
  });
};

// Utility function to create sample data
export const createSampleData = async () => {
  try {
    // Add some sample unfinished sentences
    const sampleSentences = [
      "I never got to tell you that...",
      "The last time I saw them, I...",
      "If I had one more moment, I would...",
      "Sometimes I wonder what would happen if...",
      "The thing I regret most is...",
      "When I close my eyes, I can still...",
      "I wish I had the courage to...",
      "In my dreams, we still..."
    ];

    for (const sentence of sampleSentences) {
      await addUnfinishedSentence(sentence);
    }

    // Add sample daily theme
    const today = new Date().toISOString().split('T')[0];
    await addDoc(dailyThemesRef, {
      title: "Messages to Lost Connections",
      description: "Write to someone who disappeared from your life",
      prompt: "Start a sentence for someone you lost touch with...",
      date: today,
      isActive: true
    });

    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}; 