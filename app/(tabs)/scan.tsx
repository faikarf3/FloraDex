import { auth } from "@/config/firebase";
import { identifyByUrl } from "@/services/identify";
import { uploadTempScan } from "@/services/storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Image, Text, View } from "react-native";


export default function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ label: string; score: number }[] | null>(null);

  async function ensureMediaLibPerm() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photo library.");
      return false;
    }
    return true;
  }
  
  async function ensureCameraPerm() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need camera access to take a photo.");
      return false;
    }
    return true;
  }

  const pickFromLibrary = async () => {
    if (!(await ensureMediaLibPerm())) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) {
      setPreview(res.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    if (!(await ensureCameraPerm())) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled && res.assets?.length) {
      setPreview(res.assets[0].uri);
    }
  };
  

  const runIdentify = async () => {
    try {
      if (!preview) return;
      if (!auth.currentUser) { Alert.alert("Sign in required"); return; }
      setLoading(true);
      setResult(null);
      const { downloadUrl } = await uploadTempScan(auth.currentUser.uid, preview);
      const data = await identifyByUrl(downloadUrl, "leaf");
      setResult(data.summary.slice(0, 2));
    } catch (e: any) {
      Alert.alert("Identify failed", e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:20, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:"600" }}>Scan</Text>
      <Button title="Pick from library" onPress={pickFromLibrary} />
      <Button title="Take a photo" onPress={takePhoto} />
      {preview && <Image source={{ uri: preview }} style={{ width:"100%", aspectRatio:1, borderRadius:12 }} />}
      <Button title="Identify with PlantNet" onPress={runIdentify} disabled={!preview || loading} />
      {loading && <ActivityIndicator />}

      {result && (
        <View style={{ gap:8 }}>
          <Text style={{ fontWeight:"600", marginTop:12 }}>Top 2</Text>
          {result.map((r, i) => (
            <View key={i} style={{ padding:12, borderWidth:1, borderRadius:8 }}>
              <Text>{r.label}</Text>
              <Text style={{ opacity:0.7 }}>score: {Math.round(r.score * 100)}%</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
