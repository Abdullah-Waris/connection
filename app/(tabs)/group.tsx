import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, Text, View } from "react-native";

export default function Tab() {
  return (
    <ThemedView></ThemedView>
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
    gap: 8,
  }
});
