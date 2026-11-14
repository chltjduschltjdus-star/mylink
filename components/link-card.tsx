import * as React from "react";
import { ExternalLink, MousePointerClick } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlockIcon } from "@/components/icons";
import type { Block } from "@/lib/mockData";

interface LinkCardProps {
  block: Block;
  onClick?: (block: Block) => void;
  className?: string;
}

export function LinkCard({ block, onClick, className = "" }: LinkCardProps) {
  const handleClick = () => {
    onClick?.(block);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // URL에서 도메인 및 경로 추출 (https:// 제거)
  const displayUrl = block.url ? block.url.replace(/^https?:\/\//, "") : "";

  return (
    <Card
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-pink-200/60 bg-white/85 hover:bg-white p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] backdrop-blur-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* 좌측 아이콘 + 링크 제목 & URL */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-100 group-hover:bg-pink-100 group-hover:scale-105 transition-all">
            {getBlockIcon(block.icon, "size-5")}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm sm:text-[15px] text-slate-800 truncate group-hover:text-pink-600 transition-colors">
              {block.title}
            </span>
            {displayUrl && (
              <span className="text-[11px] text-slate-400 truncate max-w-[240px] sm:max-w-[280px]">
                {displayUrl}
              </span>
            )}
          </div>
        </div>

        {/* 우측 누적 클릭수 뱃지 + 외부링크 화살표 */}
        <div className="flex items-center gap-2 shrink-0">
          {typeof block.clickCount === "number" && block.clickCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 font-normal gap-1 hidden xs:inline-flex"
            >
              <MousePointerClick className="size-2.5 text-slate-400" />
              <span>{block.clickCount}</span>
            </Badge>
          )}
          <div className="size-7 rounded-full flex items-center justify-center text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all">
            <ExternalLink className="size-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}
