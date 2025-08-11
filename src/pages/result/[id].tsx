// pages/result/[id].tsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import cardsDataRaw from "../../data/cards.json";
import { getImageUrl } from "../../lib/storage";

type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "normal" | "rare" | "superrare";
  storagePath: string;
  imageUrl?: string;
};

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const foundCard = cardsDataRaw.find((c) => c.id === id);
    if (!foundCard) {
      setCard(null);
      setLoading(false);
      return;
    }

const fetchImage = async () => {
  try {
    const imageUrl = await getImageUrl(foundCard.storagePath);

    setCard({
      ...foundCard,
      rarity: foundCard.rarity as "normal" | "rare" | "superrare", // 型を揃える
      imageUrl,
    });
  } catch (error) {
    console.error("画像取得失敗:", error);
    setImageError(true);
    setCard({
      ...foundCard,
      rarity: foundCard.rarity as "normal" | "rare" | "superrare",
      imageUrl: undefined,
    });
  } finally {
    setLoading(false);
  }
};


    fetchImage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        カード情報を読み込み中...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="mb-6">該当するカードが見つかりませんでした。</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          TOPへ戻る
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">選択されたカード</h1>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
        <img
          src={card.imageUrl || "/cardError.png"}
          alt={`${card.group} - ${card.name}`}
          className="w-full rounded-lg mb-6"
        />

        <p className="text-xl font-semibold mb-2">{card.name}</p>
        <p className="text-gray-400 mb-2">{card.group}</p>
        <p className="text-gray-400 mb-2">date: {card.date}</p>
        <p className="text-gray-400 mb-6">
          レアリティ:{" "}
          {card.rarity === "normal"
            ? "ノーマル"
            : card.rarity === "rare"
            ? "レア"
            : "スーパーレア"}
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          TOPへ戻る
        </button>
      </div>
    </div>
  );
}
