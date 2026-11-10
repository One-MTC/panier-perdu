"use client";
import { useState } from "react";
import Link from "next/link";
import { LIEN_PAIEMENT, DATE_LIVRAISON, EMAIL_CONTACT, PRIX } from "../config";

type Opt = [string, number];
const Q: { titre: string; opts: Opt[] }[] = [
  { titre: "Combien de commandes reçois-tu par mois ?", opts: [["Moins de 20", 15], ["20 à 50", 35], ["50 à 100", 75], ["Plus de 100", 150]] },
  { titre: "Quel est ton panier moyen ?", opts: [["Moins de 30 €", 25], ["30 à 60 €", 45], ["60 à 100 €", 80], ["Plus de 100 €", 130]] },
  { titre: "Aujourd’hui, comment relances-tu les paniers abandonnés ?", opts: [["Je ne relance pas", 0], ["À la main, quand j’y pense", 1], ["Un email automatique de ma plateforme", 2]] },
];

const EMAIL1 = `Objet : Tu as oublié quelque chose dans ton panier

Bonjour {prénom},

Tu as laissé des articles dans ton panier, ils t’attendent toujours :
{liste des articles}

Pour reprendre là où tu t’es arrêté(e) : {lien du panier}

Une question sur un produit ou la livraison ? Réponds simplement à cet email.

À très vite,
{nom de ta boutique}`;

const FAQ = [
  { q: "Est-ce que ça marche pour ma boutique ?", r: "Si tu es sous Shopify ou WooCommerce avec quelques dizaines de commandes par mois, oui. Au démarrage, Shopify est branché en premier ; WooCommerce suit. Si ta boutique n’est pas compatible à la livraison, tu es remboursé." },
  { q: "Combien de temps ça me prend ?", r: "Environ dix minutes : tu connectes ta boutique, tu relis les deux emails, tu actives. Ensuite, tu n’as plus rien à faire." },
  { q: "Que se passe-t-il si je veux arrêter ?", r: "Tu résilies à tout moment, sans frais ni préavis, depuis ton paiement Stripe ou en m’écrivant." },
  { q: "À quoi sert exactement ce que je paie ?", r: "À envoyer deux relances personnalisées à chaque client qui quitte ta boutique avec un panier plein, sans limite de volume, et à voir en euros ce qu’elles te rapportent." },
];

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";

