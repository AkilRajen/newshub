'use client';

import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    const getUserName = async () => {
      if (user) {
        try {
          const attributes = await fetchUserAttributes();
          const name = attributes.name || attributes.email || user.username || 'User';
          setUserName(name);
        } catch (error) {
          console.error('Error fetching user attributes:', error);
          setUserName(user.username || 'User');
        }
      }
    };
    
    getUserName();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              NewsHub
            </Link>
            <nav className="ml-10 flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Articles
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
                <span className="text-sm text-gray-600">
                  Welcome, {userName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}