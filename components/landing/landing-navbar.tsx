"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as FirebaseUser } from "firebase/auth";

export function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface LandingNavbarProps {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  isSigningIn: boolean;
  onSignInWithGoogle: () => void;
  personalPageSlug: string;
}

export function LandingNavbar({
  currentUser,
  authLoading,
  isSigningIn,
  onSignInWithGoogle,
  personalPageSlug,
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-pink-100/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* 서비스 로고 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors">
              MyLink
            </span>
          </div>
        </Link>

        {/* 내비게이션 메뉴 (데스크톱) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-pink-600 transition-colors">
            주요 기능
          </a>
          <a href="#preview" className="hover:text-pink-600 transition-colors">
            미리보기
          </a>
          <a href="#hanyang" className="hover:text-pink-600 transition-colors">
            프로젝트 소개
          </a>
        </nav>

        {/* 우측 액션 버튼 */}
        <div className="flex items-center gap-3">
          {authLoading ? (
            <div className="size-8 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-pink-500" />
            </div>
          ) : currentUser ? (
            <Link
              href={`/${encodeURIComponent(personalPageSlug)}`}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200/80 text-pink-700 text-xs sm:text-sm font-medium transition-all group shadow-2xs"
            >
              <div className="size-6 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center overflow-hidden">
                {currentUser.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "User"}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-3.5" />
                )}
              </div>
              <span className="max-w-[120px] truncate">
                {currentUser.displayName || personalPageSlug}의 링크
              </span>
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Button
              onClick={onSignInWithGoogle}
              disabled={isSigningIn}
              size="sm"
              className="h-9 px-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs text-xs sm:text-sm font-medium gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {isSigningIn ? (
                <Loader2 className="size-3.5 animate-spin text-pink-500" />
              ) : (
                <GoogleIcon className="size-3.5" />
              )}
              <span>로그인</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
