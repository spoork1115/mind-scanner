'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { ChevronLeft } from 'lucide-react';
import Mascot from '@/components/Mascot';

// 배열에서 지정된 개수만큼 랜덤하게 셔플 추출하는 헬퍼 함수
function getRandomSubarray(arr, size) {
  let shuffled = arr.slice(0);
  let i = arr.length;
  let temp, index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

export default function TestPage() {
  const router = useRouter();

  // 사용자 프로필 데이터 확인 및 상태 보관
  const [profile, setProfile] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' or 'B' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 프로필 검증 및 로드
  useEffect(() => {
    const savedProfile = localStorage.getItem('office_universe_profile');
    if (!savedProfile) {
      alert('프로필 정보를 입력해 주세요!');
      router.push('/profile');
      return;
    }
    setProfile(JSON.parse(savedProfile));
  }, [router]);

  // 2. 질문 풀 28개 중 각 카테고리별 3개씩 무작위 추출하여 12개 질문지 세팅
  useEffect(() => {
    if (questions.length === 0) return;

    // 카테고리별 필터링
    const eiPool = questions.filter(q => q.type === 'EI');
    const nsPool = questions.filter(q => q.type === 'NS');
    const tfPool = questions.filter(q => q.type === 'TF');
    const pjPool = questions.filter(q => q.type === 'PJ');

    // 무작위로 3문항씩 샘플링
    const sampledEi = getRandomSubarray(eiPool, 3);
    const sampledNs = getRandomSubarray(nsPool, 3);
    const sampledTf = getRandomSubarray(tfPool, 3);
    const sampledPj = getRandomSubarray(pjPool, 3);

    // 전체 결합 후 한번 더 무작위 셔플링
    const testSet = [...sampledEi, ...sampledNs, ...sampledTf, ...sampledPj];
    const shuffledTestSet = getRandomSubarray(testSet, testSet.length);

    setSelectedQuestions(shuffledTestSet);
  }, []);

  const currentQuestion = selectedQuestions[currentIdx];

  const handleSelect = async (optionType) => {
    if (!currentQuestion) return;

    // 1. 답변 기록
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionType // 'A' or 'B'
    };
    setAnswers(updatedAnswers);

    // 2. 다음 단계 처리
    if (currentIdx < selectedQuestions.length - 1) {
      // 다음 문항으로 이동
      setCurrentIdx(currentIdx + 1);
    } else {
      // 마지막 문항 완료 -> 제출 프로세스
      setIsSubmitting(true);
      
      try {
        const hostId = localStorage.getItem('office_universe_guest_host_id');
        const response = await fetch('/api/test/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profile, // 내부의 tarotId 포함
            answers: updatedAnswers,
            hostId: hostId || undefined
          })
        });

        const result = await response.json();
        
        if (result.success) {
          // 로컬스토리지에 결과 ID 보관 및 게이미피케이션 포인트 적립
          localStorage.setItem('office_universe_last_result_id', result.participantId);
          localStorage.setItem('office_universe_last_result', JSON.stringify(result));

          // 관계 데이터를 localStorage에 저장 (서버 DB 장애 시에도 관계망 표시 보장)
          if (result.relation) {
            const existingRelations = JSON.parse(localStorage.getItem('office_universe_relations') || '[]');
            // 중복 방지
            if (!existingRelations.some(r => r.id === result.relation.id)) {
              existingRelations.push(result.relation);
            }
            localStorage.setItem('office_universe_relations', JSON.stringify(existingRelations));
          }
          
          // 출석 및 참여 포인트 적립 (+100 포인트)
          const currentPoints = parseInt(localStorage.getItem('office_universe_points') || '0');
          localStorage.setItem('office_universe_points', (currentPoints + 100).toString());

          // 획득 배지 처리
          let badges = JSON.parse(localStorage.getItem('office_universe_badges') || '[]');
          if (!badges.includes('first_test')) {
            badges.push('first_test');
          }
          if (result.burnout.state === 'safe' && !badges.includes('positivity')) {
            badges.push('positivity');
          }
          localStorage.setItem('office_universe_badges', JSON.stringify(badges));

          // 딜레이를 줘서 AI 분석 로딩 화면 노출
          setTimeout(() => {
            router.push(`/result?id=${result.participantId}`);
          }, 2000);
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

  if (!profile || selectedQuestions.length === 0) return null;

  // 프로그레스 바 계산 (%)
  const progressPercent = Math.round((currentIdx / selectedQuestions.length) * 100);

  // AI 분석 로딩 스크린
  if (isSubmitting) {
    return (
      <div className="loading-screen fade-in">
        <div className="loading-content">
          <Mascot emotion="think" size={130} />
          <h2 className="loading-title">마인드미러 분석 중...</h2>
          <p className="loading-subtitle">사내 {profile.role} 역학과 상대방과의 성격 케미를 비춰보고 있습니다.</p>
          
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
            height: 100vh;
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
        <span className="question-counter">{currentIdx + 1} / {selectedQuestions.length}</span>
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
          height: auto;
          min-height: 100vh;
          padding-bottom: 30px;
          justify-content: flex-start;
          gap: 16px;
        }
        .test-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          margin-bottom: 12px;
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
          margin-top: 10px;
          margin-bottom: 16px;
          padding: 10px;
        }
        .question-badge {
          display: inline-block;
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 13px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .question-text {
          font-size: 21px;
          line-height: 1.45;
          font-weight: 700;
          color: hsl(var(--text-dark));
          letter-spacing: -0.3px;
        }
        .options-section {
          margin-top: 0;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
