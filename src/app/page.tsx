'use client';

import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Suspense } from 'react';

// Mock news data
const newsArticles = [
  {
    id: 1,
    title: 'Breaking: Major Tech Announcement',
    excerpt: 'A leading tech company announces groundbreaking innovation...',
    category: 'Technology',
    date: '2024-01-15',
    image: 'https://placehold.co/800x400/3B82F6/FFFFFF/png?text=Technology+News',
  },
  {
    id: 2,
    title: 'Global Markets React to Economic News',
    excerpt: 'Stock markets worldwide show significant movement...',
    category: 'Business',
    date: '2024-01-15',
    image: 'https://placehold.co/800x400/10B981/FFFFFF/png?text=Business+News',
  },
  {
    id: 3,
    title: 'Climate Summit Reaches Historic Agreement',
    excerpt: 'World leaders commit to ambitious climate goals...',
    category: 'Environment',
    date: '2024-01-14',
    image: 'https://placehold.co/800x400/059669/FFFFFF/png?text=Environment+News',
  },
];

function HomeContent() {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to NewsHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted source for the latest news and updates
        </p>
        {!user && (
          <Link
            href="/signin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Sign In to Get Started
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome back, {user.signInDetails?.loginId || 'User'}!
          </h3>
          <p className="text-blue-700">
            You have access to all premium content and personalized news feeds.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
