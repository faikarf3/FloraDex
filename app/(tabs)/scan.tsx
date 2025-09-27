import {
  AddPlantsHeader,
  IdentificationResults,
  ImageCaptureOptions,
  ImagePreview,
  LoadingOverlay,
} from "@/components/addPlants";
import { colors } from "@/constants/colors";
import { identifyPlant } from "@/services/plantnet";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IdentificationResult {
  label: string;
  score: number;
  scientificName: string;
  commonNames?: string[];
  family?: string;
  genus?: string;
}

export default function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IdentificationResult[] | null>(null);

  const pickFromLibrary = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8, // Good quality for PlantNet
        allowsEditing: true,
        aspect: [1, 1],
        exif: false, // Remove EXIF data for privacy
      });
      if (!res.canceled) {
        setPreview(res.assets[0].uri);
        setResults(null); // Clear previous results
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePhoto = async () => {
    try {
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8, // Good quality for PlantNet
        allowsEditing: true,
        aspect: [1, 1],
        exif: false, // Remove EXIF data for privacy
      });
      if (!res.canceled) {
        setPreview(res.assets[0].uri);
        setResults(null); // Clear previous results
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const runIdentify = async () => {
    try {
      if (!preview) return;
      
      setLoading(true);
      setResults(null);
      
      // Get PlantNet API key from environment
      const apiKey = process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
      if (!apiKey || apiKey === "YOUR_PLANTNET_API_KEY_HERE") {
        Alert.alert(
          "Configuration Error", 
          "PlantNet API key not configured. Please add your API key to the .env file."
        );
        return;
      }
      
      // Direct PlantNet API call
      const results = await identifyPlant(preview, "leaf", apiKey);
      
      // Show top 5 results
      setResults(results.slice(0, 5));
    } catch (e: any) {
      let errorMessage = "Unknown error occurred";
      
      if (e.message.includes("401") || e.message.includes("unauthorized")) {
        errorMessage = "Invalid PlantNet API key. Please check your configuration.";
      } else if (e.message.includes("429") || e.message.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (e.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else {
        errorMessage = e.message || "Unknown error occurred";
      }
      
      Alert.alert("Identification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToInventory = (result: IdentificationResult) => {
    Alert.alert(
      "Add to Inventory",
      `Add "${result.label}" to your plant collection?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: () => {
            // TODO: Implement adding to inventory
            Alert.alert("Success", "Plant added to your inventory!");
            setPreview(null);
            setResults(null);
          },
        },
      ]
    );
  };

  const handleTryAgain = () => {
    setPreview(null);
    setResults(null);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setResults(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddPlantsHeader />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!preview && !results && (
          <ImageCaptureOptions
            onTakePhoto={takePhoto}
            onPickFromGallery={pickFromLibrary}
            disabled={loading}
          />
        )}

        {preview && !results && (
          <ImagePreview
            imageUri={preview}
            onRemove={handleRemoveImage}
            onIdentify={runIdentify}
            loading={loading}
          />
        )}

        {results && (
          <IdentificationResults
            results={results}
            onAddToInventory={handleAddToInventory}
            onTryAgain={handleTryAgain}
          />
        )}
      </ScrollView>

      <LoadingOverlay visible={loading} message="Identifying plant..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
