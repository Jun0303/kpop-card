"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import shuffleArray from "../lib/shuffle"; // 後述
import cardsDataRaw from "../data/cards.json";
import { getImageUrl } from "../lib/storage";

type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "normal" | "rare" | "superrare";
  storagePath: string;
  imageUrl?: string;
};

const initialCardsData: Omit<Card, "imageUrl">[] = cardsDataRaw.map((card) => ({
  ...card,
  rarity: card.rarity as Card["rarity"],
}));

export default function CardGrid() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [cardsData, setCardsData] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImageUrls = async () => {
      try {
        const cardsWithImages = await Promise.allSettled(
          initialCardsData.map(async (card) => {
            try {
              const imageUrl = await getImageUrl(card.storagePath);
              return { ...card, imageUrl };
            } catch {
              return { ...card, imageUrl: undefined };
            }
          })
        );
        setCardsData(
          cardsWithImages.map((result, index) =>
            result.status === "fulfilled" ? result.value : { ...initialCardsData[index], imageUrl: undefined }
          )
        );
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    loadImageUrls();
  }, []);

  const handleFlip = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShuffle = () => {
    setCardsData((prev) => shuffleArray(prev));
    setFlipped({}); // シャッフル時に全カード裏向きに戻す
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white">カード画像を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      {/* シャッフルボタン */}
      <div className="mb-6 text-center">
        <button
          onClick={handleShuffle}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          シャッフル
        </button>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {cardsData.map((card) => {
            const isFlipped = flipped[card.id];
            const hasImageError = imageErrors[card.id];

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative w-40 h-64 cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={() => handleFlip(card.id)}
              >
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 表面 */}
                  {hasImageError || !card.imageUrl ? (
                    <div
                      className="absolute inset-0 w-full h-full bg-red-500 rounded-lg flex items-center justify-center text-white text-sm p-2"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p>画像エラー</p>
                    </div>
                  ) : (
                    <img
                      src={card.imageUrl}
                      alt={`${card.group} - ${card.name}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    />
                  )}

                  {/* 裏面 */}
                  <img
                    src="/cardBack.png"
                    alt="card back"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
