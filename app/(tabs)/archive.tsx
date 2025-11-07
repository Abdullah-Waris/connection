import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Modal, Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import {Picker} from "@react-native-picker/picker"
import { useApp } from "../context/AppContext";

export default function Tab() {
  const { archive } = useApp();
  const[current, setCurrent] = useState(new Date());
  const[pickerVisible, setPickerVisible] = useState(false);
  const[draftMonth, setDraftMonth] = useState(current.getMonth());
  const[draftYear, setDraftYear] = useState(current.getFullYear());

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
    const next = new Date(current.getFullYear(), current.getMonth()+1, 1);
    setCurrent(next);
    const month = next.getMonth();
    const year = next.getFullYear();
    setDraftMonth(month);
    setDraftYear(year);
  }
  function handleBArrow(){
    const next = new Date(current.getFullYear(), current.getMonth()-1, 1);
    setCurrent(next);
    const month = next.getMonth();
    const year = next.getFullYear();
    setDraftMonth(month);
    setDraftYear(year);
  }

  useEffect(() => {
    setCurrent(d => new Date(d.getFullYear(), d.getMonth(), 1));
  }, [])

  function handleDonePress(){
    setCurrent(new Date(Number(draftYear), Number(draftMonth), 1));
    setPickerVisible(false);
  }

  const title = current.toLocaleString(undefined, {month: "long", year: "numeric"});

  const monthly = archive
  .filter(e => e.date[0] === draftYear && e.date[1] === draftMonth)
  .sort((a,b)=>a.date[2]-b.date[2]);

  let lastDay: number | null=null;
  const rows : React.ReactNode[] = [];

  for(const entry of monthly){
    const [, , d] = entry.date;
    if(d != lastDay){
      rows.push(
        <ThemedView key={`day-${draftYear}-${draftMonth}-${d}`}>
        <ThemedText type="title" style={styles.subtitle}>
          {MONTHS[draftMonth].label + " "}{d}
        </ThemedText>
      </ThemedView>
      );
      lastDay=d;
    }

    rows.push(
    <ThemedView key={entry.id}>
      <ThemedText type="subtitle">{entry.author} · {entry.time}</ThemedText>
        {entry.image && <Image source={{ uri: entry.image }} style={{ width: 200, height: 200 }} />} 
      <ThemedText>{entry.message}</ThemedText>
    </ThemedView>
  );
  }

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
        <ThemedView key={uuidv4()}>
          {rows}
        </ThemedView>
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
    backgroundColor: 'black',
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
