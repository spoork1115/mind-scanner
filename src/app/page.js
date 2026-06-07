'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { ShieldCheck, Bell, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  
  // 동의 상태
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePush, setAgreePush] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // 스플래시 화면 1.8초 동안 노출 후 메인 온보딩 노출
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (!agreePrivacy) {
      alert('서비스 이용을 위해 필수 개인정보 처리방침에 동의해주세요.');
      return;
    }
    
    // 로컬 스토리지에 동의 정보 저장
    localStorage.setItem('office_universe_privacy_agreed', 'true');
    localStorage.setItem('office_universe_push_agreed', agreePush ? 'true' : 'false');
    
    // 프로필 입력 페이지로 이동
    router.push('/profile');
  };

  if (showSplash) {
    return (
      <div className="splash-screen fade-in">
        <div className="splash-content">
          <Mascot emotion="energetic" size={140} />
          <h1 className="splash-title">마인드미러</h1>
          <p className="splash-subtitle">직장 내 나를 비춰보는 심리 거울</p>
        </div>
        <style jsx>{`
          .splash-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background-color: hsl(34, 100%, 97%);
          }
          .splash-content {
            text-align: center;
          }
          .splash-title {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 800;
            color: #1e252b;
            margin-top: 24px;
            letter-spacing: -0.5px;
          }
          .splash-subtitle {
            font-size: 16px;
            color: #ff6f3c;
            font-weight: 600;
            margin-top: 8px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="onboarding-container fade-in">
      {/* 캐릭터 헤더 영역 */}
      <div className="header-section">
        <Mascot emotion="wink" size={120} />
        <h1 className="title-text">
          반가워요!<br />
          여기는 <span className="highlight">마인드미러</span>
        </h1>
        <p className="desc-text">
          나의 직무 성향을 정확하게 비춰보고, 동료들과의 관계를 시각화하여 더 즐겁고 매끄러운 오피스 라이프를 설계해 보세요.
        </p>
      </div>

      {/* 약관동의 카드 섹션 */}
      <div className="terms-card card">
        <h3 className="terms-header">안전한 서비스 이용을 위한 동의</h3>
        
        {/* 필수동의 */}
        <label className="terms-item">
          <input 
            type="checkbox" 
            checked={agreePrivacy} 
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="terms-checkbox"
          />
          <div className="terms-content">
            <div className="terms-title-row">
              <span className="badge-required">필수</span>
              <span className="terms-label">개인정보 수집 및 이용 동의</span>
            </div>
            <div className="terms-detail">
              - <strong>수집목적</strong>: 직무 유형 성향 분석 및 동료 케미 매칭 관계도 제공<br />
              - <strong>수집항목</strong>: 이름(닉네임), 생년월일, 직책, 오늘의 기분<br />
              - <strong>보유기간</strong>: <strong>수집 당일 자정(24:00) 즉시 영구 파기</strong> (식별 정보와 무관하게 익명 UUID로 안전히 임시 관리됩니다)
            </div>
          </div>
        </label>

        {/* 선택동의 */}
        <label className="terms-item select-item">
          <input 
            type="checkbox" 
            checked={agreePush} 
            onChange={(e) => setAgreePush(e.target.checked)}
            className="terms-checkbox"
          />
          <div className="terms-content">
            <div className="terms-title-row">
              <span className="badge-optional">선택</span>
              <span className="terms-label">오늘의 행운 푸시 알림 수신 동의</span>
            </div>
            <p className="terms-detail">
              매일 오전 9시, 행운의 직장 소통 팁 및 관계 꿀팁 가이드 혜택을 드립니다.
            </p>
          </div>
        </label>
      </div>

      {/* 엄지손가락 터치가 편리한 하단 썸존 배치 */}
      <div className="thumb-zone-action">
        <button 
          className={`btn btn-primary start-btn ${!agreePrivacy ? 'disabled' : ''}`} 
          onClick={handleStart}
          disabled={!agreePrivacy}
        >
          마인드미러 시작하기
          <ChevronRight size={20} style={{ marginLeft: '4px' }} />
        </button>
      </div>

      <style jsx>{`
        .onboarding-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .header-section {
          text-align: center;
          margin-top: 20px;
          margin-bottom: 24px;
        }
        .title-text {
          margin-top: 16px;
          font-size: 26px;
          line-height: 1.35;
          letter-spacing: -0.5px;
        }
        .highlight {
          color: hsl(var(--primary));
        }
        .desc-text {
          font-size: 15px;
          margin-top: 12px;
          padding: 0 10px;
          line-height: 1.5;
        }
        .terms-card {
          margin-top: auto;
          margin-bottom: 20px;
          padding: 18px;
        }
        .terms-header {
          font-size: 15px;
          color: hsl(var(--text-dark));
          margin-bottom: 14px;
          border-bottom: 1px solid hsl(210, 16%, 93%);
          padding-bottom: 8px;
        }
        .terms-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 16px;
          user-select: none;
        }
        .select-item {
          margin-bottom: 0;
          border-top: 1px dashed hsl(210, 16%, 93%);
          padding-top: 14px;
        }
        .terms-checkbox {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          accent-color: hsl(var(--primary));
          cursor: pointer;
        }
        .terms-content {
          flex: 1;
        }
        .terms-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .badge-required {
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .badge-optional {
          background-color: hsl(210, 16%, 93%);
          color: hsl(var(--text-muted));
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .terms-label {
          font-size: 14px;
          font-weight: 600;
          color: hsl(var(--text-dark));
        }
        .terms-detail {
          font-size: 12px;
          color: hsl(var(--text-muted));
          line-height: 1.5;
        }
        .start-btn {
          width: 100%;
        }
        .start-btn.disabled {
          background-color: hsl(210, 16%, 85%);
          color: hsl(var(--text-muted));
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
