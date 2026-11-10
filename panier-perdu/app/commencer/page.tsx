import type { Metadata } from "next";
import Funnel from "./Funnel";

export const metadata: Metadata = {
  title: "Ton plan de relance en 3 questions | Panier Perdu",
  description: "Trois questions, et tu vois ce que les paniers abandonnés te coûtent chaque mois.",
};

export default function Page() {
  return <Funnel />;
}
