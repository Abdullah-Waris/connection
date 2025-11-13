import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Image, ScrollView, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useApp } from "../context/AppContext";

export default function Tab() {
  const { archive, theme, setTheme } = useApp();
  const isDark = theme === 'dark';
  const [current, setCurrent] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [draftMonth, setDraftMonth] = useState(current.getMonth());
  const [draftYear, setDraftYear] = useState(current.getFullYear());

  const palette = isDark
    ? {
        bg: "#0f172a",
        card: "#1f2937",
        text: "#f8fafc",
        subtext: "#94a3b8",
        border: "rgba(248,250,252,0.05)",
        overlay: "rgba(15,23,42,0.55)",
      }
    : {
        bg: "#f3f4f6",
        card: "#ffffff",
        text: "#0f172a",
        subtext: "#64748b",
        border: "rgba(15,23,42,0.08)",
        overlay: "rgba(15,23,42,0.13)",
      };

  const MONTHS = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 20 }, (_, i) => ({
    label: (currentYear - 10 + i).toString(),
    value: currentYear - 10 + i,
  }));

  function handleFArrow() {
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    setCurrent(next);
    const month = next.getMonth();
    const year = next.getFullYear();
    setDraftMonth(month);
    setDraftYear(year);
  }

  function handleBArrow() {
    const next = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    setCurrent(next);
    const month = next.getMonth();
    const year = next.getFullYear();
    setDraftMonth(month);
    setDraftYear(year);
  }

  useEffect(() => {
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth(), 1));
  }, []);

  function handleDonePress() {
    setCurrent(new Date(Number(draftYear), Number(draftMonth), 1));
    setPickerVisible(false);
  }

  const title = current.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const monthly = archive
    .filter((e) => e.date[0] === draftYear && e.date[1] === draftMonth)
    .sort((a, b) => a.date[2] - b.date[2]);

  let lastDay: number | null = null;
  const rows: React.ReactNode[] = [];

  for (const entry of monthly) {
    const [, , d] = entry.date;
    if (d !== lastDay) {
      rows.push(
        <View key={`day-${draftYear}-${draftMonth}-${d}`} style={styles.dayHeader}> 
          <Text style={[styles.dayHeaderText, { color: palette.text }]}>
            {MONTHS[draftMonth].label + " "}{d}
          </Text>
        </View>
      );
      lastDay = d;
    }

    rows.push(
      <View key={entry.id} style={[styles.entryCard, { backgroundColor: palette.card, borderColor: palette.border }]}> 
        <Text style={[styles.entryMeta, { color: palette.subtext }]}>
          {entry.author} · {entry.time}
        </Text>
        {entry.image && (
          <Image source={{ uri: entry.image }} style={styles.entryImage} />
        )}
        <Text style={[styles.entryMessage, { color: palette.text }]}>{entry.message}</Text>
      </View>
    );
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: palette.bg }]}> 
      <View style={styles.topBar}>
        <ThemedText type="title" style={[styles.title, { color: palette.text }]}>Archive</ThemedText>
      </View>

      {/* month selector header */}
      <View style={[styles.monthHeader, { backgroundColor: palette.card, borderColor: palette.border }]}> 
        <Pressable onPress={handleBArrow} hitSlop={{ top: 8, left: 16, right: 16, bottom: 8 }}>
          <Text style={{ color: palette.text, fontSize: 20 }}>←</Text>
        </Pressable>
        <Pressable onPress={() => setPickerVisible(true)}>
          <Text style={{ color: palette.text, fontWeight: "600" }}>{title}</Text>
        </Pressable>
        <Pressable onPress={handleFArrow} hitSlop={{ top: 8, left: 16, right: 16, bottom: 8 }}>
          <Text style={{ color: palette.text, fontSize: 20 }}>→</Text>
        </Pressable>
      </View>

      {/* archive entries */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {rows.length > 0 ? (
          rows
        ) : (
          <Text style={{ color: palette.subtext, textAlign: "center", marginTop: 20 }}>
            No posts for this month.
          </Text>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* month/year picker modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: palette.overlay }]}> 
          <View style={[styles.pickerSheet, { backgroundColor: palette.card }]}> 
            <View style={styles.pickerRow}>
              {pickerVisible && (
                <Picker
                  selectedValue={draftMonth}
                  onValueChange={(v) => setDraftMonth(v)}
                  style={[styles.picker, { color: palette.text }]}
                  itemStyle={{ color: palette.text }}
                >
                  {MONTHS.map((m) => (
                    <Picker.Item key={m.value} label={m.label} value={m.value} />
                  ))}
                </Picker>
              )}

              {pickerVisible && (
                <Picker
                  selectedValue={draftYear}
                  onValueChange={(v) => setDraftYear(v)}
                  style={[styles.picker, { color: palette.text }]}
                  itemStyle={{ color: palette.text }}
                >
                  {YEARS.map((m) => (
                    <Picker.Item key={m.value} label={m.label} value={m.value} />
                  ))}
                </Picker>
              )}
            </View>
            <View style={styles.pickerFooter}>
              <Pressable onPress={() => setPickerVisible(false)}>
                <Text style={{ color: palette.subtext, marginRight: 16 }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleDonePress}>
                <Text style={{ color: palette.text, fontWeight: "600" }}>Done</Text>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthHeader: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  dayHeader: {
    marginTop: 12,
    marginBottom: 4,
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  entryCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  entryMeta: {
    fontSize: 12,
  },
  entryMessage: {
    fontSize: 14,
  },
  entryImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pickerSheet: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  picker: {
    flex: 1,
    height: 216,
  },
  pickerFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
});
