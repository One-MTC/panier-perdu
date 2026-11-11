import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Reçoit le lien magique, ouvre la session, puis envoie vers le compte.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/compte`);
  }
  return NextResponse.redirect(`${origin}/connexion?erreur=lien`);
}
