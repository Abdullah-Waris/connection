import 'react-native-get-random-values'; // polyfill for RN
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from 'react-native';

function handleEventPress(){
    console.log("Pressed!");
}

const MOCK_POSTS = [
  { id: '1', author: 'Mom', time: '09:15', message: 'Morning walk 🌳' },
  { id: '2', author: 'Dad', time: '12:15', message: 'Lunch 🍔' },
]

export default function Tab() {

  const [posts, setPosts] = useState(MOCK_POSTS);

  function handleAddPost(){
    const newPost = {
      id: uuidv4(),
      author: "You",
      time: new Date().toLocaleTimeString(),
      message: "Test Post!"
    }
    setPosts([newPost, ...posts]);
  }

  return (
    <ThemedView style={{flex:1}}>
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Family Thread</ThemedText>
      <ThemedText type="title">Friday, October 4</ThemedText>
    </ThemedView>

    <Pressable onPress = {handleEventPress} accessibilityRole="button" hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
        <ThemedText>Add Daily Event</ThemedText>
    </Pressable>

    <ThemedView style={styles.titleContainer}>
      <ThemedText type="subtitle">Today's Posts</ThemedText>
    </ThemedView>

    <ThemedView style={{paddingBottom:150}}>
      <FlatList 
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <ThemedView>
          <ThemedText type="subtitle">{item.author} · {item.time}</ThemedText>
          <ThemedText>{item.message}</ThemedText>
        </ThemedView>
        
      )}
      ListEmptyComponent={
        <ThemedText>No posts yet today!</ThemedText>
      }
      />
    </ThemedView>

    <Pressable style={styles.floatingContainer} onPress={handleAddPost}>
      <ThemedText>+</ThemedText>
    </Pressable>

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
  },

  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green"
  }
  
});
