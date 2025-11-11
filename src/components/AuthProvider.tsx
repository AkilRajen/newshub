'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Listen for auth events
    const unsubscribe = Hub.listen('auth', (data) => {
      console.log('Auth event:', data.payload.event);
      
      if (data.payload.event === 'signedIn') {
        console.log('User signed in successfully');
      }
      
      if (data.payload.event === 'signInWithRedirect') {
        console.log('Handling OAuth redirect');
      }
      
      if (data.payload.event === 'signInWithRedirect_failure') {
        console.error('OAuth redirect failed:', data.payload.data);
        console.error('Full error details:', JSON.stringify(data.payload, null, 2));
      }
      
      if (data.payload.event === 'tokenRefresh_failure') {
        console.error('Token refresh failed:', data.payload.data);
      }
      
      if (data.payload.event === 'customOAuthState') {
        console.log('Custom OAuth state:', data.payload.data);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}