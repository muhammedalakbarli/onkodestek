type Corner = "tl" | "tr" | "bl" | "br";

// SVG rotate(angle, cx, cy) — mərkəz ətrafında fırladır
const ROTATE: Record<Corner, string> = {
  tl: "",
  tr: "rotate(90,120,120)",
  br: "rotate(180,120,120)",
  bl: "rotate(270,120,120)",
};

const POS: Record<Corner, React.CSSProperties> = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  br: { bottom: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
};

export default function AzOrnament({
  corner = "tl",
  size = 260,
  opacity = 0.18,
}: {
  corner?: Corner;
  size?: number;
  opacity?: number;
}) {
  const c = "#0d9488";
  const t = ROTATE[corner];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute",
        pointerEvents: "none",
        opacity,
        ...POS[corner],
      }}
    >
      <g transform={t || undefined}>

        {/* ── Üfüqi kənar — romb zənciri ──────────────────────────── */}
        {[8, 32, 56, 80, 104, 128, 152, 176, 200, 224].map((x) => (
          <polygon
            key={`h${x}`}
            points={`${x},0 ${x+12},12 ${x},24 ${x-12},12`}
            stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.12"
          />
        ))}

        {/* ── Şaquli kənar — romb zənciri ─────────────────────────── */}
        {[8, 32, 56, 80, 104, 128, 152, 176, 200, 224].map((y) => (
          <polygon
            key={`v${y}`}
            points={`0,${y} 12,${y+12} 0,${y+24} -12,${y+12}`}
            stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.12"
          />
        ))}

        {/* ── Künc medallonu — 8 guşəli ulduz ─────────────────────── */}
        <g transform="translate(62,62)">
          <circle cx="0" cy="0" r="44" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.06"/>
          {/* Xarici ulduz */}
          <polygon
            points="0,-36 8,-12 34,-22 16,-4 28,26 6,14 0,38 -6,14 -28,26 -16,-4 -34,-22 -8,-12"
            stroke={c} strokeWidth="1.4" fill={c} fillOpacity="0.15"
          />
          {/* Daxili romb */}
          <polygon
            points="0,-16 12,0 0,16 -12,0"
            stroke={c} strokeWidth="1.1" fill={c} fillOpacity="0.3"
          />
          <circle cx="0" cy="0" r="4" fill={c}/>
        </g>

        {/* ── Buta (paisley) — sol kənar ──────────────────────────── */}
        {[92, 128, 164, 200].map((y, i) => (
          <g key={`bl${y}`} transform={`translate(24,${y}) rotate(${i%2===0?-8:8})`}>
            <path
              d="M0,-22 C8,-16 11,-6 9,4 C7,13 1,18 0,22 C-1,18 -7,13 -9,4 C-11,-6 -8,-16 0,-22Z"
              stroke={c} strokeWidth="1" fill={c} fillOpacity="0.2"
            />
            <circle cx="0" cy="22" r="2.5" fill={c} fillOpacity="0.6"/>
            <line x1="0" y1="-22" x2="0" y2="-30" stroke={c} strokeWidth="0.8" opacity="0.5"/>
          </g>
        ))}

        {/* ── Buta (paisley) — üst kənar ──────────────────────────── */}
        {[92, 128, 164, 200].map((x, i) => (
          <g key={`bt${x}`} transform={`translate(${x},24) rotate(90) rotate(${i%2===0?-8:8})`}>
            <path
              d="M0,-22 C8,-16 11,-6 9,4 C7,13 1,18 0,22 C-1,18 -7,13 -9,4 C-11,-6 -8,-16 0,-22Z"
              stroke={c} strokeWidth="1" fill={c} fillOpacity="0.2"
            />
            <circle cx="0" cy="22" r="2.5" fill={c} fillOpacity="0.6"/>
          </g>
        ))}

        {/* ── Arabesk qolu 1 ───────────────────────────────────────── */}
        <path
          d="M28 130 Q55 108 82 88 Q112 66 138 42 Q162 20 190 8"
          stroke={c} strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Yarpaqlar */}
        {[
          [58,112,-40], [106,74,-20], [152,38,-5],
        ].map(([x,y,r],i) => (
          <g key={`lf${i}`} transform={`translate(${x},${y}) rotate(${r})`}>
            <ellipse cx="0" cy="0" rx="6" ry="12" stroke={c} strokeWidth="0.9" fill={c} fillOpacity="0.18"/>
          </g>
        ))}

        {/* ── Arabesk qolu 2 ───────────────────────────────────────── */}
        <path
          d="M130 28 Q108 55 88 82 Q66 112 42 138 Q20 162 8 190"
          stroke={c} strokeWidth="1.5" strokeLinecap="round"
        />
        {[
          [112,58,50], [74,106,70], [38,152,85],
        ].map(([x,y,r],i) => (
          <g key={`lf2${i}`} transform={`translate(${x},${y}) rotate(${r})`}>
            <ellipse cx="0" cy="0" rx="6" ry="12" stroke={c} strokeWidth="0.9" fill={c} fillOpacity="0.18"/>
          </g>
        ))}

        {/* ── 4 köşə ulduzu (ara boşluqlar) ───────────────────────── */}
        {[[148,96],[96,148],[188,64],[64,188]].map(([x,y],i) => (
          <g key={`sm${i}`} transform={`translate(${x},${y})`}>
            <polygon
              points="0,-9 3,-3 9,0 3,3 0,9 -3,3 -9,0 -3,-3"
              stroke={c} strokeWidth="0.9" fill={c} fillOpacity="0.2"
            />
          </g>
        ))}

      </g>
    </svg>
  );
}
