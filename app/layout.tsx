import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Bookmark manager using Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {/* Optional Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-bold text-center">Smart Bookmark App</h1>
        </header>

        {/* Main content wrapper */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}