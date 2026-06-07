'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { 
  Share2, Link2, RotateCcw, Heart, AlertTriangle, 
  Coffee, Sparkles, Award, User, HelpCircle, 
  ChevronDown, ChevronUp, Network, Check
} from 'lucide-react';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');

  const [resultData, setResultData] = useState(null);
  const [relations, setRelations] = useState([]);
  const [copied, setCopied] = useState(false);
  
  // 아코디언/탭 컨트롤 상태
  const [showTheory, setShowTheory] = useState(false);
  const [selectedGuestRelation, setSelectedGuestRelation] = useState(null);

  // 호스트 본인 뷰 여부 판정
  const [isHostView, setIsHostView] = useState(false);

  useEffect(() => {
    if (!resultId) return;

    // 1. 결과 데이터 로드
    const cachedResultStr = localStorage.getItem('office_universe_last_result');
    const cachedId = localStorage.getItem('office_universe_last_result_id');
    
    if (cachedResultStr && cachedId === resultId) {
      setResultData(JSON.parse(cachedResultStr));
      setIsHostView(true);
    } else {
      // 타인의 고유 ID를 열었거나, 방금 게스트가 테스트를 끝낸 후 캐싱되지 않은 경우
      // 데모의 편의성과 API 연동을 위해 임시 저장소 데이터를 백엔드 또는 로컬 스토리지 데이터로 확보
      if (cachedResultStr) {
        setResultData(JSON.parse(cachedResultStr));
      } else {
        // 백업용 Mock 데이터 (ID 기반으로 불러올 백엔드가 없으므로, 시연용으로 로컬 데이터가 없을 때 안전장치)
        const mockResult = {
          participantId: resultId,
          mbti: 'ENFP',
          title: '아이디어 넘치는 부스터',
          mascot: 'energetic',
          description: '긍정적인 마인드로 주변에 호기심을 마구 전파하는 프로 탐험러! 신선한 활력을 조직에 뿜어냅니다.',
          fortune: '올해 토끼띠 생존 흐름과 사내 대리/선임 직무 역학을 결합해 분석한 결과입니다. 창의적인 에너지가 샘솟는 활기찬 하루입니다. 지루한 반복 업무는 잠시 뒤로 하고 기획 업무에 집중해보세요.',
          happenstance: '새로운 사람을 만나거나 낯선 부서의 요청을 받는 일은 모두 보물 같은 "호기심"의 자극원입니다. 오늘 일어나는 예기치 못한 스케줄 충돌마저 유쾌하게 받아들이면 의외의 수확을 거둡니다.',
          happenstanceType: '호기심(Curiosity)',
          warning: '대리/선임 역할로서 업무 도중 오후 4시 급격한 집중력 분산 및 먼 산 바라보기 주의! 찬 바람을 쐬며 스트레칭을 3분 하세요.',
          burnout: {
            score: 0,
            state: 'safe',
            title: '양호 (충전 중)',
            advice: '업무 강도가 적절하며, 스트레스 관리가 잘 되고 있습니다. 현재 페이스를 유지하세요!'
          },
          scores: { E: 3, I: 0, N: 2, S: 1, T: 1, F: 2, P: 2, J: 1 }
        };
        setResultData(mockResult);
      }
      setIsHostView(false);
    }
  }, [resultId]);

  // 관계 데이터 조회 (호스트 뷰인 경우에만)
  useEffect(() => {
    if (!resultId || !isHostView) return;

    const fetchRelations = async () => {
      try {
        const response = await fetch(`/api/relations?hostId=${resultId}`);
        const data = await response.json();
        if (data.success) {
          setRelations(data.relations);
        }
      } catch (err) {
        console.error('Relations API error:', err);
      }
    };

    fetchRelations();
  }, [resultId, isHostView]);

  // URL 클립보드 복사 (게스트 초대용 링크)
  const handleCopyLink = () => {
    // 프로필 입력으로 보내되, 현재 호스트 ID를 붙여서 공유
    const shareUrl = `${window.location.origin}/profile?hostId=${resultId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
  };

  const handleShareAlert = () => {
    handleCopyLink();
    alert('동료에게 공유할 수 있는 마인드미러 초대 링크가 클립보드에 복사되었습니다!\n사내 메신저나 카카오톡에 붙여넣기(Ctrl+V) 해주세요.');
  };

  if (!resultData) {
    return (
      <div className="loading-fallback">
        <p>결과를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 성격 지표 비율 바 계산 (문항 당 3개 기준)
  const getDimensionPercent = (dim1, dim2) => {
    const scores = resultData.scores || { E: 2, I: 1, N: 2, S: 1, T: 1, F: 2, P: 2, J: 1 };
    const val1 = scores[dim1] || 0;
    const val2 = scores[dim2] || 0;
    const total = val1 + val2 || 1;
    return Math.round((val1 / total) * 100);
  };

  const mbtiDimensions = [
    { leftKey: 'E', leftLabel: '외향형 (E)', rightKey: 'I', rightLabel: '내향형 (I)', desc: '에너지의 방향성' },
    { leftKey: 'N', leftLabel: '직관형 (N)', rightKey: 'S', rightLabel: '감각형 (S)', desc: '정보 인식 및 시야' },
    { leftKey: 'T', leftLabel: '사고형 (T)', rightKey: 'F', rightLabel: '감정형 (F)', desc: '의사결정 및 대인방식' },
    { leftKey: 'P', leftLabel: '인식형 (P)', rightKey: 'J', rightLabel: '판단형 (J)', desc: '업무 실행 및 계획성' },
  ];

  return (
    <div className="result-container fade-in">
      
      {/* 1. 게스트 참여 후 1:1 궁합 리포트 최상단 표출 (게스트 전용 뷰) */}
      {!isHostView && resultData.relation && (
        <div className="section-card card guest-matching-card fade-in">
          <div className="match-title-row">
            <Heart size={24} className="icon-pink pulse" />
            <h2>{resultData.relation.hostName}님과의 케미 거울</h2>
          </div>
          
          <div className="relation-avatar-match">
            <div className="match-user-box">
              <span className="user-badge">호스트</span>
              <div className="avatar-circle host-color">
                👤
              </div>
              <span className="user-name">{resultData.relation.hostName}님</span>
            </div>
            
            <div className="match-line-box">
              <span className="match-score">{resultData.relation.compatibilityScore}%</span>
              <div className="line-heart-bg">
                <svg className="matching-svg" width="100" height="30">
                  <path d="M 0,15 L 100,15" stroke="#ff6584" strokeWidth="3" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>

            <div className="match-user-box">
              <span className="user-badge guest-badge">나</span>
              <div className="avatar-circle guest-color">
                ✨
              </div>
              <span className="user-name">당신</span>
            </div>
          </div>

          <div className="influence-box">
            <h3 className="influence-title">
              오늘 {resultData.relation.hostName}님에게 당신은...<br />
              <span className="influence-highlight">{resultData.relation.influenceTitle}</span>
            </h3>
            <p className="influence-desc">{resultData.relation.influenceDesc}</p>
          </div>

          <button className="btn btn-primary start-my-mirror-btn" onClick={() => router.push('/')}>
            나도 마인드미러 만들기 🔮
          </button>
        </div>
      )}

      {/* 2. 상단 마스크 캐릭터 영역 (기본 성격 분석) */}
      <div className="result-header">
        <span className="type-badge">{resultData.mbti} 유형</span>
        <Mascot emotion={resultData.mascot} size={120} />
        <h1 className="result-title">"{resultData.title}"</h1>
        <p className="result-desc">{resultData.description}</p>
      </div>

      {/* 3. 성격 지표 비율 그래프 (순수 CSS & HTML 프리미엄 시각화) */}
      <div className="section-card card">
        <div className="card-header-row">
          <Network size={20} className="icon-orange" />
          <h3>성격 거울 지표 (성향 비율)</h3>
        </div>
        <div className="graph-container">
          {mbtiDimensions.map((dim) => {
            const leftPercent = getDimensionPercent(dim.leftKey, dim.rightKey);
            const rightPercent = 100 - leftPercent;
            return (
              <div key={dim.leftKey} className="dimension-row">
                <div className="dimension-labels">
                  <span className={`dim-label ${leftPercent >= 50 ? 'bold' : ''}`}>{dim.leftLabel}</span>
                  <span className="dim-desc">{dim.desc}</span>
                  <span className={`dim-label text-right ${rightPercent >= 50 ? 'bold' : ''}`}>{dim.rightLabel}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill left-fill" style={{ width: `${leftPercent}%` }}>
                    {leftPercent >= 20 && <span className="percent-text">{leftPercent}%</span>}
                  </div>
                  <div className="bar-fill right-fill" style={{ width: `${rightPercent}%` }}>
                    {rightPercent >= 20 && <span className="percent-text">{rightPercent}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 오늘의 직장인 운세 */}
      <div className="section-card card">
        <div className="card-header-row">
          <Sparkles size={20} className="icon-orange" />
          <h3>오늘의 직장 내 역할과 운세</h3>
        </div>
        <p className="content-text">{resultData.fortune}</p>
      </div>

      {/* 5. 신뢰성을 위한 분석 이론 및 논문 근거 (Accordion 구조) */}
      <div className="section-card card theory-accordion-card">
        <button 
          className="accordion-trigger-btn"
          onClick={() => setShowTheory(!showTheory)}
        >
          <div className="trigger-left">
            <HelpCircle size={18} className="icon-blue" />
            <span>이 분석은 어떻게 도출되었나요? (이론적 근거)</span>
          </div>
          {showTheory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showTheory && (
          <div className="accordion-content-box fade-in">
            <div className="theory-item">
              <h4>1. 칼 융의 심리유형론 및 MBTI</h4>
              <p>
                본 진단 결과는 칼 융(Carl Jung)의 심리유형론(Psychological Types)을 현대 조직 행동에 맞추어 재해석한 결과입니다. 
                각 의사결정 방식(T/F)과 세상을 보는 창(S/N)을 조직 내 상호작용 지표로 계량화하여 직장인 유형을 정의했습니다.
              </p>
              <span className="cite-text">
                📚 <em>Myers, I. B. (1980). Gifts Differing: Understanding Personality Type.</em>
              </span>
            </div>

            <div className="theory-item">
              <h4>2. 크럼볼츠의 계획된 우연 이론</h4>
              <p>
                직장 생활의 예상치 못한 해프닝과 인적 갈등을 커리어적 기회로 전환하는 능력을 진단합니다. 
                분석에 제공된 행동 지침은 존 크럼볼츠(John Krumboltz) 교수의 5대 핵심 태도(호기심, 유연성, 인내성, 낙관성, 위험 감수)를 처방용 알고리즘으로 설계한 것입니다.
              </p>
              <span className="cite-text">
                📚 <em>Mitchell, K. E., Levin, A. S., & Krumboltz, J. D. (1999). Planned Happenstance: Constructing Unexpected Career Opportunities.</em>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. 조심할 일 */}
      <div className="section-card card warning-card">
        <div className="card-header-row">
          <AlertTriangle size={20} className="icon-red" />
          <h3>오피스 주의보!</h3>
        </div>
        <p className="content-text warning-text">{resultData.warning}</p>
      </div>

      {/* 7. 호스트 뷰 전용: 인적 관계도 그래프 (SVG & CSS 프리미엄 맵) */}
      {isHostView && (
        <div className="section-card card relations-map-card">
          <div className="card-header-row">
            <Network size={20} className="icon-purple" />
            <h3>마인드미러 관계망 (Relation Map)</h3>
          </div>
          
          {relations.length > 0 ? (
            <div className="map-view-wrapper">
              <p className="map-guide">나와 매칭된 동료들을 터치해 오늘의 영향력을 확인하세요!</p>
              
              <div className="network-container">
                {/* 중앙 호스트 */}
                <div className="center-node host-node">
                  <div className="node-avatar">👤</div>
                  <span className="node-name">나</span>
                </div>

                {/* 주변 게스트들을 원형으로 배치 */}
                {relations.map((rel, idx) => {
                  const angle = (idx * 360) / relations.length;
                  const radius = 95; // 배치 반경 (px)
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.round(Math.cos(rad) * radius);
                  const y = Math.round(Math.sin(rad) * radius);

                  return (
                    <div key={rel.id} className="guest-node-wrapper" style={{ transform: `translate(${x}px, ${y}px)` }}>
                      {/* 선 긋기 */}
                      <div 
                        className="connecting-line" 
                        style={{
                          width: `${radius}px`,
                          transform: `rotate(${angle + 180}deg)`,
                          transformOrigin: '0% 50%'
                        }}
                      />
                      
                      <button 
                        className={`guest-node-btn ${selectedGuestRelation?.id === rel.id ? 'active' : ''}`}
                        onClick={() => setSelectedGuestRelation(rel)}
                      >
                        <span className="guest-node-zodiac">{rel.guestZodiac}</span>
                        <span className="guest-node-name">{rel.guestName}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 선택한 동료와의 관계 상세 내용 */}
              {selectedGuestRelation ? (
                <div className="selected-relation-detail-box fade-in">
                  <div className="detail-header">
                    <h4>{selectedGuestRelation.guestName}님과의 궁합</h4>
                    <span className="compat-score-badge">{selectedGuestRelation.compatibilityScore}%</span>
                  </div>
                  <p className="detail-role">
                    💼 {selectedGuestRelation.guestRole} ({selectedGuestRelation.guestZodiac}띠)
                  </p>
                  <div className="detail-influence">
                    <strong>{selectedGuestRelation.influenceTitle}</strong>
                    <p className="influence-desc-detail">{selectedGuestRelation.influenceDesc}</p>
                  </div>
                  <button className="close-detail-btn" onClick={() => setSelectedGuestRelation(null)}>닫기</button>
                </div>
              ) : (
                <div className="relation-placeholder-box">
                  <p>동료 아바타를 탭하면 관계도 분석 리포트가 표시됩니다.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-relations-view">
              <p>아직 마인드미러에 응답한 동료가 없습니다.</p>
              <p className="sub-text">아래 링크를 복사하여 팀원들에게 공유하고,<br />서로 어떤 영향을 끼치는지 관계망을 채워보세요!</p>
              <div className="arrow-down-glow">👇</div>
            </div>
          )}
        </div>
      )}

      {/* 8. 호스트 뷰 전용: 나에게 응답한 동료 리스트 */}
      {isHostView && relations.length > 0 && (
        <div className="section-card card">
          <div className="card-header-row">
            <User size={18} className="icon-orange" />
            <h3>나에게 응답한 동료들 ({relations.length}명)</h3>
          </div>
          <div className="guest-list">
            {relations.map((rel) => (
              <div key={rel.id} className="guest-list-item card" onClick={() => setSelectedGuestRelation(rel)}>
                <div className="item-left">
                  <span className="zodiac-emoji-box">🎨</span>
                  <div>
                    <h4 className="guest-item-name">{rel.guestName} <span className="guest-item-role">{rel.guestRole}</span></h4>
                    <p className="guest-item-influence">{rel.influenceTitle}</p>
                  </div>
                </div>
                <div className="item-right">
                  <span className="item-score">{rel.compatibilityScore}점</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. 공유 및 바이럴 링크 생성 영역 (하단 썸존) */}
      <div className="action-buttons-grid">
        {isHostView ? (
          <>
            <button className="btn btn-secondary share-btn" onClick={handleShareAlert}>
              <Share2 size={18} style={{ marginRight: '6px' }} />
              관계 매칭 공유
            </button>

            <button className="btn btn-secondary share-btn" onClick={handleCopyLink}>
              {copied ? <Check size={18} style={{ marginRight: '6px', color: 'green' }} /> : <Link2 size={18} style={{ marginRight: '6px' }} />}
              {copied ? '복사 완료!' : '초대링크 복사'}
            </button>

            <button className="btn btn-primary retry-btn" onClick={() => router.push('/')}>
              <RotateCcw size={18} style={{ marginRight: '6px' }} />
              다시 하기
            </button>
          </>
        ) : (
          <button className="btn btn-primary full-btn" onClick={() => router.push('/')}>
            나도 마인드미러 테스트하러 가기 🔮
          </button>
        )}
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
          height: 100vh;
          font-weight: 600;
          color: hsl(var(--text-muted));
        }
        .result-header {
          text-align: center;
          margin: 16px 0 24px 0;
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
          font-size: 26px;
          margin-top: 12px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .result-desc {
          font-size: 14.5px;
          color: hsl(var(--text-muted));
          margin-top: 6px;
          padding: 0 16px;
          line-height: 1.45;
        }
        .section-card {
          padding: 16px;
          margin-bottom: 8px;
        }
        .card-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .card-header-row h3 {
          margin-bottom: 0;
          font-size: 15px;
          font-weight: 700;
        }
        .content-text {
          font-size: 14.5px;
          line-height: 1.55;
          color: hsl(var(--text-dark));
        }
        .icon-orange {
          color: hsl(var(--primary));
        }
        .icon-purple {
          color: #8e44ad;
        }
        .icon-blue {
          color: #3498db;
        }
        .icon-red {
          color: hsl(var(--accent-peach));
        }
        .icon-pink {
          color: #ff6584;
        }
        .warning-card {
          background-color: hsl(355, 100%, 97%);
          border: 1px solid rgba(255, 111, 60, 0.1);
        }
        .warning-text {
          color: hsl(355, 60%, 40%);
          font-weight: 500;
        }

        /* 게스트 매칭 카드 스타일 */
        .guest-matching-card {
          border-left: 5px solid #ff6584;
          background-color: hsl(340, 100%, 98%);
        }
        .match-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .match-title-row h2 {
          font-size: 17px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .relation-avatar-match {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
        }
        .match-user-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .avatar-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background-color: #fff;
          box-shadow: var(--shadow-sm);
        }
        .avatar-circle.host-color {
          border: 3px solid #ff6584;
        }
        .avatar-circle.guest-color {
          border: 3px solid hsl(var(--primary));
        }
        .user-badge {
          font-size: 10px;
          background-color: #ff6584;
          color: #fff;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .guest-badge {
          background-color: hsl(var(--primary));
        }
        .user-name {
          font-size: 13px;
          font-weight: 700;
        }
        .match-line-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .match-score {
          font-size: 18px;
          font-weight: 800;
          color: #ff6584;
          background-color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 101, 132, 0.3);
          z-index: 2;
          font-family: 'Outfit', sans-serif;
        }
        .line-heart-bg {
          margin-top: -10px;
        }
        .influence-box {
          background-color: #fff;
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 101, 132, 0.15);
          text-align: center;
          margin-bottom: 14px;
        }
        .influence-title {
          font-size: 14px;
          font-weight: 600;
          color: hsl(var(--text-dark));
          line-height: 1.5;
        }
        .influence-highlight {
          display: inline-block;
          font-size: 18px;
          font-weight: 800;
          color: #ff6584;
          margin-top: 6px;
        }
        .influence-desc {
          font-size: 13px;
          color: hsl(var(--text-muted));
          margin-top: 8px;
          line-height: 1.45;
        }
        .start-my-mirror-btn {
          width: 100%;
          margin-top: 4px;
        }

        /* 성향 비율 그래프 스타일 */
        .graph-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 6px 0;
        }
        .dimension-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dimension-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: hsl(var(--text-dark));
        }
        .dim-label {
          font-weight: 500;
        }
        .dim-label.bold {
          font-weight: 800;
          color: hsl(var(--primary));
        }
        .dim-desc {
          color: hsl(var(--text-muted));
          font-size: 10.5px;
        }
        .text-right {
          text-align: right;
        }
        .bar-track {
          height: 16px;
          background-color: hsl(210, 16%, 93%);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
        }
        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          transition: width 0.8s cubic-bezier(0.1, 0.76, 0.55, 0.94);
        }
        .left-fill {
          background-color: hsl(var(--primary));
          justify-content: flex-start;
          padding-left: 8px;
          border-right: 1.5px solid #fff;
        }
        .right-fill {
          background-color: #ffb89f;
          justify-content: flex-end;
          padding-right: 8px;
          margin-left: auto;
          border-left: 1.5px solid #fff;
        }
        .percent-text {
          font-family: 'Outfit', sans-serif;
        }

        /* 이론 아코디언 스타일 */
        .theory-accordion-card {
          padding: 0;
          overflow: hidden;
        }
        .accordion-trigger-btn {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          cursor: pointer;
          text-align: left;
          font-size: 14.5px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .trigger-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .accordion-content-box {
          padding: 0 16px 16px 16px;
          border-top: 1px dashed hsl(210, 16%, 90%);
        }
        .theory-item {
          margin-top: 12px;
        }
        .theory-item h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 4px;
        }
        .theory-item p {
          font-size: 12.5px;
          color: hsl(var(--text-muted));
          line-height: 1.5;
        }
        .cite-text {
          display: block;
          font-size: 11px;
          color: hsl(var(--primary));
          margin-top: 3px;
        }

        /* 관계망 그래프 시각화 (Relation Map) */
        .relations-map-card {
          background-color: #fff;
        }
        .map-view-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
        }
        .map-guide {
          font-size: 12.5px;
          color: hsl(var(--text-muted));
          margin-bottom: 24px;
        }
        .network-container {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .center-node {
          position: absolute;
          z-index: 10;
          width: 68px;
          height: 68px;
          background-color: #fff;
          border: 4px solid #8e44ad;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(142, 68, 173, 0.3);
        }
        .node-avatar {
          font-size: 24px;
          line-height: 1;
        }
        .node-name {
          font-size: 10.5px;
          font-weight: 800;
          color: #8e44ad;
          margin-top: 2px;
        }
        .guest-node-wrapper {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .connecting-line {
          position: absolute;
          height: 2px;
          background-color: rgba(142, 68, 173, 0.25);
          z-index: 1;
        }
        .guest-node-btn {
          position: relative;
          z-index: 5;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #fff;
          border: 2px solid #8e44ad;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
          padding: 0;
        }
        .guest-node-btn:hover, .guest-node-btn.active {
          transform: scale(1.1);
          border-color: #ff6584;
          box-shadow: 0 4px 8px rgba(255, 101, 132, 0.3);
        }
        .guest-node-zodiac {
          font-size: 14px;
          line-height: 1;
        }
        .guest-node-name {
          font-size: 8px;
          font-weight: 700;
          color: hsl(var(--text-muted));
          max-width: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 1px;
        }
        .guest-node-btn.active .guest-node-name {
          color: #ff6584;
        }

        /* 동료 관계 상세 */
        .selected-relation-detail-box {
          width: 100%;
          background-color: hsl(210, 16%, 97%);
          border-radius: var(--radius-sm);
          padding: 14px;
          border: 1px solid hsl(210, 16%, 90%);
          margin-top: 16px;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-header h4 {
          font-size: 14.5px;
          font-weight: 800;
          color: hsl(var(--text-dark));
        }
        .compat-score-badge {
          font-family: 'Outfit', sans-serif;
          background-color: #ff6584;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .detail-role {
          font-size: 11.5px;
          color: hsl(var(--text-muted));
          margin-top: 2px;
          font-weight: 500;
        }
        .detail-influence {
          margin-top: 10px;
          background-color: #fff;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid hsl(210, 16%, 93%);
        }
        .detail-influence strong {
          display: block;
          font-size: 13.5px;
          color: #ff6584;
          margin-bottom: 4px;
        }
        .influence-desc-detail {
          font-size: 12.5px;
          line-height: 1.4;
          color: hsl(var(--text-dark));
        }
        .close-detail-btn {
          display: block;
          width: 100%;
          background: none;
          border: 1px solid hsl(210, 16%, 85%);
          color: hsl(var(--text-muted));
          font-size: 12px;
          font-weight: 700;
          padding: 6px 0;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
        }
        .close-detail-btn:hover {
          background-color: hsl(210, 16%, 93%);
        }
        .relation-placeholder-box {
          width: 100%;
          text-align: center;
          padding: 14px;
          border: 1px dashed hsl(210, 16%, 85%);
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          color: hsl(var(--text-muted));
          margin-top: 16px;
        }

        /* 참여자 없음 비어있음 디자인 */
        .empty-relations-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 16px;
          border: 1px dashed hsl(210, 16%, 85%);
          border-radius: var(--radius-sm);
          background-color: hsl(210, 16%, 98%);
        }
        .empty-relations-view p {
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 6px;
        }
        .empty-relations-view .sub-text {
          font-size: 12px;
          font-weight: 500;
          color: hsl(var(--text-muted));
          line-height: 1.45;
        }
        .arrow-down-glow {
          font-size: 24px;
          margin-top: 16px;
          animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(6px); }
        }

        /* 게스트 리스트 스타일 */
        .guest-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guest-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .guest-list-item:hover {
          background-color: hsl(210, 16%, 98%);
        }
        .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .zodiac-emoji-box {
          font-size: 20px;
        }
        .guest-item-name {
          font-size: 13.5px;
          font-weight: 700;
          color: hsl(var(--text-dark));
        }
        .guest-item-role {
          font-size: 10.5px;
          font-weight: 500;
          color: hsl(var(--text-muted));
          margin-left: 4px;
        }
        .guest-item-influence {
          font-size: 11.5px;
          color: #ff6584;
          font-weight: 700;
          margin-top: 2px;
        }
        .item-score {
          font-family: 'Outfit', sans-serif;
          font-size: 14.5px;
          font-weight: 800;
          color: #ff6584;
        }

        /* 하단 그리드 액션 버튼 */
        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr 1fr;
          gap: 8px;
          margin-top: 16px;
        }
        .share-btn {
          min-height: 48px;
          padding: 8px 12px;
          font-size: 13px;
        }
        .retry-btn {
          min-height: 48px;
          padding: 8px 12px;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(255, 111, 60, 0.2);
        }
        .full-btn {
          grid-column: span 3;
          min-height: 48px;
          font-size: 14.5px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(255, 111, 60, 0.25);
        }
        .pulse {
          animation: heartbeat 1.2s infinite alternate;
        }
        @keyframes heartbeat {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
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
