import AuthWrapper from '@/components/AuthWrapper';
import { AuthProvider } from '@/contexts/AuthContext';

export default function HomeScreen() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
