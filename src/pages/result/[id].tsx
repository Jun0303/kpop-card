import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadCards } from "@/lib/loadCards";
import { Card } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const { id, packImage } = router.query;

  const [cards, setCards] = useState<Card[]>([]);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalList, setShowFinalList] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadCards().then((all) => {
      const groupCards = all.filter((c) => c.group === id);
      setCards(groupCards);
    });
  }, [id]);

  const openPack = () => {
    if (cards.length < 3) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setOpenedCards(shuffled.slice(0, 3));
    setCurrentIndex(0);
    setShowFinalList(false);
  };

  const handleCardClick = () => {
    if (currentIndex < openedCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowFinalList(true);
    }
  };

  const retry = () => {
    router.push(
      `/card-select?artist=${id}&packImage=${encodeURIComponent(
        packImage as string
      )}`
    );
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{id} パック開封</h1>

      {openedCards.length === 0 ? (
        <div className="space-x-4">
          <button onClick={retry} className="px-4 py-2 bg-red-400 rounded">
            もう一度選ぶ
          </button>
          <button
            onClick={openPack}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            開封
          </button>
        </div>
      ) : showFinalList ? (
        // 縦並び
        <div className="flex flex-col gap-6">
          {openedCards.map((card) => (
            <div key={card.id} className="border p-2 rounded shadow">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-64 h-auto mx-auto"
              />
              <p className="mt-2 text-center font-semibold">{card.name}</p>
              <p className="mt-2 text-center font-semibold">date:{card.date}</p>
              <p className="mt-2 text-center font-semibold">rarity:{card.rarity}</p>
            </div>
          ))}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 rounded"
            onClick={() => router.push("/")}
          >
            TOP
          </button>
        </div>
      ) : (
        // 3D風に重ねる
        <div
          className="relative w-60 h-80"
          style={{ perspective: "1000px" }}
          onClick={handleCardClick}
        >
          {openedCards.map((card, i) => {
            const isActive = i === currentIndex;
            const isPast = i < currentIndex;

            return (
              <div
                key={card.id}
                className="absolute inset-0 flex justify-center items-center transition-transform duration-700"
                style={{
                  transform: isPast
                    ? "translateX(300px) rotateY(90deg)" // 退場したカード
                    : isActive
                    ? "translateZ(0px) rotateY(0deg) scale(1)" // 手前
                    : `translateZ(-${(i - currentIndex) * 100}px) rotateY(${
                        (i - currentIndex) * 10
                      }deg) scale(0.9)`, // 奥のカード
                  zIndex: openedCards.length - i,
                  opacity: isPast ? 0 : 1,
                }}
              >
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-40 h-auto shadow-xl rounded cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
