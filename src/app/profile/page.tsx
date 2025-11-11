'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import Link from 'next/link';

interface UserAttributes {
  sub?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  [key: string]: string | undefined;
}

export default function Profile() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [savedArticles] = useState([1, 2, 3]); // Mock saved articles
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const loadUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAttributes();
  }, [user, router]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const email = userAttributes.email || user.username || 'Not provided';
  const name = userAttributes.name || userAttributes.given_name || email.split('@')[0];
  const signInMethod = user.signInDetails?.authFlowType || 'Unknown';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-6">
          {userAttributes.picture ? (
            <img 
              src={userAttributes.picture} 
              alt={name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-gray-600">{email}</p>
            <p className="text-sm text-gray-500">Signed in via {signInMethod}</p>
            {userAttributes.email_verified === 'true' && (
              <span className="inline-flex items-center mt-1 text-xs text-green-600">
                ✓ Email verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">User Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(userAttributes).map(([key, value]) => (
            <div key={key} className="border-b pb-3">
              <div className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="text-gray-900 mt-1 break-all">
                {value === 'true' ? '✓ Yes' : value === 'false' ? '✗ No' : value || 'Not provided'}
              </div>
            </div>
          ))}
          <div className="border-b pb-3">
            <div className="text-sm font-medium text-gray-500">User ID</div>
            <div className="text-gray-900 mt-1 font-mono text-xs break-all">{user.userId}</div>
          </div>
          <div className="border-b pb-3">
            <div className="text-sm font-medium text-gray-500">Username</div>
            <div className="text-gray-900 mt-1">{user.username}</div>
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