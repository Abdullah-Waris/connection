import ImagePickerTile from '@/components/ImagePickerTile';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Image, TextInput, ScrollView, Switch } from "react-native";
import { useApp } from "../context/AppContext";
import * as ImagePicker from "expo-image-picker";

export default function Tab(){
    // existing context usage – unchanged
    const {avatar, setAvatar} = useApp();
    const {displayName, setDisplayName} = useApp();
    const {archive} = useApp();
    const {posts} = useApp();

    const { theme, setTheme } = useApp();
    const isDark = theme === "dark";

    const palette = isDark
      ? {
          bg: "#0f172a",
          card: "#1f2937",
          text: "#f8fafc",
          subtext: "#cbd5f5",
          border: "rgba(248,250,252,0.1)",
          accent: "#f97316"
        }
      : {
          bg: "#f3f4f6",
          card: "#ffffff",
          text: "#0f172a",
          subtext: "#64748b",
          border: "rgba(15,23,42,0.08)",
          accent: "#f97316"
        };

    async function handleChangeAvatar(){
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!perm.granted){
            console.log("Perms denied for photo library");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[1,1],
            quality: 0.9
        });

        if(!result.canceled){
            const pickedAvatar = result.assets[0].uri;
            setAvatar(pickedAvatar);
        }
    }

    // your helper – kept for compatibility (not used in the new streak version)
    function getLastDayOfMonth(year: number, month: number): number {
        const date = new Date(year, month, 0);
        return date.getDate();
    }

    // streak: start from yesterday, count unique days where author === "You"
    function getStreak(): number {
        const userDates = new Set(
          archive
            .filter((item) => item.author === "You")
            .map((item) => `${item.date[0]}-${item.date[1]}-${item.date[2]}`)
        );

        const today = new Date();
        let d = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1
        );

        let streak = 0;

        while (true) {
          const y = d.getFullYear();
          const m = d.getMonth();
          const day = d.getDate();
          const key = `${y}-${m}-${day}`;

          if (userDates.has(key)) {
            streak += 1;
            d = new Date(y, m, day - 1);
          } else {
            break;
          }
        }

        return streak;
    }

    return(
        <ThemedView style={[styles.screen, { backgroundColor: palette.bg }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* top bar */}
            <View style={styles.topBar}>
              <ThemedText type='title' style={[styles.topTitle, { color: palette.text }]}>Settings</ThemedText>
              <View style={styles.themeToggle}>
                <Text style={{ color: palette.subtext, marginRight: 6, fontSize: 12 }}>
                  {isDark ? "Dark" : "Light"}
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={(v) => setTheme(v ? "dark" : "light")}
                  thumbColor={isDark ? palette.accent : "#fff"}
                  trackColor={{ true: "rgba(249,115,22,0.4)", false: "rgba(15,23,42,0.15)" }}
                />
              </View>
            </View>

            {/* PROFILE CARD */}
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={styles.profileRow}>
                {avatar==null ? (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? "#111827" : "#e2e8f0" }]}>
                    <Text style={{ fontSize: 26 }}>👤</Text>
                  </View>
                ):(
                  <Image source={{uri: avatar}} style={styles.avatarImage} />
                )}

                <View style={styles.profileInfo}>
                  <ThemedText type='subtitle' style={[styles.displayNameLabel, { color: palette.subtext }]}>
                    Display Name
                  </ThemedText>
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder='Input Display Name'
                    placeholderTextColor={isDark ? "rgba(203,213,225,0.4)" : "#94a3b8"}
                    style={[
                      styles.displayNameInput,
                      {
                        color: palette.text,
                        borderColor: palette.border,
                        backgroundColor: isDark ? "rgba(15,23,42,0.4)" : "#fff"
                      }
                    ]}
                  />
                  <Pressable onPress={handleChangeAvatar} style={[styles.avatarButton, { borderColor: palette.border }]}>
                    <Text style={[styles.avatarButtonText, { color: palette.text }]}>Change Avatar</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* STATS CARD */}
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={styles.cardHeader}>
                <ThemedText type='subtitle' style={[styles.cardTitle, { color: palette.text }]}>Stats</ThemedText>
                <Text style={{ color: palette.subtext, fontSize: 12 }}>Your activity snapshot</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statPill, { backgroundColor: isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.08)", borderColor: "rgba(249,115,22,0.2)" }]}>
                  <Text style={[styles.statLabel, { color: palette.subtext }]}>🔥 Streak</Text>
                  <Text style={[styles.statValue, { color: palette.text }]}>{getStreak()}</Text>
                </View>

                <View style={[styles.statPill, { backgroundColor: isDark ? "rgba(148,163,184,0.06)" : "rgba(148,163,184,0.12)", borderColor: "transparent" }]}>
                  <Text style={[styles.statLabel, { color: palette.subtext }]}>Posts</Text>
                  <Text style={[styles.statValue, { color: palette.text }]}>{posts?.length ?? 0}</Text>
                </View>
              </View>
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  topTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  profileRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 999,
  },
  profileInfo: {
    flex: 1,
  },
  displayNameLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  displayNameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    marginBottom: 8,
  },
  avatarButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  avatarButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardHeader: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  matchRow: {
    flexDirection: "row",
    gap: 10,
  },
  matchTile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
});