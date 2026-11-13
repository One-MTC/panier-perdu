// Lecture des paniers abandonnés d'une boutique Shopify (API GraphQL Admin).
const DOMAINE = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;
const VERSION_API = "2026-04";

export type PanierShopify = {
  id: string;
  lien: string;
  maj: string;
  termine: boolean;
  montant: number;
  devise: string;
  email: string | null;
  prenom: string | null;
  accepteMarketing: boolean;
  articles: { titre: string; quantite: number }[];
};

function verifierDomaine(domaine: string) {
  if (!DOMAINE.test(domaine)) throw new Error("Adresse de boutique invalide");
}

// Jeton temporaire (24 h) obtenu avec l'identifiant et le secret de l'application.
export async function jetonShopify(domaine: string, clientId: string, clientSecret: string): Promise<string> {
  verifierDomaine(domaine);
  const rep = await fetch(`https://${domaine}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
  });
  if (!rep.ok) throw new Error(`Jeton refusé par Shopify (code ${rep.status})`);
  const json = (await rep.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Jeton absent dans la réponse de Shopify");
  return json.access_token;
}

const REQUETE = `
query Paniers($n: Int!) {
  abandonedCheckouts(first: $n, reverse: true) {
    edges { node {
      id abandonedCheckoutUrl updatedAt completedAt
      totalPriceSet { shopMoney { amount currencyCode } }
      customer { firstName defaultEmailAddress { emailAddress marketingState } }
      lineItems(first: 10) { edges { node { title quantity } } }
    } }
  }
}`;

export async function lirePaniers(domaine: string, jeton: string, n = 50): Promise<PanierShopify[]> {
  verifierDomaine(domaine);
  const rep = await fetch(`https://${domaine}/admin/api/${VERSION_API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": jeton },
    body: JSON.stringify({ query: REQUETE, variables: { n } }),
  });
  if (!rep.ok) throw new Error(`Lecture refusée par Shopify (code ${rep.status})`);
  const json = (await rep.json()) as any;
  if (json.errors?.length) throw new Error(`Shopify : ${String(json.errors[0].message).slice(0, 200)}`);
  const noeuds: any[] = (json.data?.abandonedCheckouts?.edges ?? []).map((e: any) => e.node);
  return noeuds.map((p) => ({
    id: String(p.id),
    lien: String(p.abandonedCheckoutUrl ?? ""),
    maj: String(p.updatedAt),
    termine: Boolean(p.completedAt),
    montant: Number(p.totalPriceSet?.shopMoney?.amount ?? 0),
    devise: String(p.totalPriceSet?.shopMoney?.currencyCode ?? "EUR"),
    email: p.customer?.defaultEmailAddress?.emailAddress ? String(p.customer.defaultEmailAddress.emailAddress).trim().toLowerCase() : null,
    prenom: p.customer?.firstName ? String(p.customer.firstName) : null,
    accepteMarketing: p.customer?.defaultEmailAddress?.marketingState === "SUBSCRIBED",
    articles: (p.lineItems?.edges ?? []).map((e: any) => ({ titre: String(e.node.title), quantite: Number(e.node.quantity) })),
  }));
}
