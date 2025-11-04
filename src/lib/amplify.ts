import { Amplify } from 'aws-amplify';

// Validate required environment variables
const requiredEnvVars = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
};

// Check if any required variables are missing
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing required Cognito environment variables:', missingVars);
  console.error('Current env values:', {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
  });
}

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: requiredEnvVars.userPoolId || '',
      userPoolClientId: requiredEnvVars.userPoolClientId || '',
      loginWith: {
        oauth: {
          domain: requiredEnvVars.domain || '',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/'],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/'],
          responseType: 'code' as const,
        },
      },
    },
  },
};

// Only configure if we have the required variables
if (missingVars.length === 0) {
  Amplify.configure(amplifyConfig);
  console.log('Amplify configured successfully');
} else {
  console.warn('Amplify not configured due to missing environment variables');
}

export default amplifyConfig;