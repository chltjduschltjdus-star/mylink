/**
 * 마이링크 (MyLink) 데모용 Mock 데이터 및 API 응답 스키마
 * PRD.md의 4. 데이터 모델 정의(LocalStorage Data Schema) 준수
 */

export type BlockType = 'link' | 'header' | 'social';

export interface CustomTheme {
  backgroundColor?: string;
  cardStyle?: 'flat' | 'rounded' | 'outline' | 'shadow';
  buttonColor?: string;
  textColor?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: string;
  customTheme?: CustomTheme;
  createdAt: string;
}

export interface Block {
  id: string;
  userId: string;
  type: BlockType;
  title: string;
  url?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  clickCount: number;
}

export interface PageAnalytics {
  userId: string;
  totalViews: number;
  lastVisitedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface FullProfilePayload {
  user: User;
  socials: Block[];
  blocks: Block[];
  analytics: PageAnalytics;
}

// -------------------------------------------------------------
// 초기 더미 데이터 정의
// -------------------------------------------------------------
export const MOCK_USER: User = {
  id: "user_seoyeon_01",
  username: "seoyeon_dev",
  displayName: "최서연 (Seoyeon Choi)",
  bio: "사용자 중심의 가치를 코드로 설계하는 프론트엔드 엔지니어 🌱 | 기술 블로그 & 오픈소스",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  themeId: "pastel-peach",
  customTheme: {
    backgroundColor: "#fdf8f5",
    cardStyle: "rounded",
    buttonColor: "#ffe8df",
    textColor: "#2d3748"
  },
  createdAt: "2026-01-10T09:00:00.000Z"
};

export const MOCK_SOCIALS: Block[] = [
  {
    id: "block_soc_1",
    userId: "user_seoyeon_01",
    type: "social",
    title: "GitHub",
    url: "https://github.com/chltjduschltjdus-star",
    icon: "github",
    isActive: true,
    order: 1,
    clickCount: 328
  },
  {
    id: "block_soc_2",
    userId: "user_seoyeon_01",
    type: "social",
    title: "Instagram",
    url: "https://instagram.com/seoyeon.dev",
    icon: "instagram",
    isActive: true,
    order: 2,
    clickCount: 215
  },
  {
    id: "block_soc_3",
    userId: "user_seoyeon_01",
    type: "social",
    title: "YouTube",
    url: "https://youtube.com/@seoyeon_dev",
    icon: "youtube",
    isActive: true,
    order: 3,
    clickCount: 184
  },
  {
    id: "block_soc_4",
    userId: "user_seoyeon_01",
    type: "social",
    title: "Email",
    url: "mailto:chltjduschltjdus@gmail.com",
    icon: "mail",
    isActive: true,
    order: 4,
    clickCount: 96
  }
];

export const MOCK_BLOCKS: Block[] = [
  {
    id: "block_hdr_1",
    userId: "user_seoyeon_01",
    type: "header",
    title: "🚀 대표 프로젝트 & 포트폴리오",
    isActive: true,
    order: 1,
    clickCount: 0
  },
  {
    id: "block_lnk_1",
    userId: "user_seoyeon_01",
    type: "link",
    title: "MyLink - 감성 링크트리 웹 서비스",
    url: "https://github.com/chltjduschltjdus-star/mylink",
    icon: "globe",
    isActive: true,
    order: 2,
    clickCount: 142
  },
  {
    id: "block_lnk_2",
    userId: "user_seoyeon_01",
    type: "link",
    title: "Notion 스타일 미니멀 UI 컴포넌트 킷",
    url: "https://github.com/chltjduschltjdus-star/notion-design-kit",
    icon: "package",
    isActive: true,
    order: 3,
    clickCount: 89
  },
  {
    id: "block_lnk_3",
    userId: "user_seoyeon_01",
    type: "link",
    title: "인터랙티브 웹 포트폴리오 (Live Demo)",
    url: "https://seoyeon-portfolio.dev",
    icon: "laptop",
    isActive: true,
    order: 4,
    clickCount: 312
  },
  {
    id: "block_hdr_2",
    userId: "user_seoyeon_01",
    type: "header",
    title: "✍️ 아티클 & 소통",
    isActive: true,
    order: 5,
    clickCount: 0
  },
  {
    id: "block_lnk_4",
    userId: "user_seoyeon_01",
    type: "link",
    title: "[기술블로그] Next.js 16 + Tailwind v4 클린 아키텍처 가이드",
    url: "https://velog.io/@seoyeon_dev/nextjs16-tailwind-v4",
    icon: "book-open",
    isActive: true,
    order: 6,
    clickCount: 520
  },
  {
    id: "block_lnk_5",
    userId: "user_seoyeon_01",
    type: "link",
    title: "카카오톡 1:1 오픈채팅 (프로젝트 & 협업 문의)",
    url: "https://open.kakao.com/me/seoyeon_dev",
    icon: "message-circle",
    isActive: true,
    order: 7,
    clickCount: 78
  }
];

export const MOCK_ANALYTICS: PageAnalytics = {
  userId: "user_seoyeon_01",
  totalViews: 1284,
  lastVisitedAt: "2026-11-15T02:45:00.000Z"
};

// -------------------------------------------------------------
// Mock API 응답 시뮬레이션 헬퍼
// -------------------------------------------------------------
export const mockApi = {
  /**
   * 사용자 프로필 및 전체 링크 목록 통합 반환 (GET /api/users/:username)
   */
  async getProfile(username = "seoyeon_dev"): Promise<ApiResponse<FullProfilePayload>> {
    return {
      success: true,
      data: {
        user: MOCK_USER,
        socials: MOCK_SOCIALS,
        blocks: MOCK_BLOCKS,
        analytics: MOCK_ANALYTICS
      },
      message: "프로필 및 링크 목록을 성공적으로 불러왔습니다.",
      timestamp: new Date().toISOString()
    };
  },

  /**
   * 링크/헤더 블록 목록만 반환 (GET /api/blocks)
   */
  async getBlocks(): Promise<ApiResponse<Block[]>> {
    return {
      success: true,
      data: MOCK_BLOCKS,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * 통계 데이터 반환 (GET /api/analytics)
   */
  async getAnalytics(): Promise<ApiResponse<PageAnalytics>> {
    return {
      success: true,
      data: MOCK_ANALYTICS,
      timestamp: new Date().toISOString()
    };
  }
};
