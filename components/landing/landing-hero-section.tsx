"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2, PlayCircle, ShieldCheck, Zap, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./landing-navbar";
import type { User as FirebaseUser } from "firebase/auth";

interface LandingHeroSectionProps {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  isSigningIn: boolean;
  onSignInWithGoogle: () => void;
  personalPageSlug: string;
}

export function LandingHeroSection({
  currentUser,
  authLoading,
  isSigningIn,
  onSignInWithGoogle,
  personalPageSlug,
}: LandingHeroSectionProps) {
  return (
    <section className="relative w-full pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 overflow-hidden flex flex-col items-center text-center">
      {/* 배경 장식 원형 그라데이션 블러 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] sm:w-[700px] sm:h-[450px] bg-gradient-to-tr from-pink-200/40 via-rose-200/30 to-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* 1. 상단 하이라이트 뱃지 */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200/70 shadow-xs mb-6 backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
        <span className="flex size-2 rounded-full bg-pink-500 animate-pulse" />
        <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          감각적인 링크인바이오의 시작
        </span>
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">|</span>
        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
          한양대학교 바이브 코딩
        </span>
      </div>

      {/* 2. 서비스 이름 및 메인 헤드라인 */}
      <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:leading-[1.18] mb-6">
        <span className="block text-slate-900 mb-1 sm:mb-2">
          나만의 모든 링크를
        </span>
        <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
          하나의 아름다운 마이링크(MyLink)
        </span>
        <span>에 담으세요</span>
      </h1>

      {/* 3. 서브 태그라인 */}
      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-8 sm:mb-10 font-normal">
        인스타그램, 유튜브, 블로그, 포트폴리오까지. 단 하나의 링크로 나를 온전히 표현하고 방문자와 소통하세요. 복잡한 가입 절차 없이 3초 만에 시작할 수 있습니다.
      </p>

      {/* 4. CTA 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center">
        {currentUser ? (
          /* 로그인 사용자: 내 링크 페이지로 이동 */
          <Link
            href={`/${encodeURIComponent(personalPageSlug)}`}
            className="w-full sm:w-auto min-w-[200px]"
          >
            <Button
              size="lg"
              className="w-full h-13 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 hover:from-pink-600 hover:via-rose-600 hover:to-rose-500 text-white font-bold text-base shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 gap-2.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>내 마이링크 관리하기</span>
              <ArrowRight className="size-4.5" />
            </Button>
          </Link>
        ) : (
          /* 비로그인 사용자: Google 소셜 로그인 CTA */
          <Button
            onClick={onSignInWithGoogle}
            disabled={isSigningIn || authLoading}
            size="lg"
            className="w-full sm:w-auto min-w-[220px] h-13 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 hover:from-pink-600 hover:via-rose-600 hover:to-rose-500 text-white font-bold text-base shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="size-4.5 animate-spin" />
                <span>로그인 진행 중...</span>
              </>
            ) : (
              <>
                <div className="size-6 rounded-full bg-white flex items-center justify-center shrink-0">
                  <GoogleIcon className="size-3.5" />
                </div>
                <span>Google로 무료 시작하기</span>
                <ArrowRight className="size-4.5 ml-0.5" />
              </>
            )}
          </Button>
        )}

        {/* 보조 CTA: 미리보기 섹션 이동 */}
        <a
          href="#preview"
          className="w-full sm:w-auto min-w-[160px]"
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full h-13 px-6 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300 font-semibold text-base shadow-2xs gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <PlayCircle className="size-4.5 text-slate-500" />
            <span>예시 화면 보기</span>
          </Button>
        </a>
      </div>

      {/* 5. 신뢰 및 핵심 장점 뱃지 목록 */}
      <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <Zap className="size-4 text-amber-500" />
          <span>3초 완성 간편 생성</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>Google 간편 보안 인증</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MousePointerClick className="size-4 text-pink-500" />
          <span>실시간 클릭 분석 지원</span>
        </div>
      </div>
    </section>
  );
}
