import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SoundProvider } from "@/components/layout/SoundContext";
import { LanguageProvider } from "@/components/layout/LanguageContext";

export const metadata = {
  metadataBase: new URL("https://andhraartofwar.org"),
  title: "Andhra Art Of War | Guru Vijay Kumar Kalidasu",
  description:
    "Official training center and living heritage school of Andhra Art Of War under Guru Sri Vijay Kumar Kalidasu — preserving Karrasamu (కర్రసాము), traditional staff combat, and battlefield weaponry of Andhra Pradesh.",
  keywords: [
    "Andhra Art Of War",
    "Vijay Kumar Kalidasu",
    "Karrasamu",
    "కర్రసాము",
    "Indian Martial Arts",
    "Stick Fighting",
    "Gurukulam Vijayawada",
    "Indrakeeladri Kanaka Durga",
    "Jodi Karra",
    "Talwar Dhal",
  ],
  openGraph: {
    title: "Andhra Art Of War | Guru Vijay Kumar Kalidasu",
    description: "Official Gurukulam of Andhra Art Of War under Guru Sri Vijay Kumar Kalidasu. Discover ancient Karrasamu staff combat, interactive 3D armory, and verified lineage.",
    images: ["/images/hero.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#DC2626] selection:text-white"
        suppressHydrationWarning
      >
        <SoundProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
