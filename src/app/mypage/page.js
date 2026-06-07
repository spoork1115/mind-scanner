'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Coins, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import Mascot from '@/components/Mascot';

export default function MyPage() {
  const router = useRouter();

  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [profile, setProfile] = useState(null);
  const [lastResultId, setLastResultId] = useState(null);

  useEffect(() => {
    // 로컬 스토리지 데이터 로드
    const savedPoints = parseInt(localStorage.getItem('office_universe_points') || '0');
    const savedBadges = JSON.parse(localStorage.getItem('office_universe_badges') || '[]');
    const savedProfile = localStorage.getItem('office_universe_profile');
    const savedResultId = localStorage.getItem('office_universe_last_result_id');

    setPoints(savedPoints);
    setBadges(savedBadges);
    setLastResultId(savedResultId);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // 배지 정의 정보 목록
  const badgeDefinitions = [
    {
      id: 'first_test',
      title: '오피스 입성 배지',
      description: '생존 가이드 첫 테스트를 완수하고 임무에 임한 신입 생존자',
      emoji: '🔰',
      color: 'blue'
    },
    {
      id: 'chemistry_matched',
      title: '프로소통러 배지',
      description: '사내 생존 케미 매칭을 시도하고 동료와 조화를 모색한 소통러',
      emoji: '🤝',
      color: 'pink'
    },
    {
      id: 'positivity',
      title: '오늘의 긍정왕 배지',
      description: '번아웃 자가 진단 결과 안전 등급을 받으며 활기찬 평온을 유지한 자',
      emoji: '👑',
      color: 'orange'
    }
  ];

  const handleBack = () => {
    if (lastResultId) {
      router.push(`/result?id=${lastResultId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mypage-container fade-in">
      {/* 상단 네비 바 */}
      <div className="top-nav">
        <button className="back-btn" onClick={handleBack} aria-label="이전 화면으로">
          <ArrowLeft size={24} />
        </button>
        <span className="nav-title">나의 마인드미러</span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* 1. 프로필 요약 정보 */}
      {profile ? (
        <div className="profile-summarycard card">
          <div className="summary-left">
            <Mascot emotion={profile.mood} size={70} />
          </div>
          <div className="summary-right">
            <span className="badge-role">{profile.role}</span>
            <h2 className="profile-nickname">{profile.zodiac}띠 생존자</h2>
            <p className="profile-status">오늘의 상태: {profile.mood === 'energetic' ? '기운 넘침! ⚡' : profile.mood === 'sad' ? '방전 주의보 😩' : '평온함 🍀'}</p>
          </div>
        </div>
      ) : (
        <div className="profile-summarycard card empty-profile">
          <p>아직 테스트를 진행하지 않았습니다.</p>
          <button className="btn btn-primary start-btn-sm" onClick={() => router.push('/')}>
            테스트하고 프로필 만들기
          </button>
        </div>
      )}

      {/* 2. 누적 가상 포인트 (Status 및 성취감) */}
      <div className="points-showcard card">
        <div className="card-header">
          <div className="icon-badge">
            <Coins size={22} className="icon-gold" />
          </div>
          <div className="header-info">
            <h3>누적 생존 포인트</h3>
            <p className="points-value">
              <span className="points-num">{points}</span> P
            </p>
          </div>
        </div>
        <div className="points-bar-bg">
          {/* 500P 기준 게이지 */}
          <div className="points-bar-fill" style={{ width: `${Math.min(100, (points / 500) * 100)}%` }}></div>
        </div>
        <p className="points-tip">500P 적립 시, 사내 매점 기프티콘 자동 응모! 🎉</p>
      </div>

      {/* 3. 획득한 배지 리스트 (게이미피케이션 시각화) */}
      <div className="badges-section card">
        <h3 className="section-title">🏆 획득한 마인드미러 뱃지 ({badges.length}개)</h3>
        <div className="badges-grid">
          {badgeDefinitions.map(b => {
            const isEarned = badges.includes(b.id);
            return (
              <div key={b.id} className={`badge-item ${isEarned ? 'earned' : 'locked'}`}>
                <div className={`badge-visual ${b.color}`}>
                  <span className="badge-emoji">{isEarned ? b.emoji : '🔒'}</span>
                </div>
                <div className="badge-info">
                  <h4 className="badge-title">{b.title}</h4>
                  <p className="badge-desc">{b.description}</p>
                  {isEarned && (
                    <span className="badge-status-tag">
                      <CheckCircle2 size={12} style={{ marginRight: '3px' }} />
                      획득 완료
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 마케팅 CRM 푸시 미리보기 안내 카드 (사내용 데모) */}
      <div className="section-card card crm-demo-card">
        <div className="card-header-row">
          <Calendar size={18} className="icon-orange" />
          <h3>오전 9시 관계 꿀팁 배달 (푸시 체험)</h3>
        </div>
        <p className="crm-desc">
          매일 출근 시간에 전송되는 유머러스하고 매력적인 푸시 메시지 샘플입니다.
        </p>
        <div className="crm-preview-box">
          <div className="crm-preview-header">
            <span>🔔 마인드미러 알림</span>
            <span className="crm-time">오전 09:00</span>
          </div>
          <p className="crm-preview-content">
            <strong>[오늘 피해야 할 동료]</strong>가 나에게 말을 걸었다면? 침착하게 미소를 지으며 3초 후 대답해보세요! 🍀
          </p>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('오늘의 행운 용돈 50P가 특별 지급되었습니다!'); setPoints(p => p + 50); }}
            className="crm-cta-link"
          >
            👉 오늘의 행운 용돈 받기
          </a>
        </div>
      </div>

      <style jsx>{`
        .mypage-container {
          display: flex;
          flex-direction: column;
          height: auto;
          padding-bottom: 40px;
        }
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          margin-bottom: 16px;
        }
        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: hsl(var(--text-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
        }
        .nav-title {
          font-size: 18px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .profile-summarycard {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }
        .empty-profile {
          flex-direction: column;
          text-align: center;
          gap: 14px;
          padding: 30px 20px;
        }
        .start-btn-sm {
          min-height: 44px;
          font-size: 14px;
          padding: 8px 16px;
        }
        .summary-right {
          flex: 1;
        }
        .badge-role {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .profile-nickname {
          font-size: 18px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 4px;
        }
        .profile-status {
          font-size: 13px;
          color: hsl(var(--text-muted));
        }
        /* 포인트 카드 */
        .points-showcard {
          padding: 20px;
        }
        .points-showcard .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: hsl(45, 100%, 95%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-gold {
          color: #f1c40f;
        }
        .header-info h3 {
          font-size: 14px;
          color: hsl(var(--text-muted));
          margin-bottom: 2px;
        }
        .points-value {
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .points-num {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          color: hsl(var(--text-dark));
        }
        .points-bar-bg {
          height: 8px;
          background-color: hsl(210, 16%, 90%);
          border-radius: 4px;
          margin-top: 14px;
          overflow: hidden;
        }
        .points-bar-fill {
          height: 100%;
          background-color: #f1c40f;
          border-radius: 4px;
          transition: width 0.5s ease-out;
        }
        .points-tip {
          font-size: 12px;
          color: hsl(var(--text-muted));
          margin-top: 8px;
          font-weight: 500;
        }
        /* 배지 목록 */
        .badges-section {
          padding: 20px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 16px;
          border-bottom: 1px solid hsl(210, 16%, 93%);
          padding-bottom: 8px;
        }
        .badges-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: var(--radius-sm);
          transition: background-color 0.2s ease;
        }
        .badge-item.earned {
          background-color: hsl(210, 16%, 97%);
        }
        .badge-item.locked {
          opacity: 0.6;
        }
        .badge-visual {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .badge-visual.blue {
          background-color: hsl(200, 100%, 95%);
          border: 2px solid hsl(200, 100%, 75%);
        }
        .badge-visual.pink {
          background-color: hsl(340, 100%, 96%);
          border: 2px solid hsl(340, 100%, 85%);
        }
        .badge-visual.orange {
          background-color: hsl(var(--primary-light));
          border: 2px solid hsl(var(--primary));
        }
        .badge-item.locked .badge-visual {
          background-color: hsl(210, 16%, 90%);
          border: 2px solid hsl(210, 16%, 80%);
        }
        .badge-info {
          flex: 1;
        }
        .badge-title {
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .badge-desc {
          font-size: 11.5px;
          color: hsl(var(--text-muted));
          margin-top: 2px;
          line-height: 1.4;
        }
        .badge-status-tag {
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          color: hsl(var(--accent-mint));
          background-color: hsl(150, 60%, 95%);
          padding: 1px 6px;
          border-radius: 4px;
          margin-top: 4px;
          font-weight: 700;
        }
        /* CRM 알림 시뮬레이터 카드 */
        .crm-demo-card {
          border-left: 5px solid hsl(var(--primary));
        }
        .card-header-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .icon-orange {
          color: hsl(var(--primary));
        }
        .crm-desc {
          font-size: 12.5px;
          color: hsl(var(--text-muted));
          margin-bottom: 12px;
        }
        .crm-preview-box {
          background-color: #fff;
          border: 2px solid hsl(210, 16%, 88%);
          border-radius: var(--radius-sm);
          padding: 12px;
        }
        .crm-preview-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: hsl(var(--text-muted));
          font-weight: 700;
          margin-bottom: 6px;
        }
        .crm-preview-content {
          font-size: 13px;
          color: hsl(var(--text-dark));
          line-height: 1.45;
        }
        .crm-cta-link {
          display: inline-block;
          font-size: 11.5px;
          color: hsl(var(--primary));
          font-weight: 700;
          margin-top: 8px;
          text-decoration: none;
        }
        .crm-cta-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
