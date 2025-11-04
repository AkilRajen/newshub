'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';

// Mock article data
const articleData: { [key: string]: any } = {
  '1': {
    id: 1,
    title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
    content: `
      <p>Industry leaders from around the world gathered at the annual TechForward Conference to witness what many are calling the most significant breakthrough in artificial intelligence in the past decade. The conference, held in San Francisco, showcased groundbreaking developments that promise to reshape how we interact with technology.</p>
      
      <p>The keynote presentation revealed a new AI system capable of understanding and generating human-like responses with unprecedented accuracy. Unlike previous systems, this breakthrough technology demonstrates remarkable contextual awareness and emotional intelligence.</p>
      
      <h3>Key Developments</h3>
      <p>The new AI system incorporates several revolutionary features:</p>
      <ul>
        <li>Advanced natural language processing with 99.7% accuracy</li>
        <li>Real-time learning and adaptation capabilities</li>
        <li>Ethical decision-making frameworks built into the core architecture</li>
        <li>Seamless integration with existing technology infrastructure</li>
      </ul>
      
      <p>Dr. Sarah Chen, lead researcher at the AI Innovation Lab, explained: "This represents a fundamental shift in how AI systems process and understand human communication. We're not just improving existing technology; we're creating entirely new possibilities for human-AI collaboration."</p>
      
      <h3>Industry Impact</h3>
      <p>The implications of this breakthrough extend far beyond the tech industry. Healthcare, education, finance, and manufacturing sectors are already exploring potential applications. Early pilot programs have shown promising results in medical diagnosis, personalized learning, and automated customer service.</p>
      
      <p>However, experts also emphasize the importance of responsible implementation. The conference included extensive discussions about ethical considerations, privacy protection, and the need for regulatory frameworks to guide the deployment of such powerful technology.</p>
      
      <p>As we move forward, this breakthrough promises to usher in a new era of artificial intelligence that is more intuitive, helpful, and aligned with human values than ever before.</p>
    `,
    author: "Sarah Johnson",
    date: "2024-11-04",
    category: "Technology",
    readTime: "5 min read",
    tags: ["AI", "Technology", "Innovation", "Conference"]
  },
  '2': {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    content: `
      <p>In a landmark moment for environmental policy, world leaders at the Global Climate Summit have reached a historic agreement that sets ambitious new targets for carbon reduction and renewable energy adoption. The agreement, signed by representatives from over 190 countries, marks the most comprehensive climate action plan in history.</p>
      
      <p>The summit, held in Geneva, brought together heads of state, environmental scientists, and industry leaders to address the urgent need for coordinated global action on climate change. After three days of intensive negotiations, the participating nations committed to achieving net-zero emissions by 2050.</p>
      
      <h3>Key Commitments</h3>
      <p>The agreement includes several groundbreaking commitments:</p>
      <ul>
        <li>50% reduction in greenhouse gas emissions by 2030</li>
        <li>$500 billion investment in renewable energy infrastructure</li>
        <li>Protection of 30% of global land and ocean areas by 2030</li>
        <li>Phase-out of coal power plants by 2035</li>
        <li>Establishment of a global carbon pricing mechanism</li>
      </ul>
      
      <p>UN Secretary-General Maria Santos stated: "Today marks a turning point in our fight against climate change. This agreement demonstrates that when nations come together with shared purpose, we can achieve what once seemed impossible."</p>
      
      <h3>Implementation Strategy</h3>
      <p>The agreement outlines a comprehensive implementation strategy with regular monitoring and reporting requirements. Countries will submit annual progress reports, and an independent oversight committee will track global progress toward the established targets.</p>
      
      <p>Funding mechanisms have been established to support developing nations in their transition to clean energy. Developed countries have committed to providing $100 billion annually in climate finance, with additional support for technology transfer and capacity building.</p>
      
      <p>Environmental groups have praised the agreement while emphasizing the critical importance of swift implementation. The next phase will focus on translating these commitments into concrete policies and actions at the national level.</p>
    `,
    author: "Michael Chen",
    date: "2024-11-03",
    category: "Environment",
    readTime: "7 min read",
    tags: ["Climate", "Environment", "Policy", "Global"]
  },
  '3': {
    id: 3,
    title: "Stock Markets Rally as Economic Indicators Show Strong Growth",
    content: `
      <p>Financial markets experienced a significant rally today as new economic data revealed stronger-than-expected growth across multiple sectors. The Dow Jones Industrial Average and S&P 500 both reached new all-time highs, reflecting renewed investor confidence in the economic recovery.</p>
      
      <p>The positive momentum was driven by encouraging employment figures, robust consumer spending data, and strong corporate earnings reports. Analysts are describing this as one of the most broad-based market rallies in recent years.</p>
      
      <h3>Market Performance</h3>
      <p>Key market indicators showed impressive gains:</p>
      <ul>
        <li>Dow Jones: +2.3% to close at 35,847</li>
        <li>S&P 500: +2.1% reaching 4,567</li>
        <li>NASDAQ: +2.8% hitting 14,234</li>
        <li>Russell 2000: +3.2% demonstrating small-cap strength</li>
      </ul>
      
      <p>Chief Market Strategist Jennifer Walsh commented: "We're seeing a perfect storm of positive economic indicators. Employment is strong, inflation is moderating, and corporate profits are exceeding expectations. This creates an ideal environment for sustained market growth."</p>
      
      <h3>Sector Analysis</h3>
      <p>Technology stocks led the rally, with major companies reporting better-than-expected quarterly results. The healthcare and financial sectors also showed strong performance, while energy stocks benefited from stable oil prices and increased demand.</p>
      
      <p>Consumer discretionary stocks surged as retail sales data indicated robust spending patterns. This suggests that consumers remain confident about their financial situation and the broader economic outlook.</p>
      
      <p>Looking ahead, economists are optimistic about continued growth, though they caution that global economic uncertainties and geopolitical tensions could impact future market performance. Investors are advised to maintain diversified portfolios while capitalizing on current opportunities.</p>
    `,
    author: "Emily Rodriguez",
    date: "2024-11-02",
    category: "Finance",
    readTime: "4 min read",
    tags: ["Finance", "Markets", "Economy", "Investment"]
  }
};

