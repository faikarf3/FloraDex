import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        {/* Tabs group (main dashboard + other tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal screen */}
        <Stack.Screen
          name="add-plant-modal"
          options={{
            presentation: 'modal', // 👈 makes it slide up like Twitter compose
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
