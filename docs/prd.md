# [PRD] 링크트리 클론 서비스: 마이링크 (MyLink) 기능 정의서

---

## 1. 프로젝트 개요 (Overview)

### 1.1 서비스 정의
**마이링크 (MyLink)**는 크리에이터, 프리랜서, 개인이 자신의 다양한 소셜 링크와 주요 콘텐츠를 하나의 모바일 최적화 페이지에 모아 공유할 수 있는 **링크트리(Linktree) 클론 웹 서비스**입니다.

### 1.2 서비스 목적
- SNS(인스타그램, 유튜브, 틱톡 등)의 단일 프로필 링크 제약을 해결하여 방문자를 원하는 페이지로 효과적으로 유도.
- 별도의 복잡한 백엔드 설정 없이, 브라우저 환경에서 즉시 체험·배포 가능한 **경량 클라이언트 완결형(Mock + LocalStorage) SaaS 프로토타입** 제공.

### 1.3 시연(Demo) 진행 전략 및 단계별 개발 원칙
> **[중요] 시연 기반 점진적 개발 (Demo-First Iteration)**  
> 본 프로젝트는 **라이브 시연(Demonstration)** 흐름에 맞추어 기능 단위별로 명확하게 단계를 나누어 진행합니다.  
> - **현재 실행 범위 (Step 1)**: 관리자 대시보드 및 통계 기능 등은 완전히 배제하고, **LocalStorage를 활용해 동작하는 완성도 높은 '단독 프로필 페이지'**를 최우선으로 제작합니다.  
> - **후속 실행 범위 (Step 2 & 3)**: 프로필 페이지 검증 완료 후, 링크 편집 대시보드와 통계 기능을 순차적으로 확장합니다.

### 1.4 핵심 타겟 사용자
- 인스타그램, 유튜브, 블로그 등 여러 채널을 운영하는 크리에이터 및 인플루언서
- 자신의 포트폴리오 및 작업물을 깔끔하게 모아 전달하고 싶은 프리랜서 및 디자이너/개발자
- 빠르고 간편하게 링크 모음 페이지를 제작하고자 하는 일반 사용자

### 1.5 사용자 시나리오 (User Scenarios)

#### 🧑‍🎨 시나리오 A: 방문자 / 팬의 모바일 탐색 여정
- **상황**: 인스타그램 프로필 링크를 클릭하여 크리에이터의 마이링크 페이지에 방문.
- **사용자 행동 흐름**:
  1. 모바일 브라우저에서 로딩 지연 없이 0.5초 만에 산뜻하고 따뜻한 파스텔 톤 프로필 페이지가 열림.
  2. 프로필 사진, 크리에이터 이름, 한 줄 소개글(`bio`)을 읽으며 크리에이터의 정체성을 한눈에 파악.
  3. 상단 원형 소셜 아이콘 바에서 인스타그램/유튜브 아이콘을 터치해 다른 채널을 손쉽게 확인.
  4. '추천 링크' 섹션 아래의 '최신 굿즈 스토어' 링크 카드를 탭하여 새 탭에서 상품 페이지로 바로 이동.

#### 💼 시나리오 B: 크리에이터 / 사용자의 링크 허브 운영
- **상황**: SNS의 단일 링크 제약을 극복하고, 블로그·포트폴리오·오픈카톡·외주 문의처를 하나로 묶어 공유하고자 함.
- **사용자 행동 흐름**:
  1. 본인의 감성에 맞는 파스텔 테마와 주요 활동 채널 링크들을 모아 나만의 모바일 프로필 페이지를 구성.
  2. 완성된 마이링크 주소를 인스타그램, 유튜브 등의 메인 프로필 링크로 등록.
  3. 팔로워 및 비즈니스 파트너가 원하는 정보(외주 문의, 작업물, SNS)로 빠르게 접근할 수 있는 허브(Hub)로 활용.

