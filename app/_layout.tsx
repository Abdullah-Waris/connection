import { Stack } from "expo-router";
import { AppProvider } from "./context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Dev-only playground lives OUTSIDE the tabs */}
      {__DEV__ && (
        <Stack.Screen
          name="playground"
          options={{
            title: 'Playground',
            presentation: 'modal', // nice modal vibe; optional
          }}
        />
      )}
    </Stack>
    </AppProvider>
  );
}
