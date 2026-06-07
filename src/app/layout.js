import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: '오피스 유니버스 | 오늘의 직장인 생존 가이드',
  description: '사내 임직원들을 위한 계획된 우연 이론 기반 심리검사 및 맞춤형 직장생활 생존 가이드 제공 플랫폼',
  openGraph: {
    title: '오피스 유니버스: 오늘의 직장인 생존 가이드',
    description: '너의 직장인 생존 유형은? 오늘의 행운과 사내 케미 매칭을 확인해보세요!',
    type: 'website',
    url: 'https://office-universe.vercel.app', // Vercel 배포 주소 임시 지정
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: '오피스 유니버스 대표 이미지',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-container">
          <main className="app-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
