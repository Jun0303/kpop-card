import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <header className="bg-gray-800 text-white">
                <nav className="container mx-auto flex gap-6 px-4 py-3">
                    <Link href="/" className="hover:underline">
                        TOP
                    </Link>
                    <Link href="/cards" className="hover:underline">
                        カード一覧
                    </Link>
                    <Link href="/version" className="hover:underline">
                        バージョン
                    </Link>
                    <Link href="/how-to-play" className="hover:underline">
                        遊び方
                    </Link>
                </nav>
            </header>
            <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
    );
}
