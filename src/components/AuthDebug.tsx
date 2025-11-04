'use client';

import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const vars = {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
      redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
    };
    
    setEnvVars(vars);
    
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Environment Variables:', vars);
    console.log('Missing variables:', Object.entries(vars).filter(([_, value]) => !value).map(([key]) => key));
    console.log('======================');
  }, []);

  const missingVars = Object.entries(envVars).filter(([_, value]) => !value);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-xs max-w-sm">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className={value ? 'text-green-600' : 'text-red-600'}>
            {key}: {value ? '✅ Set' : '❌ Missing'}
          </div>
        ))}
      </div>
      {missingVars.length > 0 && (
        <div className="mt-2 text-red-600 font-semibold">
          Missing: {missingVars.map(([key]) => key).join(', ')}
        </div>
      )}
    </div>
  );
}