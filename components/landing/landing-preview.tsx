"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  ExternalLink,
  Mail,
  Palette,
  Eye,
  Check,
  MousePointerClick,
  Smartphone,
  Flame,
} from "lucide-react";
import { GithubIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./landing-navbar";
import type { User as FirebaseUser } from "firebase/auth";

interface LandingPreviewProps {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  isSigningIn: boolean;
  onSignInWithGoogle: () => void;
  personalPageSlug: string;
}

export function LandingPreview({
  currentUser,
  authLoading,
  isSigningIn,
  onSignInWithGoogle,
  personalPageSlug,
}: LandingPreviewProps) {
  // 미리보기 목업 내의 인터랙티브 링크 상태
  const [mockLinks, setMockLinks] = React.useState([
    {
      id: "1",
      title: "🎨 2026 UI/UX 디자인 포트폴리오",
      subtitle: "최신 프로젝트 및 케이스 스터디",
      clicks: 1842,
      isHot: true,
    },
    {
      id: "2",
      title: "📹 유튜브: 풀스택 바이브코딩 브이로그",
      subtitle: "매주 업데이트되는 개발 일상",
      clicks: 3420,
      isHot: true,
    },
    {
      id: "3",
      title: "☕ 1:1 커피챗 & 외주 문의 오픈카톡",
      subtitle: "언제든 편하게 질문 남겨주세요",
      clicks: 920,
      isHot: false,
    },
    {
      id: "4",
      title: "🛍️ 감성 일러스트 굿즈 스마트스토어",
      subtitle: "한정판 스티커 & 엽서 컬렉션",
      clicks: 615,
      isHot: false,
    },
  ]);

  const [clickedLinkId, setClickedLinkId] = React.useState<string | null>(null);

  // 목업 카드 클릭 시 카운터 증가 및 펄스 효과
  const handleCardClick = (id: string) => {
    setClickedLinkId(id);
    setMockLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
    setTimeout(() => {
      setClickedLinkId(null);
    }, 800);
  };

  return (
    <section id="preview" className="w-full py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* 섹션 타이틀 */}
        <div className="text-center max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold mb-3">
            <Smartphone className="size-3.5 text-rose-600" />
            <span>실제 화면 미리보기</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            방문자를 사로잡는 모바일 최적화 디자인
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            링크 카드를 직접 탭해보세요! 실시간 클릭 수 증가와 깔끔한 모바일 인터랙션을 미리 체험해볼 수 있습니다.
          </p>
        </div>

        {/* 데스크톱: 2컬럼 레이아웃 (좌: 안내 및 CTA, 우: 스마트폰 목업) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* 좌측 안내 및 CTA 컬럼 */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium mb-4">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>실시간 인터랙티브 데모</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
              손쉬운 링크 제작으로
              <br />
              <span className="text-pink-600">나만의 디지털 명함</span>을 완성하세요
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
              따뜻하고 산뜻한 파스텔 테마와 부드러운 애니메이션이 당신의 콘텐츠를 더욱 돋보이게 만듭니다. 인스타그램 프로필이나 명함 QR코드에 등록하기에 가장 완벽합니다.
            </p>

            {/* 특징 리스트 */}
            <div className="flex flex-col gap-3 mb-8 w-full max-w-md text-left">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-pink-100/80 shadow-2xs">
                <div className="size-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">모든 디바이스 완벽 지원</h4>
                  <p className="text-xs text-slate-500">스마트폰, 태블릿, PC 어떤 화면에서도 가장 예쁘게 보입니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-pink-100/80 shadow-2xs">
                <div className="size-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MousePointerClick className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">카드를 직접 눌러보세요</h4>
                  <p className="text-xs text-slate-500">우측(모바일은 하단) 스마트폰의 링크 카드를 탭하면 클릭 카운트가 즉시 반영됩니다.</p>
                </div>
              </div>
            </div>

            {/* 미리보기 하단 CTA 버튼 */}
            <div className="w-full max-w-md">
              {currentUser ? (
                <Link
                  href={`/${encodeURIComponent(personalPageSlug)}`}
                  className="w-full block"
                >
                  <Button
                    size="lg"
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-base shadow-md shadow-pink-500/20 gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>내 마이링크 만들기/관리하러 가기</span>
                    <ArrowRight className="size-4.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={onSignInWithGoogle}
                  disabled={isSigningIn || authLoading}
                  size="lg"
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-base shadow-md shadow-pink-500/20 gap-3 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
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
                      <span>지금 내 링크 만들기 (3초 무료)</span>
                      <ArrowRight className="size-4.5 ml-0.5" />
                    </>
                  )}
                </Button>
              )}
              <p className="text-[11px] text-slate-400 text-center mt-2">
                신용카드 불필요 • Google 계정으로 1초 로그인
              </p>
            </div>
          </div>

          {/* 우측 스마트폰 디바이스 목업 */}
          <div className="lg:col-span-6 flex justify-center items-center">
            {/* 스마트폰 외형 케이스 */}
            <div className="relative w-[310px] sm:w-[340px] rounded-[44px] p-3 bg-slate-900 shadow-2xl ring-1 ring-slate-800 transition-transform duration-300 hover:scale-[1.01]">
              {/* 상단 다이나믹 아일랜드 펀치홀 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                <span className="size-2 rounded-full bg-[#1c2e4a] opacity-80" />
              </div>

              {/* 스마트폰 화면 컨테이너 */}
              <div className="relative w-full rounded-[36px] bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 overflow-hidden pt-8 pb-7 px-4 flex flex-col items-center select-none">
                {/* 상단 스마트폰 상태바 가상 표시 */}
                <div className="w-full flex justify-between items-center px-3 text-[10px] text-slate-500 font-semibold mb-3">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-slate-400" />
                    <span className="text-[9px]">5G</span>
                    <span className="w-4 h-2 rounded-xs border border-slate-400 flex items-center p-0.5">
                      <span className="h-full w-2 bg-slate-600 rounded-2xs" />
                    </span>
                  </div>
                </div>

                {/* 프로필 아바타 */}
                <div className="relative mb-2.5">
                  <div className="size-16 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 p-0.5 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                      alt="Creator Avatar"
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 size-4.5 rounded-full bg-white text-pink-500 flex items-center justify-center shadow-xs text-[10px]">
                    ✨
                  </span>
                </div>

                {/* 프로필 이름 및 닉네임 */}
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                  <span>초이 (Choi)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-600 font-semibold">
                    PRO
                  </span>
                </h4>
                <p className="text-[11px] font-mono text-slate-400 mb-2">@choidy</p>

                {/* 바이오 소개글 */}
                <p className="text-[11px] text-slate-600 text-center max-w-[240px] leading-relaxed mb-3.5">
                  UI·UX 디자이너 & 크리에이터 ✨<br />
                  세상의 모든 재미있는 프로젝트를 만듭니다.
                </p>

                {/* 소셜 아이콘 바 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-7 rounded-full bg-white/90 border border-pink-100 flex items-center justify-center text-slate-600 shadow-2xs">
                    <InstagramIcon className="size-3.5 text-pink-600" />
                  </span>
                  <span className="size-7 rounded-full bg-white/90 border border-pink-100 flex items-center justify-center text-slate-600 shadow-2xs">
                    <YoutubeIcon className="size-3.5 text-rose-600" />
                  </span>
                  <span className="size-7 rounded-full bg-white/90 border border-pink-100 flex items-center justify-center text-slate-600 shadow-2xs">
                    <GithubIcon className="size-3.5 text-slate-700" />
                  </span>
                  <span className="size-7 rounded-full bg-white/90 border border-pink-100 flex items-center justify-center text-slate-600 shadow-2xs">
                    <Mail className="size-3.5 text-amber-600" />
                  </span>
                </div>

                {/* 링크 카드 리스트 (인터랙티브 탭 가능) */}
                <div className="w-full flex flex-col gap-2.5">
                  {mockLinks.map((link) => {
                    const isClicked = clickedLinkId === link.id;
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => handleCardClick(link.id)}
                        className={`w-full text-left p-3 rounded-2xl bg-white/90 backdrop-blur-xs border transition-all duration-200 shadow-2xs flex items-center justify-between group active:scale-95 cursor-pointer ${
                          isClicked
                            ? "border-pink-500 ring-2 ring-pink-300 scale-[0.98]"
                            : "border-pink-100/90 hover:border-pink-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="size-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                            <Sparkles className="size-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-800 truncate group-hover:text-pink-600 transition-colors">
                              {link.title}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {link.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* 클릭 수 뱃지 */}
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {link.isHot && (
                            <span className="text-[9px] text-rose-500 font-bold flex items-center">
                              <Flame className="size-2.5" />
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
                              isClicked
                                ? "bg-pink-500 text-white animate-bounce"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {link.clicks.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 모바일 화면 하단 푸터 표식 */}
                <div className="mt-4 text-[9px] text-slate-400 font-medium flex items-center gap-1">
                  <span>Powered by</span>
                  <strong className="text-pink-600 font-bold">MyLink</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
