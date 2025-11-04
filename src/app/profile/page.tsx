'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profile() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [savedArticles] = useState([1, 2, 3]); // Mock saved articles

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  const userAttributes = user.signInDetails || {};
  const email = userAttributes.loginId || 'Not provided';
  const signInMethod = userAttributes.authFlowType || 'Unknown';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">{email}</p>
            <p className="text-sm text-gray-500">Signed in via {signInMethod}</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{savedArticles.length}</div>
          <div className="text-gray-600">Saved Articles</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">24</div>
          <div className="text-gray-600">Articles Read</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
          <div className="text-gray-600">Days Active</div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">News Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favorite Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Environment', 'Finance', 'Science', 'Health', 'Education'].map((category) => (
                <button
                  key={category}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Daily news digest</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Breaking news alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Weekly newsletter</span>
              </label>
            </div>
          </div>
        </div>
        
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Preferences
        </button>
      </div>

      {/* Saved Articles */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Saved Articles</h2>
        {savedArticles.length > 0 ? (
          <div className="space-y-4">
            {savedArticles.map((articleId) => (
              <div key={articleId} className="border-b pb-4 last:border-b-0">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                  <Link href={`/articles/${articleId}`}>
                    Sample Article Title {articleId}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Saved on November {articleId + 1}, 2024
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved articles yet. Start reading and save articles you find interesting!</p>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="space-y-4">
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Change Password
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Privacy Settings
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Download My Data
          </button>
          <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}