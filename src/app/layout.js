import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SoundProvider } from "@/components/layout/SoundContext";
import { LanguageProvider } from "@/components/layout/LanguageContext";

export const metadata = {
  metadataBase: new URL("https://andhraartofwar.org"),
  title: "Andhra Art of War | Sri Vijaya Karrasamu Gurukulam",
  description:
    "Official training center and living heritage school of Karrasamu (కర్రసాము) — the traditional staff fighting and ancient martial art of Andhra Pradesh. Interactive 3D weapon viewer, authentic lineage, curriculum, and class enrollment.",
  keywords: [
    "Karrasamu",
    "కర్రసాము",
    "Andhra Art of War",
    "Indian Martial Arts",
    "Stick Fighting",
    "Gurukulam Visakhapatnam",
    "Jodi Karra",
    "Silambam Andhra",
  ],
  openGraph: {
    title: "Andhra Art of War | Sri Vijaya Karrasamu Gurukulam",
    description: "Discover the ancient staff fighting heritage of Andhra Pradesh. Interactive 3D armory, verified lineage, and authentic martial curriculum.",
    images: ["/images/hero.jpg"],
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
