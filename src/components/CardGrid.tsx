import { useState, useEffect, useRef } from "react";
import cardsDataRaw from "../data/cards.json";
import { useRouter } from "next/router";
import styles from "./CardGrid.module.css";

interface Card {
  id: string;
  group: string;
  name: string;
  date: string;
  rarity: "normal" | "rare" | "superrare";
  storagePath: string;
}

export default function CardSelect({ group }: { group: string }) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [isShuffling, setIsShuffling] = useState(true);
  // 修正: ReturnType<typeof setInterval>を使用
  const shuffleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // シャッフル関数
  const shuffleCards = (arr: Card[]) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // 初期セット & シャッフル開始
  useEffect(() => {
    const filtered = cardsDataRaw.filter((c) => c.group === group) as Card[];
    setCards(filtered);

    shuffleInterval.current = setInterval(() => {
      setCards((prev) => shuffleCards(prev));
    }, 200);

    return () => {
      if (shuffleInterval.current) {
        clearInterval(shuffleInterval.current);
      }
    };
  }, [group]);

  const handleStop = () => {
    setIsShuffling(false);
    if (shuffleInterval.current) {
      clearInterval(shuffleInterval.current);
    }
  };

  const handleCardClick = (card: Card) => {
    if (isShuffling) return;
    router.push(`/result/${card.id}`);
  };

  return (
    <div>
      <h1>{group} - カード選択</h1>
      {isShuffling ? (
        <button onClick={handleStop}>ストップ</button>
      ) : (
        <p>パックを選んでください</p>
      )}
      <div className={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${isShuffling ? styles.shuffling : ""}`}
            onClick={() => handleCardClick(card)}
          >
            <img
              src={`/back/${group}.png`} // アーティストごとの裏面画像
              alt="パック裏面"
            />
          </div>
        ))}
      </div>
    </div>
  );
}