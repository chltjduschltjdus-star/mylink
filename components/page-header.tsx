import * as React from "react";
import { Sparkles, RotateCcw, Share2, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  isCopied: boolean;
  onShare: () => void;
  onReset: () => void;
  onOpenAddLink?: () => void;
  className?: string;
}

export function PageHeader({
  isCopied,
  onShare,
  onReset,
  onOpenAddLink,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`w-full max-w-[480px] flex items-center justify-between mb-6 px-1 ${className}`}>
      {/* shadcn Badge 데모 표시 */}
      <Badge
        variant="pastel"
        className="px-2.5 py-1 text-[11px] font-semibold tracking-wide gap-1 shadow-xs"
      >
        <Sparkles className="size-3 text-pink-500" />
        <span>MyLink Demo</span>
      </Badge>

      {/* 액션 버튼 그룹 (링크 추가 + 초기화 + 공유) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onOpenAddLink && (
          <Button
            size="sm"
            onClick={onOpenAddLink}
            title="새 링크 추가하기"
            className="text-xs bg-pink-500 hover:bg-pink-600 text-white rounded-full h-8 px-3 gap-1 shadow-xs transition-all active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>링크 추가</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="초기 더미 데이터로 복원"
          className="text-xs text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-full h-8 px-2.5 gap-1.5 transition-all shadow-xs"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden sm:inline">초기화</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="text-xs bg-white/90 hover:bg-white border-pink-200/80 text-slate-700 rounded-full h-8 px-3 gap-1.5 shadow-xs transition-all active:scale-95"
        >
          {isCopied ? (
            <>
              <Check className="size-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">복사됨!</span>
            </>
          ) : (
            <>
              <Share2 className="size-3.5 text-slate-600" />
              <span className="hidden xs:inline">공유</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
