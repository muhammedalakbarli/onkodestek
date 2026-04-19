"use client";

import { calcProgress } from "@/lib/utils";

interface Props {
  collected: number | string;
  goal: number | string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function ProgressBar({ collected, goal, showLabel = true, size = "md" }: Props) {
  const pct = calcProgress(collected, goal);
  const isComplete = pct >= 100;

  return (
    <div className="w-full">
      <div className={`w-full rounded-full overflow-hidden ${size === "sm" ? "h-1.5" : "h-2.5"} ${isComplete ? "bg-emerald-100" : "bg-slate-100"}`}>
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? "linear-gradient(90deg, #059669 0%, #10b981 100%)"
              : "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
          }}
        />
      </div>
      {showLabel && (
        <p className={`text-xs mt-1.5 text-right font-medium ${isComplete ? "text-emerald-600" : "text-slate-400"}`}>
          {isComplete ? "✓ Tam maliyyələşdi" : `${pct}% toplandı`}
        </p>
      )}
    </div>
  );
}
