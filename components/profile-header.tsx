import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/mockData";

interface ProfileHeaderProps {
  user: User;
  className?: string;
}

export function ProfileHeader({ user, className = "" }: ProfileHeaderProps) {
  const initials = user.displayName ? user.displayName.slice(0, 2) : "ML";

  return (
    <section className={`flex flex-col items-center text-center w-full ${className}`}>
      {/* 파스텔 글로우 링 + shadcn Avatar */}
      <div className="relative group mb-3.5">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 rounded-full blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
        <Avatar className="size-24 border-4 border-white shadow-md relative">
          <AvatarImage
            src={user.avatarUrl}
            alt={user.displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-pink-100 text-pink-700 text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
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
