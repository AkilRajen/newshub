'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signInWithRedirect } from 'aws-amplify/auth';

export default function SignIn() {
  const router = useRouter();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithRedirect({ 
        provider: { custom: 'Microsoft' } 
      });
    } catch (error) {
      console.error('Microsoft sign-in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to NewsHub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access personalized news and exclusive content
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-3">
            {/* Microsoft Sign-In Button */}
            <button
              onClick={handleMicrosoftSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign in with Microsoft</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          <Authenticator
            socialProviders={['google', 'facebook','apple']}
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