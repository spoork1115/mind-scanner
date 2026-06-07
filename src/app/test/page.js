'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import Mascot from '@/components/Mascot';

export default function TestPage() {
  const router = useRouter();

  // 사용자 프로필 데이터 확인 및 상태 보관
  const [profile, setProfile] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' or 'B' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('office_universe_profile');
    if (!savedProfile) {
      alert('프로필 정보를 입력해 주세요!');
      router.push('/profile');
      return;
    }
    setProfile(JSON.parse(savedProfile));
  }, [router]);

  const currentQuestion = questions[currentIdx];

  const handleSelect = async (optionType) => {
    // 1. 답변 기록
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionType // 'A' or 'B'
    };
    setAnswers(updatedAnswers);

    // 2. 다음 단계 처리
    if (currentIdx < questions.length - 1) {
      // 다음 문항으로 이동
      setCurrentIdx(currentIdx + 1);
    } else {
      // 마지막 문항 완료 -> 제출 프로세스
      setIsSubmitting(true);
      
      try {
        const response = await fetch('/api/test/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profile,
            answers: updatedAnswers
          })
        });

        const result = await response.json();
        
        if (result.success) {
          // 로컬스토리지에 결과 ID 보관 및 게이미피케이션 포인트 적립
          localStorage.setItem('office_universe_last_result_id', result.participantId);
          localStorage.setItem('office_universe_last_result', JSON.stringify(result));
          
          // 출석 및 참여 포인트 적립 (+100 포인트)
          const currentPoints = parseInt(localStorage.getItem('office_universe_points') || '0');
          localStorage.setItem('office_universe_points', (currentPoints + 100).toString());

          // 획득 배지 처리
          let badges = JSON.parse(localStorage.getItem('office_universe_badges') || '[]');
          
          // 첫 검사 완료 배지 추가
          if (!badges.includes('first_test')) {
            badges.push('first_test');
          }
          
          // 번아웃 위험군일 때 긍정극복 배지 추가 가능성, 혹은 일반 배지 지급
          if (result.burnout.state === 'safe' && !badges.includes('positivity')) {
            badges.push('positivity');
          }
          localStorage.setItem('office_universe_badges', JSON.stringify(badges));

          // Vercel SPA 배포 특성상, 결과 페이지로 라우팅
          // 딜레이를 2초 정도 줘서 AI 분석 로딩 화면을 충분히 보여줍니다.
          setTimeout(() => {
            router.push(`/result?id=${result.participantId}`);
          }, 2200);
        } else {
          alert('결과 제출 중 오류가 발생했습니다.');
          setIsSubmitting(false);
        }

      } catch (err) {
        console.error('제출 중 네트워킹 에러:', err);
        alert('서버와 통신할 수 없습니다.');
        setIsSubmitting(false);
      }
    }
  };

  // 이전 질문으로 돌아가기 (UX 배려)
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      router.push('/profile');
    }
  };

  // 프로그레스 바 계산 (%)
  const progressPercent = Math.round(((currentIdx) / questions.length) * 100);

  if (!profile) return null;

  // AI 분석 로딩 스크린 (Progressive Disclosure & Skeleton screen 효과 연출)
  if (isSubmitting) {
    return (
      <div className="loading-screen fade-in">
        <div className="loading-content">
          <Mascot emotion="think" size={130} />
          <h2 className="loading-title">AI 캐릭터가 생존 유형 분석 중...</h2>
          <p className="loading-subtitle">사내 {profile.role} 역학과 오늘의 감정 흐름을 행성 궤도에 매핑하고 있습니다.</p>
          
          {/* 스켈레톤 디자인 모사 카드 */}
          <div className="skeleton-card card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
          </div>
        </div>
        <style jsx>{`
          .loading-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 24px;
            background-color: hsl(34, 100%, 97%);
          }
          .loading-content {
            text-align: center;
            width: 100%;
          }
          .loading-title {
            margin-top: 24px;
            font-size: 20px;
            font-weight: 800;
            color: hsl(var(--text-dark));
          }
          .loading-subtitle {
            font-size: 14px;
            color: hsl(var(--text-muted));
            margin-top: 8px;
            margin-bottom: 30px;
          }
          .skeleton-card {
            background-color: #fff;
            padding: 20px;
            border-radius: var(--radius-md);
            margin-top: 20px;
            box-shadow: var(--shadow-sm);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="test-container fade-in">
      {/* 상단 네비바 */}
      <div className="test-header">
        <button className="back-arrow-btn" onClick={handlePrev} aria-label="이전 질문으로">
          <ChevronLeft size={24} />
        </button>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="question-counter">{currentIdx + 1} / {questions.length}</span>
      </div>

      {/* 중앙 질문 카드 */}
      <div className="question-section">
        <span className="question-badge">Q. {currentIdx + 1}</span>
        <h2 className="question-text">{currentQuestion.question}</h2>
      </div>

      {/* 선택지 목록 (Thumb zone - 화면 하단부 배치) */}
      <div className="options-section">
        <button 
          className="option-btn card fade-in" 
          onClick={() => handleSelect('A')}
        >
          <span className="option-letter">A</span>
          <span className="option-text">{currentQuestion.options[0].text}</span>
        </button>
        
        <button 
          className="option-btn card fade-in" 
          onClick={() => handleSelect('B')}
        >
          <span className="option-letter">B</span>
          <span className="option-text">{currentQuestion.options[1].text}</span>
        </button>
      </div>

      <style jsx>{`
        .test-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }
        .test-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          margin-bottom: 24px;
        }
        .back-arrow-btn {
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
        .progress-bar-container {
          flex: 1;
          height: 8px;
          background-color: hsl(210, 16%, 88%);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: hsl(var(--primary));
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .question-counter {
          font-size: 13px;
          font-weight: 700;
          color: hsl(var(--text-muted));
          width: 45px;
          text-align: right;
        }
        .question-section {
          margin-top: 20px;
          margin-bottom: auto;
          padding: 10px;
        }
        .question-badge {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 13px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .question-text {
          font-size: 22px;
          line-height: 1.4;
          font-weight: 700;
          color: hsl(var(--text-dark));
          letter-spacing: -0.3px;
        }
        .options-section {
          margin-top: auto;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .option-btn {
          text-align: left;
          width: 100%;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: #fff;
          border: 2px solid transparent;
          cursor: pointer;
          margin-bottom: 0;
        }
        .option-btn:hover {
          border-color: hsl(var(--primary-light));
        }
        .option-btn:active {
          transform: scale(0.98);
          background-color: hsl(var(--primary-light));
        }
        .option-letter {
          font-family: 'Outfit', sans-serif;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: hsl(210, 16%, 93%);
          color: hsl(var(--text-muted));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
        }
        .option-btn:active .option-letter {
          background-color: hsl(var(--primary));
          color: #fff;
        }
        .option-text {
          font-size: 15px;
          line-height: 1.45;
          color: hsl(var(--text-dark));
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
