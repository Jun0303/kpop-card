// src/lib/storage.ts
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseClient";

/**
 * storagePath 例: "images/card_001.png"
 */
export async function getImageUrl(storagePath: string): Promise<string> {
  const storageRef = ref(storage, storagePath);
  return await getDownloadURL(storageRef);
}