#### 🎬 시나리오 C: 라이브 시연자(Presenter)의 Step 1 데모 시연
- **상황**: 별도 백엔드 설치 없이도 브라우저에서 로컬스토리지를 기반으로 즉시 완결성 있게 동작하는 프로필 페이지를 청중에게 시연.
- **시연 진행 흐름**:
  1. 브라우저에서 페이지를 열면, LocalStorage에서 사전에 준비된 풍성한 파스텔 Mock 데이터(프로필, SNS 아이콘, 링크/헤더)가 즉각 바인딩되어 출력.
  2. 모바일 반응형 뷰(480px 카드 뷰)에서 버튼 호버, 클릭, 외부 링크 전환 등 부드러운 인터랙션을 실시간으로 검증.
  3. 프론트엔드 단독 환경에서도 디자인 완성도와 사용자 경험(UX)이 완벽히 작동함을 증명.

---

## 2. 디자인 및 톤앤매너 (Design & Tone)

- **스타일링 원칙: Tailwind CSS 단일 표준화 (No CSS Modules)**
  - CSS 모듈(`*.module.css`) 사용을 전면 배제하고, 전역 및 모든 컴포넌트 스타일은 **Tailwind CSS v4 (Utility-First)**로 100% 통일.
  - 유지보수성과 스타일 일관성을 위해 별도의 분산된 CSS 모듈 대신 Tailwind 유틸리티 클래스와 `cn()` 유틸리티 함수를 사용.
- **컴포넌트 재사용성 및 shadcn/ui 기반 모듈화**:
  - 페이지 내의 프로필 헤더, 소셜 아이콘 바, 링크 카드, 섹션 헤더 등 주요 UI 블록을 **shadcn/ui 프리미티브를 래핑한 독립적이고 재사용 가능한 컴포넌트**로 분리하여 설계.
  - 컴포넌트 아키텍처는 **shadcn/ui**의 headless 프리미티브 및 접근성(A11y), CVA(Class Variance Authority) 패턴을 기반으로 구축.
  - shadcn/ui의 기본 모노크롬 테마에 얽매이지 않고, **기존 PRD에 정의된 고유의 파스텔 톤앤매너를 100% 계승하여 커스터마이징**.
- **비주얼 컨셉**: **산뜻하고 깔끔한 파스텔 톤 (Soft Pastel & Clean)**
  - 자극적이지 않고 화사한 파스텔 컬러 팔레트 (라벤더, 민트, 피치, 파스텔 블루 등) 적용
  - shadcn/ui 컴포넌트(Button, Card, Avatar, Badge, Dialog 등)에 파스텔 색상 토큰 및 CSS 변수 바인딩
  - 여백을 충분히 살린 미니멀한 카드/버튼 레이아웃
  - 부드러운 라운딩(`rounded-xl` ~ `rounded-2xl`)과 은은한 그림자(`shadow-sm`, `shadow-md`)로 모던하고 친근한 인상 부여
- **모바일 퍼스트 (Mobile-First)**:
  - 실제 공유되는 링크 페이지는 모바일 세로 뷰에 최적화
  - 데스크톱에서는 중앙 모바일 목업 카드 형태로 단정하게 렌더링

---

## 3. 기술 스택 및 아키텍처 (Tech Stack & Architecture)

### 3.1 기술 스택
| 구분 | 기술 / 라이브러리 | 선정 이유 |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | 강력한 라우팅, 서버/클라이언트 컴포넌트 유연성 |
| **Design System / UI** | **shadcn/ui (v4), Tailwind CSS v4** | 최신 Tailwind v4 기반(no-config) headless 컴포넌트 시스템. CSS 모듈을 전면 배제하고 Tailwind CSS 유틸리티 클래스로 100% 일원화하여 스타일링. |
| **State Management** | **Zustand (`persist` 미들웨어)** | 초경량 전역 상태 관리, 실시간 프리뷰 최적화 및 LocalStorage 자동 동기화 |
| **Icons** | Lucide React | 깔끔하고 가벼운 모던 아이콘 세트 (SNS 및 UI 아이콘) |
| **DnD** | `@hello-pangea/dnd` 또는 경량 HTML5 Drag-and-Drop | 링크 순서 드래그 앤 드롭 정렬 지원 (Step 2 예정) |
| **Data & Storage** | 브라우저 LocalStorage + Mock Data Store | 외부 백엔드/클라우드 설정 없이 독립 실행 가능한 데모 환경 |

