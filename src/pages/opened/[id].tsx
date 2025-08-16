// src/pages/opened/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadCards } from "@/lib/loadCards";
import { Card } from "@/types";

export default function OpenedPage() {
  const router = useRouter();
  const { id, cards } = router.query;
  const [openedCards, setOpenedCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!cards) return;
    const cardIds = (cards as string).split(",");

    loadCards().then((all) => {
      const selected = all.filter((c) => cardIds.includes(c.id));
      setOpenedCards(selected);
    });
  }, [cards]);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{id} パック開封結果</h1>

      <div className="grid grid-cols-3 gap-4">
        {openedCards.map((card) => (
          <div key={card.id} className="border p-2 rounded shadow">
            <img src={card.imageUrl} alt={card.name} className="w-40 h-auto" />
            <p className="mt-2 text-center font-semibold">{card.name}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-gray-300 rounded"
        onClick={() => router.push("/card-select?artist=Kep1er&packImage=%2Fimages%2Fpack%2Fkep1er-pack.png")}
      >
        もう一度選ぶ
      </button>
    </div>
  );
}
