import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  Switch,
} from "react-native";
import { useApp, Person } from "../context/AppContext";
import { Picker } from "@react-native-picker/picker";

export default function Tab() {
  const { posts, archive, people, theme, setTheme } = useApp();
  const isDark = theme === "dark";
  const [timePicker, setTimePicker] = useState(false);
  const [draftHour, setDraftHour] = useState<string | undefined>("1");
  const [draftMinute, setDraftMinute] = useState<string | undefined>("00");
  const [draftSection, setDraftSection] = useState<string | undefined>("AM");
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [minute, setMinute] = useState<string | undefined>(undefined);
  const [section, setSection] = useState<string | undefined>(undefined);

  const palette = isDark
    ? {
        bg: "#0f172a",
        card: "#1f2937",
        text: "#f8fafc",
        subtext: "#94a3b8",
        border: "rgba(248,250,252,0.05)",
        accent: "#f97316",
        overlay: "rgba(15,23,42,0.6)",
      }
    : {
        bg: "#f3f4f6",
        card: "#ffffff",
        text: "#0f172a",
        subtext: "#64748b",
        border: "rgba(15,23,42,0.08)",
        accent: "#f97316",
        overlay: "rgba(15,23,42,0.15)",
      };

  const HOURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]; // display
  let MINUTES: string[] = [];
  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      MINUTES[i] = "0" + i;
    } else {
      MINUTES[i] = "" + i;
    }
  }

  function lastPosted(person: Person) {
    // check today's posts first
    for (const indPerson of posts) {
      if (indPerson.author == person.name) {
        return person.name + ": Last Posted Today " + indPerson.time;
      }
    }
    // then archive
    for (const indPerson of archive) {
      if (indPerson.author == person.name) {
        if (
          indPerson.date[0] == new Date().getFullYear() &&
          indPerson.date[1] == new Date().getMonth() &&
          indPerson.date[2] == new Date().getDate() - 1
        ) {
          return person.name + ": Last Posted Yesterday " + indPerson.time;
        } else {
          return (
            "Last Posted " +
            (indPerson.date[1] + 1) +
            "/" +
            indPerson.date[2] +
            "/" +
            indPerson.date[0]
          );
        }
      }
    }
    return person.name + ": No Posts";
  }

  function handleSetReminder() {
    setTimePicker(true);
  }

  function handleCancelPress() {
    setTimePicker(false);
  }

  function handleDonePress() {
    setTimePicker(false);
    setHour(draftHour);
    setMinute(draftMinute);
    setSection(draftSection);
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: palette.bg }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* header */}
        <View style={styles.topBar}>
          <ThemedText type="title" style={[styles.title, { color: palette.text }]}>
            Group Settings
          </ThemedText>
        </View>

        {/* Invite section */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: palette.text }]}>Invite Others</ThemedText>
          <ThemedText style={{ color: palette.subtext, marginBottom: 10 }}>
            Share the group with family members.
          </ThemedText>
          <View style={styles.inlineButtons}>
            <Pressable onPress={() => console.log("LINK!")} style={[styles.secondaryBtn, { borderColor: palette.border }]}> 
              <ThemedText style={{ color: palette.text }}>Copy Invite Link</ThemedText>
            </Pressable>
            <Pressable onPress={() => console.log("QR CODE!")} style={[styles.secondaryBtn, { borderColor: palette.border }]}> 
              <ThemedText style={{ color: palette.text }}>QR Code</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Members */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: palette.text }]}>Members</ThemedText>
          <FlatList
            data={people}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: palette.border }]} />}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <View style={[styles.memberAvatar, { backgroundColor: isDark ? "#111827" : "#e2e8f0" }]}>
                  <Text style={{ color: palette.text, fontWeight: "700" }}>
                    {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ color: palette.text, fontWeight: "500" }}>{item.name}</ThemedText>
                  <ThemedText style={{ color: palette.subtext, fontSize: 12 }}>
                    {lastPosted(item)}
                  </ThemedText>
                </View>
              </View>
            )}
            ListEmptyComponent={<ThemedText style={{ color: palette.subtext }}>No Members</ThemedText>}
          />
        </View>

        {/* Reminders */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: palette.text }]}>Reminders</ThemedText>
          <ThemedText style={{ color: palette.subtext, marginBottom: 10 }}>
            Daily Reminder: {hour ? `${hour}:${minute} ${section}` : "None Set"}
          </ThemedText>
          <Pressable onPress={handleSetReminder} style={[styles.primaryBtn, { backgroundColor: palette.accent }]}> 
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>Change Reminder</ThemedText>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal visible={timePicker} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: palette.overlay }]}> 
          <View style={[styles.fieldSheet, { backgroundColor: palette.card }]}> 
            <ThemedText type="subtitle" style={{ color: palette.text, marginBottom: 12 }}>
              Select Reminder Time
            </ThemedText>
            <View style={[styles.pickerRow, { backgroundColor: isDark ? "#0f172a" : "#e2e8f0" }]}> 
              <Picker
                selectedValue={draftHour}
                onValueChange={(v) => setDraftHour(v)}
                style={[styles.picker, { color: palette.text }]}
                itemStyle={{ color: palette.text }}
              >
                {HOURS.map((m) => (
                  <Picker.Item key={uuidv4()} label={m.toString()} value={m} color={palette.text} />
                ))}
              </Picker>

              <Picker
                selectedValue={draftMinute}
                onValueChange={(v) => setDraftMinute(v)}
                style={[styles.picker, { color: palette.text }]}
                itemStyle={{ color: palette.text }}
              >
                {MINUTES.map((m) => (
                  <Picker.Item key={uuidv4()} label={m.toString()} value={m} color={palette.text} />
                ))}
              </Picker>

              <Picker
                selectedValue={draftSection}
                onValueChange={(v) => setDraftSection(v)}
                style={[styles.picker, { color: palette.text }]}
                itemStyle={{ color: palette.text }}
              >
                <Picker.Item key={uuidv4()} label={"AM"} value={"AM"} color={palette.text} />
                <Picker.Item key={uuidv4()} label={"PM"} value={"PM"} color={palette.text} />
              </Picker>
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={handleCancelPress}>
                <ThemedText style={{ color: palette.subtext }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleDonePress}>
                <ThemedText style={{ color: palette.text, fontWeight: "600" }}>Done</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  title: {
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
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  inlineButtons: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  memberRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 6,
  },
  memberAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
    marginVertical: 6,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  fieldSheet: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  pickerRow: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    flex: 1,
    height: 216,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});
