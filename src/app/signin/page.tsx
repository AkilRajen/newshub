'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function SignIn() {
  const router = useRouter();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to NewsHub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access personalized news and exclusive content
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Authenticator
            socialProviders={['google']}
            signUpAttributes={['email']}
            hideSignUp={false}
          >
            {({ signOut, user }) => (
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Welcome back, {user?.signInDetails?.loginId}!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You are now signed in to NewsHub.
                </p>
                <button
                  onClick={signOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </Authenticator>
        </div>
      </div>
    </div>
  );
}