import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import FormData from "form-data";
import fetch from "node-fetch";

// Initialize Firebase Admin once
admin.initializeApp();

// Secret
const PLANTNET_API_KEY = defineSecret("PLANTNET_API_KEY");

// Basic allowlist for organs (optional guard)
const ALLOWED_ORGANS = new Set(["leaf","flower","fruit","bark","habit","other"]);

function normalizeCandidates(json: any) {
  // Pl@ntNet returns an array of results with scores and species names
  // We'll extract a simple summary: [{ label, score }]
  const results = json?.results || json?.candidates || [];
  return results.map((r: any) => {
    const sci = r?.species?.scientificName || r?.species?.scientificNameWithoutAuthor || r?.label || "Unknown";
    const label = sci;
    const score = typeof r?.score === "number" ? r.score : (r?.probability ?? 0);
    return { label, score };
  }).sort((a: any, b: any) => b.score - a.score);
}

export const plantnetIdentify = onRequest(
  { region: "us-central1", cors: true, secrets: [PLANTNET_API_KEY] },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, error: "Use POST" });
        return;
      }

      const {
        imageUrl,
        images,           // optional: array of URLs (future)
        organs = [],
        project = "all",
        lang = "en",
        includeRelatedImages = false,
        noReject = false
      } = req.body || {};

      if (!imageUrl && !Array.isArray(images)) {
        res.status(400).json({ ok: false, error: "imageUrl or images[] is required" });
        return;
      }

      // Build multipart form
      const form = new FormData();

      // Collect list of URLs (for this first version we only support public URLs)
      const urlList: string[] = Array.isArray(images) ? images : [imageUrl];

      // Download each image and append as a binary "images" part
      for (let i = 0; i < urlList.length; i++) {
        const u = urlList[i];
        const r = await fetch(u);
        if (!r.ok) {
          res.status(400).json({ ok: false, error: `Failed to fetch image: ${u} (${r.status})` });
          return;
        }
        const buf = await r.buffer();
        form.append("images", buf, { filename: `image_${i}.jpg`, contentType: r.headers.get("content-type") || "image/jpeg" });

        // Optional organ for this image
        if (Array.isArray(organs) && organs[i]) {
          const organ = String(organs[i]).toLowerCase();
          if (ALLOWED_ORGANS.has(organ)) form.append("organs", organ);
        }
      }

      // Endpoint: /v2/identify/{project}?api-key=...
      const apiKey = PLANTNET_API_KEY.value();
      const endpoint = `https://my-api.plantnet.org/v2/identify/${encodeURIComponent(project)}?api-key=${encodeURIComponent(apiKey)}&lang=${encodeURIComponent(lang)}&include-related-images=${includeRelatedImages ? "true" : "false"}&no-reject=${noReject ? "true" : "false"}`;

      const upstream = await fetch(endpoint, { method: "POST", body: form as any });
      const text = await upstream.text();

      if (!upstream.ok) {
        res.status(upstream.status).json({ ok: false, error: "PlantNet error", details: text });
        return;
      }

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      const summary = normalizeCandidates(json).slice(0, 5); // top 5 for inspection
      res.status(200).json({ ok: true, plantnet: json, summary });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || "Internal error" });
    }
  }
);
