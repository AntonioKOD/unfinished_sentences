import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Cache the response for 1 hour
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const completion = searchParams.get('completion');
    const mood = searchParams.get('mood') || 'hopeful';
    const type = searchParams.get('type') || 'quote'; // 'quote' or 'brand'

    // For brand/main page sharing
    if (type === 'brand' || (!start && !completion)) {
      const response = new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAF8F5',
              background: 'linear-gradient(45deg, #FAF8F5 0%, #F5F0E8 100%)',
              fontFamily: 'serif',
              position: 'relative',
            }}
          >
            {/* Subtle pattern background */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 20px 20px, rgba(217, 165, 179, 0.1) 2px, transparent 2px)`,
                backgroundSize: '40px 40px',
              }}
            />
            
            {/* Main content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 300,
                  color: '#2D3748',
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Unfinished
              </div>
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 500,
                  color: '#D9A5B3',
                  fontStyle: 'italic',
                  marginBottom: '48px',
                  letterSpacing: '-0.02em',
                }}
              >
                Sentences
              </div>
              
              <div
                style={{
                  width: '200px',
                  height: '2px',
                  backgroundColor: '#D9A5B3',
                  marginBottom: '48px',
                }}
              />
              
              <div
                style={{
                  fontSize: '32px',
                  color: '#666',
                  fontWeight: 300,
                  maxWidth: '800px',
                  lineHeight: 1.4,
                  textAlign: 'center',
                }}
              >
                Share your unfinished thoughts with strangers
                <br />
                who help complete them.
              </div>
              
              <div
                style={{
                  fontSize: '24px',
                  color: '#D9A5B3',
                  fontStyle: 'italic',
                  marginTop: '32px',
                  fontWeight: 400,
                }}
              >
                Create poetry from vulnerability.
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );

      // Add cache headers
      response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24 hours
      return response;
    }

    // For quote sharing
    if (start && completion) {
      const moodColors = {
        melancholy: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
        nostalgic: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
        hopeful: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff' },
        grateful: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#ffffff' },
      };

      const colorScheme = moodColors[mood as keyof typeof moodColors] || moodColors.hopeful;

      const response = new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: colorScheme.bg,
              fontFamily: 'serif',
              padding: '80px',
              position: 'relative',
            }}
          >
            {/* Subtle pattern overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 30px 30px, rgba(255, 255, 255, 0.1) 2px, transparent 2px)`,
                backgroundSize: '60px 60px',
              }}
            />
            
            {/* Quote icon */}
            <div
              style={{
                fontSize: '64px',
                marginBottom: '40px',
                opacity: 0.9,
              }}
            >
              📜
            </div>
            
            {/* Start text */}
            <div
              style={{
                fontSize: '36px',
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: '32px',
                fontStyle: 'italic',
                lineHeight: 1.3,
                maxWidth: '900px',
                fontWeight: 400,
              }}
            >
              &ldquo;{start}&rdquo;
            </div>
            
            {/* Divider */}
            <div
              style={{
                width: '300px',
                height: '2px',
                backgroundColor: colorScheme.text,
                opacity: 0.6,
                marginBottom: '32px',
              }}
            />
            
            {/* Completion text */}
            <div
              style={{
                fontSize: '32px',
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: '48px',
                fontStyle: 'italic',
                lineHeight: 1.3,
                maxWidth: '900px',
                fontWeight: 300,
                opacity: 0.95,
              }}
            >
              &ldquo;{completion}&rdquo;
            </div>
            
            {/* Mood badge */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                padding: '12px 24px',
                borderRadius: '20px',
                fontSize: '20px',
                fontWeight: 500,
                textTransform: 'capitalize',
                marginBottom: '24px',
              }}
            >
              {mood}
            </div>
            
            {/* Branding */}
            <div
              style={{
                fontSize: '18px',
                color: colorScheme.text,
                opacity: 0.8,
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              Unfinished Sentences
              <br />
              <span style={{ fontSize: '16px', fontStyle: 'italic' }}>
                Complete the Unsaid
              </span>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );

      // Add cache headers for quote images (longer cache since content is unique)
      response.headers.set('Cache-Control', 'public, max-age=2592000, s-maxage=2592000'); // Cache for 30 days
      return response;
    }

    // Fallback
    return new Response('Missing parameters', { status: 400 });
  } catch (e: unknown) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
} 