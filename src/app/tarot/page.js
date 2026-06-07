'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { ChevronRight, ArrowLeft, RotateCw, Sparkles, HelpCircle } from 'lucide-react';

const TAROT_POOL = [
  { id: 'fool', name: 'The Fool (바보)', emoji: '🃏', img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
  { id: 'magician', name: 'The Magician (마법사)', emoji: '🧙', img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
  { id: 'empress', name: 'The Empress (여황제)', emoji: '👑', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/RWS_Tarot_03_Empress.jpg' },
  { id: 'hermit', name: 'The Hermit (은둔자)', emoji: '🕯️', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
  { id: 'chariot', name: 'The Chariot (전차)', emoji: '🛒', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
  { id: 'wheel', name: 'Wheel of Fortune (수레바퀴)', emoji: '🎡', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' }
];

export default function TarotTestPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  // 진행 단계 상태 (1: 질문정하기, 2: 배열법선택, 3: 카드 고르기, 4: 제출 로딩)
  const [step, setStep] = useState(1);
  
  // 1단계 상태: 질문 정하기
  const [question, setQuestion] = useState('이번 프로젝트의 협업 동료와 다음 달에 관계가 더 좋아질까요?');
  const [customQuestion, setCustomQuestion] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const questionTemplates = [
    '이번 프로젝트의 협업 동료와 다음 달에 관계가 더 좋아질까요?',
    '오늘 갑작스러운 오피스 갈등 상황을 슬기롭게 모면하는 꿀팁은?',
    '이번 분기 나의 업무 만족도와 직장 내 승진/인정운은 어떨까요?',
    '오늘 나에게 업무 피드백을 해줄 팀장님과의 적절한 멘탈 대비책은?'
  ];

  // 2단계 상태: 스프레드(배열법) 선택
  const [spreadMode, setSpreadMode] = useState('one'); // 'one' (1장) or 'three' (3장)

  // 3단계 상태: 셔플 및 고르기
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);

  useEffect(() => {
    const savedProfile = localStorage.getItem('office_universe_profile');
    if (!savedProfile) {
      alert('프로필 정보를 먼저 입력해 주세요!');
      router.push('/profile');
      return;
    }
    setProfile(JSON.parse(savedProfile));
    
    // 타로 덱 생성 (풀 카드를 3중 복제하여 펼쳐놓음)
    const deck = [...TAROT_POOL, ...TAROT_POOL, ...TAROT_POOL];
    setShuffledCards(deck);
  }, [router]);

  // 셔플 로직
  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      // 랜덤 셔플링
      const newDeck = [...shuffledCards].sort(() => Math.random() - 0.5);
      setShuffledCards(newDeck);
      setIsShuffling(false);
      setShuffleCount(prev => prev + 1);
    }, 1000);
  };

  // 카드 선택 핸들러
  const handleSelectCard = (card, index) => {
    if (isShuffling) return;
    const limit = spreadMode === 'one' ? 1 : 3;
    if (selectedCards.length >= limit) return;
    
    // 중복 방지
    if (selectedCards.find(c => c.deckIndex === index)) return;

    const newSelection = [...selectedCards, { ...card, deckIndex: index }];
    setSelectedCards(newSelection);
  };

  // 최종 리딩 결과 제출
  const handleSubmitTarot = async () => {
    setStep(4); // 로딩 화면 전환

    const finalQuestion = isCustom ? customQuestion : question;
    const selectedMode = spreadMode; // 'one' or 'three'
    const cardsCsv = selectedCards.map(c => c.id).join(',');

    const updatedProfile = {
      ...profile,
      tarotId: selectedCards[0].id, // 대표 카드
      tarotCards: cardsCsv, // 3장일 시 전체 카드 리스트
      tarotQuestion: finalQuestion,
      tarotSpread: selectedMode
    };

    // 로컬 스토리지 업데이트
    localStorage.setItem('office_universe_profile', JSON.stringify(updatedProfile));

    try {
      const hostId = localStorage.getItem('office_universe_guest_host_id');
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: updatedProfile,
          answers: {}, // 타로 모드는 설문 답안 비움
          hostId: hostId || undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('office_universe_last_result_id', result.participantId);
        localStorage.setItem('office_universe_last_result', JSON.stringify(result));
        
        // 딜레이 후 결과 이동
        setTimeout(() => {
          router.push(`/result?id=${result.participantId}`);
        }, 2000);
      } else {
        alert('타로 결과 제출 중 오류가 발생했습니다.');
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 통신 오류가 발생했습니다.');
      setStep(3);
    }
  };

  if (!profile) return null;

  return (
    <div className="tarot-test-container fade-in">
      {/* 상단 네비 바 */}
      <div className="top-nav">
        {step > 1 && step < 4 ? (
          <button className="back-btn" onClick={() => setStep(step - 1)} aria-label="이전 단계로">
            <ArrowLeft size={24} />
          </button>
        ) : (
          <button className="back-btn" onClick={() => router.push('/profile')} aria-label="프로필로">
            <ArrowLeft size={24} />
          </button>
        )}
        <span className="nav-title">운명 타로 거울 ({step}/3 단계)</span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* 1단계: 명확한 질문 정하기 */}
      {step === 1 && (
        <div className="step-content fade-in">
          <div className="mascot-bubble-section">
            <Mascot emotion="think" size={90} />
            <p className="mascot-bubble">오늘 나의 직장 생활이나 관계 속에서 어떤 운명을 비춰보고 싶으신가요?</p>
          </div>

          <div className="form-group card">
            <label className="section-label">📋 고민 중인 질문 유형 선택</label>
            <div className="templates-list">
              {questionTemplates.map((t, idx) => (
                <button 
                  key={idx}
                  type="button"
                  className={`template-btn ${question === t && !isCustom ? 'active' : ''}`}
                  onClick={() => { setQuestion(t); setIsCustom(false); }}
                >
                  {t}
                </button>
              ))}
              <button 
                type="button" 
                className={`template-btn ${isCustom ? 'active' : ''}`}
                onClick={() => setIsCustom(true)}
              >
                ✏️ 질문 직접 작성하기...
              </button>
            </div>

            {isCustom && (
              <textarea 
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="구체적이고 주도적인 질문을 작성해 주세요. (예: 오늘 팀장님께 결재를 매끄럽게 받으려면 어떤 태도를 취해야 할까요?)"
                className="custom-question-input"
                maxLength={100}
              />
            )}
          </div>

          <div className="thumb-zone-action">
            <button 
              className="btn btn-primary next-btn" 
              onClick={() => {
                if (isCustom && !customQuestion.trim()) {
                  alert('직접 질문을 입력해 주세요!');
                  return;
                }
                setStep(2);
              }}
            >
              배열법 선택하러 가기
              <ChevronRight size={20} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      )}

      {/* 2단계: 배열법(스프레드) 선택하기 */}
      {step === 2 && (
        <div className="step-content fade-in">
          <div className="mascot-bubble-section">
            <Mascot emotion="smile" size={90} />
            <p className="mascot-bubble">고민의 성격에 따라 카드를 정하는 형식을 골라주세요.</p>
          </div>

          <div className="spread-selection-grid">
            <button 
              className={`spread-card card ${spreadMode === 'one' ? 'active' : ''}`}
              onClick={() => setSpreadMode('one')}
            >
              <span className="spread-icon">🃏</span>
              <span className="spread-title">원 카드 (1장) 배열</span>
              <span className="spread-desc">오늘의 흐름이나 질문에 대한 명확하고 단호한 직관의 답변을 원할 때</span>
            </button>

            <button 
              className={`spread-card card ${spreadMode === 'three' ? 'active' : ''}`}
              onClick={() => setSpreadMode('three')}
            >
              <span className="spread-icon">🃏🃏🃏</span>
              <span className="spread-title">쓰리 카드 (3장) 배열</span>
              <span className="spread-desc">질문에 대한 [과거 - 현재 - 미래] 흐름과 인과적 스토리 리딩을 분석할 때</span>
            </button>
          </div>

          <div className="thumb-zone-action">
            <button 
              className="btn btn-primary next-btn" 
              onClick={() => setStep(3)}
            >
              카드 뽑으러 가기
              <ChevronRight size={20} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      )}

      {/* 3단계: 셔플 및 카드 고르기 */}
      {step === 3 && (
        <div className="step-content fade-in">
          <div className="tarot-board card">
            <div className="board-header">
              <span className="board-title">🔮 집중해서 카드를 선택하세요</span>
              <span className="selection-counter">
                {selectedCards.length} / {spreadMode === 'one' ? 1 : 3} 장 선택됨
              </span>
            </div>

            {/* 상단 랙: 내가 뽑은 카드 슬롯 */}
            <div className="slots-row">
              {Array.from({ length: spreadMode === 'one' ? 1 : 3 }).map((_, idx) => {
                const card = selectedCards[idx];
                return (
                  <div key={idx} className="selected-slot card">
                    {card ? (
                      <div className="slot-tarot-item fade-in">
                        <span className="slot-emoji">{card.emoji}</span>
                        <span className="slot-name">
                          {spreadMode === 'three' && (idx === 0 ? '[과거] ' : idx === 1 ? '[현재] ' : '[미래] ')}
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      <span className="empty-slot-text">
                        {spreadMode === 'three' && (idx === 0 ? '과거 카드' : idx === 1 ? '현재 카드' : '미래 카드')}
                        {spreadMode === 'one' && '운명의 카드'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 카드 셔플 툴바 */}
            <div className="shuffle-toolbar">
              <button 
                className={`btn btn-secondary shuffle-btn ${isShuffling ? 'spinning' : ''}`}
                onClick={handleShuffle}
                disabled={isShuffling}
              >
                <RotateCw size={18} style={{ marginRight: '6px' }} />
                {shuffleCount > 0 ? '다시 섞기' : '카드 정성껏 섞기'}
              </button>
            </div>

            {/* 부채꼴로 펼쳐진 타로 덱 */}
            <div className={`tarot-deck-scroll ${isShuffling ? 'shuffling-motion' : ''}`}>
              {shuffledCards.map((card, index) => {
                const isSelected = selectedCards.find(c => c.deckIndex === index);
                return (
                  <button
                    key={index}
                    type="button"
                    className={`deck-tarot-card ${isSelected ? 'selected-from-deck' : ''}`}
                    onClick={() => handleSelectCard(card, index)}
                    disabled={isSelected || isShuffling}
                  >
                    <div className="card-back-pattern">🔮</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="thumb-zone-action">
            <button 
              className={`btn btn-primary submit-tarot-btn ${selectedCards.length < (spreadMode === 'one' ? 1 : 3) ? 'disabled' : ''}`} 
              onClick={handleSubmitTarot}
              disabled={selectedCards.length < (spreadMode === 'one' ? 1 : 3)}
            >
              타로 거울 해독 완료
              <ChevronRight size={20} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      )}

      {/* 4단계: 제출 로딩 애니메이션 */}
      {step === 4 && (
        <div className="loading-screen fade-in">
          <div className="loading-content">
            <Mascot emotion="wink" size={130} />
            <h2 className="loading-title">타로 궤도 리딩 중...</h2>
            <p className="loading-subtitle">당신의 생년월일 {profile.zodiac}띠 기운과 뽑아든 타로 궤도를 연결하고 있습니다.</p>
            
            <div className="skeleton-card card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tarot-test-container {
          display: flex;
          flex-direction: column;
          height: auto;
          min-height: 100vh;
          font-family: 'Jua', sans-serif;
          padding-bottom: 120px;
        }
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          margin-bottom: 12px;
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
        .mascot-bubble-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }
        .mascot-bubble {
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 14.5px;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          text-align: center;
          margin-top: 8px;
          border: 1px solid rgba(255, 111, 60, 0.15);
          max-width: 85%;
          line-height: 1.5;
        }

        /* 1단계 질문선택 */
        .templates-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
          margin-bottom: 110px;
        }
        .template-btn {
          width: 100%;
          text-align: left;
          padding: 12px 14px;
          background-color: hsl(210, 16%, 97%);
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Jua', sans-serif;
          color: hsl(var(--text-dark));
          line-height: 1.45;
        }
        .template-btn.active {
          background-color: hsl(var(--primary-light));
          border-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }
        .custom-question-input {
          width: 100%;
          height: 70px;
          padding: 10px;
          border-radius: var(--radius-sm);
          border: 2px solid hsl(var(--primary));
          background-color: #fff;
          font-family: 'Jua', sans-serif;
          font-size: 13px;
          margin-top: 10px;
          outline: none;
          resize: none;
        }

        /* 2단계 스프레드선택 */
        .spread-selection-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 110px;
        }
        .spread-card {
          display: flex;
          flex-direction: column;
          padding: 18px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
          background-color: #fff;
          margin-bottom: 0;
        }
        .spread-card:hover, .spread-card.active {
          border-color: hsl(var(--primary));
        }
        .spread-icon {
          font-size: 26px;
          margin-bottom: 4px;
        }
        .spread-title {
          font-size: 16px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .spread-desc {
          font-size: 12px;
          color: hsl(var(--text-muted));
          margin-top: 4px;
          line-height: 1.4;
        }

        /* 3단계 타로 보드 */
        .tarot-board {
          padding: 16px;
          display: flex;
          flex-direction: column;
        }
        .board-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 800;
          color: hsl(var(--text-dark));
          margin-bottom: 12px;
        }
        .selection-counter {
          color: hsl(var(--primary));
        }
        .slots-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 16px;
        }
        .selected-slot {
          flex: 1;
          min-height: 72px;
          border: 2px dashed hsl(210, 16%, 85%);
          background-color: hsl(210, 16%, 98%);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0;
          padding: 6px;
        }
        .empty-slot-text {
          font-size: 11px;
          color: hsl(var(--text-muted));
          text-align: center;
        }
        .slot-tarot-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .slot-emoji {
          font-size: 24px;
        }
        .slot-name {
          font-size: 9px;
          font-weight: 700;
          margin-top: 2px;
        }
        .shuffle-toolbar {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
        }
        .shuffle-btn {
          min-height: 40px;
          font-size: 13px;
          border-radius: 20px;
          padding: 6px 16px;
        }
        .shuffle-btn.spinning svg {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* 부채꼴 카드 스크롤 */
        .tarot-deck-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 10px 0;
          scrollbar-width: none;
        }
        .tarot-deck-scroll::-webkit-scrollbar {
          display: none;
        }
        .deck-tarot-card {
          width: 50px;
          height: 80px;
          border: 2px solid hsl(var(--primary));
          border-radius: 6px;
          background-color: hsl(34, 100%, 97%);
          color: hsl(var(--primary));
          flex-shrink: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, background-color 0.2s;
        }
        .deck-tarot-card:hover {
          transform: translateY(-8px);
        }
        .deck-tarot-card.selected-from-deck {
          opacity: 0.2;
          cursor: not-allowed;
          transform: scale(0.9);
        }
        .card-back-pattern {
          font-size: 20px;
        }

        /* 셔플링 모션 효과 */
        .shuffling-motion .deck-tarot-card {
          animation: shuffle-shake 0.3s infinite alternate;
        }
        @keyframes shuffle-shake {
          from { transform: rotate(-3deg) translateY(2px); }
          to { transform: rotate(3deg) translateY(-2px); }
        }

        /* 제출 로딩 화면 */
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
          font-size: 22px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .loading-subtitle {
          font-size: 14.5px;
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
        .submit-tarot-btn.disabled {
          background-color: hsl(210, 16%, 85%);
          color: hsl(var(--text-muted));
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
