import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import '../global.css';

import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export const unstable_settings = {
  anchor: '(tabs)',
};

export const useAuth = create((set) => ({
  session:null,
  setSession:(session:any) => set(session),
}));

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const setSession = useAuth((state:any) => state.setSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession({session})
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession({session})
    })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
