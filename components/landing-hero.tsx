import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/page-header";

interface LandingHeroProps {
  onSignInWithGoogle: () => void;
  isLoading?: boolean;
}

export function LandingHero({ onSignInWithGoogle, isLoading = false }: LandingHeroProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
      {/* 심플한 로그인 박스 카드 */}
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-pink-100 shadow-sm flex flex-col items-center text-center">
        {/* 심플 로고 아이콘 */}
        <div className="size-14 rounded-2xl bg-gradient-to-tr from-rose-300 via-pink-200 to-amber-100 flex items-center justify-center shadow-xs mb-4">
          <Sparkles className="size-7 text-rose-500" />
        </div>

        {/* 타이틀 */}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
          MyLink 로그인
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Google 계정으로 바로 로그인하세요
        </p>

        {/* Google 로그인 즉시 실행 버튼 */}
        <Button
          onClick={onSignInWithGoogle}
          disabled={isLoading}
          size="lg"
          className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 rounded-2xl shadow-xs hover:shadow-sm font-semibold text-sm gap-3 transition-all active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-pink-500" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          <span>Google 계정으로 로그인</span>
        </Button>
      </div>
    </div>
  );
}
