import { identifyByUrl } from "@/services/identify";
import { useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, TextInput, View } from "react-native";

export default function PlantNetTest() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ label: string; score: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onIdentify = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const data = await identifyByUrl(url.trim(), "leaf");
      setSummary(data.summary?.slice(0, 5) ?? []);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:20, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:"600" }}>PlantNet Tester</Text>
      <TextInput
        placeholder="Paste image URL…"
        autoCapitalize="none"
        value={url}
        onChangeText={setUrl}
        style={{ borderWidth:1, borderRadius:8, padding:12 }}
      />
      <Button title="Identify" onPress={onIdentify} />

      {loading && <ActivityIndicator style={{ marginTop:12 }} />}
      {error && <Text style={{ color:"red", marginTop:12 }}>{error}</Text>}

      {summary && (
        <View style={{ marginTop:12 }}>
          <Text style={{ fontWeight:"600", marginBottom:8 }}>Top matches</Text>
          <FlatList
            data={summary}
            keyExtractor={(item, i) => item.label + i}
            renderItem={({ item }) => (
              <View style={{ padding:12, borderWidth:1, borderRadius:8, marginBottom:8 }}>
                <Text>{item.label}</Text>
                <Text style={{ opacity:0.7 }}>score: {Math.round(item.score * 100)}%</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
