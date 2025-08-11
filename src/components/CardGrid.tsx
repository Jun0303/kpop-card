import { useState, useEffect } from "react";
import cardsDataRaw from "../data/cards.json";
import { getImageUrl } from "../lib/storage";
import { useRouter } from "next/router";
import Modal from "./Model";

type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "normal" | "rare" | "superrare";
  storagePath: string;
  imageUrl?: string;
};

type CardGridProps = {
  group: string; // どのアーティストか
};

export default function CardGrid({ group }: CardGridProps) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showModal, setShowModal] = useState(false);

  // アーティストごとの裏面画像
  const backImageMap: Record<string, string> = {
    "Kep1er": "/images/back_kep1er.png",
    "TOMORROW X TOGETHER": "/images/back_txt.png",
  };

  useEffect(() => {
    const groupCards = cardsDataRaw
      .filter((card) => card.group === group)
      .map((card) => ({
        ...card,
        rarity: card.rarity as "normal" | "rare" | "superrare",
      }));

    // シャッフル
    const shuffled = [...groupCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [group]);

  const handleCardClick = async (card: Card) => {
    if (flippedCardId || selectedCard) return; // 1枚だけ選択可能
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedCard) return;

    try {
      const imageUrl = await getImageUrl(selectedCard.storagePath);
      const cardWithImage: Card = { ...selectedCard, imageUrl };
      setFlippedCardId(selectedCard.id);
      router.push(`/result/${selectedCard.id}`);
    } catch (error) {
      console.error("画像取得失敗:", error);
    }
  };

  return (
    <div>
      {/* レスポンシブグリッド: スマホ3列、デスクトップ5列 */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 p-4 lg:p-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative w-full aspect-[3/4] cursor-pointer perspective`}
            onClick={() => handleCardClick(card)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform ${
                flippedCardId === card.id ? "rotate-y-180" : ""
              }`}
            >
              {/* 裏面 */}
              <div className="absolute w-full h-full backface-hidden">
                <img
                  src={backImageMap[group]} // アーティストごとに裏面画像変更
                  alt="Card Back"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              {/* 表面 */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCard && (
        <Modal
          title="このカードで間違いありませんか？"
          onClose={() => {
            setSelectedCard(null);
            setShowModal(false);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}