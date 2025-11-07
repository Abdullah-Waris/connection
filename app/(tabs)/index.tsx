import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, Image, View, Switch, ScrollView } from "react-native";
import { FlatList } from 'react-native';
import ImagePickerTile from '@/components/ImagePickerTile';
import { useApp, Post } from "../context/AppContext";

const placeholderPost: Post = {
  id: "Placeholder",
  author: "Placeholder",
  time: "Placeholder",
  message: "PlaceHolder",
  date: [1, 1, 1],
};

export default function Tab() {
  const { posts, setPosts, totalPosts, setTotalPosts, theme, setTheme } = useApp();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [text, setText] = useState("");
  const [uri, setUri] = useState<string | undefined>(undefined);
  const isDark = theme === "dark";

  const palette = isDark
    ? {
        bg: "#0f172a",
        card: "#1f2937",
        text: "#f8fafc",
        subtext: "#94a3b8",
        border: "rgba(248,250,252,0.05)",
        accent: "#f97316",
      }
    : {
        bg: "#f3f4f6",
        card: "#ffffff",
        text: "#0f172a",
        subtext: "#64748b",
        border: "rgba(15,23,42,0.08)",
        accent: "#22c55e",
      };

  const date: [number, number, number] = [
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ];

  function handleQuickAddPost() {
    const newPost = {
      id: uuidv4(),
      author: "You",
      time: new Date().toLocaleTimeString(),
      message: "Test Post!",
      date,
    };
    setTotalPosts(totalPosts + 1);
    setPosts([newPost, ...posts]);
  }

  function handleDonePress() {
    setPickerVisible(false);
    placeholderPost.message = text;
    placeholderPost.image = uri;
    setTotalPosts(totalPosts + 1);
    const newPostBase = {
      id: uuidv4(),
      author: "You",
      time: new Date().toLocaleTimeString(),
      message: placeholderPost.message,
      date,
    };

    const newPost: Post = {
      ...newPostBase,
      ...(placeholderPost.image ? { image: placeholderPost.image } : {}),
    };

    setUri(undefined);
    setText("");
    setPosts([newPost, ...posts]);
  }

  function handleCancelPress() {
    setPickerVisible(false);
    setUri(undefined);
  }

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ThemedView style={[styles.screen, { backgroundColor: palette.bg }]}>
      {/* header + add button */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="title" style={[styles.appTitle, { color: palette.text }]}>Family Thread</ThemedText>
          <ThemedText type="default" style={{ color: palette.subtext, marginTop: 2 }}>{todayLabel}</ThemedText>
        </View>
      </View>

      <Pressable
        style={[styles.addCard, { backgroundColor: palette.card, borderColor: palette.border }]}
        onPress={() => setPickerVisible(true)}
      >
        <ThemedText style={{ color: palette.text, fontWeight: "600" }}>Add Daily Event</ThemedText>
        <ThemedText style={{ color: palette.subtext, fontSize: 12 }}>Capture today’s update for the family</ThemedText>
      </Pressable>

      <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.text }]}>Today's Posts</ThemedText>

      {/* posts list */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 12 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.postCard, { backgroundColor: palette.card, borderColor: palette.border }]}> 
            <ThemedText type="subtitle" style={{ color: palette.text, marginBottom: 4 }}>
              {item.author} · {item.time}
            </ThemedText>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
            <ThemedText style={{ color: palette.text }}>{item.message}</ThemedText>
            <ThemedText style={{ color: palette.subtext, fontSize: 11, marginTop: 6 }}>
              {item.date[0]}-{item.date[1] + 1}-{item.date[2]}
            </ThemedText>
          </View>
        )}
        ListEmptyComponent={
          <ThemedText style={{ color: palette.subtext, textAlign: "center", marginTop: 20 }}>
            No posts yet today!
          </ThemedText>
        }
      />

      {/* modal for new post */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? "rgba(15,23,42,0.55)" : "rgba(15,23,42,0.25)" }]}>
          <View style={[styles.modalCard, { backgroundColor: palette.card, borderColor: palette.border }]}> 
            <ThemedText type="subtitle" style={{ color: palette.text, marginBottom: 12 }}>
              New Message
            </ThemedText>
            <ImagePickerTile
              size={140}
              label='Add Image'
              onPicked={(newUri) => {
                setUri(newUri);
              }}
            />
            <View style={styles.boxDescription}>
              <ThemedText style={{ color: palette.text, marginRight: 6 }}>Message:</ThemedText>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder='Input Message'
                placeholderTextColor={palette.subtext}
                style={[styles.input, { color: palette.text, borderColor: palette.border }]}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={handleCancelPress} style={styles.modalButton}>
                <ThemedText style={{ color: palette.subtext }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleDonePress} style={[styles.modalButtonPrimary, { backgroundColor: palette.accent }] }>
                <ThemedText style={{ color: "#fff" }}>Done</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* floating button */}
      <Pressable style={[styles.floatingContainer, { backgroundColor: palette.accent }]} onPress={handleQuickAddPost}>
        <ThemedText style={{ color: "white", fontSize: 26, lineHeight: 26 }}>+</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  addCard: {
    marginHorizontal: 16,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 2,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "600",
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  boxDescription: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    alignSelf: "stretch",
    marginTop: 6,
  },
  modalButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  modalButtonPrimary: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  floatingContainer: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
