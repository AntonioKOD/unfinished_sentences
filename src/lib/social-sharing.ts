// Social sharing utilities for generating beautiful quote images

export interface ShareableQuote {
  startText: string;
  completionText: string;
  mood: string;
  theme?: string;
}

// Generate beautiful quote image as canvas
export const generateQuoteImage = (quote: ShareableQuote): Promise<string> => {
  return new Promise((resolve) => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas dimensions for social media optimization
    canvas.width = 1080;
    canvas.height = 1080;
    
    // Mood-based color schemes
    const colorSchemes = {
      melancholy: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: ['#667eea', '#764ba2'],
        textColor: '#ffffff'
      },
      nostalgic: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        colors: ['#f093fb', '#f5576c'],
        textColor: '#ffffff'
      },
      hopeful: {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        colors: ['#4facfe', '#00f2fe'],
        textColor: '#ffffff'
      },
      grateful: {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        colors: ['#43e97b', '#38f9d7'],
        textColor: '#ffffff'
      }
    };
    
    const scheme = colorSchemes[quote.mood as keyof typeof colorSchemes] || colorSchemes.hopeful;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, scheme.colors[0]);
    gradient.addColorStop(1, scheme.colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle pattern overlay
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(i * 54 + 27, j * 54 + 27, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    
    // Set text properties
    ctx.fillStyle = scheme.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw quote icon
    ctx.font = '60px serif';
    ctx.fillText('📜', canvas.width / 2, 200);
    
    // Draw start text
    ctx.font = 'italic 36px serif';
    const startWords = quote.startText.split(' ');
    let startLine = '';
    let startY = 320;
    
    for (const word of startWords) {
      const testLine = startLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && startLine !== '') {
        ctx.fillText(`"${startLine.trim()}"`, canvas.width / 2, startY);
        startLine = word + ' ';
        startY += 50;
      } else {
        startLine = testLine;
      }
    }
    ctx.fillText(`"${startLine.trim()}"`, canvas.width / 2, startY);
    
    // Draw completion text
    ctx.font = '32px serif';
    ctx.fillStyle = scheme.textColor;
    ctx.globalAlpha = 0.9;
    
    const completionWords = quote.completionText.split(' ');
    let completionLine = '';
    let completionY = startY + 100;
    
    for (const word of completionWords) {
      const testLine = completionLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && completionLine !== '') {
        ctx.fillText(`"${completionLine.trim()}"`, canvas.width / 2, completionY);
        completionLine = word + ' ';
        completionY += 45;
      } else {
        completionLine = testLine;
      }
    }
    ctx.fillText(`"${completionLine.trim()}"`, canvas.width / 2, completionY);
    
    // Draw mood badge
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    const moodText = quote.mood.charAt(0).toUpperCase() + quote.mood.slice(1);
    const moodWidth = ctx.measureText(moodText).width + 40;
    
    // Rounded rectangle for mood badge
    const badgeX = (canvas.width - moodWidth) / 2;
    const badgeY = completionY + 80;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, moodWidth, 40, 20);
    ctx.fill();
    
    ctx.fillStyle = scheme.colors[0];
    ctx.fillText(moodText, canvas.width / 2, badgeY + 20);
    
    // Draw app branding
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = scheme.textColor;
    ctx.font = '20px serif';
    ctx.fillText('Unfinished Sentences', canvas.width / 2, canvas.height - 60);
    ctx.font = '16px sans-serif';
    ctx.fillText('Complete the Unsaid', canvas.width / 2, canvas.height - 30);
    
    // Convert to data URL
    resolve(canvas.toDataURL('image/png', 0.9));
  });
};

// Share via Web Share API
export const shareQuote = async (quote: ShareableQuote) => {
  const text = `"${quote.startText}"\n\n"${quote.completionText}"\n\n✨ Created on Unfinished Sentences`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Unfinished Sentences',
        text,
        url: window.location.origin
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: Copy to clipboard
    await navigator.clipboard.writeText(text);
    // You could show a toast notification here
    alert('Quote copied to clipboard!');
  }
};

// Download quote as image
export const downloadQuoteImage = async (quote: ShareableQuote) => {
  const imageUrl = await generateQuoteImage(quote);
  
  const link = document.createElement('a');
  link.download = `unfinished-sentence-${Date.now()}.png`;
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Share to specific platforms
export const shareToTwitter = (quote: ShareableQuote) => {
  const text = `"${quote.startText}"\n\n"${quote.completionText}"\n\n✨ Created on Unfinished Sentences`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

export const shareToFacebook = (quote: ShareableQuote) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(`"${quote.startText}" "${quote.completionText}"`)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

export const shareToLinkedIn = (quote: ShareableQuote) => {
  const text = `"${quote.startText}" "${quote.completionText}" - Created on Unfinished Sentences`;
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

// Generate shareable link with embedded quote
export const generateShareableLink = (quote: ShareableQuote): string => {
  const params = new URLSearchParams({
    start: quote.startText,
    completion: quote.completionText,
    mood: quote.mood
  });
  
  return `${window.location.origin}/shared?${params.toString()}`;
};

// Create beautiful text-based social media post
export const generateSocialMediaText = (quote: ShareableQuote, platform: 'twitter' | 'instagram' | 'linkedin'): string => {
  const baseText = `${quote.startText}\n\n${quote.completionText}`;
  
  switch (platform) {
    case 'twitter':
      return `${baseText}\n\n✨ #UnfinishedSentences #Poetry #Vulnerability #Connection`;
      
    case 'instagram':
      return `${baseText}\n\n✨ Sometimes the most beautiful words are completed by strangers.\n\n#UnfinishedSentences #Poetry #Community #Vulnerability #Connection #Words #Healing #Love`;
      
    case 'linkedin':
      return `${baseText}\n\nSometimes vulnerability creates the most authentic connections. This beautiful completion came from the Unfinished Sentences community - a place where strangers help finish each other's thoughts.\n\n#Community #Vulnerability #Connection #Creativity`;
      
    default:
      return baseText;
  }
}; 