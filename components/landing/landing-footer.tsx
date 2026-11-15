"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, Heart } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function LandingFooter() {
  return (
    <footer id="hanyang" className="w-full bg-white/80 border-t border-pink-100/80 py-12 px-4 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* 좌측: 로고 및 프로젝트 소속 안내 */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="size-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              MyLink (마이링크)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
              한양대학교 바이브 코딩
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            한양대학교 바이브 코딩 프로젝트로 제작된 경량 & 고성능 링크인바이오(Link-in-bio) 서비스입니다.
          </p>
        </div>

        {/* 중앙: 한양대학교 바이브 코딩 크레딧 배지 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl shadow-2xs">
          <span>Created with</span>
          <Heart className="size-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>at</span>
          <strong className="text-slate-900 font-bold">한양대학교 바이브 코딩</strong>
        </div>

        {/* 우측: GitHub 링크 및 저작권 */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <GithubIcon className="size-3.5" />
              <span>GitHub 저장소 바로가기</span>
              <ExternalLink className="size-3 text-slate-400" />
            </a>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 MyLink. 한양대학교 바이브 코딩. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
