import {
  AddPlantsHeader,
  IdentificationResults,
  ImageCaptureOptions,
  ImagePreview,
  LoadingOverlay,
} from "@/components/addPlants";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/colors";
import { identifyByUrl } from "@/services/identify";
import { uploadTempScan } from "@/services/storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IdentificationResult {
  label: string;
  score: number;
}

export default function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IdentificationResult[] | null>(null);

  const pickFromLibrary = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        aspect: [1, 1],
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
        quality: 0.9,
        allowsEditing: true,
        aspect: [1, 1],
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
      if (!auth.currentUser) {
        Alert.alert("Sign in required", "Please sign in to identify plants");
        return;
      }
      
      setLoading(true);
      setResults(null);
      
      const { downloadUrl } = await uploadTempScan(auth.currentUser.uid, preview);
      const data = await identifyByUrl(downloadUrl, "leaf");
      
      // Show top 5 results instead of just 2
      setResults(data.summary.slice(0, 5));
    } catch (e: any) {
      Alert.alert("Identification Failed", e.message || "Unknown error occurred");
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
