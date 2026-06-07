'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  // 입력 필드 상태
  const [role, setRole] = useState('사원');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('N'); // M, F, N (선택안함/비공개)
  const [zodiac, setZodiac] = useState('쥐');
  const [mood, setMood] = useState('smile'); // smile, energetic, think, sad, wink

  // 기분 리스트 정의
  const moods = [
    { id: 'energetic', emoji: '😄', label: '열정 충만' },
    { id: 'smile', emoji: '🙂', label: '평온/무난' },
    { id: 'think', emoji: '🤔', label: '생각 많음' },
    { id: 'wink', emoji: '😉', label: '유쾌 발랄' },
    { id: 'sad', emoji: '😩', label: '방전/피곤' },
  ];

  // 띠 리스트
  const zodiacs = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  
  // 직책 리스트
  const roles = ['인턴/주니어', '사원/연구원', '대리/선임', '과장/차장/책임', '부장/수석', '임원/대표'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 로컬 스토리지에 프로필 임시 저장
    const profile = { role, age, gender, zodiac, mood };
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
        <span className="nav-title">프로필 작성</span>
        <div style={{ width: '24px' }}></div> {/* 균형 맞추기용 빈박스 */}
      </div>

      {/* 마스코트 캐릭터 기분 반응 피드백 */}
      <div className="mascot-section">
        <Mascot emotion={mood} size={110} />
        <p className="mascot-bubble">
          {mood === 'energetic' && '우와! 오늘 엄청 파이팅 넘치시네요! 🔥'}
          {mood === 'smile' && '오늘 하루도 평온하고 안전하게 흘러가길! 🍀'}
          {mood === 'think' && '머릿속이 복잡하신가요? 제가 정리해드릴게요. 🔍'}
          {mood === 'wink' && '오늘 혹시 재미있는 일이 있으신가요? 얘기해주세요! ✨'}
          {mood === 'sad' && '많이 지치셨군요.. 오늘 가이드로 위로해 드릴게요 ☕'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group card">
          <label className="form-label">💼 어떤 역할을 맡고 계신가요?</label>
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

        <div className="form-row-group">
          <div className="form-group card flex-1">
            <label className="form-label">🎂 나이</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || ''))} 
              className="input-field"
              min="1"
              max="100"
            />
          </div>

          <div className="form-group card flex-1">
            <label className="form-label">✨ 태어난 띠</label>
            <select 
              value={zodiac} 
              onChange={(e) => setZodiac(e.target.value)} 
              className="select-field"
            >
              {zodiacs.map(z => (
                <option key={z} value={z}>{z}띠</option>
              ))}
            </select>
          </div>
        </div>

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

        <div className="form-group card">
          <label className="form-label">💭 오늘의 리얼한 기분은?</label>
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

        {/* 하단 썸존 배치 */}
        <div className="thumb-zone-action">
          <button type="submit" className="btn btn-primary submit-btn">
            테스트 시작하기
            <ChevronRight size={20} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </form>

      <style jsx>{`
        .profile-container {
          display: flex;
          flex-direction: column;
          height: 100%;
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
        .mascot-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
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
          position: relative;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-row-group {
          display: flex;
          gap: 12px;
        }
        .flex-1 {
          flex: 1;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 10px;
        }
        .gender-btn-group {
          display: flex;
          gap: 8px;
        }
        .gender-btn {
          flex: 1;
          min-height: 44px;
          border-radius: var(--radius-sm);
          border: 2px solid hsl(210, 16%, 88%);
          background-color: #fff;
          font-size: 14px;
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
          min-height: 70px;
        }
        .mood-btn.active {
          border-color: hsl(var(--primary));
          background-color: hsl(var(--primary-light));
        }
        .mood-emoji {
          font-size: 24px;
          margin-bottom: 4px;
        }
        .mood-label {
          font-size: 10px;
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
