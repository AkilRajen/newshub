import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  if (typeof window === 'undefined') return; // Only run on client side

  // Get current origin dynamically
  const currentOrigin = window.location.origin;

  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_VQgBje3F5',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '1rpk9v4saq6m186teedfcqp5qc',
        loginWith: {
          oauth: {
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'https://us-east-1vqgbje3f5.auth.us-east-1.amazoncognito.com',
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || `${currentOrigin}/`],
            redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || `${currentOrigin}/`],
            responseType: 'code' as const,
          },
          email: true,
          username: false,
        },
      },
    },
  };

  console.log('🔧 Configuring Amplify with origin:', currentOrigin);
  Amplify.configure(amplifyConfig);
};