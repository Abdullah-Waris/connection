import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {Picker} from "@react-native-picker/picker"

const MOCK_ARCHIVE = [
  { id: uuidv4(), author: 'Mom', time: '09:15', message: 'Morning walk 🌳', date: [2025, 7, 29] },
  { id: uuidv4(), author: 'Dad', time: '12:15', message: 'Lunch 🍔', date: [2025, 7, 4]},
  { id: uuidv4(), author: 'Tom', time: '02:00', message: 'FUN! YAY', date: [2025, 7, 4]}
  ]

export default function Tab() {

  const[current, setCurrent] = useState(new Date);
  const[pickerVisible, setPickerVisible] = useState(false);
  const[draftMonth, setDraftMonth] = useState(current.getMonth());
  const[draftYear, setDraftYear] = useState(current.getFullYear());
  const [archive, setArchive] = useState(MOCK_ARCHIVE);

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
  const YEARS = Array.from({length:20}, (_,i) => ({
    label: (currentYear - 10 + i).toString(),
    value: currentYear -10 +i
  }));

  function handleFArrow(){
    setCurrent(d => new Date(d.getFullYear(), d.getMonth()+1, 1));
  }
  function handleBArrow(){
    setCurrent(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
  }

  function openPicker(){
    setDraftMonth(current.getMonth());
    setDraftYear(current.getFullYear());
    setPickerVisible(true);
  }

  function confirmPicker(){
    setCurrent(new Date(draftYear, draftMonth, 1));
    setPickerVisible(false);
  }

  useEffect(() => {
    setCurrent(d => new Date(d.getFullYear(), d.getMonth(), 1));
  }, [])

  function handleDonePress(){
    setCurrent(new Date(Number(draftYear), Number(draftMonth), 1));
    setPickerVisible(false);
  }

  const title = current.toLocaleString(undefined, {month: "long", year: "numeric"});

  return (
    <ThemedView>

    <ThemedView style = {styles.titleContainer}>
        <Pressable onPress={handleBArrow} hitSlop={{ top: 8, left: 16, right: 16, bottom: 8 }}>
          <ThemedText>{"←"}</ThemedText>
        </Pressable>

        <ThemedText type="title">{title}</ThemedText>

        <Pressable onPress={handleFArrow} hitSlop={{ top: 8, left: 16, right: 16, bottom: 8 }}>
          <ThemedText>{"→"}</ThemedText>
        </Pressable>
    </ThemedView>

    <ThemedView style={styles.titleContainer}>
      <Pressable onPress={()=> setPickerVisible(true)}>
        <ThemedText>{"Show Picker"}</ThemedText>
      </Pressable>
    </ThemedView>

    <Modal visible={pickerVisible} transparent animationType="slide">
    <View style = {styles.modalContainer}>
      <View style = {styles.pickerSheet}>
        <View style = {styles.pickerRow}>
        {/* Month Picker */}
      {pickerVisible && (
      <Picker 
      selectedValue={draftMonth}
      onValueChange={(v=> setDraftMonth(v))}
      style={styles.picker}
      >
        {MONTHS.map(m=>(
          <Picker.Item key={m.value} label={m.label} value={m.value} />
        ))}
      </Picker>
      )}

      {/* Year Picker */}
      {pickerVisible && (
      <Picker
      selectedValue={draftYear}
      onValueChange={(v=>setDraftYear(v))}
      style={styles.picker}
      >
        {YEARS.map(m=>(
          <Picker.Item key={m.value} label={m.label} value={m.value}/>
        ))}
      </Picker>
      )}
      </View>
      <View style={styles.pickerHeader}>
      <Pressable onPress={()=>handleDonePress()}>
        <ThemedText>Done</ThemedText>
      </Pressable>
      </View> 
      </View>

    </View>
    </Modal>

    <ThemedView>
      {archive
      .filter(e => e.date[0] === draftYear && e.date[1] === draftMonth)
      .map((entry) => {
        const [y, m, d] = entry.date;
        const matches = MOCK_ARCHIVE.filter(a => 
          a.date[0] == draftYear &&
          a.date[1] == draftMonth &&
          a.date[2] == d
        );

        if(matches.length==0) return null;

        return(
        <ThemedView key={`day-${y}-${m}-${d}`}>
          <ThemedView>
            <ThemedText type="title" style={styles.subtitle}>
              {MONTHS[draftMonth].label + " "}
              {d}
            </ThemedText>
            {matches.map((a) => (
            <ThemedView key={a.id ?? `post-${a.author}-${a.time}`}>
              <ThemedText type="subtitle">{a.author} · {a.time}</ThemedText>
              <ThemedText>{a.message}</ThemedText>
            </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        )
      })}
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
    flexDirection: "row",
    gap: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  pickerSheet: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 32,
    width: "100%",
  },
  pickerHeader: {
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
  subtitle: {
    flexDirection:"row",
    paddingHorizontal: 5,
  }
});
