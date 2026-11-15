"use client";

import * as React from "react";
import {
  Link2,
  BarChart3,
  Globe,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Copy,
  MousePointer2,
} from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      id: "link-management",
      title: "간편한 링크 관리",
      tagline: "클릭 한 번으로 손쉽게 추가하고 정리",
      description:
        "인스타그램, 유튜브, 블로그, 포트폴리오까지 흩어져 있는 모든 채널을 한곳에 모으세요. 직관적인 UI로 언제 어디서나 새 링크를 추가하고 실시간으로 수정·삭제할 수 있습니다.",
      icon: Link2,
      accentColor: "from-pink-500 to-rose-400",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200/80",
      iconBg: "bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-pink-500/20",
      previewComponent: (
        <div className="w-full mt-4 p-3 rounded-2xl bg-white/90 border border-pink-100 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-pink-50/60 border border-pink-100/70 text-xs text-slate-700 font-medium">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-pink-500" />
              <span>포트폴리오 바로가기</span>
            </span>
            <ExternalLink className="size-3 text-slate-400" />
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-400" />
              <span>유튜브 최신 영상</span>
            </span>
            <ExternalLink className="size-3 text-slate-400" />
          </div>
        </div>
      ),
      tags: ["원클릭 추가/삭제", "자동 아이콘 매핑", "실시간 클라우드 반영"],
    },
    {
      id: "analytics",
      title: "실시간 클릭 통계",
      tagline: "어떤 링크가 인기 있는지 한눈에 파악",
      description:
        "방문자들이 어떤 링크에 가장 많은 반응을 보이는지 실시간 클릭 수로 분석하세요. 인기 콘텐츠의 성과를 트래킹하고 SNS 유입 전략을 한 단계 업그레이드할 수 있습니다.",
      icon: BarChart3,
      accentColor: "from-purple-500 to-indigo-500",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      iconBg: "bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-purple-500/20",
      previewComponent: (
        <div className="w-full mt-4 p-3 rounded-2xl bg-white/90 border border-purple-100 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">인기 링크 순위</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600">
              <TrendingUp className="size-3" />
              <span>실시간 집계</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-purple-50/70 text-slate-700">
            <span className="truncate max-w-[140px] font-medium">포트폴리오</span>
            <span className="font-bold text-purple-700">1,842 clicks</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 text-slate-600">
            <span className="truncate max-w-[140px] font-medium">유튜브 채널</span>
            <span className="font-bold text-slate-700">3,120 clicks</span>
          </div>
        </div>
      ),
      tags: ["실시간 클릭 카운터", "인기 링크 트래킹", "유입 효과 측정"],
    },
    {
      id: "custom-url",
      title: "나만의 개인 URL",
      tagline: "기억하기 쉬운 고유 주소로 브랜드 완성",
      description:
        "mylink.io/@내이름 처럼 기억하기 쉬운 나만의 고유한 주소를 만들어 SNS 프로필(바이오)에 완벽하게 공유하세요. 모바일 브라우저에 최적화된 맞춤형 페이지를 제공합니다.",
      icon: Globe,
      accentColor: "from-amber-500 to-orange-400",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/20",
      previewComponent: (
        <div className="w-full mt-4 p-3 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs flex flex-col gap-2">
          <div className="text-[11px] font-medium text-slate-500">나만의 고유 링크 예시</div>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-semibold text-amber-900">
            <span className="truncate font-mono">mylink.app/@choidy</span>
            <span className="flex items-center gap-1 text-[10px] bg-white text-amber-700 px-2 py-0.5 rounded-md shadow-2xs">
              <Copy className="size-2.5" />
              <span>복사</span>
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500" />
            <span>인스타그램, 틱톡 프로필 링크에 바로 연결 가능</span>
          </div>
        </div>
      ),
      tags: ["고유 닉네임 라우팅", "원클릭 URL 복사", "모바일 웹 최적화"],
    },
  ];

  return (
    <section id="features" className="w-full py-16 sm:py-24 px-4 bg-white/50 backdrop-blur-xs border-y border-pink-100/60">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* 섹션 서브타이틀 및 헤딩 */}
        <div className="text-center max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 text-pink-700 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5 text-pink-600" />
            <span>핵심 기능 3가지</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            마이링크가 제공하는 강력하고 심플한 도구
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            링크 관리부터 방문자 통계 분석, 그리고 나만의 고유 브랜드 URL까지.
            누구나 복잡한 과정 없이 바로 사용할 수 있습니다.
          </p>
        </div>

        {/* 3개 기능 카드 그리드 (모바일 1열, 데스크톱 3열 반응형) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white to-pink-50/20 border border-pink-100/80 shadow-xs hover:shadow-md hover:border-pink-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* 상단 아이콘 */}
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center shadow-md mb-5 ${feature.iconBg} group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="size-6" />
                  </div>

                  {/* 카드 제목 & 태그라인 */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-medium text-pink-600 mb-3">
                    {feature.tagline}
                  </p>

                  {/* 설명 본문 */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* 카드 내부 미니 비주얼 프리뷰 */}
                  {feature.previewComponent}
                </div>

                {/* 하단 태그 목록 */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md"
                    >
                      <CheckCircle2 className="size-2.5 text-pink-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
