'use client';

import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';

// Mock news data
const featuredArticles = [
  {
    id: 1,
    title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
    excerpt: "Industry leaders gather to discuss the future of artificial intelligence and its impact on society.",
    author: "Sarah Johnson",
    date: "2024-11-04",
    category: "Technology",
    image: "/api/placeholder/600/300"
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    excerpt: "World leaders commit to ambitious new targets for carbon reduction and renewable energy adoption.",
    author: "Michael Chen",
    date: "2024-11-03",
    category: "Environment",
    image: "/api/placeholder/600/300"
  },
  {
    id: 3,
    title: "Stock Markets Rally as Economic Indicators Show Strong Growth",
    excerpt: "Positive employment data and consumer confidence boost market sentiment across major indices.",
    author: "Emily Rodriguez",
    date: "2024-11-02",
    category: "Finance",
    image: "/api/placeholder/600/300"
  }
];

const recentNews = [
  {
    id: 4,
    title: "New Space Mission Launches Successfully",
    excerpt: "International space agency announces successful launch of Mars exploration mission.",
    author: "David Kim",
    date: "2024-11-04",
    category: "Science"
  },
  {
    id: 5,
    title: "Healthcare Innovation Shows Promise in Clinical Trials",
    excerpt: "Breakthrough treatment demonstrates significant improvement in patient outcomes.",
    author: "Dr. Lisa Wang",
    date: "2024-11-03",
    category: "Health"
  },
  {
    id: 6,
    title: "Education Reform Initiative Gains Momentum",
    excerpt: "New policies aim to improve access to quality education in underserved communities.",
    author: "James Thompson",
    date: "2024-11-02",
    category: "Education"
  }
];

export default function Home() {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to NewsHub
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Your trusted source for breaking news, in-depth analysis, and stories that matter
        </p>
        {!user && (
          <Link
            href="/signin"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign In to Personalize Your News
          </Link>
        )}
      </section>

      {/* Featured Articles */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Stories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {article.author}</span>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent News */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Latest News</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {recentNews.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                <Link href={`/articles/${article.id}`}>
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {article.author}</span>
                <Link
                  href={`/articles/${article.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Get the latest news delivered straight to your inbox
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}