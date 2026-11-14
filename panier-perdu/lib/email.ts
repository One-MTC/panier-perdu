// Contenu des deux emails de relance (texte + HTML).
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export type Article = { titre: string; quantite: number };

export function construireEmail(o: {
  numero: 1 | 2;
  prenom: string | null;
  boutique: string;
  articles: Article[];
  lien: string;
  code: string | null;
  desinscription: string;
}) {
  const bonjour = o.prenom ? `Bonjour ${o.prenom},` : "Bonjour,";
  const liste = o.articles.map((a) => `${a.quantite} × ${a.titre}`);

  const sujet = o.numero === 1 ? "Tu as oublié quelque chose dans ton panier" : "Ton panier t’attend toujours";
  const intro =
    o.numero === 1
      ? `Tu as laissé des articles dans ton panier chez ${o.boutique}. Ils t’attendent toujours :`
      : `Ton panier chez ${o.boutique} est toujours là, avec :`;
  const reduction =
    o.numero === 2 && o.code
      ? `Pour t’aider à te décider, voici un code de réduction : ${o.code}. Saisis-le à l’étape de paiement.`
      : null;
  const appel = "Pour reprendre là où tu t’es arrêté(e) :";
  const pied = `Tu reçois cet email parce que tu as commencé une commande chez ${o.boutique}.`;

  const texte = [
    bonjour,
    "",
    intro,
    ...liste.map((l) => `- ${l}`),
    "",
    ...(reduction ? [reduction, ""] : []),
    appel,
    o.lien,
    "",
    `À très vite,`,
    o.boutique,
    "",
    "--",
    pied,
    `Ne plus recevoir ces emails : ${o.desinscription}`,
  ].join("\n");

  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#f7f7f4;font-family:Arial,Helvetica,sans-serif;color:#12263f;">
<div style="max-width:520px;margin:0 auto;background:#ffffff;padding:24px;">
<p>${esc(bonjour)}</p>
<p>${esc(intro)}</p>
<ul>${liste.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
${reduction ? `<p style="background:#fdf3c7;padding:12px;">${esc(reduction)}</p>` : ""}
<p>${esc(appel)}</p>
<p><a href="${esc(o.lien)}" style="display:inline-block;background:#f4c20d;color:#12263f;padding:14px 20px;text-decoration:none;font-weight:bold;">Reprendre mon panier</a></p>
<p>À très vite,<br>${esc(o.boutique)}</p>
<hr style="border:none;border-top:1px solid #dddddd;margin:24px 0;">
<p style="font-size:12px;color:#5b6572;">${esc(pied)}<br><a href="${esc(o.desinscription)}" style="color:#5b6572;">Ne plus recevoir ces emails</a></p>
</div></body></html>`;

  return { sujet, texte, html };
}
