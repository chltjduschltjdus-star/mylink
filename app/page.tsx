"use client";

import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { SocialBar } from "@/components/social-bar";
import { LinkCard } from "@/components/link-card";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import { AddLinkDialog, type NewLinkData } from "@/components/add-link-dialog";
import { Plus, Sparkles } from "lucide-react";
import {
  MOCK_USER,
  MOCK_SOCIALS,
  type User,
  type Block,
} from "@/lib/mockData";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeFirestoreLinks,
  incrementFirestoreLinkClick,
  sortLinksByCreatedAtDesc,
} from "@/lib/links";

export default function HomePage() {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [socials, setSocials] = useState<Block[]>(MOCK_SOCIALS);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 1. 페이지 로드시 Firestore `users/anonymous/links` 실시간 구독 (createdAt 최신순)
  useEffect(() => {
    let isMounted = true;

    // Firestore `users/anonymous/links` 실시간 리스너 구독 (createdAt 최신순 정렬)
    const unsubscribe = subscribeFirestoreLinks(
      (firestoreLinks) => {
        if (!isMounted) return;
        setBlocks(firestoreLinks);
        setIsLoaded(true);
      },
      (err) => {
        console.warn("Firestore 실시간 구독 에러:", err);
        if (!isMounted) return;
        setIsLoaded(true);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. 새 링크 추가 핸들러: Firestore `users/anonymous/links`에 저장 및 목록 즉각 갱신
  const handleAddLink = async (data: NewLinkData) => {
    // Firestore `users/anonymous/links` 컬렉션에 새 문서 생성 (createdAt: serverTimestamp())
    const savedBlock = await addLinkToFirestore({
      title: data.title,
      url: data.url,
      icon: data.icon || "globe",
      order: 0,
    });

    // 화면 즉각 갱신 (실시간 리스너 보조 낙관적 업데이트 - 최신순 정렬 유지)
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== savedBlock.id);
      return sortLinksByCreatedAtDesc([savedBlock, ...filtered]);
    });
  };

  // 3. 링크 클릭 핸들러 (실시간 누적 클릭 카운트 & 새 창 URL 이동)
  const handleLinkClick = (block: Block) => {
    if (!block.url) return;

    const newCount = (block.clickCount || 0) + 1;
    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, clickCount: newCount } : b))
    );

    // Firestore 커스텀 링크인 경우 Firestore에도 클릭 수 업데이트 시도
    if (block.id) {
      incrementFirestoreLinkClick(block.id, block.clickCount || 0);
    }

    window.open(block.url, "_blank", "noopener,noreferrer");
  };

  // 4. 소셜 링크 클릭 핸들러
  const handleSocialClick = (social: Block) => {
    if (!social.url) return;

    setSocials((prev) =>
      prev.map((s) =>
        s.id === social.id ? { ...s, clickCount: (s.clickCount || 0) + 1 } : s
      )
    );

    window.open(social.url, "_blank", "noopener,noreferrer");
  };

  // 5. 프로필 공유 URL 클립보드 복사
  const handleShareProfile = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 에러:", err);
    }
  };

  // 6. 초기화 / 최신 데이터 새로고침
  const handleResetData = async () => {
    setUser(MOCK_USER);
    setSocials(MOCK_SOCIALS);
    try {
      const firestoreLinks = await getLinksFromFirestore();
      setBlocks(firestoreLinks);
    } catch (e) {
      console.error("데이터 새로고침 에러:", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf8f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Firestore에서 링크를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 활성화된 블록 필터링 및 createdAt 최신순 정렬
  const sortedBlocks = sortLinksByCreatedAtDesc(
    blocks.filter((b) => b.isActive !== false)
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col items-center py-8 sm:py-14 px-4 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* 1. 상단 컨트롤 바 */}
      <PageHeader
        isCopied={isCopied}
        onShare={handleShareProfile}
        onReset={handleResetData}
        onOpenAddLink={() => setIsAddDialogOpen(true)}
      />

      {/* 2. 메인 프로필 및 링크 콘텐츠 컨테이너 */}
      <main className="w-full max-w-[480px] flex flex-col items-center">
        {/* 프로필 헤더 */}
        <ProfileHeader user={user} />

        {/* 원형 소셜 아이콘 바 */}
        <SocialBar
          socials={socials}
          onSocialClick={handleSocialClick}
          className="mt-5"
        />

        {/* 3. 섹션 헤더 및 링크 카드 목록 (createdAt 최신순 정렬) */}
        <div className="w-full flex flex-col gap-3.5 mt-6">
          {sortedBlocks.length === 0 ? (
            <div className="w-full text-center py-10 px-4 rounded-2xl border-2 border-dashed border-pink-200/70 bg-white/50 backdrop-blur-xs flex flex-col items-center gap-2">
              <div className="size-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                등록된 링크가 없습니다
              </p>
              <p className="text-xs text-slate-400">
                아래 버튼을 눌러 첫 번째 링크를 추가해보세요!
              </p>
            </div>
          ) : (
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
                />
              );
            })
          )}

          {/* 목록 하단 빠른 링크 추가 카드 */}
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
        </div>

        {/* 4. 브랜딩 푸터 */}
        <PageFooter />
      </main>

      {/* 5. 링크 추가 다이얼로그 모달 */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLink={handleAddLink}
      />
    </div>
  );
}
