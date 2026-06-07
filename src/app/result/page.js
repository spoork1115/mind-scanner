'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { Share2, Link2, RotateCcw, User, Heart, AlertTriangle, Coffee, Sparkles, Award } from 'lucide-react';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');

  const [resultData, setResultData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);
  const [exposeProfile, setExposeProfile] = useState(true); // 프라이버시 노출 동의 상태
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. 결과 데이터 로드
    // 캐싱된 최신 결과가 있고 ID가 일치하면 로컬 캐시 사용, 없으면 mock 로직
    const cachedResultStr = localStorage.getItem('office_universe_last_result');
    const cachedId = localStorage.getItem('office_universe_last_result_id');
    
    if (cachedResultStr && cachedId === resultId) {
      setResultData(JSON.parse(cachedResultStr));
    } else if (cachedResultStr) {
      // 다른 ID일 경우 일단 캐싱된 것 활용 (Vercel 배포 시 시연 편의성용)
      setResultData(JSON.parse(cachedResultStr));
    } else {
      // 로컬 스토리지에 데이터가 전혀 없으면 온보딩으로 복귀
      alert('인증 정보가 만료되었습니다. 처음부터 다시 진행해주세요.');
      router.push('/');
    }
  }, [resultId, router]);

  // 2. 케미 매칭 파트너 가져오기
  useEffect(() => {
    if (!resultData || !resultId) return;

    const fetchMatch = async () => {
      try {
        setIsLoadingMatch(true);
        const response = await fetch('/api/chemistry/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ participantId: resultId })
        });

        const data = await response.json();
        if (data.success) {
          setMatchData(data);
          // 매칭 성공 시 배지 지급 처리 (게이미피케이션)
          let badges = JSON.parse(localStorage.getItem('office_universe_badges') || '[]');
          if (!badges.includes('chemistry_matched')) {
            badges.push('chemistry_matched');
            localStorage.setItem('office_universe_badges', JSON.stringify(badges));
            // 포인트 50점 추가 적립
            const currentPoints = parseInt(localStorage.getItem('office_universe_points') || '0');
            localStorage.setItem('office_universe_points', (currentPoints + 50).toString());
          }
        } else {
          console.warn('Match API warning:', data.error);
        }
      } catch (err) {
        console.error('Match API Error:', err);
      } finally {
        setIsLoadingMatch(false);
      }
    };

    fetchMatch();
  }, [resultData, resultId]);

  // URL 클립보드 복사
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
  };

  // 카카오톡 공유 (가상 알림 모사 및 복사 기능 유도)
  const handleKakaoShare = () => {
    alert('사내 메신저 및 카카오톡으로 공유할 수 있도록 링크가 복사되었습니다! 친구에게 붙여넣기(Ctrl+V) 해주세요.');
    handleCopyLink();
  };

  if (!resultData) {
    return (
      <div className="loading-fallback">
        <p>결과를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 기분 이모지 매핑
  const getMoodEmoji = (moodType) => {
    const emojis = { smile: '🙂', energetic: '😄', think: '🤔', sad: '😩', wink: '😉' };
    return emojis[moodType] || '🙂';
  };

  return (
    <div className="result-container fade-in">
      {/* 1. 상단 마스크 캐릭터 영역 */}
      <div className="result-header">
        <span className="type-badge">{resultData.mbti} 유형</span>
        <Mascot emotion={resultData.mascot} size={130} />
        <h1 className="result-title">"{resultData.title}"</h1>
        <p className="result-desc">{resultData.description}</p>
      </div>

      {/* 2. 오늘의 직장인 운세 (바넘 효과 제어) */}
      <div className="section-card card">
        <div className="card-header-row">
          <Sparkles size={20} className="icon-orange" />
          <h3>오늘의 직장인 생존 운세</h3>
        </div>
        <p className="content-text">{resultData.fortune}</p>
      </div>

      {/* 3. 계획된 우연 이론 처방 가이드 */}
      <div className="section-card card border-highlight">
        <div className="card-header-row">
          <Heart size={20} className="icon-orange" />
          <h3>행동 가이드: {resultData.happenstanceType}</h3>
        </div>
        <p className="content-text happenstance-text">
          {resultData.happenstance}
        </p>
        <div className="theory-badge">
          계획된 우연 이론(Planned Happenstance Theory)
        </div>
      </div>

      {/* 4. 조심할 일 */}
      <div className="section-card card warning-card">
        <div className="card-header-row">
          <AlertTriangle size={20} className="icon-red" />
          <h3>오피스 주의보!</h3>
        </div>
        <p className="content-text warning-text">{resultData.warning}</p>
      </div>

      {/* 5. 번아웃 자가 진단 & 특별 복지 연동 */}
      <div className={`section-card card burnout-card ${resultData.burnout.state}`}>
        <div className="card-header-row">
          <Coffee size={20} />
          <h3>번아웃 케어 진단: {resultData.burnout.title}</h3>
        </div>
        <p className="content-text">{resultData.burnout.advice}</p>
        
        {resultData.burnout.showBenefit && (
          <a 
            href="https://gift.kakao.com" // 가상 사내 커피 쿠폰 지급 연결
            target="_blank" 
            rel="noopener noreferrer" 
            className="benefit-link-btn"
          >
            ☕ 3시의 힐링! 무료 아메리카노 쿠폰 받기
          </a>
        )}
      </div>

      {/* 6. 사내 케미스트리(궁합) 매칭 */}
      <div className="section-card card chemistry-card">
        <div className="card-header-row">
          <Heart size={20} className="icon-pink" />
          <h3>사내 생존 케미 매칭</h3>
        </div>

        {isLoadingMatch ? (
          <div className="match-loading">
            <div className="spinner"></div>
            <p>환상의 짝꿍을 탐색하고 있습니다...</p>
          </div>
        ) : matchData ? (
          <div className="match-result fade-in">
            <div className="partner-profile-box">
              <div className="partner-avatar">
                {getMoodEmoji(matchData.partner.mood)}
              </div>
              <div className="partner-info">
                <span className="partner-badge">{matchData.matchTitle}</span>
                <h4 className="partner-role">{matchData.partner.role} ({matchData.partner.zodiac}띠)</h4>
                <p className="partner-mbti">생존 유형: <strong>{matchData.partner.mbti}</strong></p>
              </div>
            </div>
            
            <p className="match-advice-text">{matchData.matchAdvice}</p>
            <div className="match-score-badge">
              케미 지수: <span className="score-num">{matchData.chemistryScore}%</span>
            </div>
          </div>
        ) : (
          <p className="error-text">매칭 데이터를 불러오지 못했습니다.</p>
        )}

        {/* 프라이버시 노출 토글 */}
        <div className="privacy-toggle-box">
          <label className="privacy-toggle-label">
            <input 
              type="checkbox" 
              checked={exposeProfile}
              onChange={(e) => {
                setExposeProfile(e.target.checked);
                localStorage.setItem('office_universe_expose_matching', e.target.checked ? 'true' : 'false');
              }}
              className="privacy-checkbox"
            />
            <span className="privacy-toggle-text">다른 동료의 케미 매칭 상대로 내 프로필 노출 동의</span>
          </label>
        </div>
      </div>

      {/* 7. 게이미피케이션 피드백 안내 */}
      <div className="section-card card point-card">
        <div className="card-header-row">
          <Award size={20} className="icon-gold" />
          <h3>오늘의 생존 퀘스트 완료!</h3>
        </div>
        <p className="content-text">
          테스트 완료 보상 <strong>+100P</strong> 및 케미 매칭 보상 <strong>+50P</strong>가 적립되었습니다.
        </p>
        <button className="mypage-go-btn" onClick={() => router.push('/mypage')}>
          마이페이지에서 배지 & 포인트 확인하기 →
        </button>
      </div>

      {/* 8. 바이럴 및 추가 액션 (Thumb zone 영역 내) */}
      <div className="action-buttons-grid">
        <button className="btn btn-secondary share-btn" onClick={handleKakaoShare}>
          <Share2 size={18} style={{ marginRight: '6px' }} />
          사내 공유
        </button>

        <button className="btn btn-secondary share-btn" onClick={handleCopyLink}>
          <Link2 size={18} style={{ marginRight: '6px' }} />
          {copied ? '복사 완료!' : 'URL 복사'}
        </button>

        <button className="btn btn-primary retry-btn" onClick={() => router.push('/')}>
          <RotateCcw size={18} style={{ marginRight: '6px' }} />
          다시 하기
        </button>
      </div>

      <style jsx>{`
        .result-container {
          display: flex;
          flex-direction: column;
          height: auto;
          padding-bottom: 40px;
        }
        .loading-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-weight: 600;
          color: hsl(var(--text-muted));
        }
        .result-header {
          text-align: center;
          margin: 20px 0 30px 0;
        }
        .type-badge {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 14px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
          box-shadow: 0 2px 6px rgba(255, 111, 60, 0.1);
        }
        .result-title {
          font-size: 28px;
          margin-top: 16px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .result-desc {
          font-size: 15px;
          color: hsl(var(--text-muted));
          margin-top: 8px;
          padding: 0 16px;
          line-height: 1.5;
        }
        .section-card {
          padding: 20px;
        }
        .card-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .card-header-row h3 {
          margin-bottom: 0;
          font-size: 16px;
          font-weight: 700;
        }
        .content-text {
          font-size: 15px;
          line-height: 1.6;
          color: hsl(var(--text-dark));
        }
        .icon-orange {
          color: hsl(var(--primary));
        }
        .icon-red {
          color: hsl(var(--accent-peach));
        }
        .icon-pink {
          color: #ff6584;
        }
        .icon-gold {
          color: #f1c40f;
        }
        .border-highlight {
          border-left: 5px solid hsl(var(--primary));
        }
        .happenstance-text {
          font-weight: 500;
        }
        .theory-badge {
          display: inline-block;
          font-size: 11px;
          color: hsl(var(--primary));
          background-color: hsl(var(--primary-light));
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 12px;
          font-weight: 700;
        }
        .warning-card {
          background-color: hsl(355, 100%, 97%);
          border: 1px solid rgba(255, 111, 60, 0.15);
        }
        .warning-text {
          color: hsl(355, 60%, 40%);
          font-weight: 500;
        }
        /* 번아웃 스타일 분기 */
        .burnout-card.safe {
          background-color: hsl(150, 60%, 96%);
          border-left: 5px solid hsl(var(--accent-mint));
          color: hsl(150, 60%, 25%);
        }
        .burnout-card.safe h3, .burnout-card.safe svg {
          color: hsl(var(--accent-mint));
        }
        .burnout-card.warning {
          background-color: hsl(45, 100%, 96%);
          border-left: 5px solid #f1c40f;
          color: #7f6a00;
        }
        .burnout-card.warning h3, .burnout-card.warning svg {
          color: #b79500;
        }
        .burnout-card.danger {
          background-color: hsl(355, 85%, 96%);
          border-left: 5px solid hsl(var(--accent-peach));
          color: hsl(355, 85%, 35%);
        }
        .burnout-card.danger h3, .burnout-card.danger svg {
          color: hsl(var(--accent-peach));
        }
        .benefit-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          background-color: hsl(var(--accent-peach));
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          box-shadow: 0 4px 8px rgba(255, 111, 108, 0.3);
          transition: transform 0.2s ease;
        }
        .benefit-link-btn:active {
          transform: scale(0.98);
        }
        /* 케미 매칭 파트너 스타일 */
        .match-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          gap: 10px;
        }
        .spinner {
          width: 28px;
          height: 28px;
          border: 3px solid hsl(210, 16%, 88%);
          border-top-color: #ff6584;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .match-result {
          background-color: hsl(340, 100%, 98%);
          border-radius: var(--radius-sm);
          padding: 16px;
          border: 1px solid rgba(255, 101, 132, 0.15);
        }
        .partner-profile-box {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .partner-avatar {
          width: 50px;
          height: 50px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: var(--shadow-sm);
          border: 2px solid #ff6584;
        }
        .partner-info {
          flex: 1;
        }
        .partner-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          background-color: #ff6584;
          color: #fff;
          padding: 2px 8px;
          border-radius: 10px;
          margin-bottom: 4px;
        }
        .partner-role {
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .partner-mbti {
          font-size: 12px;
          color: hsl(var(--text-muted));
          margin-top: 2px;
        }
        .match-advice-text {
          font-size: 13.5px;
          line-height: 1.5;
          color: hsl(var(--text-dark));
          margin-top: 8px;
          border-top: 1px dashed rgba(255, 101, 132, 0.2);
          padding-top: 10px;
        }
        .match-score-badge {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #ff6584;
        }
        .score-num {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          margin-left: 4px;
        }
        .privacy-toggle-box {
          margin-top: 14px;
          border-top: 1px solid hsl(210, 16%, 93%);
          padding-top: 12px;
        }
        .privacy-toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .privacy-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #ff6584;
          cursor: pointer;
        }
        .privacy-toggle-text {
          font-size: 12px;
          color: hsl(var(--text-muted));
          font-weight: 600;
        }
        /* 게이미피케이션 카드 */
        .point-card {
          background-color: hsl(45, 100%, 97%);
          border: 1px solid rgba(241, 196, 15, 0.25);
        }
        .mypage-go-btn {
          display: block;
          width: 100%;
          background: none;
          border: none;
          color: #b79500;
          font-size: 13.5px;
          font-weight: 700;
          text-align: right;
          cursor: pointer;
          margin-top: 10px;
          padding: 4px 0;
        }
        .mypage-go-btn:hover {
          text-decoration: underline;
        }
        /* 하단 그리드 액션 버튼 */
        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.3fr;
          gap: 8px;
          margin-top: 20px;
        }
        .share-btn {
          min-height: 48px;
          padding: 8px 12px;
          font-size: 14px;
        }
        .retry-btn {
          min-height: 48px;
          padding: 8px 12px;
          font-size: 14px;
          box-shadow: 0 4px 10px rgba(255, 111, 60, 0.25);
        }
      `}</style>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="loading-fallback"><p>결과 데이터를 불러오는 중입니다...</p></div>}>
      <ResultContent />
    </Suspense>
  );
}
