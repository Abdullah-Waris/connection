import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { Modal, Pressable, StyleSheet, FlatList, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import {Picker} from "@react-native-picker/picker"

export default function Tab() {

  const { posts, archive } = useApp();
  const [ timePicker, setTimePicker ] = useState(false);
  const [draftHour, setDraftHour] = useState<Number|undefined>(undefined);
  const [draftMinute, setDraftMinute] = useState<Number|undefined>(undefined);
  const [draftSection, setDraftSection] = useState<string|undefined>(undefined);
  const [hour, setHour] = useState<Number|undefined>(undefined);
  const [minute, setMinute] = useState<Number|undefined>(undefined);
  const [section, setSection] = useState<string|undefined>(undefined);

  type Person = {
    id: string,
    name: string
  }

  const MOCK_PEOPLE: Person[] = [
    {id: uuidv4(), name: "Mom"},
    {id: uuidv4(), name: "Dad"},
    {id: uuidv4(), name: "You"}
  ]

  const HOURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  let MINUTES = [];
  for(let i=0; i<60; i++){
    if(i<10){
      MINUTES[i] = "0" + i;
    }else{
      MINUTES[i] = "" + i;
    }
  }

  function lastPosted(person: Person){
    for(const indPerson of posts){
      if(indPerson.author == person.name){
        return person.name + ": Last Posted Today " + indPerson.time;
      }
    }
    for(const indPerson of archive){
      if(indPerson.author == person.name){
        if(indPerson.date[0] == new Date().getFullYear() 
          && indPerson.date[1] == new Date().getMonth() 
          && indPerson.date[2] == new Date().getDate()-1){
            return person.name + ": Last Posted Yesterday " + indPerson.time;
        }else{
          return "Last Posted " + indPerson.date[1] + "/" + indPerson.date[2] + "/" + indPerson.date[0];
        }
      }
    }
    return person.name + ": No Posts";
  }

  function handleSetReminder(){
    setTimePicker(true);
  }

  function handleCancelPress(){
    setTimePicker(false);
  }

  function handleDonePress(){
    setTimePicker(false);
    setHour(draftHour);
    setMinute(draftMinute);
    setSection(draftSection);
  }

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Group Settings</ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedText type="subtitle">Invite Others:</ThemedText>
        <ThemedView style={{flexDirection:"row"}}>
          <Pressable onPress={()=>console.log("LINK!")}>
            <ThemedText>[Copy Invite Link]</ThemedText>
          </Pressable>

          <Pressable onPress={()=>console.log("QR CODE!")}>
            <ThemedText>[QR Code]</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedView>
        <ThemedText type="subtitle">Members:</ThemedText>
      </ThemedView>

      <FlatList
      data = {MOCK_PEOPLE}
      keyExtractor={(item)=>item.id}
      renderItem={({item}) => (
        <ThemedView>
        <ThemedText>
          {lastPosted(item)}
        </ThemedText>
        </ThemedView>
      )}
      ListEmptyComponent={
        <ThemedText>No Members</ThemedText>
      }
      />

      <ThemedView>
        <ThemedText type="subtitle">Reminders:</ThemedText>
        <ThemedText>Daily Reminder: {(hour ? hour + ":" + minute + " " + section:"None Set")}</ThemedText>
        <Pressable onPress={()=>handleSetReminder()}>
            <ThemedText>[Change Reminder]</ThemedText>
        </Pressable>
      </ThemedView> 

      <Modal visible={timePicker} transparent animationType="slide" style={styles.modalContainer}>
        <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.fieldSheet}>
              <ThemedView style={styles.pickerRow}>
              <Picker
              selectedValue={draftHour}
              onValueChange={(v=>setDraftHour(v))}
              style={styles.picker}
              >
                {HOURS.map(m=>(
                  <Picker.Item key={uuidv4()} label={m.toString()} value={m}/>
                ))}
              </Picker>

              <Picker
              selectedValue={draftMinute}
              onValueChange={(v=>setDraftMinute(v))}
              style={styles.picker}
              >
                {MINUTES.map(m=>(
                  <Picker.Item key={uuidv4()} label={m.toString()} value={m}/>
                ))}
              </Picker>

              <Picker
              selectedValue={draftSection}
              onValueChange={(v=>setDraftSection(v))}
              style={styles.picker}
              >
                <Picker.Item key={uuidv4()} label={"AM"} value={"AM"}/>
                <Picker.Item key={uuidv4()} label={"PM"} value={"PM"}/>
              </Picker>
            
              </ThemedView>
              <ThemedView style={{flexDirection: "row", width: "50%", justifyContent: "space-between"}}>
                <Pressable onPress={handleCancelPress}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={handleDonePress}>
                  <ThemedText>Done</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          </ThemedView>
      </Modal>     
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
    flexDirection: 'row',
    justifyContent:"center",
    alignItems: "center",
    gap: 8,
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
  picker: {
    height: 216, // standard iOS picker height
    width: '100%',
    color: "rgba(255, 255, 255, 1)"
  },
  pickerRow: {
    alignItems:"center",
    flexDirection:"row",
    paddingHorizontal: 120,
    backgroundColor: 'black',
  },
});
