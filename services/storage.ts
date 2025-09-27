import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadTempScan(uid: string, fileUri: string) {
  const id = Math.random().toString(36).slice(2);
  const storagePath = `temp/scans/${uid}/${id}/original.jpg`;
  const r = ref(storage, storagePath);
  const resp = await fetch(fileUri);
  const blob = await resp.blob();
  await uploadBytes(r, blob, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  return { storagePath, downloadUrl: url };
}
