import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#2D5016',
          borderTopColor: '#2D5016',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inventory',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Add Plants',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
