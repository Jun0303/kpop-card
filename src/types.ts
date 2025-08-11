export type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "superrare" | "normal" | "rare";
  storagePath: string;
  imageUrl: string; // 動的に生成
};
