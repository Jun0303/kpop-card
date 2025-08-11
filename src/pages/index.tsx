// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Random Trading Cards Game</h1>
      <p className="max-w-2xl text-center mb-10 text-gray-300">
        このゲームでは、推しのアーティストカードを選び、カードをめくって確認することができます。
        下記のボタンからアーティストを選択してください。
      </p>

      <div className="flex gap-6">
        <Link href="/kep1er">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg">
            Kep1er
          </button>
        </Link>
        <Link href="/txt">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg">
            TOMORROW X TOGETHER
          </button>
        </Link>
      </div>
    </div>
  );
}
