import * as React from "react";
import type { User } from "@/lib/mockData";
import { Sparkles, CheckCircle2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: User;
  firestorePath?: string;
  canEdit?: boolean;
  onEditProfileClick?: () => void;
  className?: string;
}

export function ProfileHeader({
  user,
  firestorePath,
  canEdit = false,
  onEditProfileClick,
  className = "",
}: ProfileHeaderProps) {
  // 표시 이름의 앞 글자
  const initial = user.displayName ? user.displayName.slice(0, 1).toUpperCase() : "M";

  return (
    <section className={`flex flex-col items-center text-center w-full ${className}`}>
      {/* 아바타 영역: 기본 파스텔 그라데이션 컬러 */}
      <div className="relative group mb-3.5">
        {/* 외부 소프트 글로우 링 */}
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 rounded-full blur-xs opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* 메인 파스텔 그라데이션 원형 */}
        <div className="relative size-24 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-rose-300 via-pink-200 to-amber-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
          <span className="relative text-2xl font-black text-rose-500/80 tracking-wider select-none drop-shadow-xs">
            {initial}
          </span>
          <Sparkles className="absolute top-3 right-3 size-3.5 text-amber-300/80 animate-pulse" />
        </div>
      </div>

      {/* 표시 이름 & 사용자 핸들 */}
      <div className="flex items-center gap-1.5 justify-center mb-0.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {user.displayName}
        </h1>
        <span title="인증된 사용자">
          <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-100" />
        </span>
      </div>

      <div className="flex items-center gap-2 justify-center mb-2.5">
        <p className="text-xs sm:text-sm font-medium text-pink-600 tracking-wide font-mono">
          @{user.username}
        </p>

        {/* 본인인 경우 프로필 수정 버튼 노출 */}
        {canEdit && onEditProfileClick && (
          <Button
            size="xs"
            variant="ghost"
            onClick={onEditProfileClick}
            className="h-5 px-2 text-[11px] font-medium text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-full gap-1 border border-pink-200/60 shadow-2xs cursor-pointer transition-all active:scale-95"
            title="프로필 수정 (username, displayname, bio)"
          >
            <UserCog className="size-3 text-pink-500" />
            <span>수정</span>
          </Button>
        )}
      </div>

      {/* 한 줄 소개글 (Bio) */}
      <p className="text-sm text-slate-600 leading-relaxed max-w-sm px-2">
        {user.bio}
      </p>
    </section>
  );
}
