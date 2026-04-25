import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, makeHref }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {page > 1 && (
        <Link href={makeHref(page - 1)}
          className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors">
          ← Əvvəlki
        </Link>
      )}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
        ) : (
          <Link key={p} href={makeHref(p)}
            className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-xl transition-colors ${
              p === page
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
            }`}>
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={makeHref(page + 1)}
          className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors">
          Növbəti →
        </Link>
      )}
    </div>
  );
}
