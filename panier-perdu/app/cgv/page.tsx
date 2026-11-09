import type { Metadata } from "next";
export const metadata: Metadata = { title: "Conditions générales de vente | Panier Perdu" };
export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 leading-relaxed [&_h2]:font-titre [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-8 [&_p]:mt-2">
      <a href="/" className="underline text-sm">← Accueil</a>
      <h1 className="font-titre font-extrabold text-4xl mt-6">Conditions générales de vente</h1>
      <p className="text-sm text-gris">Texte de départ, à relire et compléter. Les passages [À COMPLÉTER] sont à remplir avant tout encaissement.</p>

      <h2>1. Objet</h2>
      <p>Les présentes conditions régissent la vente de l’abonnement « Panier Perdu », un service de relance par email des paniers abandonnés, proposé par [À COMPLÉTER : raison sociale] (« l’éditeur »).</p>
      <h2>2. Prix et paiement</h2>
      <p>L’abonnement coûte 29 € par mois [À COMPLÉTER : « TVA non applicable, art. 293 B du CGI » ou « TTC »]. Il est prélevé chaque mois par Stripe, jusqu’à résiliation.</p>
      <h2>3. Accès fondateur et livraison</h2>
      <p>Le service est en cours de construction. L’éditeur s’engage à le livrer au plus tard le [À COMPLÉTER : date identique à celle de la page d’accueil]. À défaut, le client est remboursé intégralement sur simple demande.</p>
      <h2>4. Satisfait ou remboursé</h2>
      <p>Le client peut demander le remboursement de son paiement dans les 30 jours suivant la livraison du service, sans avoir à se justifier, en écrivant à [À COMPLÉTER : email]. Le remboursement est effectué sous 5 jours ouvrés.</p>
      <h2>5. Résiliation</h2>
      <p>Le client peut résilier à tout moment, sans frais ni préavis. La résiliation prend effet à la fin de la période déjà payée.</p>
      <h2>6. Droit de rétractation</h2>
      <p>Le client consommateur dispose de 14 jours pour se rétracter conformément au Code de la consommation. La garantie de 30 jours ci-dessus est plus favorable et s’y substitue.</p>
      <h2>7. Médiation et droit applicable</h2>
      <p>Le droit français s’applique. En cas de litige, le client peut recourir gratuitement à un médiateur de la consommation : [À COMPLÉTER : nom et coordonnées du médiateur].</p>
    </main>
  );
}
