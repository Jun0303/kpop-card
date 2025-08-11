import { useRouter } from "next/router";
import cardsDataRaw from "../../data/cards.json";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../lib/storage";

type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: string;
  storagePath: string;
};

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [card, setCard] = useState<Card | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = cardsDataRaw.find((c) => c.id === id);
    if (found) {
      setCard(found);
      getImageUrl(found.storagePath).then(setImageUrl);
    }
  }, [id]);

  if (!card) {
    return <div className="p-8">カードが見つかりません。</div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">選択されたカード</h1>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={card.name}
          className="w-60 h-96 object-cover rounded-lg mb-4"
        />
      )}
      <div className="text-lg">{card.group} - {card.name}</div>
      <div className="text-sm text-gray-500">{card.date}</div>
      <div className="text-sm">{card.rarity}</div>
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/")}
      >
        戻る
      </button>
    </div>
  );
}
