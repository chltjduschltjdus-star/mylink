"use client";

import { useEffect, useState, useRef } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { ProfileHeader } from "@/components/profile-header";
import { SocialBar } from "@/components/social-bar";
import { LinkCard } from "@/components/link-card";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import { AddLinkDialog, type NewLinkData } from "@/components/add-link-dialog";
import { DeleteLinkDialog } from "@/components/delete-link-dialog";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import {
  MOCK_SOCIALS,
  type User,
  type Block,
} from "@/lib/mockData";
import {
  signInWithGoogle,
  logOut,
  subscribeAuthState,
  searchUserByDisplayName,
  updateUserProfileInFirestore,
  type UserProfile,
} from "@/lib/auth";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeFirestoreLinks,
  incrementFirestoreLinkClick,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  sortLinksByCreatedAtDesc,
  type UpdateLinkInput,
} from "@/lib/links";
import NotFound from "@/app/not-found";

interface DisplayNameClientPageProps {
  initialDisplayName: string;
}

export function DisplayNameClientPage({ initialDisplayName }: DisplayNameClientPageProps) {
  const decodedDisplayName = decodeURIComponent(initialDisplayName).trim();

  // 검색 및 데이터 로딩 상태
  const [isSearching, setIsSearching] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  // 인증 및 유저 상태
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // 화면에 렌더링할 프로필 및 블록 데이터
  const [user, setUser] = useState<User | null>(null);
  const [socials, setSocials] = useState<Block[]>(MOCK_SOCIALS);
  const [blocks, setBlocks] = useState<Block[]>([]);

  // UI 상태
  const [isCopied, setIsCopied] = useState(false);
  const [isLinksLoading, setIsLinksLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [deletingBlock, setDeletingBlock] = useState<Block | null>(null);

  // 1. displayName으로 유저 검색 (where 쿼리)
  useEffect(() => {
    let isMounted = true;
    setIsSearching(true);
    setUserNotFound(false);

    searchUserByDisplayName(decodedDisplayName)
      .then((profile) => {
        if (!isMounted) return;
        if (!profile) {
          setUserNotFound(true);
          setUserProfile(null);
          setIsSearching(false);
          setIsLinksLoading(false);
          return;
        }

        setUserProfile(profile);
        setUser({
          id: profile.uid,
          username: profile.username || "user",
          displayName: profile.displayName || profile.username || decodedDisplayName,
          bio: profile.bio || "안녕하세요! 나만의 링크 공간입니다.",
          avatarUrl: profile.photoURL || "",
          themeId: "pastel-pink",
          createdAt: new Date().toISOString(),
        });
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("displayName 유저 검색 에러:", err);
        if (!isMounted) return;
        setUserNotFound(true);
        setIsSearching(false);
        setIsLinksLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [decodedDisplayName]);

  // 2. 인증 상태 구독
  const prevUserRef = useRef<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState((fbUser) => {
      // 본인이 로그인된 상태에서 로그아웃된 경우, 프로필을 보기 전용으로 남기지 않고 즉시 홈(Google 로그인 화면)으로 이동
      if (prevUserRef.current && !fbUser) {
        if (typeof window !== "undefined") {
          window.location.href = "/mylink/";
          return;
        }
      }
      prevUserRef.current = fbUser;
      setCurrentUser(fbUser);
      setAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 3. 해당 유저의 링크 목록 실시간 동기화 (경로: user/{userId}/links)
  useEffect(() => {
    if (!userProfile?.uid) return;

    let isMounted = true;
    setIsLinksLoading(true);

    const unsubscribeLinks = subscribeFirestoreLinks(
      userProfile.uid,
      (firestoreLinks) => {
        if (!isMounted) return;
        setBlocks(firestoreLinks);
        setIsLinksLoading(false);
      },
      (err) => {
        console.warn("Firestore 실시간 동기화 에러:", err);
        if (!isMounted) return;
        setIsLinksLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribeLinks();
    };
  }, [userProfile?.uid]);

  // 4. 권한 계산: 로그인한 유저가 현재 프로필의 소유자인지 확인
  const isOwner = Boolean(
    currentUser && userProfile && currentUser.uid === userProfile.uid
  );

  // 5. 유저를 찾지 못했을 때 404 페이지 노출
  if (!isSearching && userNotFound) {
    return <NotFound />;
  }

  // 6. 검색 중일 때 로딩 화면
  if (isSearching || !user) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col items-center justify-center py-20 px-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-pink-500 animate-spin" />
          <p className="text-xs font-medium text-slate-500">
            @{decodedDisplayName} 님의 프로필을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 7. 구글 로그인 핸들러
  const handleSignInWithGoogle = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request"
      ) {
        alert("Google 로그인 중 문제가 발생했습니다: " + (err?.message || "다시 시도해주세요."));
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // 8. 로그아웃 핸들러: 로그아웃 시 홈(/)으로 이동하여 Google 로그인 화면 표시
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/mylink/";
      }
    }
  };

  // 9. 프로필 정보 수정 핸들러 (본인만 가능)
  const handleUpdateProfile = async (data: { username: string; displayName: string; bio: string }) => {
    if (!isOwner || !currentUser?.uid) {
      alert("프로필 수정 권한이 없습니다. 본인 계정으로 로그인해주세요.");
      return;
    }

    await updateUserProfileInFirestore(currentUser.uid, data);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            username: data.username,
            displayName: data.displayName,
            bio: data.bio,
          }
        : null
    );

    setUserProfile((prev) =>
      prev
        ? {
            ...prev,
            username: data.username,
            displayName: data.displayName,
            bio: data.bio,
          }
        : null
    );

    // 만약 displayName이 변경되었다면 새 URL로 이동
    if (data.displayName !== decodedDisplayName) {
      window.history.replaceState(null, "", `/${encodeURIComponent(data.displayName)}`);
    }
  };

  // 10. 새 링크 추가 핸들러 (user/{userId}/links 경로)
  const handleAddLink = async (data: NewLinkData) => {
    if (!isOwner || !currentUser?.uid) {
      alert("링크 추가 권한이 없습니다. 본인 계정으로 로그인해주세요.");
      return;
    }

    const savedBlock = await addLinkToFirestore(currentUser.uid, {
      title: data.title,
      url: data.url,
      icon: data.icon || "globe",
      order: 0,
    });

    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== savedBlock.id);
      return sortLinksByCreatedAtDesc([savedBlock, ...filtered]);
    });
  };

  // 11. 링크 수정 핸들러
  const handleUpdateLink = async (linkId: string, data: UpdateLinkInput) => {
    if (!isOwner || !currentUser?.uid) {
      alert("링크 수정 권한이 없습니다. 본인 계정으로 로그인해주세요.");
      return;
    }

    await updateLinkInFirestore(currentUser.uid, linkId, data);

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === linkId
          ? {
              ...b,
              title: data.title,
              url: data.url,
              ...(data.icon ? { icon: data.icon } : {}),
            }
          : b
      )
    );
  };

  // 12. 링크 삭제 핸들러
  const handleDeleteLink = async (linkId: string) => {
    if (!isOwner || !currentUser?.uid) {
      alert("링크 삭제 권한이 없습니다. 본인 계정으로 로그인해주세요.");
      return;
    }

    await deleteLinkFromFirestore(currentUser.uid, linkId);
    setBlocks((prev) => prev.filter((b) => b.id !== linkId));
  };

  // 13. 링크 클릭 핸들러 (방문자 누구나 클릭 가능, 클릭 수 +1 및 새 창 열기)
  const handleLinkClick = (block: Block) => {
    if (!block.url) return;

    const newCount = (block.clickCount || 0) + 1;
    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, clickCount: newCount } : b))
    );

    if (userProfile?.uid && block.id) {
      incrementFirestoreLinkClick(userProfile.uid, block.id, block.clickCount || 0);
    }

    window.open(block.url, "_blank", "noopener,noreferrer");
  };

  // 14. 소셜 링크 클릭 핸들러
  const handleSocialClick = (social: Block) => {
    if (!social.url) return;

    setSocials((prev) =>
      prev.map((s) =>
        s.id === social.id ? { ...s, clickCount: (s.clickCount || 0) + 1 } : s
      )
    );

    window.open(social.url, "_blank", "noopener,noreferrer");
  };

  // 15. 현재 개인 페이지 URL 클립보드 복사
  const handleShareProfile = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  // 16. 수동 새로고침
  const handleResetData = async () => {
    if (!userProfile?.uid) return;
    try {
      setIsLinksLoading(true);
      const links = await getLinksFromFirestore(userProfile.uid);
      setBlocks(links);
    } catch (e) {
      console.error("데이터 새로고침 실패:", e);
    } finally {
      setIsLinksLoading(false);
    }
  };

  // 활성화된 링크 필터링 및 정렬
  const sortedBlocks = sortLinksByCreatedAtDesc(
    blocks.filter((b) => b.isActive !== false)
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col items-center py-8 sm:py-14 px-4 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* 1. 상단 헤더: Google Auth, 공유, 내 개인 페이지 바로가기 포함 */}
      <PageHeader
        currentUser={currentUser}
        authLoading={authLoading || isSigningIn}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        isCopied={isCopied}
        onShare={handleShareProfile}
        onReset={handleResetData}
        onEditProfile={isOwner ? () => setIsEditProfileOpen(true) : undefined}
        userDisplayName={isOwner ? user.displayName : undefined}
      />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="w-full max-w-[480px] flex flex-col items-center">
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          {/* 권한 상태 알림 뱃지 배너 */}
          {isOwner ? (
            /* 본인 관리자 모드 배너 */
            <div className="w-full mb-4 px-3.5 py-2 rounded-xl bg-pink-50/80 border border-pink-200/70 text-xs text-pink-700 flex items-center justify-between shadow-2xs backdrop-blur-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-3.5 text-pink-600 shrink-0" />
                <span>내 링크 관리 모드 (수정/삭제/추가 가능)</span>
              </span>
              <span className="text-[10px] bg-pink-100/90 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                본인 인증됨
              </span>
            </div>
          ) : (
            /* 타인 공개 링크 조회 모드 배너 */
            <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-800 flex items-center justify-between shadow-2xs backdrop-blur-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="size-3.5 text-amber-600 shrink-0" />
                <span>공개 링크 조회 중 (읽기 전용)</span>
              </span>
              {currentUser ? (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    const myName = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : currentUser.uid);
                    window.location.href = `/mylink/${encodeURIComponent(myName)}`;
                  }}
                  className="h-6 text-[11px] border-amber-300 bg-white hover:bg-amber-100 text-amber-800 cursor-pointer"
                >
                  내 페이지로 이동
                </Button>
              ) : (
                <Button
                  size="xs"
                  onClick={handleSignInWithGoogle}
                  disabled={isSigningIn}
                  className="h-6 text-[11px] bg-amber-600 hover:bg-amber-700 text-white cursor-pointer disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    "내 링크 만들기"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* 프로필 헤더: 경로 user/{userId}/links 표시 및 본인일 때 수정 버튼 노출 */}
          <ProfileHeader
            user={user}
            firestorePath={`user/${userProfile?.uid || user.id}/links`}
            canEdit={isOwner}
            onEditProfileClick={isOwner ? () => setIsEditProfileOpen(true) : undefined}
          />

          {/* 원형 소셜 아이콘 바 */}
          <SocialBar
            socials={socials}
            onSocialClick={handleSocialClick}
            className="mt-5"
          />

          {/* 링크 카드 목록 컨테이너 */}
          <div className="w-full flex flex-col gap-3.5 mt-6">
            {isLinksLoading ? (
              <div className="w-full py-12 flex flex-col items-center justify-center gap-2">
                <div className="size-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-400">링크 목록을 불러오는 중...</p>
              </div>
            ) : sortedBlocks.length === 0 ? (
              /* 등록된 링크가 없을 때의 안내 카드 */
              <div className="w-full text-center py-10 px-4 rounded-2xl border-2 border-dashed border-pink-200/70 bg-white/50 backdrop-blur-xs flex flex-col items-center gap-2">
                <div className="size-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                  <Sparkles className="size-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  아직 등록된 링크가 없습니다
                </p>
                <p className="text-xs text-slate-400">
                  {isOwner
                    ? "아래 버튼을 눌러 나만의 첫 번째 링크를 추가해보세요!"
                    : "이 사용자가 아직 링크를 추가하지 않았습니다."}
                </p>
              </div>
            ) : (
              /* 링크 카드 렌더링 */
              sortedBlocks.map((block) => {
                if (block.type === "header") {
                  return (
                    <SectionHeader
                      key={block.id}
                      title={block.title}
                    />
                  );
                }

                return (
                  <LinkCard
                    key={block.id}
                    block={block}
                    onClick={handleLinkClick}
                    onUpdate={isOwner ? handleUpdateLink : undefined}
                    onDeleteRequest={isOwner ? (targetBlock) => setDeletingBlock(targetBlock) : undefined}
                    canEdit={isOwner}
                  />
                );
              })
            )}

            {/* 하단 버튼 분기 */}
            {isOwner ? (
              <button
                type="button"
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 border-dashed border-pink-200/90 bg-white/40 hover:bg-white/80 hover:border-pink-300 text-pink-600 hover:text-pink-700 font-medium text-sm transition-all duration-200 group active:scale-[0.99] cursor-pointer shadow-2xs"
              >
                <div className="size-6 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Plus className="size-3.5 text-pink-600" />
                </div>
                <span>새 링크 추가하기</span>
              </button>
            ) : !currentUser ? (
              <button
                type="button"
                onClick={handleSignInWithGoogle}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium text-sm transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>나만의 마이링크 만들기 (무료 시작)</span>
                <ArrowRight className="size-4 ml-1" />
              </button>
            ) : null}
          </div>
        </div>

        {/* 3. 브랜딩 푸터 */}
        <PageFooter />
      </main>

      {/* 4. 링크 추가 모달 */}
      {isOwner && (
        <AddLinkDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddLink={handleAddLink}
        />
      )}

      {/* 5. 링크 삭제 확인 모달 */}
      {isOwner && (
        <DeleteLinkDialog
          open={Boolean(deletingBlock)}
          onOpenChange={(open) => {
            if (!open) setDeletingBlock(null);
          }}
          link={deletingBlock}
          onDelete={handleDeleteLink}
        />
      )}

      {/* 6. 프로필 정보 수정 모달 */}
      {isOwner && currentUser && (
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          initialData={{
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
          }}
          currentUserId={currentUser.uid}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}
