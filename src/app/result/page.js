'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { 
  Share2, Link2, RotateCcw, Heart, AlertTriangle, 
  Coffee, Sparkles, Award, User, HelpCircle, 
  ChevronDown, ChevronUp, Network, Check, ShoppingBag, Eye
} from 'lucide-react';

// 타로 카드 정보 사전
const TAROT_CARDS_DATA = {
  fool: {
    name: 'The Fool (바보 카드) 🃏',
    desc: '새로운 도전과 자유로운 모험의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',
    advice: '오늘 직장에서 무모해 보이는 도전이나 갑작스러운 기획 변경이 생기더라도 두려워하지 마세요! 예측 불허의 상황이 당신에게 가장 유리하고 긍정적인 반전 기회를 가져다줍니다. 엉뚱한 발상이 대박의 시작이 될 수 있으니 생각을 적극적으로 피력해 보세요.'
  },
  magician: {
    name: 'The Magician (마법사 카드) 🧙',
    desc: '무한한 창의성과 탁월한 재능의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
    advice: '준비된 지식과 기획력이 최고조로 빛나는 날입니다. 오늘 열리는 회의나 PT, 슬랙 소통에서 당신의 의견은 강한 설득력을 발휘하여 동료들을 끌어당길 것입니다. 당신의 능력을 마음껏 연출하고 자랑해도 좋은 타이밍입니다.'
  },
  empress: {
    name: 'The Empress (여황제 카드) 👑',
    desc: '풍요와 만족, 따뜻한 포용력의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/RWS_Tarot_03_Empress.jpg',
    advice: '팀원들과의 협업이 더없이 매끄럽고 풍요로운 결실을 맺는 하루입니다. 오늘은 탕비실에 소소한 간식을 채우거나, 동료에게 가벼운 칭찬 한마디를 건네보세요. 베푼 친절이 몇 배의 만족감과 보상으로 당신에게 돌아올 것입니다.'
  },
  hermit: {
    name: 'The Hermit (은둔자 카드) 🕯️',
    desc: '조용한 성찰과 깊이 있는 지혜의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg',
    advice: '사소한 사내 정치나 가벼운 잡담에서 한 걸음 물러나 침묵을 지키는 것이 이로운 날입니다. 오늘은 메신저 알림을 잠시 끄고 딥워크(Deep Work)에 몰두하여 엑셀이나 코드 오탈자 검토에 집중해 보세요. 조용한 성찰 속에서 완벽한 아이디어가 완성됩니다.'
  },
  chariot: {
    name: 'The Chariot (전차 카드) 🛒',
    desc: '강력한 추진력과 극복의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
    advice: '오늘 직장에서 어려운 태스크나 막히던 결재 라인이 있나요? 주저하지 말고 강력하게 추진해 보세요. 돌파력이 최고조에 달한 상태이므로, 당당한 태도로 상대방을 설득하면 결국 당신의 의도대로 업무를 주도하게 될 것입니다.'
  },
  wheel: {
    name: 'Wheel of Fortune (수레바퀴 카드) 🎡',
    desc: '변화와 기회, 순환의 상징',
    img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg',
    advice: '갑작스러운 업무 조정, 팀 재배치, 스케줄 변동이 생기더라도 전혀 걱정하지 마세요. 이는 운명이 가져다준 긍정적인 터닝 포인트입니다. 파도에 몸을 싣듯 자연스럽게 흐름을 타고 대세에 맞추면 오히려 좋은 평가를 받습니다.'
  }
};

