"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import {
  signInWithGoogle,
  subscribeAuthState,
  getUserProfileFromFirestore,
} from "@/lib/auth";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingPreview } from "@/components/landing/landing-preview";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function RootLandingPage() {
  const router = useRouter();

  // 인증 상태 관리
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // 로그인한 유저의 개인별 페이지 라우팅용 displayName (또는 username)
  const [personalPageSlug, setPersonalPageSlug] = useState<string>("user");

  // 1. 레거시 쿼리(?u=UID) 감지 시 해당 사용자의 displayName 페이지로 자동 리다이렉트
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlUid = searchParams.get("u") || searchParams.get("uid");
      if (urlUid) {
        getUserProfileFromFirestore(urlUid).then((profile) => {
          if (profile?.displayName) {
            router.replace(`/${encodeURIComponent(profile.displayName)}`);
          } else if (profile?.username) {
            router.replace(`/${encodeURIComponent(profile.username)}`);
          }
        });
      }
    }
  }, [router]);

  // 2. Firebase Auth 인증 상태 감지 리스너 구독
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState(async (fbUser) => {
      setCurrentUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        try {
          const profile = await getUserProfileFromFirestore(fbUser.uid);
          if (profile?.displayName) {
            setPersonalPageSlug(profile.displayName);
          } else if (profile?.username) {
            setPersonalPageSlug(profile.username);
          } else if (fbUser.displayName) {
            setPersonalPageSlug(fbUser.displayName);
          } else if (fbUser.email) {
            setPersonalPageSlug(fbUser.email.split("@")[0]);
          }
        } catch (e) {
          console.warn("프로필 조회 에러:", e);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 3. 구글 소셜 로그인 실행 및 로그인 성공 시 개인 페이지로 라우팅
  const handleSignInWithGoogle = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    try {
      const loggedUser = await signInWithGoogle();
      const profile = await getUserProfileFromFirestore(loggedUser.uid);
      const targetSlug =
        profile?.displayName ||
        profile?.username ||
        loggedUser.displayName ||
        (loggedUser.email ? loggedUser.email.split("@")[0] : "user");

      router.push(`/${encodeURIComponent(targetSlug)}`);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request"
      ) {
        alert("구글 로그인 중 문제가 발생했습니다: " + (err?.message || "다시 시도해주세요."));
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* 1. 상단 내비게이션 바 */}
      <LandingNavbar
        currentUser={currentUser}
        authLoading={authLoading}
        isSigningIn={isSigningIn}
        onSignInWithGoogle={handleSignInWithGoogle}
        personalPageSlug={personalPageSlug}
      />

      {/* 2. 메인 랜딩 컨텐츠 영역 */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* 1) 히어로 섹션: 서비스 이름, 태그라인, CTA 버튼 */}
        <LandingHeroSection
          currentUser={currentUser}
          authLoading={authLoading}
          isSigningIn={isSigningIn}
          onSignInWithGoogle={handleSignInWithGoogle}
          personalPageSlug={personalPageSlug}
        />

        {/* 2) 기능 소개: 3개 기능 카드(링크 관리, 클릭통계, 개인 URL) */}
        <LandingFeatures />

        {/* 3) 미리보기: 예시 화면 목업, CTA 버튼 */}
        <LandingPreview
          currentUser={currentUser}
          authLoading={authLoading}
          isSigningIn={isSigningIn}
          onSignInWithGoogle={handleSignInWithGoogle}
          personalPageSlug={personalPageSlug}
        />
      </main>

      {/* 3. 푸터: 한양대학교 바이브 코딩, GitHub 링크 */}
      <LandingFooter />
    </div>
  );
}
