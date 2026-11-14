import * as React from "react";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`pt-4 pb-1 px-1 flex items-center gap-2 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 select-none">
        {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
    </div>
  );
}
