import type { Metadata } from "next";
export const metadata: Metadata = { title: "Politique de confidentialité | Panier Perdu" };
export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 leading-relaxed [&_h2]:font-titre [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-8 [&_p]:mt-2">
      <a href="/" className="underline text-sm">← Accueil</a>
      <h1 className="font-titre font-extrabold text-4xl mt-6">Politique de confidentialité</h1>
      <p className="text-sm text-gris">Texte de départ, à relire et compléter. Les passages [À COMPLÉTER] sont à remplir avant tout encaissement.</p>

      <h2>Responsable du traitement</h2>
      <p>[À COMPLÉTER : raison sociale], joignable à [À COMPLÉTER : email].</p>
      <h2>Données collectées</h2>
      <p>Lors du paiement, Stripe collecte ton email, ton nom et tes informations de paiement. L’éditeur reçoit ton email et ton nom pour te livrer le service et te contacter.</p>
      <h2>Finalité et durée</h2>
      <p>Ces données servent uniquement à fournir le service et à répondre à tes demandes. Elles sont conservées pendant la durée de l’abonnement, puis [À COMPLÉTER : durée, par exemple 3 ans] pour les obligations légales.</p>
      <h2>Tes droits</h2>
      <p>Tu peux demander l’accès, la rectification ou la suppression de tes données en écrivant à l’adresse ci-dessus. Tu peux aussi saisir la CNIL (cnil.fr).</p>
      <h2>Cookies</h2>
      <p>Ce site n’utilise pas de cookie publicitaire. [À COMPLÉTER si tu ajoutes une mesure d’audience.]</p>
    </main>
  );
}
