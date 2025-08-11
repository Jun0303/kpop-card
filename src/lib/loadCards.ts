import { getStorage, ref, getDownloadURL } from "firebase/storage";
import cardsDataRaw from "../data/cards.json";
import { Card } from "../types";

const storage = getStorage();

export const loadCards = async (): Promise<Card[]> => {
  const promises = (cardsDataRaw as Omit<Card, "imageUrl">[]).map(async (card) => {
    const url = await getDownloadURL(ref(storage, card.storagePath));
    return {
      ...card,
      rarity: card.rarity as Card["rarity"], // 型を正しくキャスト
      imageUrl: url,
    };
  });

  return Promise.all(promises);
};