export default function ArticlePage() {
  const params = useParams();
  const { user } = useAuthenticator((context) => [context.user]);
  const articleId = params.id as string;
  const article = articleData[articleId];

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
        <Link href="/articles" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <nav className="mb-4">
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            ← Back to Articles
          </Link>
        </nav>
        
        <div className="mb-6">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
            {article.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between text-gray-600 mb-8">
          <div className="flex items-center space-x-4">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          
          {user && (
            <div className="flex space-x-2">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                Save
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Article Image Placeholder */}
      <div className="h-64 md:h-96 bg-gray-200 rounded-lg mb-8 flex items-center justify-center">
        <span className="text-gray-500">Article Image Placeholder</span>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Article Tags */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag: string) => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Sign-in prompt for non-authenticated users */}
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Want to save articles and get personalized recommendations?
          </h3>
          <p className="text-blue-700 mb-4">
            Sign in to access exclusive features and customize your news experience.
          </p>
          <Link
            href="/signin"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* Related Articles */}
      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(articleData)
            .filter((relatedArticle: any) => 
              relatedArticle.id !== article.id && 
              relatedArticle.category === article.category
            )
            .slice(0, 2)
            .map((relatedArticle: any) => (
              <div key={relatedArticle.id} className="bg-white rounded-lg shadow-md p-6">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-2 inline-block">
                  {relatedArticle.category}
                </span>
                <h4 className="text-lg font-bold mb-2 hover:text-blue-600">
                  <Link href={`/articles/${relatedArticle.id}`}>
                    {relatedArticle.title}
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm mb-2">By {relatedArticle.author}</p>
                <Link
                  href={`/articles/${relatedArticle.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}