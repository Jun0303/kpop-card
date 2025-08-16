import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useRouter } from "next/router";
import styles from "@/styles/CardSelect.module.css";

const packImages: Record<string, string> = {
  Kep1er: "/images/pack/kep1er-pack.png",
  txt: "/images/pack/txt-pack.png",
  // 他のアーティストもここに追加可能
};

export default function CardSelect() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const cardListRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const { artist } = router.query;

  if (!artist) return <div>アーティストを指定してください</div>;

  // packsの生成: 同じパック画像を複数配置
  const packs = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    img: packImages[artist as string] || "/images/pack/default-pack.png",
  }));

  useEffect(() => {
    if (!scrollableRef.current || !cardListRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollableRef.current,
      smoothWheel: true,
      touchMultiplier: 0.5,
      syncTouch: true,
      gestureOrientation: "both",
      infinite: true,
    });

    let baseDeg = 0;
    cardListRef.current.style.setProperty("--base-deg", `${baseDeg}`);

    const STRENGTH = 0.3;
    const onScroll = (event: any) => {
      baseDeg -= event.velocity * STRENGTH;
      cardListRef.current!.style.setProperty("--base-deg", `${baseDeg}`);
    };

    lenis.on("scroll", onScroll);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleSelect = () => {
    //if (!artist) return;
    router.push(`/result/${artist}`);
  };

  return (
    <div className={styles.container}>
      <div
        ref={scrollableRef}
        className={styles.scrollable}
      >
        <ul
          className={styles.cardList}
          ref={cardListRef}
          style={{ ["--card-count" as any]: packs.length }}
        >
          {packs.map((card, index) => (
            <li
              key={card.id}
              className={styles.sampleCard}
              style={{ ["--index" as any]: index }}
              onClick={handleSelect}
            >

              <div className={`${styles.face} ${styles.front}`}>
                <img
                  src={card.img}
                  alt={`${artist} Pack`}
                  className={styles.cardImage}
                />
              </div>
              <div className={`${styles.face} ${styles.front}`}>
                <img
                  src={card.img}
                  alt={`${artist} Pack`}
                  className={styles.cardImage}
                />
              </div>
              <div className={`${styles.face} ${styles.back}`}>
                <img
                  src={card.img}
                  alt={`${artist} Pack`}
                  className={styles.cardImage}
                />
                <div className={styles.cardBack} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}