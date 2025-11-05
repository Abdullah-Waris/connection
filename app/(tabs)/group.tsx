import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function Tab() {
  type Person = {
    id: string,
    name: string
  }

  const MOCK_PEOPLE: Person[] = [
    {id: uuidv4(), name: "Mom"},
    {id: uuidv4(), name: "Dad"},
    {id: uuidv4(), name: "You"}
  ]

  function lastPosted(person: Person){
    
  }

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Group Settings</ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedText type="subtitle">Invite Others:</ThemedText>
        <ThemedView style={{flexDirection:"row"}}>
          <Pressable onPress={()=>console.log("LINK!")}>
            <ThemedText>[Copy Invite Link]</ThemedText>
          </Pressable>

          <Pressable onPress={()=>console.log("QR CODE!")}>
            <ThemedText>[QR Code]</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedView>
        <ThemedText type="subtitle">Members:</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent:"center",
    alignItems: "center",
    gap: 8,
  }
});