### 3.2 라우팅 구조 (Page Routes)
- `/` : (Step 1) 로컬스토리지 기반 파스텔톤 프로필 페이지 (시연용 메인)
- `/admin` : (Step 2) 링크 관리 및 테마 설정 대시보드 (좌측 편집기 + 우측 실시간 프리뷰)
- `/admin/analytics` : (Step 3) 클릭 수 및 조회수 요약 통계
- `/[username]` : 다중 프로필 확장 시 고유 핸들별 공개 링크 페이지

---

## 4. 데이터 모델 정의 (LocalStorage Data Schema)

외부 DB 없이 브라우저 `localStorage`에 JSON 형태로 저장·동기화되는 데이터 구조입니다.

### 4.1 Users (사용자 계정 및 프로필)
```typescript
interface User {
  id: string; // 고유 ID (예: "user-1")
  username: string; // 고유 핸들 (URL에 사용, 예: "mylink_lover")
  displayName: string; // 표시 이름 (예: "초이 / 크리에이터")
  bio: string; // 한 줄 소개글
  avatarUrl: string; // 프로필 이미지 URL (기본 제공 파스텔 아바타)
  themeId: string; // 적용된 테마 ID (기본: "pastel-peach")
  customTheme?: {
    backgroundColor?: string;
    cardStyle?: 'flat' | 'rounded' | 'outline' | 'shadow';
    buttonColor?: string;
    textColor?: string;
  };
  createdAt: string;
}
```

### 4.2 Blocks / Links (콘텐츠 블록)
```typescript
type BlockType = 'link' | 'header' | 'social';

interface Block {
  id: string; // 블록 고유 ID
  userId: string; // 소유 사용자 ID
  type: BlockType; // 블록 유형
  title: string; // 링크 라벨 또는 섹션 헤더 제목
  url?: string; // 이동할 URL (type이 'link' 또는 'social'일 때)
  icon?: string; // 아이콘 식별자 (예: 'instagram', 'youtube', 'github', 'mail' 등)
  isActive: boolean; // 링크 노출 활성/비활성화 토글
  order: number; // 노출 정렬 순서 (0부터 오름차순)
  clickCount: number; // 해당 링크의 누적 클릭 수 (Step 3 연동)
}
```

### 4.3 Analytics (방문 및 통계 데이터)
```typescript
interface PageAnalytics {
  userId: string;
  totalViews: number; // 전체 공개 페이지 조회수
  lastVisitedAt?: string;
}
```

