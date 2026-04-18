import "./globals.css";

import ClientShell from "../components/ClientShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#06060a] to-black text-white">
        <div className="flex flex-col min-h-screen">

          {/* CLIENT LAYER (STATE + GLOBAL UI) */}
          <ClientShell>
            <main className="flex-1 w-full max-w-[420px] mx-auto px-2 pb-24">
              {children}
            </main>
          </ClientShell>
        </div>
      </body>
    </html>
  );
}