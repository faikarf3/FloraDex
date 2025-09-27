import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from 'expo-router';
import React from 'react';

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
          display: user ? 'flex' : 'none', // Hide tab bar when not logged in
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
