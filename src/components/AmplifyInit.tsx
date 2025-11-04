'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/amplify';

export default function AmplifyInit() {
  useEffect(() => {
    configureAmplify();
  }, []);

  return null;
}