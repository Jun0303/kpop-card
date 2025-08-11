"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

export default function SelectPage() {
    const router = useRouter();
    const { group } = router.query;
    const [cardsData, setCardsData] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Record<string, string>>({});
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [showModal, setShowModal] = useState(false);

    // シャッフル関数（Fisher-Yatesアルゴリズム）
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    useEffect(() => {
        if (!group) return;

        const filteredCards = initialCardsData.filter(
            (card) => card.group.toLowerCase() === String(group).toLowerCase()
        );

        const loadImageUrls = async () => {
            try {
                const cardsWithImages = await Promise.allSettled(
                    filteredCards.map(async (card) => {
                        try {
                            const imageUrl = await getImageUrl(card.storagePath);
                            return { ...card, imageUrl };
                        } catch (error) {
                            console.error(`画像取得エラー (${card.name}):`, error);
                            return { ...card, imageUrl: undefined };
                        }
                    })
                );

                const processedCards = cardsWithImages.map((result, index) => {
                    if (result.status === "fulfilled") {
                        return result.value;
                    } else {
                        const originalCard = filteredCards[index];
                        setImageErrors((prev) => ({
                            ...prev,
                            [originalCard.id]:
                                `画像の取得に失敗しました: ${result.reason?.message || "不明なエラー"}`,
                        }));
                        return { ...originalCard, imageUrl: undefined };
                    }
                });

                // ここでシャッフルしてからセット
                const shuffledCards = shuffleArray(processedCards);

                setCardsData(shuffledCards);
                setLoading(false);
            } catch (error) {
                console.error("画像URL取得中にエラー:", error);
                setLoading(false);
            }
        };

        loadImageUrls();
    }, [group]);


    const handleCardClick = (card: Card) => {
        if (!selectedCard) {
            setSelectedCard(card);
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>カード画像を読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-900 min-h-screen relative">
            {cardsData.map((card) => (
                <div
                    key={card.id}
                    className="relative w-full aspect-[2/3] cursor-pointer mx-auto max-w-[140px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[160px] xl:max-w-[140px]"
                    onClick={() => handleCardClick(card)}
                >
                    {/* 裏面固定 */}
                    <img
                        src="/cardBack_kep1er.png"
                        alt="card back"
                        className="absolute inset-0 w-full h-full object-cover rounded-md sm:rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    />
                </div>

            ))}

            {/* モーダル */}
            {showModal && selectedCard && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xs sm:max-w-sm text-center mx-4 text-black">
                        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                            このカードで間違いありませんか？
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <button
                                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded text-sm sm:text-base order-2 sm:order-1"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedCard(null);
                                }}
                            >
                                キャンセル
                            </button>
                            <button
                                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base order-1 sm:order-2"
                                onClick={() => {
                                    router.push(`/result?id=${selectedCard.id}`);
                                }}
                            >
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
