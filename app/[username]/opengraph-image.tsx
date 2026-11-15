import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// 이미지 메타데이터
export const alt = '마이링크 프로필 OG 이미지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// 한글 폰트(Noto Sans KR) 로더
async function loadNotoSansKR(text: string): Promise<ArrayBuffer | undefined> {
  // 1. 필요한 글자만 서브셋으로 Google Fonts에서 가져와 네트워크 지연 최소화
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
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
    console.warn('[OG Image] Subset font fetch failed, trying direct font fallback:', error);
  }

  // 2. Fallback: Google Fonts 공식 CDN Direct TTF
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

interface OgImageProps {
  params: Promise<{ username: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const resolvedParams = await params;
  const rawUsername = resolvedParams?.username || '마이링크 사용자';
  const username = decodeURIComponent(rawUsername);

  // 폰트 서브셋에 포함할 텍스트 모음
  const fontChars = `마이링크${username}나만의 모든 링크를 하나의 프로필로🔗mylink.me/`;
  const fontData = await loadNotoSansKR(fontChars);

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
          padding: '50px 60px',
          backgroundColor: '#E6FFFA', // 산뜻한 민트색 배경 기본값
          backgroundImage:
            'radial-gradient(circle at 15% 15%, #ccfbf1 0%, transparent 40%), radial-gradient(circle at 85% 85%, #99f6e4 0%, transparent 45%), linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #A7F3D0 100%)',
          fontFamily: '"Noto Sans KR", sans-serif',
        }}
      >
        {/* 상단: 마이링크 브랜드 로고 바 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 로고 영역 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '12px 24px',
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* 체인 링크 SVG 아이콘 */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

          {/* 소셜 링크 뱃지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '18px',
              color: '#0D9488',
              fontWeight: 600,
              border: '1px solid rgba(204, 251, 241, 0.8)',
            }}
          >
            <span>Link in Bio</span>
          </div>
        </div>

        {/* 중앙: 메인 프로필 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            maxWidth: '920px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            borderRadius: '32px',
            padding: '48px 60px',
            boxShadow: '0 20px 40px -10px rgba(13, 148, 136, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* 아바타 플레이스홀더 */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '44px',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
              marginBottom: '20px',
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {/* 사용자 이름 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
              fontWeight: 700,
              color: '#134E4A',
              letterSpacing: '-1px',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            {username}
          </div>

          {/* 서브 설명 문구 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#0F766E',
              fontWeight: 600,
              backgroundColor: '#F0FDFA',
              padding: '10px 28px',
              borderRadius: '9999px',
              border: '1px solid #CCFBF1',
            }}
          >
            나만의 모든 링크를 하나의 프로필로
          </div>
        </div>

        {/* 하단: URL 및 도메인 안내 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '20px',
            color: '#115E59',
            fontWeight: 600,
          }}
        >
          <span>🔗</span>
          <span>mylink.me/{username}</span>
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
