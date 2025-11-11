import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  if (typeof window === 'undefined') return; // Only run on client side

  // Get current origin dynamically
  const currentOrigin = window.location.origin;

  // Remove https:// from domain for Amplify (it adds it automatically)
  const cognitoDomain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com')
    .replace('https://', '');

  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_VQgBje3F5',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '1rpk9v4saq6m186teedfcqp5qc',
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
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

  console.log('🔧 Configuring Amplify with:', {
    origin: currentOrigin,
    domain: cognitoDomain,
    userPoolId: amplifyConfig.Auth.Cognito.userPoolId,
    clientId: amplifyConfig.Auth.Cognito.userPoolClientId,
    redirectSignIn: amplifyConfig.Auth.Cognito.loginWith.oauth.redirectSignIn,
  });

  Amplify.configure(amplifyConfig);
};