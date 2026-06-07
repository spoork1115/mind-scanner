'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { ArrowLeft, ChevronRight, Calendar, Briefcase, Smile, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  // 분할 날짜 상태
  const [birthYear, setBirthYear] = useState('1998');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');

  // 기타 프로필 입력 상태
  const [role, setRole] = useState('사원/연구원');
  const [gender, setGender] = useState('N'); // M, F, N (선택안함/비공개)
  const [mood, setMood] = useState('smile'); // smile, energetic, think, sad, wink

  // 자동 연산 상태
  const [zodiac, setZodiac] = useState('호랑이');
  const [age, setAge] = useState(29);

  // 게스트/호스트 정보
  const [hostId, setHostId] = useState(null);
  const [hostName, setHostName] = useState('');

  // 타로 카드 상태
  const [tarotId, setTarotId] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);

  // 띠 목록
  const zodiacs = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  
  // 직책 리스트
  const roles = [
    '인턴/주니어', 
    '사원/연구원', 
    '대리/선임', 
    '과장/차장/책임', 
    '부장/수석', 
    '임원/대표'
  ];

  // 기분 리스트 정의
  const moods = [
    { id: 'energetic', emoji: '😄', label: '열정 충만' },
    { id: 'smile', emoji: '🙂', label: '평온/무난' },
    { id: 'think', emoji: '🤔', label: '생각 많음' },
    { id: 'wink', emoji: '😉', label: '유쾌 발랄' },
    { id: 'sad', emoji: '😩', label: '방전/피곤' },
  ];

  // 타로 카드 목록 정의 (오늘 나의 운명 카드)
  const tarotCards = [
    { 
      id: 'fool', 
      name: 'The Fool (바보)', 
      emoji: '🃏', 
      desc: '새로운 도전과 자유. 오늘 예측 불허의 상황도 긍정적 기회가 됩니다.' 
    },
    { 
      id: 'magician', 
      name: 'The Magician (마법사)', 
      emoji: '🧙', 
      desc: '무한한 능력과 기획력. 준비해 온 창조적 능력을 발휘할 최고의 날!' 
    },
    { 
      id: 'empress', 
      name: 'The Empress (여황제)', 
      emoji: '👑', 
      desc: '풍요와 원만한 협업. 동료들과의 조화를 통해 든든한 결실을 얻습니다.' 
    },
    { 
      id: 'hermit', 
      name: 'The Hermit (은둔자)', 
      emoji: '🕯️', 
      desc: '고독과 지혜로운 성찰. 시끄러운 메신저를 끄고 딥워크에 집중하세요.' 
    }
  ];

  // 년, 월, 일 배열 생성
  const years = Array.from({ length: 66 }, (_, i) => (1950 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (1 + i).toString());
  const days = Array.from({ length: 31 }, (_, i) => (1 + i).toString());

  // URL에서 hostId 쿼리스트링 및 로컬 정보 파악
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hId = params.get('hostId');
    if (hId) {
      setHostId(hId);
      localStorage.setItem('office_universe_guest_host_id', hId);
      
      // 호스트 정보 조회
      fetch(`/api/user-info?id=${hId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setHostName(data.user.name);
          }
        })
        .catch(err => console.error('호스트 정보 조회 실패:', err));
    } else {
      localStorage.removeItem('office_universe_guest_host_id');
    }
  }, []);

  // 년/월/일 변경 시 띠와 나이 실시간 연산
  useEffect(() => {
    const year = parseInt(birthYear);
    if (isNaN(year)) return;

    // 1. 한국식 나이 계산
    const currentYear = new Date().getFullYear();
    const computedAge = currentYear - year + 1;
    setAge(computedAge);

    // 2. 띠 계산: (연도 - 4) % 12
    let zodiacIdx = (year - 4) % 12;
    if (zodiacIdx < 0) zodiacIdx += 12;
    setZodiac(zodiacs[zodiacIdx]);
  }, [birthYear, birthMonth, birthDay]);

  // 타로 카드 플립 처리
  const handleTarotClick = (cardId) => {
    setFlippedCardId(cardId);
    setTarotId(cardId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tarotId) {
      alert('오늘 당신의 운명을 비춰줄 타로 카드를 한 장 선택해 주세요!');
      return;
    }

    // YYYY-MM-DD 포맷 조합
    const formattedMonth = birthMonth.padStart(2, '0');
    const formattedDay = birthDay.padStart(2, '0');
    const birthDate = `${birthYear}-${formattedMonth}-${formattedDay}`;
    
    // 로컬 스토리지에 프로필 임시 저장 (이름은 제거되었으므로 서버 닉네임 작명 결과를 기대함)
    const profile = { 
      birthDate, 
      role, 
      age, 
      zodiac, 
      gender, 
      mood,
      tarotId
    };
    localStorage.setItem('office_universe_profile', JSON.stringify(profile));

    // 테스트 진행 페이지로 이동
    router.push('/test');
  };

  return (
    <div className="profile-container fade-in">
      {/* 헤더 네비게이션 */}
      <div className="top-nav">
        <button className="back-btn" onClick={() => router.push('/')} aria-label="이전 페이지로 이동">
          <ArrowLeft size={24} />
        </button>
        <span className="nav-title">
          {hostName ? `${hostName}님과의 마인드 매칭` : '프로필 및 운명 설정'}
        </span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* 마스코트 캐릭터 기분 반응 피드백 */}
      <div className="mascot-section">
        <Mascot emotion={mood} size={100} />
        <p className="mascot-bubble">
          {hostName ? (
            <span>안녕하세요! <strong>{hostName}</strong>님과 당신의 관계 거울을 비춰볼게요! 🔍</span>
          ) : (
            <>
              {mood === 'energetic' && '우와! 오늘 엄청 파이팅 넘치시네요! 🔥'}
              {mood === 'smile' && '오늘 하루도 평온하고 안전하게 흘러가길! 🍀'}
              {mood === 'think' && '머릿속이 복잡하신가요? 제가 정리해드릴게요. 🔍'}
              {mood === 'wink' && '오늘 혹시 재미있는 일이 있으신가요? 얘기해주세요! ✨'}
              {mood === 'sad' && '많이 지치셨군요.. 오늘 가이드로 위로해 드릴게요 ☕'}
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        
        {/* 생년월일 분할 선택 (년, 월, 일) */}
        <div className="form-group card">
          <label className="form-label">
            <Calendar size={16} className="inline-icon" /> 태어난 생년월일
          </label>
          <div className="birth-select-row">
            <select 
              value={birthYear} 
              onChange={(e) => setBirthYear(e.target.value)} 
              className="select-field flex-2"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>

            <select 
              value={birthMonth} 
              onChange={(e) => setBirthMonth(e.target.value)} 
              className="select-field flex-1"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>

            <select 
              value={birthDay} 
              onChange={(e) => setBirthDay(e.target.value)} 
              className="select-field flex-1"
            >
              {days.map(d => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>

          <div className="auto-info-row">
            <span className="info-tag">{age}세</span>
            <span className="info-tag primary-tag">{zodiac}띠</span>
          </div>
        </div>

        {/* 타로 카드 선택 영역 (인터랙티브 3D Flip) */}
        <div className="form-group card tarot-selection-group">
          <label className="form-label">
            <Sparkles size={16} className="inline-icon" /> 오늘의 운명을 이끌 타로 카드 선택
          </label>
          <p className="tarot-guide">마음에 드는 카드 한 장을 클릭하여 뒤집어주세요.</p>
          
          <div className="tarot-grid">
            {tarotCards.map((card) => {
              const isSelected = tarotId === card.id;
              const isFlipped = flippedCardId === card.id;
              
              return (
                <div 
                  key={card.id} 
                  className={`tarot-card-container ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleTarotClick(card.id)}
                >
                  <div className={`tarot-card-inner ${isFlipped ? 'flipped' : ''}`}>
                    {/* 카드 뒷면 */}
                    <div className="tarot-card-back">
                      <div className="tarot-back-pattern">🔮</div>
                      <span className="card-back-text">MIRROR</span>
                    </div>
                    {/* 카드 앞면 */}
                    <div className="tarot-card-front">
                      <span className="tarot-front-emoji">{card.emoji}</span>
                      <h4 className="tarot-front-name">{card.name}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 선택한 타로 카드 해석 한줄 노출 */}
          {tarotId && (
            <div className="tarot-desc-box fade-in">
              <span className="tarot-badge">선택 카드: {tarotCards.find(c => c.id === tarotId).name}</span>
              <p className="tarot-desc-text">
                "{tarotCards.find(c => c.id === tarotId).desc}"
              </p>
            </div>
          )}
        </div>

        {/* 직책 선택 */}
        <div className="form-group card">
          <label className="form-label">
            <Briefcase size={16} className="inline-icon" /> 어떤 역할을 맡고 계신가요?
          </label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="select-field"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 성별 선택 */}
        <div className="form-group card">
          <label className="form-label">⚧️ 성별</label>
          <div className="gender-btn-group">
            {[
              { id: 'M', label: '남성' },
              { id: 'F', label: '여성' },
              { id: 'N', label: '선택안함' }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                className={`gender-btn ${gender === g.id ? 'active' : ''}`}
                onClick={() => setGender(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* 기분 선택 */}
        <div className="form-group card">
          <label className="form-label">
            <Smile size={16} className="inline-icon" /> 오늘의 리얼한 기분은?
          </label>
          <div className="mood-btn-group">
            {moods.map(m => (
              <button
                key={m.id}
                type="button"
                className={`mood-btn ${mood === m.id ? 'active' : ''}`}
                onClick={() => setMood(m.id)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="thumb-zone-action">
          <button type="submit" className="btn btn-primary submit-btn">
            {hostName ? `${hostName}님과의 거울 보기` : '테스트 시작하기'}
            <ChevronRight size={20} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </form>

      <style jsx>{`
        .profile-container {
          display: flex;
          flex-direction: column;
          height: auto;
          padding-bottom: 40px;
          font-family: 'Gowun Batang', serif;
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
        .mascot-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }
        .mascot-bubble {
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          font-size: 14px;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          text-align: center;
          margin-top: 8px;
          border: 1px solid rgba(255, 111, 60, 0.15);
          max-width: 85%;
          line-height: 1.5;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-group {
          margin-bottom: 8px;
          padding: 16px;
        }
        .form-label {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 8px;
        }
        .inline-icon {
          margin-right: 6px;
          color: hsl(var(--primary));
        }
        .birth-select-row {
          display: flex;
          gap: 8px;
        }
        .flex-2 {
          flex: 2;
        }
        .flex-1 {
          flex: 1;
        }
        .auto-info-row {
          display: flex;
          gap: 6px;
          margin-top: 10px;
          justify-content: flex-end;
        }
        .info-tag {
          background-color: hsl(210, 16%, 93%);
          color: hsl(var(--text-dark));
          font-size: 12.5px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid hsl(210, 16%, 88%);
        }
        .info-tag.primary-tag {
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          border-color: rgba(255, 111, 60, 0.2);
        }
        
        /* 타로 카드 뒤집기 스타일 */
        .tarot-selection-group {
          display: flex;
          flex-direction: column;
        }
        .tarot-guide {
          font-size: 12px;
          color: hsl(var(--text-muted));
          margin-bottom: 12px;
        }
        .tarot-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          perspective: 1000px;
        }
        .tarot-card-container {
          aspect-ratio: 2 / 3.2;
          cursor: pointer;
        }
        .tarot-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
        }
        .tarot-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .tarot-card-back, .tarot-card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 8px;
          border: 2px solid hsl(var(--primary));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .tarot-card-back {
          background-color: hsl(34, 100%, 97%);
          color: hsl(var(--primary));
        }
        .tarot-back-pattern {
          font-size: 22px;
          margin-bottom: 2px;
        }
        .card-back-text {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .tarot-card-front {
          background-color: #fff;
          color: hsl(var(--text-dark));
          transform: rotateY(180deg);
          border-color: #ffb89f;
          padding: 4px;
        }
        .tarot-card-container.selected .tarot-card-inner {
          box-shadow: 0 0 10px rgba(255, 111, 60, 0.5);
        }
        .tarot-card-container.selected .tarot-card-back,
        .tarot-card-container.selected .tarot-card-front {
          border-color: #ff6f3c;
          border-width: 2.5px;
        }
        .tarot-front-emoji {
          font-size: 24px;
        }
        .tarot-front-name {
          font-size: 9px;
          font-weight: 800;
          margin-top: 4px;
          line-height: 1.1;
        }
        .tarot-desc-box {
          background-color: hsl(34, 100%, 97%);
          border: 1px solid rgba(255, 111, 60, 0.2);
          border-radius: var(--radius-sm);
          padding: 12px;
          margin-top: 12px;
          text-align: center;
        }
        .tarot-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .tarot-desc-text {
          font-size: 12.5px;
          color: hsl(var(--text-dark));
          line-height: 1.45;
          font-weight: 500;
        }

        /* 공용 성별/기분 등 */
        .gender-btn-group {
          display: flex;
          gap: 8px;
        }
        .gender-btn {
          flex: 1;
          min-height: 40px;
          border-radius: var(--radius-sm);
          border: 2px solid hsl(210, 16%, 88%);
          background-color: #fff;
          font-size: 14px;
          font-family: 'Gowun Batang', serif;
          font-weight: 600;
          color: hsl(var(--text-dark));
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gender-btn.active {
          border-color: hsl(var(--primary));
          background-color: hsl(var(--primary-light));
          color: hsl(var(--primary));
        }
        .mood-btn-group {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }
        .mood-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          border-radius: var(--radius-sm);
          border: 2px solid hsl(210, 16%, 88%);
          background-color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 64px;
        }
        .mood-btn.active {
          border-color: hsl(var(--primary));
          background-color: hsl(var(--primary-light));
        }
        .mood-emoji {
          font-size: 22px;
          margin-bottom: 2px;
        }
        .mood-label {
          font-size: 9px;
          font-weight: 700;
          color: hsl(var(--text-muted));
        }
        .mood-btn.active .mood-label {
          color: hsl(var(--primary));
        }
        .submit-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