### 4.4 표준 데모 더미 데이터 명세 (Mock Data Specification)
> 시스템 초기 로딩, LocalStorage Fallback, 백엔드 Mock API에 공통으로 사용하는 표준 더미 데이터 세트입니다.  
> 실제 파일 위치: [`mylink/data/links.json`](file:///c:/Users/chois/Desktop/바이브코딩_프로젝트/mylink/data/links.json), [`mylink/lib/mockData.ts`](file:///c:/Users/chois/Desktop/바이브코딩_프로젝트/mylink/lib/mockData.ts)

- **사용자 프로필 (`User`)**:
  - `id`: `"user_seoyeon_01"`
  - `username`: `"seoyeon_dev"`
  - `displayName`: `"최서연 (Seoyeon Choi)"`
  - `bio`: `"사용자 중심의 가치를 코드로 설계하는 프론트엔드 엔지니어 🌱 | 기술 블로그 & 오픈소스"`
  - `avatarUrl`: 파스텔 톤 고해상도 아바타 이미지
  - `themeId`: `"pastel-peach"` (배경: `#fdf8f5`, 버튼: `#ffe8df`, 텍스트: `#2d3748`)
- **소셜 아이콘 바 (`socials`, 4개)**:
  - GitHub (`github`), Instagram (`instagram`), YouTube (`youtube`), 이메일 (`mail`)
- **콘텐츠 블록 목록 (`blocks`, 헤더 3개 + 링크 7개)**:
  - **헤더 1**: `"🚀 대표 프로젝트 & 포트폴리오"`
    - 링크 1: `"MyLink - 감성 링크트리 웹 서비스"` (GitHub Repo)
    - 링크 2: `"Notion 스타일 미니멀 UI 컴포넌트 킷"` (GitHub Repo)
    - 링크 3: `"인터랙티브 웹 포트폴리오 (Live Demo)"` (Web Demo)
  - **헤더 2**: `"✍️ 기술 블로그 & 최신 아티클"`
    - 링크 4: `"[기술블로그] Next.js 16 + Tailwind v4 클린 아키텍처 가이드"` (Velog)
    - 링크 5: `"디자인 시스템 설계와 컴포넌트 추상화 전략"` (Brunch)
  - **헤더 3**: `"💬 소통 & 협업 문의"`
    - 링크 6: `"☕ 커피 한 잔 후원하기 (Buy Me a Coffee)"` (후원 링크)
    - 링크 7: `"카카오톡 1:1 오픈채팅 (프로젝트 & 협업 문의)"` (오픈채팅 링크)
- **통계 초기값 (`PageAnalytics`)**:
  - `totalViews`: `1284`, `lastVisitedAt`: `"2026-11-15T02:45:00.000Z"`

---

## 5. 상세 기능 요구사항 (Functional Requirements)

### 5.1 [Step 1: 현재 구현 대상] 로컬스토리지 기반 프로필 페이지
> **시연 1단계 집중 목표**: 별도의 대시보드 없이도 브라우저에서 즉시 예쁘고 완성도 높은 프로필 링크 모음 페이지를 확인하고 동작을 시연할 수 있도록 구현합니다.

1. **LocalStorage 데이터 바인딩 & Fallback**:
   - 페이지 로드시 `localStorage`에서 프로필 및 링크 데이터를 조회.
   - 저장된 데이터가 없을 경우, **4.4절의 표준 데모 더미 데이터 (`mylink/data/links.json` / `mockData.ts`)**를 자동으로 로컬스토리지에 주입 및 렌더링.
2. **비주얼 & 파스텔 디자인 구성**:
   - 배경: 부드러운 파스텔 톤 캔버스 (예: 피치/민트/라벤더 베이스)
   - 모바일 최적화 레이아웃 (최대 폭 480px의 중앙 모바일 카드 형태)
3. **재사용 가능한 shadcn/ui 기반 모듈형 컴포넌트 구성**:
   - 모든 컴포넌트는 CSS 모듈 대신 **Tailwind CSS 유틸리티 클래스**로만 스타일링되어 단일 표준 유지.
   - **`ProfileHeader`**: shadcn/ui `Avatar` 컴포넌트를 기반으로 파스텔 테두리 링 커스텀 적용, 굵은 텍스트의 표시 이름(`displayName`), 서브 텍스트 핸들명(`@username`), 한 줄 소개글(`bio`)을 독립적으로 렌더링.
   - **`SocialBar`**: shadcn/ui `Button` (icon variant) 기반으로 제작되어 인스타그램, 유튜브, 깃허브, 이메일 등의 아이콘이 가로로 배열, 클릭 시 새 탭 이동 및 소셜 리스트 재사용 가능.
   - **`LinkCard`**: shadcn/ui `Card` 및 `Badge` 컴포넌트를 확장하여 파스텔 배경, 둥근 모서리(`rounded-2xl`), 클릭 시 호버 애니메이션(부드러운 확대/그림자 효과), 클릭 카운트 표시 및 새 탭 URL 이동.
   - **`SectionHeader`**: "추천 링크", "포트폴리오" 등 카테고리를 분리해 주는 단정한 텍스트 라벨과 파스텔 그라데이션 구분선.
   - **`PageHeader`**: shadcn/ui `Badge` 및 `Button` 기반의 데모 뱃지, 공유하기, 데이터 초기화 컨트롤 바.
   - **`PageFooter`**: shadcn/ui `Badge` 기반 "Powered by **MyLink**" 로고 뱃지.

---

### 5.2 [Step 2: 차후 단계] 관리자 대시보드 (`/admin`) - 분할 화면 빌더
> *시연 1단계(프로필 페이지) 완료 후 진행 예정*
- 좌측 편집 컨트롤 패널 (링크 CRUD, 드래그 앤 드롭 순서 변경, 토글)
- 우측 실시간 모바일 목업 프리뷰 (편집 내용이 딜레이 없이 100% 동기화)
- 테마 프리셋 선택 및 버튼 스타일 커스텀

---

### 5.3 [Step 3: 차후 단계] 통계 및 분석 (Analytics)
> *시연 2단계(대시보드) 완료 후 진행 예정*
- 전체 누적 페이지 뷰 수 집계
- 각 링크 버튼별 실시간 클릭 수 카운트 & CTR 표시
- 대시보드 내 지표 요약 카드 및 통계 초기화 버튼

---

## 6. 비기능적 요구사항 (Non-Functional Requirements)

1. **사용성 및 반응성 (UX & Reactivity)**:
   - 모든 수정 사항은 즉각적으로 LocalStorage에 반영되며, 별도의 '저장' 버튼을 누르지 않아도 상태가 보존(Auto-save)되어야 함.
2. **반응형 디자인 (Responsiveness)**:
   - 관리자 화면은 데스크톱(1024px 이상)에서 스플릿 뷰를 유지하고, 모바일 화면에서는 탭 기반으로 유연하게 전환되어야 함.
3. **데이터 안정성 및 초기화**:
   - LocalStorage가 비어있거나 손상된 경우를 대비해 Fallback 안전 장치 및 **[기본 데모 데이터로 복원]** 버튼 제공.
4. **웹 표준 및 접근성**:
   - 링크 버튼의 키보드 네비게이션(Tab 키 포커스), 스크린 리더용 ARIA 속성 기본 준수.

---

## 7. 단계별 시연 로드맵 (Demonstration Roadmap)

| 단계 | 범위 및 상태 | 주요 작업 내용 | 핵심 산출물 |
| :--- | :---: | :--- | :--- |
| **Step 1: 로컬스토리지 기반 프로필 페이지** | **🔥 현재 구현 대상** | - LocalStorage 초기 Mock 데이터 세팅 (프로필 정보, SNS 아이콘, 링크/헤더 목록)<br>- **shadcn/ui 기반 컴포넌트(Avatar, Button, Card 등) 활용 및 산뜻한 파스텔 톤 커스텀 스타일링**<br>- 프로필 헤더 (아바타, 이름, 바이오)<br>- SNS 원형 아이콘 바<br>- 링크 버튼 및 섹션 헤더 리스트<br>- 모바일 반응형 뷰 최적화 | **완성된 단독 프로필 페이지**<br>(대시보드/통계 없이 즉시 시연 가능) |
| **Step 2: 관리자 대시보드 (Admin Builder)** | *차후 진행* | - 좌측 링크 CRUD & 순서 변경(DnD)<br>- 우측 실시간 모바일 목업 프리뷰 동기화<br>- 테마 프리셋 선택기 | 링크 편집 & 실시간 프리뷰 시스템 |
| **Step 3: 통계 및 분석 (Analytics)** | *차후 진행* | - 페이지 조회수 및 링크별 누적 클릭수 카운트<br>- 대시보드 내 통계 지표 위젯 및 초기화 기능 | 방문/클릭 통계 시스템 |
