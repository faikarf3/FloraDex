import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AddPlantModal() {
  const [plantName, setPlantName] = useState("");
  const router = useRouter();

  const handleSave = () => {
    console.log("Plant saved:", plantName);
    router.back(); // 👈 closes modal
  };

  return (
    <View style={styles.modalContainer}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Add New Plant</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.modalBody}>
        <TextInput
          style={styles.input}
          placeholder="Enter plant name..."
          value={plantName}
          onChangeText={setPlantName}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  modalBody: {
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
  },
});