// 복지몰 상품 매칭 사전
const MALL_PRODUCTS = {
  burnout_danger: [
    { title: '15분 오피스 힐링 온열 안대', price: '9,900원', emoji: '👁️', link: 'https://gift.kakao.com' },
    { title: '지압용 고체 스트레스 볼 (그립퍼)', price: '6,500원', emoji: '✊', link: 'https://gift.kakao.com' }
  ],
  burnout_warning: [
    { title: '사무용 무선 저소음 키보드 & 마우스', price: '38,900원', emoji: '⌨️', link: 'https://gift.k  useEffect(() => {
    if (!resultId) return;

    const cachedResultStr = localStorage.getItem('office_universe_last_result');
    const cachedId = localStorage.getItem('office_universe_last_result_id');
    
    if (cachedResultStr && cachedId === resultId) {
      setResultData(JSON.parse(cachedResultStr));
      setIsHostView(true);
    } else {
      // 타인 고유 ID 뷰 (실시간 DB Fetch 조회)
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/user-info?id=${resultId}`);
          const data = await res.json();
          if (data.success && data.user) {
            setResultData(data.user);
          } else {
            // 실패 시 로컬 스토리지 또는 mock 백업
            if (cachedResultStr) {
              setResultData(JSON.parse(cachedResultStr));
            } else {
              setResultData({
                participantId: resultId,
                name: '행복한 아티스트 토끼사원',
                mbti: 'ISFP',
                title: '평화주의 아티스트',
                mascot: 'smile',
                description: '사내 갈등을 유연하게 피해 가며 조용하고 잔잔하게 팀에 기여하는 예술가!',
                fortune: '올해 토끼띠 생존 흐름과 사내 직무 역학을 결합해 분석한 결과입니다. 갈등이 없는 평화로운 사무실 분위기 속에서 조용하고 편안하게 루틴 업무를 마칠 수 있는 날입니다.',
                warning: '동료의 피드백 요구에 마냥 "다 좋아요"만 대답하다 나중에 꼬이지 않도록, 필요한 의견은 명확히 피력하세요.',
                burnout: {
                  score: 0,
                  state: 'safe',
                  title: '양호 (충전 중)',
                  advice: '업무 강도가 적절하며, 스트레스 관리가 잘 되고 있습니다.'
                },
                scores: { E: 1, I: 2, N: 1, S: 2, T: 1, F: 2, P: 2, J: 1 }
              });
            }
          }
        } catch (err) {
          console.error('Failed to fetch user result:', err);
        }
      };
      fetchUserData();
      setIsHostView(false);
    }
  }, [resultId]);�코디언/탭 컨트롤 상태
  const [showTheory, setShowTheory] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(null);

  // 로컬 정보 기반 본인 페이지 확인
  const [isHostView, setIsHostView] = useState(false);

  useEffect(() => {
    if (!resultId) return;

    const cachedResultStr = localStorage.getItem('office_universe_last_result');
    const cachedId = localStorage.getItem('office_universe_last_result_id');
    
    if (cachedResultStr && cachedId === resultId) {
      setResultData(JSON.parse(cachedResultStr));
      setIsHostView(true);
    } else {
      // 타인 고유 ID 뷰 (또는 게스트가 테스트 마친 직후)
      if (cachedResultStr) {
        setResultData(JSON.parse(cachedResultStr));
      } else {
        // 백업용 템플릿
        const mockResult = {
          participantId: resultId,
          name: '아이디어 부스터 토끼대리',
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
          scores: { E: 3, I: 0, N: 2, S: 1, T: 1, F: 2, P: 2, J: 1 },
          tarotId: 'magician'
        };
        setResultData(mockResult);
      }
      setIsHostView(false);
    }
  }, [resultId]);

  // 관계 데이터 조회 (양방향 조회 지원 - host이든 guest이든 나 자신을 기준으로 엮인 모든 관계 긁어옴)
  useEffect(() => {
    if (!resultId) return;

    const fetchRelations = async () => {
      try {
        const response = await fetch(`/api/relations?userId=${resultId}`);
        const data = await response.json();
        if (data.success) {
          setRelations(data.relations);
        }
      } catch (err) {
        console.error('Relations API error:', err);
      }
    };

    fetchRelations();
  }, [resultId]);

  // 초대 링크 클립보드 복사
  const handleCopyLink = () => {
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

  // 성격 지표 비율 바 계산
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

  // 타로 카드 정보 매핑
  const tarotInfo = TAROT_CARDS_DATA[resultData.tarotId] || TAROT_CARDS_DATA.fool;

  // 복지몰 상품 추천 목록 구성
  const getRecommendedProducts = () => {
    let products = [];
    if (resultData.burnout?.state === 'danger') {
      products = products.concat(MALL_PRODUCTS.burnout_danger);
    } else if (resultData.burnout?.state === 'warning') {
      products = products.concat(MALL_PRODUCTS.burnout_warning);
    }

    const mbti = resultData.mbti || 'ENFP';
    // 엠비티아이 유형별로 대표적인 특성 결합
    if (mbti.includes('T')) {
      products.push(MALL_PRODUCTS.T[0]);
    } else {
      products.push(MALL_PRODUCTS.F[0]);
    }

    if (mbti.includes('N')) {
      products.push(MALL_PRODUCTS.N[0]);
    } else {
      products.push(MALL_PRODUCTS.S[0]);
    }

    // 최대 3개 리턴
    return products.slice(0, 3);
  };

  const recommendedProducts = getRecommendedProducts();

  // 관계별 연결선 SVG 패스 및 스타일을 획득하는 함수
  // cx, cy: 연결할 노드 좌표. rx, ry: 중심 노드 좌표(130, 130)
  const getRelationSvgPath = (type, cx, cy, rx = 130, ry = 130) => {
    if (type === 'villain') {
      // 피해야 할 빌런: 지그재그 번개 모양
      const steps = 6;
      let pathD = `M ${rx},${ry}`;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const currX = rx + (cx - rx) * t;
        const currY = ry + (cy - ry) * t;
        
        if (i < steps) {
          // 수직 벡터 계산하여 오프셋 꼬아줌
          const dx = cx - rx;
          const dy = cy - ry;
          const len = Math.sqrt(dx*dx + dy*dy) || 1;
          const perpX = (-dy / len) * (i % 2 === 0 ? 8 : -8);
          const perpY = (dx / len) * (i % 2 === 0 ? 8 : -8);
          pathD += ` L ${currX + perpX},${currY + perpY}`;
        } else {
          pathD += ` L ${cx},${cy}`;
        }
      }
      return {
        d: pathD,
        stroke: '#e74c3c',
        strokeWidth: 3,
        strokeDasharray: 'none',
        markerEnd: 'none'
      };
    } else if (type === 'booster') {
      // 아이디어 부스터: 네온 그린 물결선
      const dx = cx - rx;
      const dy = cy - ry;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      // 컨트롤포인트 2개를 활용해 삼차 베지에 곡선으로 물결 형태 모사
      const midX = rx + dx * 0.5;
      const midY = ry + dy * 0.5;
      const perpX = (-dy / len) * 15;
      const perpY = (dx / len) * 15;
      
      const cp1x = rx + dx * 0.25 + perpX;
      const cp1y = ry + dy * 0.25 + perpY;
      const cp2x = rx + dx * 0.75 - perpX;
      const cp2y = ry + dy * 0.75 - perpY;
      
      return {
        d: `M ${rx},${ry} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cx},${cy}`,
        stroke: '#2ecc71',
        strokeWidth: 3,
        strokeDasharray: 'none',
        markerEnd: 'url(#arrow-green)'
      };
    } else if (type === 'savior') {
      // 오늘의 구원자: 부드러운 핑크색 점선 + 화살표
      return {
        d: `M ${rx},${ry} L ${cx},${cy}`,
        stroke: '#ff6584',
        strokeWidth: 2.5,
        strokeDasharray: '4,4',
        markerEnd: 'url(#arrow-pink)'
      };
    } else if (type === 'workmate') {
      // 야근 동반자: 회색 굵은 긴 점선
      return {
        d: `M ${rx},${ry} L ${cx},${cy}`,
        stroke: '#95a5a6',
        strokeWidth: 4,
        strokeDasharray: '8,4',
        markerEnd: 'none'
      };
    } else if (type === 'charger') {
      // 감정 충전기: 연두색 완만한 곡선 + 화살표
      const dx = cx - rx;
      const dy = cy - ry;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      const midX = rx + dx * 0.5 + (-dy / len) * 10;
      const midY = ry + dy * 0.5 + (dx / len) * 10;
      return {
        d: `M ${rx},${ry} Q ${midX},${midY} ${cx},${cy}`,
        stroke: '#2ecc71',
        strokeWidth: 2.5,
        strokeDasharray: 'none',
        markerEnd: 'url(#arrow-green)'
      };
    } else if (type === 'corrector') {
      // 팩트 폭격기: 하늘색 일점쇄선
      return {
        d: `M ${rx},${ry} L ${cx},${cy}`,
        stroke: '#3498db',
        strokeWidth: 2.5,
        strokeDasharray: '8,3,2,3',
        markerEnd: 'url(#arrow-blue)'
      };
    }
    
    // 기본 디폴트 실선
    return {
      d: `M ${rx},${ry} L ${cx},${cy}`,
      stroke: '#bdc3c7',
      strokeWidth: 2,
      strokeDasharray: 'none',
      markerEnd: 'none'
    };
  };

  return (
    <div className="result-container fade-in">
      
      {/* 1. 게스트 참여 후 1:1 궁합 리포트 최상단 표출 (게스트 1:1 전용 뷰) */}
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
              <span className="user-name">{resultData.relation.hostName}</span>
            </div>
            
            <div className="match-line-box">
              <span className="match-score">{resultData.relation.compatibilityScore}%</span>
              <div className="line-heart-bg">
                <svg className="matching-svg" width="100" height="30">
                  <defs>
                    <marker id="arrow-match" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#ff6584" />
                    </marker>
                  </defs>
                  {/* 관계선 형태 분기 렌더링 (지그재그, 물결 등 1:1에서도 모사) */}
                  {resultData.relation.influenceType === 'villain' ? (
                    <path d="M 0,15 L 20,25 L 40,5 L 60,25 L 80,5 L 100,15" stroke="#e74c3c" strokeWidth="3" fill="none" />
                  ) : resultData.relation.influenceType === 'booster' ? (
                    <path d="M 0,15 Q 25,30 50,15 T 100,15" stroke="#2ecc71" strokeWidth="3" fill="none" markerEnd="url(#arrow-match)" />
                  ) : (
                    <path d="M 0,15 L 100,15" stroke="#ff6584" strokeWidth="2.5" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow-match)" />
                  )}
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

      {/* 2. 상단 마스크 캐릭터 영역 (나의 분석 결과) */}
      <div className="result-header">
        <span className="type-badge">{resultData.mbti} 유형</span>
        <Mascot emotion={resultData.mascot} size={110} />
        <h1 className="result-title">"{resultData.name || resultData.title}"</h1>
        <p className="result-desc">{resultData.description}</p>
      </div>

      {/* 3. 오늘 나를 이끌 타로 카드 결과 노출 (NEW) */}
      {resultData.tarotId && (
        <div className="section-card card tarot-result-card fade-in">
          <div className="card-header-row">
            <Sparkles size={18} className="icon-gold" />
            <h3>오늘 나의 운명 타로 카드</h3>
          </div>
          <div className="tarot-result-body">
            <div className="tarot-result-card-visual">
              <div className="tarot-result-emoji">
                {resultData.tarotId === 'fool' && '🃏'}
                {resultData.tarotId === 'magician' && '🧙'}
                {resultData.tarotId === 'empress' && '👑'}
                {resultData.tarotId === 'hermit' && '🕯️'}
              </div>
              <span className="tarot-result-card-name">{tarotInfo.name}</span>
            </div>
            <div className="tarot-result-text-box">
              <h4 className="tarot-result-sub">{tarotInfo.desc}</h4>
              <p className="tarot-result-advice">{tarotInfo.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. 성격 지표 비율 그래프 */}
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

      {/* 5. 오늘의 직장 내 역할과 운세 */}
      <div className="section-card card">
        <div className="card-header-row">
          <Sparkles size={20} className="icon-orange" />
          <h3>오늘의 직장 내 역할과 운세</h3>
        </div>
        <p className="content-text">{resultData.fortune}</p>
      </div>

      {/* 6. 신뢰성을 위한 분석 이론 및 논문 근거 */}
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

      {/* 7. 조심할 일 */}
      <div className="section-card card warning-card">
        <div className="card-header-row">
          <AlertTriangle size={20} className="icon-red" />
          <h3>오피스 주의보!</h3>
        </div>
        <p className="content-text warning-text">{resultData.warning}</p>
      </div>

      {/* 8. 양방향 관계도 그래프 시각화 (SVG & CSS 연결선 다각화 탑재) */}
      <div className="section-card card relations-map-card">
        <div className="card-header-row">
          <Network size={20} className="icon-purple" />
          <h3>마인드미러 관계망 (Relation Map)</h3>
        </div>
        
        {relations.length > 0 ? (
          <div className="map-view-wrapper">
            <p className="map-guide">나와 매칭된 동료들을 터치해 관계도 분석과 다른 스타일의 연결선을 확인해 보세요!</p>
            
            <div className="network-container">
              {/* 관계선들을 렌더링하는 통합 SVG 캔버스 */}
              <svg className="network-svg-canvas" width="260" height="260">
                <defs>
                  {/* 화살표 마커 모음 */}
                  <marker id="arrow-pink" markerWidth="5" markerHeight="5" refX="22" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5 Z" fill="#ff6584" />
                  </marker>
                  <marker id="arrow-green" markerWidth="5" markerHeight="5" refX="22" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5 Z" fill="#2ecc71" />
                  </marker>
                  <marker id="arrow-blue" markerWidth="5" markerHeight="5" refX="22" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5 Z" fill="#3498db" />
                  </marker>
                </defs>

                {/* 각 노드를 잇는 연결선들을 계산하여 드로잉 */}
                {relations.map((rel, idx) => {
                  const angle = (idx * 360) / relations.length;
                  const radius = 95;
                  const rad = (angle * Math.PI) / 180;
                  // 노드의 중심 좌표 계산
                  const cx = 130 + radius * Math.cos(rad);
                  const cy = 130 + radius * Math.sin(rad);

                  // 관계선 스타일 및 패스 계산
                  const lineStyle = getRelationSvgPath(rel.influenceType, cx, cy);

                  return (
                    <path
                      key={`line-${rel.id}`}
                      d={lineStyle.d}
                      stroke={lineStyle.stroke}
                      strokeWidth={lineStyle.strokeWidth}
                      strokeDasharray={lineStyle.strokeDasharray}
                      fill="none"
                      markerEnd={lineStyle.markerEnd}
                    />
                  );
                })}
              </svg>

              {/* 중앙 노드 (나) */}
              <div className="center-node host-node">
                <div className="node-avatar">👤</div>
                <span className="node-name">나</span>
              </div>

              {/* 주변 연결자 노드 배치 */}
              {relations.map((rel, idx) => {
                const angle = (idx * 360) / relations.length;
                const radius = 95; 
                const rad = (angle * Math.PI) / 180;
                const x = Math.round(Math.cos(rad) * radius);
                const y = Math.round(Math.sin(rad) * radius);

                // 양방향 노드 판별: 내가 게스트인지 호스트인지에 따라 대상 이름 표기
                const targetName = rel.hostId === resultId ? rel.guestName : rel.hostName || '동료';
                const targetRole = rel.hostId === resultId ? rel.guestRole : '호스트';
                const targetZodiac = rel.hostId === resultId ? rel.guestZodiac : '✨';

                return (
                  <div key={`node-${rel.id}`} className="guest-node-wrapper" style={{ transform: `translate(${x}px, ${y}px)` }}>
                    <button 
                      className={`guest-node-btn ${selectedRelation?.id === rel.id ? 'active' : ''} ${rel.hostId !== resultId ? 'host-partner' : ''}`}
                      onClick={() => setSelectedRelation(rel)}
                    >
                      <span className="guest-node-zodiac">{targetZodiac}</span>
                      <span className="guest-node-name">{targetName}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 선택한 동료와의 관계 상세 내용 */}
            {selectedRelation ? (
              <div className="selected-relation-detail-box fade-in">
                <div className="detail-header">
                  <h4>{selectedRelation.hostId === resultId ? selectedRelation.guestName : selectedRelation.hostName || '호스트'}님과의 관계</h4>
                  <span className="compat-score-badge">{selectedRelation.compatibilityScore}%</span>
                </div>
                <p className="detail-role">
                  💼 {selectedRelation.hostId === resultId ? `${selectedRelation.guestRole} (${selectedRelation.guestZodiac}띠)` : '초대해준 호스트'}
                </p>
                <div className="detail-influence">
                  <strong>{selectedRelation.influenceTitle}</strong>
                  <p className="influence-desc-detail">{selectedRelation.influenceDesc}</p>
                </div>
                <button className="close-detail-btn" onClick={() => setSelectedRelation(null)}>닫기</button>
              </div>
            ) : (
              <div className="relation-placeholder-box">
                <p>연결선 모양과 동료 노드를 탭하면 분석 리포트가 표시됩니다.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-relations-view">
            <p>아직 마인드미러에 응답한 동료가 없습니다.</p>
            <p className="sub-text">아래 링크를 복사하여 팀원들에게 공유하고,<br />지그재그 번개선, 물결선 등 다양한 연결선을 완성해 보세요!</p>
            <div className="arrow-down-glow">👇</div>
          </div>
        )}
      </div>

      {/* 9. 나에게 응답한 동료 리스트 */}
      {relations.length > 0 && (
        <div className="section-card card">
          <div className="card-header-row">
            <User size={18} className="icon-orange" />
            <h3>나와 엮인 동료 리스트 ({relations.length}명)</h3>
          </div>
          <div className="guest-list">
            {relations.map((rel) => {
              const targetName = rel.hostId === resultId ? rel.guestName : rel.hostName || '호스트';
              const targetRole = rel.hostId === resultId ? rel.guestRole : '초대한 호스트';
              return (
                <div key={`list-${rel.id}`} className="guest-list-item card" onClick={() => setSelectedRelation(rel)}>
                  <div className="item-left">
                    <span className="zodiac-emoji-box">
                      {rel.influenceType === 'savior' && '👼'}
                      {rel.influenceType === 'villain' && '☠️'}
                      {rel.influenceType === 'workmate' && '☕'}
                      {rel.influenceType === 'booster' && '🚀'}
                      {rel.influenceType === 'charger' && '🔋'}
                      {rel.influenceType === 'corrector' && '🎯'}
                    </span>
                    <div>
                      <h4 className="guest-item-name">{targetName} <span className="guest-item-role">{targetRole}</span></h4>
                      <p className="guest-item-influence">{rel.influenceTitle}</p>
                    </div>
                  </div>
                  <div className="item-right">
                    <span className="item-score">{rel.compatibilityScore}점</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 10. 오피스 복지몰 맞춤 상품 추천 섹션 (NEW) */}
      <div className="section-card card shopping-welfare-card">
        <div className="card-header-row">
          <ShoppingBag size={18} className="icon-orange" />
          <h3>오피스 복지몰 추천 상품</h3>
        </div>
        <p className="welfare-desc">나의 유형 및 멘탈 상태에 부합하는 사내 맞춤 특가 복지 상품입니다.</p>
        
        <div className="product-grid">
          {recommendedProducts.map((prod, idx) => (
            <a 
              key={idx} 
              href={prod.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="product-card card"
            >
              <div className="product-emoji">{prod.emoji}</div>
              <h4 className="product-title">{prod.title}</h4>
              <span className="product-price">{prod.price}</span>
              <span className="welfare-buy-btn">선물하기 🎁</span>
            </a>
          ))}
        </div>
      </div>

      {/* 11. 공유 및 바이럴 링크 생성 영역 */}
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
          font-family: 'Gowun Batang', serif;
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
          font-size: 24px;
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
        .icon-gold {
          color: #f1c40f;
        }
        .warning-card {
          background-color: hsl(355, 100%, 97%);
          border: 1px solid rgba(255, 111, 60, 0.1);
        }
        .warning-text {
          color: hsl(355, 60%, 40%);
          font-weight: 500;
        }

        /* 타로 결과 카드 스타일 */
        .tarot-result-card {
          border-left: 5px solid #f1c40f;
          background-color: hsl(45, 100%, 98%);
        }
        .tarot-result-body {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 8px;
        }
        .tarot-result-card-visual {
          width: 70px;
          height: 110px;
          border-radius: 8px;
          border: 2px solid #f1c40f;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }
        .tarot-result-emoji {
          font-size: 32px;
        }
        .tarot-result-card-name {
          font-size: 8px;
          font-weight: 800;
          color: #b79500;
          margin-top: 4px;
          text-align: center;
        }
        .tarot-result-text-box {
          flex: 1;
        }
        .tarot-result-sub {
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          margin-bottom: 6px;
        }
        .tarot-result-advice {
          font-size: 12.5px;
          line-height: 1.5;
          color: hsl(var(--text-muted));
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
          font-size: 12px;
          color: hsl(var(--text-muted));
          margin-bottom: 24px;
          text-align: center;
          padding: 0 10px;
          line-height: 1.4;
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
        .network-svg-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
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
          z-index: 5;
        }
        .guest-node-btn {
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
        /* 내가 초대한 상대가 아닌 경우(나를 초대한 호스트 파트너 노드)는 노드 컬러 차별화 */
        .guest-node-btn.host-partner {
          border-color: #3498db;
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

        /* 복지몰 추천 상품 카드 스타일 */
        .shopping-welfare-card {
          border-left: 5px solid #2ecc71;
        }
        .welfare-desc {
          font-size: 12.5px;
          color: hsl(var(--text-muted));
          margin-bottom: 16px;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .product-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 6px;
          background-color: #fff;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s;
          margin-bottom: 0;
          min-height: 160px;
          justify-content: space-between;
        }
        .product-card:hover {
          transform: translateY(-3px);
          border-color: #2ecc71;
        }
        .product-emoji {
          font-size: 28px;
          margin-bottom: 4px;
        }
        .product-title {
          font-size: 11px;
          font-weight: 700;
          color: hsl(var(--text-dark));
          line-height: 1.3;
          margin-bottom: 4px;
          height: 32px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          font-size: 11px;
          font-weight: 800;
          color: #e74c3c;
          font-family: 'Outfit', sans-serif;
        }
        .welfare-buy-btn {
          font-size: 9px;
          font-weight: 800;
          background-color: hsl(150, 60%, 95%);
          color: #2ecc71;
          padding: 3px 6px;
          border-radius: 4px;
          margin-top: 6px;
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
