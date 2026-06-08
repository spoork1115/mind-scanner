import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: '마인드미러 | 직장인 성향 분석 & 관계망 시각화',
  description: '12문항 설문으로 나의 직무 성향 유형을 분석하고, 동료들과의 관계망을 시각화해 보세요. 사내 임직원을 위한 심리 거울 플랫폼.',
  openGraph: {
    title: '마인드미러: 직장인 성향 분석 & 관계망 시각화',
    description: '나의 직장인 성향 유형은? 12문항 설문으로 알아보고 동료들과의 케미 관계망을 확인해보세요!',
    type: 'website',
    url: 'https://office-universe.vercel.app',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: '마인드미러 대표 이미지',
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
