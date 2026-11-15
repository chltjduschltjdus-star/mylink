import { ImageResponse } from 'next/og';
import { searchUserByDisplayName } from '@/lib/auth';
import { getLinksFromFirestore } from '@/lib/links';
import { MOCK_USER, MOCK_BLOCKS } from '@/lib/mockData';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export function generateStaticParams() {
  return [
    { username: "최서연" },
    { username: "%EC%B5%9C%EC%84%9C%EC%97%B0" },
    { username: "user" },
  ];
}



// 이미지 메타데이터
export const alt = '마이링크 프로필 OG 이미지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// 한글 폰트(Noto Sans KR) 로더
async function loadNotoSansKR(text: string): Promise<ArrayBuffer | undefined> {
  // 1. 필요한 글자만 서브셋으로 Google Fonts에서 가져와 전송 크기 최소화
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@600;700&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
    });

    if (cssRes.ok) {
      const cssText = await cssRes.text();
      const match = cssText.match(/src:\s*url\((.+?)\)\s*format\('(opentype|truetype)'\)/);
      if (match && match[1]) {
        const fontRes = await fetch(match[1]);
        if (fontRes.ok) {
          return await fontRes.arrayBuffer();
        }
      }
    }
  } catch (error) {
    console.warn('[OG Image] Subset font fetch failed, falling back:', error);
  }

  // 2. Direct Fallback: Google Fonts 공식 CDN Noto Sans KR TTF
  try {
    const fallbackRes = await fetch(
      'https://fonts.gstatic.com/s/notosanskr/v40/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzg01eLQ.ttf'
    );
    if (fallbackRes.ok) {
      return await fallbackRes.arrayBuffer();
    }
  } catch (error) {
    console.error('[OG Image] Fallback font load failed:', error);
  }

  return undefined;
}

// 프로필 이미지를 Satori 호환 Base64 Data URL로 안전하게 변환
async function fetchImageAsBase64(url?: string | null): Promise<string | null> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.warn('[OG Image] Failed to fetch profile image as base64:', e);
    return null;
  }
}

interface OgImageProps {
  params: Promise<{ username: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const resolvedParams = await params;
  const rawUsername = resolvedParams?.username || '마이링크 사용자';
  const username = decodeURIComponent(rawUsername);

  // 기본 사용자 프로필 값
  let displayName = username;
  let bio = '사용자의 소셜 채널과 주요 링크를 한곳에서 확인해보세요.';
  let avatarUrl: string | null = null;
  let linkCount = 0;

  try {
    // 1. 유저 정보 조회 (Firestore)
    const userProfile = await searchUserByDisplayName(username);

    if (userProfile) {
      displayName = userProfile.displayName || userProfile.username || username;
      if (userProfile.bio && userProfile.bio.trim()) {
        bio = userProfile.bio.trim();
      }
      if (userProfile.photoURL) {
        avatarUrl = userProfile.photoURL;
      }

      // 2. 등록된 링크 개수 조회
      if (userProfile.uid) {
        const blocks = await getLinksFromFirestore(userProfile.uid);
        const actualLinks = blocks.filter((b) => b.type === 'link');
        linkCount = actualLinks.length;
      }
    } else if (
      username.toLowerCase() === 'seoyeon_dev' ||
      username === '최서연' ||
      username === '초이'
    ) {
      // Mock 폴백 데이터
      displayName = MOCK_USER.displayName;
      bio = MOCK_USER.bio;
      avatarUrl = MOCK_USER.avatarUrl || null;
      linkCount = MOCK_BLOCKS.filter((b) => b.type === 'link').length;
    }
  } catch (err) {
    console.warn('[OG Image] Error loading user profile:', err);
  }

  // 데모/기본값 보정
  if (linkCount === 0 && (username.toLowerCase() === 'seoyeon_dev' || username === '최서연')) {
    linkCount = 5;
  }

  // 프로필 이미지 Base64 변환
  const base64Avatar = await fetchImageAsBase64(avatarUrl);

  // 소개글 길이 조절 (OG 카드에 알맞게)
  const truncatedBio = bio.length > 70 ? `${bio.slice(0, 67)}...` : bio;

  // 한글 폰트 서브셋에 포함할 글자 집합
  const sampleText = `마이링크${displayName}${username}${truncatedBio}${linkCount}개의 링크Link in Bio🔗mylink.me/@`;
  const uniqueChars = Array.from(new Set(sampleText)).join('');
  const fontData = await loadNotoSansKR(uniqueChars);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '48px 64px',
          backgroundColor: '#E6FFFA', // 민트색 배경
          backgroundImage:
            'radial-gradient(circle at 10% 15%, #CCFBF1 0%, transparent 40%), radial-gradient(circle at 90% 85%, #99F6E4 0%, transparent 45%), linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 45%, #99F6E4 100%)',
          fontFamily: '"Noto Sans KR", sans-serif',
        }}
      >
        {/* ================= 1. 상단 바 (로고 + 링크 배지) ================= */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 브랜드 로고 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 26px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* 체인 링크 원형 아이콘 */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '19px',
                backgroundColor: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#0F766E',
                letterSpacing: '-0.5px',
              }}
            >
              마이링크
            </span>
          </div>

          {/* 링크 배지: "N개의 링크" */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '9999px',
              boxShadow: '0 6px 18px rgba(13, 148, 136, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            {/* 링크 개수 아이콘 */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '10px' }}
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '-0.3px',
              }}
            >
              {linkCount > 0 ? `${linkCount}개의 링크` : '등록된 링크'}
            </span>
          </div>
        </div>

        {/* ================= 2. 중앙 메인 프로필 카드 ================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1060px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '36px',
            padding: '48px 56px',
            boxShadow: '0 24px 50px -12px rgba(13, 148, 136, 0.18)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* 프로필 이미지 (둥근 원형) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '144px',
              height: '144px',
              minWidth: '144px',
              borderRadius: '72px',
              border: '5px solid #2DD4BF',
              boxShadow: '0 12px 28px rgba(13, 148, 136, 0.25)',
              overflow: 'hidden',
              backgroundColor: '#CCFBF1',
              marginRight: '40px',
            }}
          >
            {base64Avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={base64Avatar}
                alt={displayName}
                width={144}
                height={144}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '72px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  fontSize: '56px',
                  fontWeight: 700,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 프로필 정보 (이름, 핸들, 소개글) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {/* 이름 + 핸들 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#134E4A',
                  letterSpacing: '-1px',
                  marginRight: '16px',
                }}
              >
                {displayName}
              </span>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0D9488',
                  backgroundColor: '#F0FDFA',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #CCFBF1',
                }}
              >
                @{username}
              </span>
            </div>

            {/* 소개글 (bio) */}
            <div
              style={{
                display: 'flex',
                fontSize: '23px',
                lineHeight: '1.55',
                color: '#334155',
                fontWeight: 600,
                letterSpacing: '-0.3px',
              }}
            >
              {truncatedBio}
            </div>
          </div>
        </div>

        {/* ================= 3. 하단 바 (브랜딩 문구 + URL) ================= */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 브랜딩 서브 문구 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 600,
              color: '#0F766E',
            }}
          >
            <span>마이링크에서 나만의 프로필을 만나보세요</span>
          </div>

          {/* 프로필 URL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '20px',
              color: '#0D9488',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.08)',
              border: '1px solid rgba(204, 251, 241, 0.9)',
            }}
          >
            <span style={{ marginRight: '8px' }}>🔗</span>
            <span>mylink.me/@{username}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Noto Sans KR',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
