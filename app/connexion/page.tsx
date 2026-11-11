"use client";
import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

type Etat = "attente" | "envoi" | "envoye" | "erreur";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<Etat>("attente");
  const [message, setMessage] = useState("");

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const adresse = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) {
      setEtat("erreur");
      setMessage("Cette adresse email ne semble pas valide.");
      return;
    }
    setEtat("envoi");
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.auth.signInWithOtp({
      email: adresse,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setEtat("erreur");
      setMessage(error.status === 429 ? "Trop de demandes. Réessaie dans quelques minutes." : "L’email n’a pas pu partir. Réessaie dans un instant.");
      return;
    }
    setEtat("envoye");
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10 pb-16">
      <Link href="/" className="font-titre font-semibold text-lg">Panier Perdu</Link>
      <h1 className="font-titre font-extrabold text-3xl leading-tight mt-8">Connexion</h1>
      {etat === "envoye" ? (
        <div className="mt-6 border-l-4 border-moutarde pl-4">
          <p className="font-semibold">Regarde ta boîte mail.</p>
          <p className="mt-1 text-gris leading-relaxed">Un lien de connexion vient d’être envoyé à {email}. Ouvre-le sur cet appareil. Pense à vérifier tes courriers indésirables.</p>
        </div>
      ) : (
        <form onSubmit={envoyer} className="mt-6">
          <label htmlFor="email" className="block font-semibold">Ton adresse email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border-2 border-marine bg-white px-4 py-4 text-lg" placeholder="toi@exemple.fr" />
          <button type="submit" disabled={etat === "envoi"} className="mt-4 block w-full bg-moutarde text-marine font-titre font-extrabold text-lg px-6 py-4 min-h-[56px] disabled:opacity-60">
            {etat === "envoi" ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
          </button>
          {etat === "erreur" && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
          <p className="mt-4 text-sm text-gris">Pas de mot de passe : tu reçois un lien à usage unique.</p>
        </form>
      )}
    </main>
  );
}
