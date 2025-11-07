import ImagePickerTile from '@/components/ImagePickerTile';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { Modal, Pressable, StyleSheet, FlatList, Text, View, Image, TextInput } from "react-native";
import { useApp } from "../context/AppContext";
import * as ImagePicker from "expo-image-picker";

export default function Tab(){
    const {avatar, setAvatar} = useApp();
    const {displayName, setDisplayName} = useApp();
    const {archive} = useApp();
    const {posts} = useApp();
    const {totalPosts} = useApp();

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
            const pickedAvatar = result.assets[0].uri
            setAvatar(pickedAvatar);
        }
    }

    function getStreak(): number {
        // Collect unique posting days (avoid counting multiple posts per day)
        const userDates = new Set(
            archive
            .filter((item) => item.author === "You")
            .map((item) => `${item.date[0]}-${item.date[1]}-${item.date[2]}`)
        );

        // Start from yesterday
        const today = new Date();
        let d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        let streak = 0;

        while (true) {
            const y = d.getFullYear();
            const m = d.getMonth(); // 0-indexed
            const day = d.getDate();

            const key = `${y}-${m}-${day}`;

            if (userDates.has(key)) {
            streak += 1;
            // move one calendar day back
            d = new Date(y, m, day - 1);
            } else {
            break;
            }
        }

        return streak;
    }

    function handleThemeChange(){
        console.log("Theme Changed");
    }

    function handleSignOut(){
        console.log("Sign Out");
    }

    return(
        <ThemedView>
            <ThemedView style={styles.titleContainer}>
            <ThemedText type='title'>Profile</ThemedText>
            </ThemedView>

            <ThemedView style={styles.subtitle}>
                {avatar==null ? (<ThemedText>👤</ThemedText>):(<Image source={{uri: avatar}} style={{ width: 40, height: 40 }}></Image>)}
                <ThemedText type='subtitle'>  Avatar</ThemedText>
            </ThemedView>
            <ThemedView>
                <Pressable onPress={handleChangeAvatar}>
                    <ThemedText>[Change Avatar]</ThemedText>
                </Pressable>
            </ThemedView>

            <ThemedView style={styles.subtitle}>
                <ThemedText>Display Name: </ThemedText>
                <TextInput value={displayName} 
                onChangeText={setDisplayName} 
                placeholder='Input Display Name'
                />
            </ThemedView>

            <ThemedView>
                <ThemedText type='subtitle'>Stats</ThemedText>
            </ThemedView>
            <ThemedView>
                <ThemedText>🔥 Streak: {getStreak()}</ThemedText>
                <ThemedText>📝 Total Posts: {totalPosts}</ThemedText>
            </ThemedView>

            <ThemedView>
                <ThemedText type='subtitle'>Theme</ThemedText>
                <ThemedView style={styles.subtitle}>
                    <Pressable onPress={handleThemeChange}>
                        <ThemedText>[Light]</ThemedText>
                    </Pressable>
                    <Pressable>
                        <ThemedText onPress={handleThemeChange}>[Dark]</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>

            <ThemedView>
                <Pressable onPress={handleSignOut}>
                    <ThemedText>[Sign Out]</ThemedText>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleContainer: {
    flexDirection: 'row',
    justifyContent:"center",
    alignItems: "center",
    gap: 8,
  },
  subtitle: {
    flexDirection:"row",
    paddingHorizontal: 5,
  }
});