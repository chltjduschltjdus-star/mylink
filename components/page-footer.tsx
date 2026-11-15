import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons";

interface PageFooterProps {
  className?: string;
}

export function PageFooter({ className = "" }: PageFooterProps) {
  return (
    <footer className={`mt-12 mb-6 flex flex-col items-center gap-2.5 text-center ${className}`}>
      <Link href="/" className="inline-block group">
        <Badge
          variant="outline"
          className="rounded-full px-3.5 py-1 bg-white/70 hover:bg-white border-pink-200/60 text-slate-600 text-xs shadow-xs gap-1.5 transition-all group-hover:border-pink-300"
        >
          <span className="size-1.5 rounded-full bg-pink-400 animate-pulse" />
          <span>Powered by</span>
          <strong className="text-pink-600 font-bold group-hover:text-pink-700">MyLink</strong>
        </Badge>
      </Link>
      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <span>한양대학교 바이브 코딩</span>
        <span>•</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-600 inline-flex items-center gap-1 transition-colors"
        >
          <GithubIcon className="size-3" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
