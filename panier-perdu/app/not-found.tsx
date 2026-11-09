import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="font-titre font-extrabold text-4xl">Cette page n’existe pas.</h1>
      <p className="mt-4 text-gris">Le lien est peut-être erroné ou ancien.</p>
      <Link href="/" className="mt-8 inline-block bg-marine text-white px-6 py-4 font-semibold">Retourner à l’accueil</Link>
    </main>
  );
}
