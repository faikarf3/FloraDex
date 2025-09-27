import { auth } from "@/config/firebase";
import { identifyByUrl } from "@/services/identify";
import { uploadTempScan } from "@/services/storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// FloraDex Color Theme
export const colors = {
  navbar: '#2D5016',
  buttons: '#6B8E4E',
  cards: '#F5E6D3',
  background: '#819067',
  text: {
    primary: '#2D5016',
    secondary: '#6B8E4E',
    light: '#FEFCF8',
    muted: '#8B9A7A',
  },
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  buttonHover: '#5A7A42',
  buttonPressed: '#4A6A32',
  cardHover: '#F0DCC0',
  border: '#E0D5C7',
  divider: '#D4C4B0',
};

function NiceButton({
  title,
  icon,
  color,
  onPress,
  disabled,
}: {
  title: string;
  icon?: React.ReactNode;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: disabled ? colors.divider : color,
        paddingVertical: 14,
        borderRadius: 10,
        marginVertical: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
      activeOpacity={0.85}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Text style={{ color: colors.text.light, fontWeight: "600", fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ label: string; score: number }[] | null>(null);

  const pickFromLibrary = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9
    });
    if (!res.canceled) setPreview(res.assets[0].uri);
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled) setPreview(res.assets[0].uri);
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

  const runIdentifyUrl = async () => {
    try {
      if (!url.trim()) return;
      setLoading(true);
      setResult(null);
      const data = await identifyByUrl(url.trim(), "leaf");
      setResult(data.summary.slice(0, 2));
    } catch (e: any) {
      Alert.alert("Identify failed", e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <MaterialCommunityIcons name="leaf" size={32} color={colors.text.primary} />
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text.primary }}>
            FloraDex Scan
          </Text>
        </View>

        <Text style={{ color: colors.text.muted, fontSize: 15, marginBottom: 4 }}>
          Identify plants by uploading a photo or pasting an image URL.
        </Text>

        <NiceButton
          title="Pick from Library"
          icon={<Ionicons name="image-outline" size={20} color={colors.text.light} />}
          color={colors.buttons}
          onPress={pickFromLibrary}
        />
        <NiceButton
          title="Take a Photo"
          icon={<Ionicons name="camera-outline" size={20} color={colors.text.light} />}
          color={colors.buttons}
          onPress={takePhoto}
        />

        <View style={{
          backgroundColor: colors.cards,
          borderRadius: 10,
          padding: 12,
          marginVertical: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <Text style={{ color: colors.text.primary, fontWeight: "600", marginBottom: 6 }}>
            Or paste an image URL:
          </Text>
          <TextInput
            placeholder="Paste image URL…"
            autoCapitalize="none"
            value={url}
            onChangeText={setUrl}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              backgroundColor: colors.cardHover,
              color: colors.text.primary,
              marginBottom: 8,
            }}
          />
          <NiceButton
            title="Identify from URL"
            icon={<Ionicons name="link-outline" size={18} color={colors.text.light} />}
            color={colors.info}
            onPress={runIdentifyUrl}
            disabled={loading || !url.trim()}
          />
        </View>

        {preview && (
          <View style={{
            alignItems: "center",
            marginVertical: 8,
          }}>
            <Image
              source={{ uri: preview }}
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: colors.border,
                marginBottom: 8,
              }}
              resizeMode="cover"
            />
            <NiceButton
              title="Identify with PlantNet"
              icon={<MaterialCommunityIcons name="magnify" size={20} color={colors.text.light} />}
              color={colors.success}
              onPress={runIdentify}
              disabled={!preview || loading}
            />
          </View>
        )}

        {loading && (
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <ActivityIndicator color={colors.buttons} size="large" />
            <Text style={{ color: colors.text.muted, marginTop: 8 }}>Identifying…</Text>
          </View>
        )}

        {result && (
          <View style={{ gap: 10, marginTop: 18 }}>
            <Text style={{ fontWeight: "700", fontSize: 17, color: colors.text.primary }}>
              Top Matches
            </Text>
            {result.map((r, i) => (
              <View
                key={i}
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: colors.border,
                  backgroundColor: colors.cards,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <MaterialCommunityIcons name="leaf" size={24} color={colors.text.secondary} />
                <View>
                  <Text style={{ color: colors.text.primary, fontWeight: "600", fontSize: 16 }}>
                    {r.label}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 14 }}>
                    Confidence: {Math.round(r.score * 100)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
