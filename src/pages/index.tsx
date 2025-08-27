import { useRouter } from "next/router";

const artists = [
  { name: "Kep1er", packImage: "/images/pack/kep1er-pack.png" },
  { name: "txt", packImage: "/images/pack/txt-pack.png" },
  { name: "aespa", packImage: "/images/pack/aespa-pack.png" },
  { name: "IVE", packImage: "/images/pack/ive-pack.png" },
  { name: "StrayKids", packImage: "/images/pack/straykids-pack.png" },
  // 他アーティストもここに追加可能
];

export default function Home() {
  const router = useRouter();

  const handleSelectArtist = (artist: string, packImage: string) => {
    router.push({
      pathname: "/card-select",
      query: { artist, packImage },
    });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">RANDOM TRADING CARD GAME</h1>
      <br/>
      <h3 className="text-1xl mb-4">このゲームはK-POPにおけるランダムトレーディングカードを再現したものです！下記の中から好きなアーティストを選択し、推しを引いてください！！</h3>
      <p>※1パックに3枚のトレカが入ってます</p>
      <br/>
      <h2 className="text-2xl font-bold mb-4">アーティストを選択</h2>
      <div className="grid grid-cols-2 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.name}
            className="cursor-pointer border rounded p-2 shadow hover:scale-105 transition-transform"
            onClick={() => handleSelectArtist(artist.name, artist.packImage)}
          >
            <img
              src={artist.packImage}
              alt={artist.name}
              className="w-40 h-auto mx-auto"
            />
            <p className="text-center mt-2 font-semibold">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
