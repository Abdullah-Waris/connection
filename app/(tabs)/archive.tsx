import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, Text, View } from "react-native";

export default function Tab() {
  return (
    <ThemedView>

    <ThemedView style = {styles.titleContainer}>
        <ThemedText type="title">September 2025</ThemedText>
        <ThemedText></ThemedText>
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
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  }
});
