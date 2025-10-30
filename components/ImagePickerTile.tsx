import {useState} from "react";
import { Pressable, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "./ThemedView";

type Props = {
    size?:number;
    onPicked?: (uri: string) => void;
    label?: string;
};

export default function ImagePickerTile({size=120, onPicked, label="Add Photo"}: Props){
    const [uri, setUri] = useState<string | null>(null);

    async function handlePick(){
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
            const pickedUri = result.assets[0].uri
            setUri(pickedUri);
            onPicked?.(pickedUri);
        }
    }

    return(
        <Pressable onPress={handlePick} style={[styles.tile, { width: size, height: size }]}>
            {uri ? (
                <Image source={{uri}} style={styles.image}></Image>
            ): (
            <ThemedView style={styles.placeholder}>
                <Text style={styles.plus}>＋</Text>
                <Text style={styles.label}>{label}</Text>
            </ThemedView>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#999",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  plus: {
    fontSize: 28,
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
});