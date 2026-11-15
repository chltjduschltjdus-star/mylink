"use client";

import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { SocialBar } from "@/components/social-bar";
import { LinkCard } from "@/components/link-card";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import { AddLinkDialog, type NewLinkData } from "@/components/add-link-dialog";
import { Plus } from "lucide-react";
import {
  MOCK_USER,
  MOCK_SOCIALS,
  MOCK_BLOCKS,
  type User,
  type Block,
} from "@/lib/mockData";

const STORAGE_KEY = "mylink_demo_state";

export default function HomePage() {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [socials, setSocials] = useState<Block[]>(MOCK_SOCIALS);
  const [blocks, setBlocks] = useState<Block[]>(MOCK_BLOCKS);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 1. 더미 데이터 로드 (LocalStorage 조회 또는 기본 Mock 주입)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.user) setUser(parsed.user);
        if (Array.isArray(parsed.socials)) setSocials(parsed.socials);
        if (Array.isArray(parsed.blocks)) setBlocks(parsed.blocks);
      } else {
        const initialData = {
          user: MOCK_USER,
          socials: MOCK_SOCIALS,
          blocks: MOCK_BLOCKS,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (e) {
      console.warn("LocalStorage 접근 실패, 기본 Mock 데이터 유지:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 새 링크 추가 핸들러 (로컬 상태 반영 및 LocalStorage 동기화)
  const handleAddLink = (data: NewLinkData) => {
    const maxOrder = blocks.length > 0 ? Math.max(...blocks.map((b) => b.order)) : 0;
    const newBlock: Block = {
      id: `block_link_${Date.now()}`,
      userId: user.id || "user_seoyeon_01",
      type: "link",
      title: data.title,
      url: data.url,
      icon: data.icon || "globe",
      isActive: true,
      order: maxOrder + 1,
      clickCount: 0,
    };

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          socials,
          blocks: updatedBlocks,
        })
      );
    } catch (e) {
      console.error("새 링크 저장 실패:", e);
    }
  };

  // 링크 클릭 핸들러 (실시간 누적 클릭 카운트 & 새 창 URL 이동)
  const handleLinkClick = (block: Block) => {
    if (!block.url) return;

    const updatedBlocks = blocks.map((b) =>
      b.id === block.id ? { ...b, clickCount: (b.clickCount || 0) + 1 } : b
    );
    setBlocks(updatedBlocks);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          socials,
          blocks: updatedBlocks,
        })
      );
    } catch (e) {
      console.error("클릭 수 저장 실패:", e);
    }

    window.open(block.url, "_blank", "noopener,noreferrer");
  };

  // 소셜 링크 클릭 핸들러
  const handleSocialClick = (social: Block) => {
    if (!social.url) return;

    const updatedSocials = socials.map((s) =>
      s.id === social.id ? { ...s, clickCount: (s.clickCount || 0) + 1 } : s
    );
    setSocials(updatedSocials);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          socials: updatedSocials,
          blocks,
        })
      );
    } catch (e) {
      console.error("소셜 클릭 수 저장 실패:", e);
    }

    window.open(social.url, "_blank", "noopener,noreferrer");
  };

  // 프로필 공유 URL 클립보드 복사
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

  // 초기 데모 데이터로 복원
  const handleResetData = () => {
    setUser(MOCK_USER);
    setSocials(MOCK_SOCIALS);
    setBlocks(MOCK_BLOCKS);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: MOCK_USER,
          socials: MOCK_SOCIALS,
          blocks: MOCK_BLOCKS,
        })
      );
    } catch (e) {
      console.error("데이터 초기화 에러:", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf8f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            링크 목록을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 활성화된 블록 필터링 및 오름차순 정렬
  const sortedBlocks = [...blocks]
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fef5f0] via-[#fdf8f5] to-[#f7f2fa] text-slate-800 flex flex-col items-center py-8 sm:py-14 px-4 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* 1. 상단 컨트롤 바 (MyLink 뱃지, 링크 추가, 데이터 초기화, 프로필 공유) */}
      <PageHeader
        isCopied={isCopied}
        onShare={handleShareProfile}
        onReset={handleResetData}
        onOpenAddLink={() => setIsAddDialogOpen(true)}
      />

      {/* 2. 메인 프로필 및 링크 콘텐츠 컨테이너 */}
      <main className="w-full max-w-[480px] flex flex-col items-center">
        {/* 프로필 헤더 (아바타, 이름, 핸들, 바이오) */}
        <ProfileHeader user={user} />

        {/* 원형 소셜 아이콘 바 */}
        <SocialBar
          socials={socials}
          onSocialClick={handleSocialClick}
          className="mt-5"
        />

        {/* 3. 섹션 헤더 및 링크 카드 목록 */}
        <div className="w-full flex flex-col gap-3.5 mt-6">
          {sortedBlocks.map((block) => {
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
          })}

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