export default function Funnel() {
  const [etape, setEtape] = useState(0);
  const [rep, setRep] = useState<number[]>([]);
  const [copie, setCopie] = useState(false);

  const aller = (e: number) => { setEtape(e); if (typeof window !== "undefined") window.scrollTo(0, 0); };
  const choisir = (i: number) => { setRep([...rep.slice(0, etape), i]); aller(etape + 1); };

  const cmd = Q[0].opts[rep[0]]?.[1] ?? 0;
  const panier = Q[1].opts[rep[1]]?.[1] ?? 0;
  const rel = Q[2].opts[rep[2]]?.[1] ?? 0;
  const abandonnes = Math.round((cmd * 7) / 3); // 7 paniers sur 10 abandonnés
  const perdu = abandonnes * panier;
  const taux = rel === 2 ? 0.03 : 0.05; // hypothèse prudente
  const recup = Math.round(perdu * taux);
  const nbRentab = panier > 0 ? Math.ceil(PRIX / panier) : 1;
  const actif = LIEN_PAIEMENT.startsWith("https://");

  const Bouton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} className="block w-full text-center bg-moutarde text-marine font-titre font-extrabold text-lg px-6 py-4 min-h-[56px]">{children}</button>
  );

  return (
    <main className="mx-auto max-w-xl px-5 py-6 min-h-screen">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-titre font-semibold text-lg">Panier Perdu</Link>
        {etape > 0 && etape < 5 && <button onClick={() => aller(etape - 1)} className="underline text-sm text-gris min-h-[44px] px-2">Retour</button>}
      </div>

      {etape < 3 && (
        <section className="mt-8">
          <p className="text-sm text-gris">Question {etape + 1} sur 3</p>
          <div className="mt-2 h-2 bg-marine/15" role="progressbar" aria-valuenow={etape + 1} aria-valuemin={1} aria-valuemax={3}>
            <div className="h-2 bg-marine" style={{ width: `${((etape + 1) / 3) * 100}%` }} />
          </div>
          <h1 className="font-titre font-extrabold text-3xl leading-tight mt-8">{Q[etape].titre}</h1>
          <div className="mt-6 space-y-3">
            {Q[etape].opts.map(([label], i) => (
              <button key={label} onClick={() => choisir(i)} className="block w-full text-left border-2 border-marine px-5 py-4 min-h-[56px] font-semibold active:bg-moutarde">{label}</button>
            ))}
          </div>
        </section>
      )}

      {etape === 3 && (
        <section className="mt-8">
          <h1 className="font-titre font-extrabold text-3xl leading-tight">Voilà ce que ça te coûte.</h1>
          <p className="mt-5 text-lg leading-snug">Tu reçois environ <strong>{cmd} commandes par mois</strong>, avec un panier moyen de <strong>{panier} €</strong>. Quand 7 paniers sur 10 sont abandonnés, cela fait environ <strong>{abandonnes} paniers pleins</strong> qui partent chaque mois.</p>
          <p className="mt-5 font-titre font-extrabold text-4xl">{eur(perdu)}</p>
          <p className="text-gris">de ventes à un clic de la caisse, chaque mois.</p>
          <p className="mt-6 leading-relaxed">
            {rel === 0 && "Aujourd’hui, tu ne relances personne : ces paniers ne reviennent jamais."}
            {rel === 1 && "Aujourd’hui, tu relances à la main, quand tu y penses : ça ne tient pas dans la durée."}
            {rel === 2 && "Ta plateforme envoie déjà un email. Panier Perdu ajoute une seconde relance, avec code de réduction si tu veux, et te montre en euros ce que ça rapporte."}
          </p>
          <div className="mt-6 border-l-4 border-moutarde pl-4">
            <p className="font-semibold">Ce que Panier Perdu changerait</p>
            <p className="mt-1 leading-relaxed">Si deux relances ramènent {Math.round(taux * 100)} % de ces paniers, cela fait environ <strong>{eur(recup)} par mois</strong> récupérés. Il suffit de <strong>{nbRentab} panier{nbRentab > 1 ? "s" : ""} récupéré{nbRentab > 1 ? "s" : ""}</strong> pour couvrir l’abonnement.</p>
            <p className="mt-2 text-xs text-gris">Estimation : 7 paniers abandonnés sur 10 (moyenne Baymard) et {Math.round(taux * 100)} % récupérés. Le résultat réel dépend de ta boutique.</p>
          </div>
          <div className="mt-8"><Bouton onClick={() => aller(4)}>Voir ton plan de relance</Bouton></div>
        </section>
      )}

      {etape === 4 && (
        <section className="mt-8">
          <h1 className="font-titre font-extrabold text-3xl leading-tight">Ta première relance, prête à l’emploi.</h1>
          <p className="mt-3 text-gris">Tu peux la copier dès maintenant dans l’outil d’emailing que tu utilises déjà.</p>
          <pre className="mt-5 whitespace-pre-wrap bg-white border border-marine/20 p-4 text-sm leading-relaxed font-texte">{EMAIL1}</pre>
          <button onClick={() => { navigator.clipboard?.writeText(EMAIL1).then(() => setCopie(true)).catch(() => {}); }} className="mt-3 border-2 border-marine px-5 py-3 font-semibold min-h-[48px]">{copie ? "Copié" : "Copier le texte"}</button>
          <div className="mt-8 border-2 border-dashed border-marine/40 p-4">
            <p className="font-titre font-semibold text-lg">Relance 2 · Verrouillée</p>
            <p className="text-sm text-gris">Envoyée deux jours plus tard, avec ton code de réduction facultatif.</p>
            <p aria-hidden className="mt-3 text-sm blur-sm select-none">Bonjour, ton panier est toujours là. Pour te remercier d’avoir pris le temps de le remplir, voici un code de réduction valable quelques jours seulement…</p>
          </div>
          <div className="mt-8"><Bouton onClick={() => aller(5)}>Débloquer la suite</Bouton></div>
        </section>
      )}

      {etape === 5 && (
        <section className="mt-8">
          <h1 className="font-titre font-extrabold text-3xl leading-tight">Voilà ton plan, prêt.</h1>
          <p className="mt-3 leading-relaxed">Ta première relance est écrite. Reste la seconde, le branchement à ta boutique et le compteur en euros.</p>

          <p className="mt-6 leading-relaxed">Pour ta boutique, <strong>{eur(perdu)}</strong> de paniers s’en vont chaque mois. <strong>{nbRentab} panier{nbRentab > 1 ? "s" : ""} récupéré{nbRentab > 1 ? "s" : ""}</strong> suffit à couvrir le mois. Estimation prudente : {eur(recup)} récupérés.</p>

          <div className="mt-6 border-2 border-marine p-5">
            <p className="font-titre font-extrabold text-4xl">{PRIX} € <span className="text-lg font-semibold">par mois</span></p>
            <p className="text-gris">Soit moins d’un euro par jour, relances illimitées.</p>
            <div className="mt-4 bg-marine text-white p-4">
              <p className="font-semibold">Satisfait ou remboursé, 30 jours.</p>
              <p className="mt-1 text-sm leading-relaxed">Écris à {EMAIL_CONTACT} dans les 30 jours qui suivent la livraison : tu es remboursé sous 5 jours ouvrés, sans justification.</p>
            </div>
            <a href={actif ? LIEN_PAIEMENT : "#"} aria-disabled={!actif} className={`mt-4 block text-center bg-moutarde text-marine font-titre font-extrabold text-lg px-6 py-4 min-h-[56px] ${actif ? "" : "opacity-60 pointer-events-none"}`}>Payer {PRIX} € et réserver mon accès</a>
            <p className="mt-2 text-sm text-center">Sans engagement, résiliable à tout moment.</p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-gris">Accès fondateur : Panier Perdu est en construction. Il t’est livré au plus tard le {DATE_LIVRAISON}. Passé cette date, tu es remboursé en entier.</p>

          <h2 className="font-titre font-extrabold text-2xl mt-10">Questions fréquentes</h2>
          <div className="mt-3 divide-y divide-marine/15 border-y border-marine/15">
            {FAQ.map((f) => (
              <details key={f.q} className="py-3">
                <summary className="font-titre font-semibold cursor-pointer min-h-[44px] flex items-center">{f.q}</summary>
                <p className="mt-1 text-gris leading-relaxed">{f.r}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
