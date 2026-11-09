import { ImageResponse } from "next/og";
export const alt = "Panier Perdu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#12263F", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
        <div style={{ fontSize: 40, color: "#F4C20D", marginBottom: 24 }}>Panier Perdu</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Tes clients ont rempli leur panier, puis sont partis. Ramène-les.</div>
        <div style={{ fontSize: 34, marginTop: 36, color: "#cbd5e1" }}>2 relances automatiques · 29 € par mois</div>
      </div>
    ),
    size
  );
}
