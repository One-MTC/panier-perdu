"use client";
import Link from "next/link";
export default function Erreur({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="font-titre font-extrabold text-4xl">Un problème est survenu.</h1>
      <p className="mt-4 text-gris">Ce n’est pas de votre fait. Réessayez, ou revenez à l’accueil.</p>
      <div className="mt-8 flex gap-3 flex-wrap">
        <button onClick={reset} className="bg-marine text-white px-6 py-4 font-semibold">Réessayer</button>
        <Link href="/" className="border-2 border-marine px-6 py-4 font-semibold">Accueil</Link>
      </div>
    </main>
  );
}
