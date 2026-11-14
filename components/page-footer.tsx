import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface PageFooterProps {
  className?: string;
}

export function PageFooter({ className = "" }: PageFooterProps) {
  return (
    <footer className={`mt-12 mb-6 flex flex-col items-center gap-2 text-center ${className}`}>
      <Badge
        variant="outline"
        className="rounded-full px-3.5 py-1 bg-white/70 border-pink-200/60 text-slate-600 text-xs shadow-xs gap-1.5"
      >
        <span className="size-1.5 rounded-full bg-pink-400 animate-pulse" />
        <span>Powered by</span>
        <strong className="text-pink-600 font-bold">MyLink</strong>
      </Badge>
      <p className="text-[11px] text-slate-400">
        나만의 소셜 링크와 포트폴리오를 한곳에서 간편하게 공유하세요.
      </p>
    </footer>
  );
}
