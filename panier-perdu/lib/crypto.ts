// Chiffrement des données sensibles (emails, prénoms) avant stockage en base.
// La clé vient de la variable CLE_CHIFFREMENT (Vercel). Perdre cette clé = données illisibles.
import crypto from "crypto";

function cle(): Buffer {
  const secret = process.env.CLE_CHIFFREMENT;
  if (!secret || secret.length < 32) throw new Error("CLE_CHIFFREMENT manquante ou trop courte");
  return crypto.createHash("sha256").update(secret).digest();
}

export function chiffrer(texte: string): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", cle(), iv);
  const enc = Buffer.concat([c.update(texte, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
}

export function dechiffrer(valeur: string): string {
  const [iv, tag, enc] = valeur.split(".").map((p) => Buffer.from(p, "base64"));
  const d = crypto.createDecipheriv("aes-256-gcm", cle(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}

// Empreinte non réversible : permet de retrouver un email (désinscription) sans le stocker en clair.
export function empreinte(email: string): string {
  return crypto.createHmac("sha256", cle()).update(email.trim().toLowerCase()).digest("hex");
}
