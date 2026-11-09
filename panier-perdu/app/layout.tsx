import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const titre = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-titre", weight: ["600", "800"], display: "swap" });
const texte = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-texte", weight: ["400", "500", "600"], display: "swap" });

// ⚠️ Remplace par ton vrai domaine quand tu l'auras (sinon laisse tel quel).
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panier-perdu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Panier Perdu : récupère les paniers abandonnés de ta boutique",
  description: "Deux emails de relance automatiques pour les petites boutiques Shopify et WooCommerce. 29 € par mois, relances illimitées, satisfait ou remboursé.",
  openGraph: {
    title: "Panier Perdu : récupère les paniers abandonnés de ta boutique",
    description: "Deux emails de relance automatiques, 29 € par mois, relances illimitées.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#12263F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body className="font-texte antialiased">
        {children}
        <footer className="border-t border-marine/15 mt-16 px-5 py-8 text-sm text-gris">
          <div className="mx-auto max-w-2xl flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="underline">Mentions légales</Link>
            <Link href="/cgv" className="underline">CGV</Link>
            <Link href="/confidentialite" className="underline">Confidentialité</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
