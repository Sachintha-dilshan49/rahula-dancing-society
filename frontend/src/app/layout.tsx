import "./globals.css";
import Navbar from "@/features/public/components/navbar/navbar";
import Footer from "@/features/public/components/footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 flex flex-col min-h-screen">
        <Navbar />

        {/* remove centering here */}
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}