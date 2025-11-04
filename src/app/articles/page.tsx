'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock articles data
const allArticles = [
  {
    id: 1,
    title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
    excerpt: "Industry leaders gather to discuss the future of artificial intelligence and its impact on society. The conference showcased groundbreaking developments in machine learning, natural language processing, and computer vision.",
    author: "Sarah Johnson",
    date: "2024-11-04",
    category: "Technology",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    excerpt: "World leaders commit to ambitious new targets for carbon reduction and renewable energy adoption. The agreement includes binding commitments from over 190 countries to achieve net-zero emissions by 2050.",
    author: "Michael Chen",
    date: "2024-11-03",
    category: "Environment",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Stock Markets Rally as Economic Indicators Show Strong Growth",
    excerpt: "Positive employment data and consumer confidence boost market sentiment across major indices. The Dow Jones and S&P 500 reached new all-time highs as investors showed renewed optimism.",
    author: "Emily Rodriguez",
    date: "2024-11-02",
    category: "Finance",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "New Space Mission Launches Successfully",
    excerpt: "International space agency announces successful launch of Mars exploration mission. The mission aims to search for signs of ancient microbial life and collect samples for future return to Earth.",
    author: "David Kim",
    date: "2024-11-04",
    category: "Science",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Healthcare Innovation Shows Promise in Clinical Trials",
    excerpt: "Breakthrough treatment demonstrates significant improvement in patient outcomes. The new therapy has shown a 90% success rate in treating previously incurable conditions.",
    author: "Dr. Lisa Wang",
    date: "2024-11-03",
    category: "Health",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Education Reform Initiative Gains Momentum",
    excerpt: "New policies aim to improve access to quality education in underserved communities. The initiative includes funding for technology infrastructure and teacher training programs.",
    author: "James Thompson",
    date: "2024-11-02",
    category: "Education",
    readTime: "5 min read"
  },
  {
    id: 7,
    title: "Renewable Energy Adoption Reaches New Milestone",
    excerpt: "Solar and wind power now account for 40% of global electricity generation. This marks a significant shift towards sustainable energy sources worldwide.",
    author: "Maria Garcia",
    date: "2024-11-01",
    category: "Environment",
    readTime: "6 min read"
  },
  {
    id: 8,
    title: "Cybersecurity Threats Evolve with AI Technology",
    excerpt: "Security experts warn of new challenges as artificial intelligence is used by both defenders and attackers. Organizations are urged to update their security protocols.",
    author: "Alex Turner",
    date: "2024-10-31",
    category: "Technology",
    readTime: "7 min read"
  }
];

const categories = ["All", "Technology", "Environment", "Finance", "Science", "Health", "Education"];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Articles</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive collection of news articles, analysis, and insights
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                <Link href={`/articles/${article.id}`}>
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">By {article.author}</span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
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

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}