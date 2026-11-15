"use client";

import Link from "next/link";
import { UserX, Home, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col items-center justify-center py-12 px-4 font-sans">
      <main className="w-full max-w-[480px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        {/* 상단 MyLink 뱃지 */}
        <Link href="/" className="mb-6 group">
          <Badge
            variant="pastel"
            className="px-3 py-1 text-xs font-semibold tracking-wide gap-1.5 shadow-xs group-hover:bg-pink-100 transition-colors"
          >
            <Sparkles className="size-3.5 text-pink-500 group-hover:scale-110 transition-transform" />
            <span>MyLink</span>
          </Badge>
        </Link>

        {/* 404 안내 카드 */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-pink-200/80 p-8 sm:p-10 shadow-lg flex flex-col items-center">
          {/* 원형 아이콘 */}
          <div className="relative mb-5">
            <div className="absolute -inset-2 bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 rounded-full blur-md opacity-60" />
            <div className="relative size-20 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-500 shadow-sm">
              <UserX className="size-9 text-pink-500" />
            </div>
          </div>

          {/* 에러 코드 뱃지 */}
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full mb-3 border border-pink-100">
            404 NOT FOUND
          </span>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            사용자를 찾을 수 없습니다
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mb-8">
            입력하신 <span className="font-semibold text-slate-700">displayName</span> 또는{" "}
            <span className="font-semibold text-slate-700">username</span>에 해당하는
            마이링크 페이지가 존재하지 않거나 주소가 변경되었습니다.
          </p>

          {/* 이동 버튼 그룹 */}
          <div className="w-full flex flex-col gap-2.5">
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 rounded-2xl border-pink-200 hover:bg-pink-50/70 text-slate-700 font-medium text-xs sm:text-sm gap-2 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="size-4 text-slate-500" />
                <span>홈으로 돌아가기</span>
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button className="w-full h-11 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium text-xs sm:text-sm gap-2 shadow-sm cursor-pointer">
                <Sparkles className="size-4" />
                <span>나만의 마이링크 만들기</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 하단 푸터 카피 */}
        <p className="mt-8 text-[11px] text-slate-400 font-sans">
          &copy; {new Date().getFullYear()} MyLink. All rights reserved.
        </p>
      </main>
    </div>
  );
}
