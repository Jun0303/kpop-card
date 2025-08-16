// src/pages/result/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadCards } from "@/lib/loadCards";
import { Card } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const { id, packImage } = router.query; // id=アーティスト名, packImage=パック画像URL

  const [cards, setCards] = useState<Card[]>([]);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);

  // 全カードをロード
  useEffect(() => {
    if (!id) return;
    loadCards().then((all) => {
      const groupCards = all.filter((c) => c.group === id);
      setCards(groupCards);
    });
  }, [id]);

  // ランダムで3枚選ぶ
  const openPack = () => {
    if (cards.length < 3) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setOpenedCards(shuffled.slice(0, 3));
  };

  // 「もう一度選ぶ」ボタン
  const retry = () => {
    //if (!id || !packImage) return;
    router.push(`/card-select?artist=${id}&packImage=${encodeURIComponent(packImage as string)}`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{id} パック開封</h1>

      {openedCards.length === 0 ? (
        <div className="space-x-4">
          <button
            onClick={retry}
            className="px-4 py-2 bg-red-400 rounded"
          >
            もう一度選ぶ
          </button>
          <button
            onClick={openPack}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            開封
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {openedCards.map((card) => (
            <div key={card.id} className="border p-2 rounded shadow">
              <img src={card.imageUrl} alt={card.name} className="w-40 h-auto" />
              <p className="mt-2 text-center font-semibold">{card.name}</p>
            </div>
          ))}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 rounded"
            onClick={() => router.push("/#")}
          >
            TOP
          </button>
        </div>
      )}
    </div>
  );
}
