import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from 'react-native';
import ImagePickerTile from '@/components/ImagePickerTile';

function handleEventPress(){
    console.log("Pressed!");
}

const MOCK_POSTS = [
  { id: '1', author: 'Mom', time: '09:15', message: 'Morning walk 🌳', date: [2025, 9, 29]},
  { id: '2', author: 'Dad', time: '12:15', message: 'Lunch 🍔', date: [2025, 9, 29]},
]

export default function Tab() {

  const [posts, setPosts] = useState(MOCK_POSTS);
  const [pickerVisible, setPickerVisible] = useState(false);

  function handleQuickAddPost(){
    const newPost = {
      id: uuidv4(),
      author: "You",
      time: new Date().toLocaleTimeString(),
      message: "Test Post!",
      date: [new Date().getFullYear(), new Date().getMonth(), new Date().getDay()],
    }
    setPosts([newPost, ...posts]);
  }

  return (
    <ThemedView style={{flex:1}}>
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Family Thread</ThemedText>
      <ThemedText type="title">Friday, October 4</ThemedText>
    </ThemedView>

    <Pressable style={styles.container} onPress = {()=>setPickerVisible(true)} accessibilityRole="button" hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
        <ThemedText>Add Daily Event</ThemedText>
    </Pressable>

    <ThemedView style={styles.titleContainer}>
      <ThemedText type="subtitle">Today's Posts</ThemedText>
    </ThemedView>

    <Modal visible={pickerVisible} transparent animationType="slide" style={styles.modalContainer}>
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.fieldSheet}>
      <ThemedView>
        <ThemedText type="subtitle">New Message</ThemedText>
        <ImagePickerTile
          size={140}
          label='Add Image'
          onPicked={(uri)=>{
            console.log("Picked Image ", uri);
          }}
        />
      </ThemedView>

      <Pressable onPress={()=>setPickerVisible(false)}>
        <ThemedText >Done</ThemedText>
      </Pressable>
      </ThemedView>
      </ThemedView>
    </Modal>

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

    <Pressable style={styles.floatingContainer} onPress={handleQuickAddPost}>
      <ThemedText>+</ThemedText>
    </Pressable>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  fieldSheet: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 32,
    width: "100%",
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  picker: {
    height: 216, // standard iOS picker height
    width: '100%',
    color: "rgba(255, 255, 255, 1)"
  },
  pickerRow: {
    alignItems:"center",
    flexDirection:"row",
    paddingHorizontal: 80,
    backgroundColor: 'black',
  },
});
