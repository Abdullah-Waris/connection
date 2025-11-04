import { ThemedView } from '@/components/ThemedView';
import * as React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

export default function Playground() {
  const [count, setCount] = React.useState(0);
  return(
  <ThemedView>
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Playground</Text>
      <Text>Use this screen for tiny spikes.</Text>
      <Button title={`Increment (${count})`} onPress={() => setCount(c => c + 1)} />
    </ScrollView>
  </ThemedView>
  );
}