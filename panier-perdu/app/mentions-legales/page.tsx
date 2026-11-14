import type { Metadata } from "next";
export const metadata: Metadata = { title: "Mentions légales | Panier Perdu" };
export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 leading-relaxed [&_h2]:font-titre [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-8 [&_p]:mt-2">
      <a href="/" className="underline text-sm">← Accueil</a>
      <h1 className="font-titre font-extrabold text-4xl mt-6">Mentions légales</h1>
      <p className="text-sm text-gris">Texte de départ, à relire et compléter. Les passages [À COMPLÉTER] sont à remplir avant tout encaissement.</p>

      <h2>Éditeur du site</h2>
      <p>[À COMPLÉTER : nom et prénom ou raison sociale], entrepreneur individuel ou société.</p>
      <p>SIRET : [À COMPLÉTER]. Adresse : [À COMPLÉTER]. Email : panier.perdu.service@gmail.com.</p>
      <p>TVA : [À COMPLÉTER : par exemple « TVA non applicable, article 293 B du CGI » si tu es en franchise en base].</p>
      <h2>Directeur de la publication</h2>
      <p>[À COMPLÉTER : ton nom].</p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
      <h2>Paiement</h2>
      <p>Les paiements sont traités par Stripe. Aucune donnée de carte bancaire n’est stockée par l’éditeur.</p>
    </main>
  );
}
