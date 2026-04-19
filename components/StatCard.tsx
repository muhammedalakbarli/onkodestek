interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  accent?: string;
}

export default function StatCard({ title, value, subtitle, icon, accent = "blue" }: Props) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100" },
    green:  { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100" },
    purple: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  };
  const c = colors[accent] ?? colors.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className={`w-10 h-10 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <p className={`text-2xl font-bold mt-0.5 ${c.text}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
