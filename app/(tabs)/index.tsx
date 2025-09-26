import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';

export default function HomeScreen() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
