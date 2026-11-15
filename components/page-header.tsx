"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  RotateCcw,
  Share2,
  Check,
  LogOut,
  Loader2,
  ChevronDown,
  User as UserIcon,
  UserCog,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User as FirebaseUser } from "firebase/auth";
import { getUserProfileFromFirestore } from "@/lib/auth";

// 깔끔한 Google G 컬러 SVG 아이콘
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

interface PageHeaderProps {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  isCopied: boolean;
  onShare: () => void;
  onReset: () => void;
  onEditProfile?: () => void;
  userDisplayName?: string | null;
  className?: string;
}

export function PageHeader({
  currentUser,
  authLoading,
  onSignInWithGoogle,
  onSignOut,
  isCopied,
  onShare,
  onReset,
  onEditProfile,
  userDisplayName,
  className = "",
}: PageHeaderProps) {
  // 프로필 드롭다운 메뉴 열림 상태
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 현재 로그인한 유저의 개인별 페이지 라우팅용 displayName (또는 username)
  const [personalPageSlug, setPersonalPageSlug] = React.useState<string>(() => {
    if (userDisplayName) return userDisplayName;
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split("@")[0];
    return "user";
  });

  // currentUser 또는 prop 변경 시 개인별 페이지 슬러그 동기화
  React.useEffect(() => {
    if (!currentUser) return;

    if (userDisplayName) {
      setPersonalPageSlug(userDisplayName);
      return;
    }

    let isMounted = true;
    getUserProfileFromFirestore(currentUser.uid)
      .then((profile) => {
        if (!isMounted) return;
        if (profile?.displayName) {
          setPersonalPageSlug(profile.displayName);
        } else if (profile?.username) {
          setPersonalPageSlug(profile.username);
        } else if (currentUser.displayName) {
          setPersonalPageSlug(currentUser.displayName);
        } else if (currentUser.email) {
          setPersonalPageSlug(currentUser.email.split("@")[0]);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "user");
        setPersonalPageSlug(fallback);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, userDisplayName]);

  // 외부 클릭 및 ESC 키 입력 시 드롭다운 닫기
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // 디스플레이 네임: personalPageSlug 또는 이메일 앞부분 사용
  const displayUsername = personalPageSlug || (currentUser?.email ? currentUser.email.split("@")[0] : "사용자");

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onSignOut();
  };

  return (
    <header className={`relative w-full max-w-[480px] flex items-center justify-between mb-6 px-1 ${className}`}>
      {/* 좌측 로고 / 브랜드 뱃지 (클릭 시 홈 페이지 이동) */}
      <Link href="/" className="flex items-center gap-2 group cursor-pointer" title="홈으로 이동">
        <Badge
          variant="pastel"
          className="px-2.5 py-1 text-[11px] font-semibold tracking-wide gap-1 shadow-xs group-hover:bg-pink-100 transition-colors"
        >
          <Sparkles className="size-3 text-pink-500 group-hover:scale-110 transition-transform" />
          <span>MyLink</span>
        </Badge>
      </Link>

      {/* 우측 액션 버튼 및 프로필 드롭다운 영역 */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {authLoading ? (
          <div className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/70 border border-slate-200 text-xs text-slate-500">
            <Loader2 className="size-3.5 animate-spin text-pink-500" />
            <span className="text-[11px]">확인 중...</span>
          </div>
        ) : currentUser ? (
          <>
            {/* 1. 헤더: 개인별 페이지 바로가기 버튼 */}
            <Link
              href={`/${encodeURIComponent(personalPageSlug)}`}
              title={`내 개인 페이지 (/${personalPageSlug}) 로 이동`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs font-medium text-pink-700 bg-pink-50/70 hover:bg-pink-100/90 border border-pink-200/60 rounded-full gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Globe className="size-3.5 text-pink-500" />
                <span className="hidden xs:inline">내 페이지</span>
              </Button>
            </Link>

            {/* 새로고침 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              title="최신 데이터 다시 불러오기"
              className="text-xs text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-full h-8 px-2 transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
            </Button>

            {/* 공유 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              title="페이지 주소 복사하기"
              className="text-xs bg-white/90 hover:bg-white border-pink-200/80 text-slate-700 rounded-full h-8 px-2.5 sm:px-3 gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5 text-slate-600" />
                  <span className="hidden xs:inline">공유</span>
                </>
              )}
            </Button>

            {/* 프로필 드롭다운 메뉴 트리거 및 팝오버 컨테이너 */}
            <div className="relative pl-1 border-l border-slate-200/80" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1 p-0.5 rounded-full hover:bg-white/80 transition-all border border-transparent hover:border-pink-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                title={`${displayUsername} 계정 메뉴 열기`}
              >
                {currentUser.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.photoURL}
                    alt={displayUsername}
                    referrerPolicy="no-referrer"
                    className="size-7 rounded-full border border-pink-200 object-cover shadow-2xs"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-pink-100 text-pink-600 font-semibold text-xs flex items-center justify-center border border-pink-200">
                    {displayUsername.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <ChevronDown
                  className={`size-3 text-slate-400 transition-transform duration-200 mr-0.5 ${
                    isDropdownOpen ? "rotate-180 text-pink-500" : ""
                  }`}
                />
              </button>

              {/* 드롭다운 메뉴 레이어 */}
              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-pink-100 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  {/* 프로필 요약 섹션 */}
                  <div className="px-2.5 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                        <UserIcon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {displayUsername}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {currentUser.email || "Google 계정"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="h-px bg-slate-100 my-1" />

                  {/* 2. 프로필 드롭다운: 개인별 페이지 바로가기 메뉴 */}
                  <Link
                    href={`/${encodeURIComponent(personalPageSlug)}`}
                    onClick={() => setIsDropdownOpen(false)}
                    role="menuitem"
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-pink-600 hover:bg-pink-50/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="size-3.5 text-pink-500 transition-transform group-hover:scale-110" />
                      <span>내 개인 페이지</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-pink-600 font-mono bg-pink-50/80 px-1.5 py-0.5 rounded-md border border-pink-100 max-w-[100px] truncate">
                      <span className="truncate">/{personalPageSlug}</span>
                      <ExternalLink className="size-2.5 shrink-0 opacity-60" />
                    </div>
                  </Link>

                  {/* 프로필 수정 버튼 */}
                  {onEditProfile && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onEditProfile();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-pink-600 hover:bg-pink-50/80 rounded-xl transition-colors cursor-pointer group"
                    >
                      <UserCog className="size-3.5 text-pink-500 transition-transform group-hover:scale-110" />
                      <span>프로필 수정</span>
                    </button>
                  )}

                  {/* 로그아웃 버튼 (프로필 드롭다운 내부 포함) */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <LogOut className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 미로그인 상태: 구글 소셜 로그인 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSignInWithGoogle}
              className="text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 rounded-full h-8 px-3.5 gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <GoogleIcon className="size-3.5" />
              <span>Google 로그인</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
