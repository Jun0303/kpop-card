import { useState, useEffect } from "react";
import cardsData from "../../data/cards.json";
import { getImageUrl } from "../../lib/storage";

type Card = {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "normal" | "rare" | "superrare";
  storagePath: string;
};

export default function CardListPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [cardImages, setCardImages] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const groups = Array.from(new Set(cardsData.map((c) => c.group)));

  useEffect(() => {
    if (!selectedGroup) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const filteredCards = cardsData.filter(
          (c) => c.group === selectedGroup
        );

        const imagePromises = filteredCards.map(async (card) => {
          try {
            const url = await getImageUrl(card.storagePath);
            return { id: card.id, url };
          } catch (err) {
            console.error(`画像取得失敗: ${card.name}`, err);
            return { id: card.id, url: "" };
          }
        });

        const results = await Promise.all(imagePromises);
        const imageMap: { [id: string]: string } = {};
        results.forEach((res) => {
          imageMap[res.id] = res.url;
        });

        setCardImages(imageMap);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedGroup]);

  const filteredCards = selectedGroup
    ? cardsData.filter((c) => c.group === selectedGroup)
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">カード一覧</h1>

      {/* アーティスト選択ボタン */}
      <div className="flex gap-4 mb-6">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-2 rounded ${
              selectedGroup === group
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* ローディング表示 */}
      {loading && <p className="text-gray-500">画像読み込み中...</p>}

      {/* カード一覧 */}
      {!loading && selectedGroup && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="border rounded shadow">
              {cardImages[card.id] ? (
                <img
                  src={cardImages[card.id]}
                  alt={card.name}
                  className="w-full h-auto rounded"
                />
              ) : (
                <div className="bg-gray-200 w-full h-48 flex items-center justify-center text-gray-500">
                  画像なし
                </div>
              )}
              <p className="text-center mt-2">{card.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
