// Client avec la clé SECRÈTE : accès complet à la base.
// À importer UNIQUEMENT dans du code serveur (pages serveur, routes), jamais dans un composant "use client".
import { createClient } from "@supabase/supabase-js";

export function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
