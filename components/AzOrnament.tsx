import type { CSSProperties } from "react";

type Corner = "tl" | "tr" | "bl" | "br";

const TRANSFORMS: Record<Corner, string> = {
  tl: "rotate(0)",
  tr: "rotate(90) translate(0, -240)",
  br: "rotate(180) translate(-240, -240)",
  bl: "rotate(270) translate(-240, 0)",
};

const POSITIONS: Record<Corner, CSSProperties> = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  br: { bottom: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
};

export default function AzOrnament({
  corner = "tl",
  size = 240,
  opacity = 0.07,
  className = "",
}: {
  corner?: Corner;
  size?: number;
  opacity?: number;
  className?: string;
}) {
  const c = "#0d9488";

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
        ...POSITIONS[corner],
      }}
      className={className}
    >
      <g transform={`${TRANSFORMS[corner]}`} style={{ transformOrigin: "120px 120px" }}>

        {/* ── Kənar romb silsiləsi — üfüqi ───────────────────────────────── */}
        {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228].map((x) => (
          <polygon
            key={`hd-${x}`}
            points={`${x},0 ${x + 10},10 ${x},20 ${x - 10},10`}
            stroke={c}
            strokeWidth="0.8"
            fill={`${c}18`}
          />
        ))}

        {/* ── Kənar romb silsiləsi — şaquli ──────────────────────────────── */}
        {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228].map((y) => (
          <polygon
            key={`vd-${y}`}
            points={`0,${y} 10,${y + 10} 0,${y + 20} -10,${y + 10}`}
            stroke={c}
            strokeWidth="0.8"
            fill={`${c}18`}
          />
        ))}

        {/* ── 8 guşəli ulduz medallonu (künc) ────────────────────────────── */}
        <g transform="translate(56,56)">
          {/* Xarici dairə */}
          <circle cx="0" cy="0" r="38" stroke={c} strokeWidth="0.8" fill={`${c}0a`} />
          {/* 8-guşəli ulduz */}
          <polygon
            points="0,-32 7,-10 30,-20 14,-4 26,22 4,12 0,34 -4,12 -26,22 -14,-4 -30,-20 -7,-10"
            stroke={c}
            strokeWidth="1.1"
            fill={`${c}14`}
          />
          {/* Daxili romb */}
          <polygon
            points="0,-14 10,0 0,14 -10,0"
            stroke={c}
            strokeWidth="0.9"
            fill={`${c}20`}
          />
          {/* Mərkəz nöqtəsi */}
          <circle cx="0" cy="0" r="3" fill={c} />
        </g>

        {/* ── Buta (paisley) silsiləsi — sol kənar boyunca ───────────────── */}
        {[80, 120, 160, 200].map((y, i) => (
          <g key={`bl-${y}`} transform={`translate(22,${y}) rotate(${i % 2 === 0 ? 0 : 10})`}>
            <path
              d="M0,-18 C5,-14 8,-6 7,2 C5,9 1,13 0,17 C-1,13 -5,9 -7,2 C-8,-6 -5,-14 0,-18Z"
              stroke={c}
              strokeWidth="0.7"
              fill={`${c}18`}
            />
            <circle cx="0" cy="17" r="2" fill={c} opacity="0.5" />
          </g>
        ))}

        {/* ── Buta silsiləsi — üst kənar boyunca ─────────────────────────── */}
        {[80, 120, 160, 200].map((x, i) => (
          <g key={`bt-${x}`} transform={`translate(${x},22) rotate(90) rotate(${i % 2 === 0 ? 0 : 10})`}>
            <path
              d="M0,-18 C5,-14 8,-6 7,2 C5,9 1,13 0,17 C-1,13 -5,9 -7,2 C-8,-6 -5,-14 0,-18Z"
              stroke={c}
              strokeWidth="0.7"
              fill={`${c}18`}
            />
            <circle cx="0" cy="17" r="2" fill={c} opacity="0.5" />
          </g>
        ))}

        {/* ── Arabesk spiralı ─────────────────────────────────────────────── */}
        <path
          d="M26 110 Q50 90 80 80 Q110 70 130 50 Q150 30 160 10"
          stroke={c}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Spiral üzərindəki kiçik yarpaqlar */}
        {[
          { cx: 56, cy: 94, r: -30 },
          { cx: 106, cy: 63, r: 20 },
          { cx: 148, cy: 34, r: -15 },
        ].map(({ cx, cy, r }, i) => (
          <g key={`leaf-${i}`} transform={`translate(${cx},${cy}) rotate(${r})`}>
            <path
              d="M0,-10 C4,-6 5,0 3,6 C1,10 0,12 0,14 C0,12 -1,10 -3,6 C-5,0 -4,-6 0,-10Z"
              stroke={c}
              strokeWidth="0.7"
              fill={`${c}20`}
            />
          </g>
        ))}

        {/* ── Arabesk — ikinci qol ─────────────────────────────────────────── */}
        <path
          d="M110 26 Q90 50 80 80 Q70 110 50 130 Q30 150 10 160"
          stroke={c}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* ── Kiçik ulduzlar araboşluqlarda ──────────────────────────────── */}
        {[
          [130, 100], [100, 130], [160, 70], [70, 160], [190, 110], [110, 190],
        ].map(([x, y], i) => (
          <polygon
            key={`star-${i}`}
            points={`${x},${y! - 8} ${x! + 3},${y! - 3} ${x! + 8},${y} ${x! + 3},${y! + 3} ${x},${y! + 8} ${x! - 3},${y! + 3} ${x! - 8},${y} ${x! - 3},${y! - 3}`}
            stroke={c}
            strokeWidth="0.7"
            fill={`${c}10`}
          />
        ))}

      </g>
    </svg>
  );
}
