import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { usePlayerStore } from '@/store/player';

export default function RootLayout() {
  const isReady = useFrameworkReady();
  const router = useRouter();
  const { library } = usePlayerStore();

  useEffect(() => {
    if (!isReady) return;
    if (!library.length) {
      router.replace('/auth');
    }
  }, [isReady, library]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
