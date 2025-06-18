import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SharedQuoteClient from './SharedQuoteClient';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const start = params.start as string;
  const completion = params.completion as string;
  const mood = params.mood as string || 'hopeful';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unfinished-sentences.vercel.app';

  if (start && completion) {
    const title = `"${start}" - Shared Quote | Unfinished Sentences`;
    const description = `"${start}" ${completion} - A beautiful ${mood} completion shared on Unfinished Sentences. Create your own shared poetry from vulnerability.`;
    
    // Generate Open Graph image URL
    const ogImageUrl = `${baseUrl}/api/og?start=${encodeURIComponent(start)}&completion=${encodeURIComponent(completion)}&mood=${mood}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${baseUrl}/shared?start=${encodeURIComponent(start)}&completion=${encodeURIComponent(completion)}&mood=${mood}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${start} ${completion}`,
            type: 'image/png',
          },
        ],
        siteName: 'Unfinished Sentences',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
        site: '@unfinishedapp',
        creator: '@unfinishedapp',
      },
      alternates: {
        canonical: `${baseUrl}/shared?start=${encodeURIComponent(start)}&completion=${encodeURIComponent(completion)}&mood=${mood}`
      },
    };
  }

  // Fallback metadata
  return {
    title: 'Shared Quote | Unfinished Sentences',
    description: 'Discover beautiful completions shared on Unfinished Sentences - where strangers help complete your unfinished thoughts.',
  };
}

export default async function SharedQuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const start = params.start as string;
  const completion = params.completion as string;
  const mood = params.mood as string;

  if (!start || !completion || !mood) {
    notFound();
  }

  return (
    <SharedQuoteClient 
      start={start}
      completion={completion}
      mood={mood}
    />
  );
} 