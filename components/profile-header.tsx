import * as React from "react";
import type { User } from "@/lib/mockData";
import { Sparkles } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  className?: string;
}

export function ProfileHeader({ user, className = "" }: ProfileHeaderProps) {
  // 표시 이름의 앞 글자 (예: "최" 또는 "서연")
  const initial = user.displayName ? user.displayName.slice(0, 1) : "M";

  return (
    <section className={`flex flex-col items-center text-center w-full ${className}`}>
      {/* 파스텔톤 그라데이션 아바타 (인물 사진 대신 은은하고 감성적인 파스텔 그라데이션) */}
      <div className="relative group mb-3.5">
        {/* 외부 소프트 글로우 링 */}
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 rounded-full blur-xs opacity-70 group-hover:opacity-90 transition-opacity" />
        
        {/* 메인 파스텔 그라데이션 원형 */}
        <div className="relative size-24 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-rose-300 via-pink-200 to-amber-100 flex items-center justify-center overflow-hidden">
          {/* 부드러운 내부 빛 반사 효과 및 중앙 이니셜 */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
          <span className="relative text-2xl font-black text-rose-500/80 tracking-wider select-none drop-shadow-xs">
            {initial}
          </span>
          <Sparkles className="absolute top-3 right-3 size-3.5 text-amber-300/80 animate-pulse" />
        </div>
      </div>

      {/* 표시 이름 & 사용자 핸들 */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1">
        {user.displayName}
      </h1>
      <p className="text-xs sm:text-sm font-medium text-pink-600 mb-3 tracking-wide">
        @{user.username}
      </p>

      {/* 한 줄 소개글 (Bio) */}
      <p className="text-sm text-slate-600 leading-relaxed max-w-sm px-2">
        {user.bio}
      </p>
    </section>
  );
}
