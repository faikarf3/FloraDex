export async function identifyByUrl(imageUrl: string, organ: string = "leaf") {
    const endpoint = process.env.EXPO_PUBLIC_PLANTNET_ENDPOINT!;
    if (!endpoint) throw new Error("Missing EXPO_PUBLIC_PLANTNET_ENDPOINT");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, organs: [organ], project: "all" }),
    });
    if (!res.ok) throw new Error(`PlantNet error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<{
      ok: boolean;
      plantnet: any;
      summary: { label: string; score: number }[];
    }>;
  }
  