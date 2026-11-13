import type { Metadata, Viewport } from "next";
import Link from "next/link";
// Polices installées avec le projet (plus de téléchargement chez Google à chaque compilation).
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";


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
    <html lang="fr">
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
