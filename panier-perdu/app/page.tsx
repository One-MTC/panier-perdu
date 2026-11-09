// ====== À MODIFIER ======
const LIEN_PAIEMENT = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? ""; // lien Stripe, ajouté dans Vercel à l'action 5
const DATE_LIVRAISON = "[À COMPLÉTER : ex. 30 novembre 2026]"; // date limite de livraison que tu t'engages à tenir
const EMAIL_CONTACT = "[À COMPLÉTER : ton email]";
// ========================

function Bouton({ className = "" }: { className?: string }) {
  const actif = LIEN_PAIEMENT.startsWith("https://");
  return (
    <a
      href={actif ? LIEN_PAIEMENT : "#"}
      aria-disabled={!actif}
      className={`block text-center bg-moutarde text-marine font-titre font-extrabold text-lg px-6 py-4 min-h-[56px] ${actif ? "" : "opacity-60 pointer-events-none"} ${className}`}
    >
      Réserver mon accès fondateur · 29 € par mois
    </a>
  );
}

const faq = [
  { q: "Est-ce que ça marche pour ma boutique ?", r: "Si ta boutique tourne sous Shopify ou WooCommerce et qu’elle reçoit quelques dizaines de commandes par mois, oui. Au démarrage, Shopify est branché en premier ; WooCommerce suit. Si ta boutique n’est pas compatible à la livraison, tu es remboursé." },
  { q: "Combien de temps ça me prend ?", r: "Environ dix minutes : tu connectes ta boutique, tu relis les deux emails proposés, tu actives. Ensuite, tu n’as plus rien à faire." },
  { q: "Que se passe-t-il si je veux arrêter ?", r: "Tu résilies en un clic depuis ton paiement Stripe, ou en m’écrivant. L’abonnement s’arrête, sans frais ni préavis." },
  { q: "À quoi sert exactement ce que je paie ?", r: "À envoyer deux emails de relance personnalisés à chaque client qui a quitté sa boutique avec un panier plein, sans limite de volume, et à voir en euros ce que ces relances te rapportent." },
];

export default function Accueil() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10 pb-28">
      <p className="font-titre font-semibold text-lg">Panier Perdu</p>

      <h1 className="font-titre font-extrabold text-[2.5rem] leading-[1.05] mt-8 sm:text-6xl">
        Récupère les paniers abandonnés de ta boutique.
      </h1>
      <p className="mt-5 text-xl leading-snug">
        Deux emails de relance partent tout seuls vers chaque client qui a quitté ton site avec un panier plein.
      </p>
      <Bouton className="mt-8" />
      <p className="mt-3 text-sm text-gris">Sans engagement, résiliable à tout moment. Satisfait ou remboursé 30 jours.</p>

      <section className="mt-16">
        <h2 className="font-titre font-extrabold text-3xl">Environ 7 paniers sur 10 ne vont jamais jusqu’au paiement.</h2>
        <p className="mt-4 leading-relaxed">
          C’est la moyenne observée par l’institut Baymard sur de nombreuses études. Une boutique qui encaisse 40 commandes à 60 € laisse donc partir, en gros, 90 paniers pleins par mois. Les outils de relance existent, mais ils sont pensés et facturés pour les grosses boutiques. Alors tu ne relances rien.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-titre font-extrabold text-3xl">Ce que tu obtiens</h2>
        <ul className="mt-6 space-y-6">
          <li><p className="font-titre font-semibold text-xl">Un branchement simple</p><p className="mt-1 text-gris">Tu connectes ta boutique, Panier Perdu lit les paniers abandonnés.</p></li>
          <li><p className="font-titre font-semibold text-xl">Deux relances espacées et personnalisées</p><p className="mt-1 text-gris">Le premier email rappelle le panier. Le second arrive plus tard et peut contenir un code de réduction, si tu le souhaites.</p></li>
          <li><p className="font-titre font-semibold text-xl">Le chiffre d’affaires récupéré, en euros</p><p className="mt-1 text-gris">Un compteur te montre ce que les relances ont rapporté, face aux 29 € que tu paies.</p></li>
        </ul>
      </section>

      <section className="mt-14 bg-marine text-white p-6">
        <h2 className="font-titre font-extrabold text-3xl">Accès fondateur : lis avant de payer.</h2>
        <p className="mt-4 leading-relaxed">
          Panier Perdu est en construction. En réservant maintenant, tu paies 29 € par mois, et c’est le prix que tu gardes tant que tu restes abonné. Le produit t’est livré au plus tard le <strong>{DATE_LIVRAISON}</strong>. Je te préviens par email à chaque étape.
        </p>
        <p className="mt-4 leading-relaxed">
          Si la livraison n’a pas eu lieu à cette date, ou si le produit ne te convient pas dans les 30 jours qui suivent, je te rembourse en entier. Il suffit d’écrire à {EMAIL_CONTACT} : remboursement sous 5 jours ouvrés.
        </p>
      </section>

      <section id="offre" className="mt-14">
        <h2 className="font-titre font-extrabold text-3xl">29 € par mois, relances illimitées</h2>
        <p className="mt-2 text-gris">Soit moins d’un euro par jour. Une seule récupération de panier peut déjà couvrir le mois.</p>
        <Bouton className="mt-6" />
        <ul className="mt-4 text-sm space-y-1">
          <li>Sans engagement, résiliable à tout moment.</li>
          <li>Satisfait ou remboursé pendant 30 jours.</li>
          <li>Paiement sécurisé par Stripe.</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-titre font-extrabold text-3xl">Questions fréquentes</h2>
        <div className="mt-4 divide-y divide-marine/15 border-y border-marine/15">
          {faq.map((f) => (
            <details key={f.q} className="py-4">
              <summary className="font-titre font-semibold text-lg cursor-pointer min-h-[44px] flex items-center">{f.q}</summary>
              <p className="mt-2 leading-relaxed text-gris">{f.r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Barre de paiement collée en bas sur mobile */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-papier/95 border-t border-marine/15 sm:hidden">
        <Bouton />
      </div>
    </main>
  );
}
