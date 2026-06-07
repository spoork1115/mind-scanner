// 16가지 직장인 생존 유형 정의 데이터
export const RESULT_TYPES = {
  ESTJ: {
    title: '철두철미 엑셀 마스터',
    mascot: 'energetic',
    description: '모든 계획을 엑셀 시트에 완벽히 박아 넣는 프로 계획러! 논리적이고 조직적이어서 실무가 꼬이는 꼴을 참지 못합니다.',
    fortune: '오늘은 계획대로 착착 일이 풀려 생산성이 극대화되는 날입니다. 다만, 동료들의 유연한 일 처리가 눈에 차지 않더라도 넓은 마음으로 지켜봐 주세요.',
    happenstance: '예상치 못한 기획 변경이나 돌발 상황이 생기더라도, 이를 새로운 방향성을 개척할 "호기심"과 "유연성"의 기회로 삼아보세요. 새로운 대박 프로젝트의 시초가 될 수 있습니다.',
    warning: '오후 2시, 다른 부서의 급작스러운 업무 폰트 변경 요청 주의! 당황하지 말고 깊은 한숨 뒤에 차분히 대응하세요.',
    happenstanceType: '유연성(Flexibility)'
  },
  ESTP: {
    title: '영업본부 불도저',
    mascot: 'wink',
    description: '돌발 상황과 급박한 불끄기 업무에 가장 먼저 나서는 야전 사령관! 온갖 이슈를 본능적인 센스로 시원하게 해결합니다.',
    fortune: '즉각적인 행동력이 빛을 발하는 날입니다. 복잡한 서류 검토보다는 빠른 미팅과 결단이 좋은 성과를 낼 것입니다.',
    happenstance: '계획되지 않은 돌발 상황을 두려워하지 않는 당신의 성향은 "위험 감수" 태도와 완벽히 맞아떨어집니다. 오늘 마주치는 우연한 갈등 속에서 새로운 파트너쉽의 힌트를 얻을 수 있습니다.',
    warning: '오후 3시, 성급한 메신저 발송으로 인한 오타 주의! "감사합니다"가 "감사함디"로 나갈 수 있으니 재차 확인하세요.',
    happenstanceType: '위험 감수(Risk Taking)'
  },
  ESFJ: {
    title: '사내 복지 복덕방',
    mascot: 'smile',
    description: '팀원들의 소소한 안부부터 탕비실 간식 수급까지 전부 챙기는 사내 인간 비타민! 동료들의 마음을 어루만져 줍니다.',
    fortune: '당신의 친절이 부메랑이 되어 맛있는 간식이나 칭찬으로 돌아오는 따뜻한 하루입니다.',
    happenstance: '타인과의 끊임없는 소통 속에서 예기치 못한 커리어 기회가 찾아옵니다. 협력 과정에서 생기는 갈등은 관계의 회복력을 배우는 "인내성"의 훈련 기회로 전환하세요.',
    warning: '점심시간 메뉴 결정 장애 주의! 짬뽕과 짜장면 사이에서 고민하다 15분을 날릴 수 있으니 오늘은 동료의 결정을 따르세요.',
    happenstanceType: '인내성(Persistence)'
  },
  ESFP: {
    title: '워크샵의 댄싱 킹',
    mascot: 'wink',
    description: '답답한 사무실 공기조차 유쾌한 에너지로 바꾸는 사내 분위기 메이커! 활력 넘치는 소통을 즐깁니다.',
    fortune: '유쾌한 기운이 넘쳐 회의 분위기가 유연하게 풀릴 것입니다. 어려운 협상도 가벼운 스몰토크로 물꼬를 틀어보세요.',
    happenstance: '예상외의 유머러스한 해프닝을 새로운 관계 확장으로 연결하는 "낙관성"을 유지하세요. 오늘의 사소한 실수가 오히려 팀원들을 하나로 묶는 해피바이러스가 될 수 있습니다.',
    warning: '급격한 텐션 상승으로 인한 탕비실 종이컵 도미노 주의! 가벼운 발걸음으로 천천히 움직이세요.',
    happenstanceType: '낙관성(Optimism)'
  },
  ENTJ: {
    title: '야망 가득 프로젝트 매니저(PM)',
    mascot: 'energetic',
    description: '눈앞의 잡무보다 거시적인 프로젝트 성공을 지향하는 전략가! 거침없는 추진력과 냉철한 판단력의 소유자입니다.',
    fortune: '의사결정권자의 눈에 당신의 묵직한 아이디어가 돋보이는 날입니다. 자신감 있는 프레젠테이션이 필요합니다.',
    happenstance: '새로운 시스템 도입이나 리스크가 높은 도전 상황은 커리어를 점프시킬 최고의 기회입니다. 리스크를 계산해 다루는 "위험 감수" 태도가 당신의 핵심 무기가 될 것입니다.',
    warning: '메일 제목에 [긴급]을 남발하다 팀원들의 눈총을 받을 수 있으니 정말 급한 건인지 한 번 더 필터링하세요.',
    happenstanceType: '위험 감수(Risk Taking)'
  },
  ENTP: {
    title: '아이디어 폭격기',
    mascot: 'wink',
    description: '기존의 비효율을 깨고 새로운 대안을 던지는 크리에이티브 브레인! 상상을 현실로 만드는 기발한 제안을 잘 합니다.',
    fortune: '틀을 벗어난 발상이 좋은 해결책으로 대우받는 날입니다. 브레인스토밍에서 적극적으로 목소리를 높여보세요.',
    happenstance: '끊임없이 새로운 지식을 탐색하는 당신의 "호기심"은 직장 생활 속 우연한 문제를 흥미로운 연구 주제로 탈바꿈시킵니다. 갑작스러운 툴 에러가 나면 해결법을 파고들어 사내 영웅이 되어보세요.',
    warning: '쓸데없는 사내 토론 배틀 참전 주의! 탕수육 부먹 찍먹 논쟁에 진지하게 임해 진을 빼지 마세요.',
    happenstanceType: '호기심(Curiosity)'
  },
  ENFJ: {
    title: '사내 소통의 아이콘',
    mascot: 'smile',
    description: '개인의 성취보다 공동체의 동반 성장을 꿈꾸는 따뜻한 리더! 진정성 있는 설득과 격려로 모두를 움직입니다.',
    fortune: '멘토링이나 동료 고민 상담을 해주기 아주 좋은 날입니다. 당신의 지지와 공감이 상대방의 하루를 구원할 수 있습니다.',
    happenstance: '구성원 간의 갈등을 긍정적인 신뢰 형성으로 유도하는 "낙관성"을 발휘하세요. 오늘 생기는 돌발 오해는 더 끈끈한 협력을 낳는 전화위복의 계기가 됩니다.',
    warning: '과도한 공감으로 감정 소모 주의! 남의 업무 스트레스까지 짊어지고 퇴근해 끙끙 앓지 마세요.',
    happenstanceType: '낙관성(Optimism)'
  },
  ENFP: {
    title: '아이디어 넘치는 부스터',
    mascot: 'energetic',
    description: '긍정적인 마인드로 주변에 호기심을 마구 전파하는 프로 탐험러! 신선한 활력을 조직에 뿜어냅니다.',
    fortune: '창의적인 에너지가 샘솟는 활기찬 하루입니다. 지루한 반복 업무는 잠시 뒤로 하고 기획 업무에 집중해보세요.',
    happenstance: '새로운 사람을 만나거나 낯선 부서의 요청을 받는 일은 모두 보물 같은 "호기심"의 자극원입니다. 오늘 일어나는 예기치 못한 스케줄 충돌마저 유쾌하게 받아들이면 의외의 수확을 거듭합니다.',
    warning: '오후 4시 급격한 집중력 분산 및 먼 산 바라보기 주의! 찬 바람을 쐬며 스트레칭을 3분 하세요.',
    happenstanceType: '호기심(Curiosity)'
  },
  ISTJ: {
    title: '정시 퇴근 캘린더',
    mascot: 'smile',
    description: '자신에게 주어진 책임은 끝까지 완수하고, 칼퇴근 캘린더를 지키는 FM 직장인! 정확하고 성실한 실무형 인재입니다.',
    fortune: '어질러진 서류나 데이터들이 깔끔하게 제자리를 찾아 마음이 편안해지는 날입니다. 마무리가 아주 매끄럽습니다.',
    happenstance: '계획이 갑작스럽게 엉클어지는 우연은 당신에게 불쾌할 수 있지만, 이를 대처하며 시야를 넓히는 "유연성"의 기회로 여겨보세요. 매뉴얼 밖의 임기응변도 훌륭한 생존 공식입니다.',
    warning: '오후 5시 30분, 갑작스러운 결재 누락 건 발견 주의! 꼼꼼히 문서를 한 번 더 확인하고 메일함을 점검하세요.',
    happenstanceType: '유연성(Flexibility)'
  },
  ISTP: {
    title: '자발적 아웃사이더 장인',
    mascot: 'think',
    description: '말 대신 묵묵한 실무 해결 능력으로 존재감을 증명하는 해결사! 과도한 참견을 싫어하며 조용한 고효율을 추구합니다.',
    fortune: '혼자 집중하는 환경에서 최대 능률이 나옵니다. 불필요한 메신저 창은 최소화하고 딥워크를 진행해보세요.',
    happenstance: '난관에 부딪히거나 장비가 고장 나는 등 돌발 사고 상황은 당신의 문제해결 "호기심"을 발동시킵니다. 당황하지 않고 원인을 규명하면 업무 역량이 한 단계 더 점프합니다.',
    warning: '회의 중 메커니즘 설명 생략으로 불친절하다는 인상을 주지 않도록, 비개발자 동료의 눈높이에서 설명해주세요.',
    happenstanceType: '호기심(Curiosity)'
  },
  ISFJ: {
    title: '보이지 않는 서포터',
    mascot: 'smile',
    description: '드러나지 않는 곳에서 남들이 놓친 디테일을 메워주는 사내의 수호천사! 묵묵히 헌신하며 안정을 도모합니다.',
    fortune: '보이지 않던 당신의 소중한 노력을 상사나 동료가 비로소 알아주고 고마움을 표시하는 보람찬 날입니다.',
    happenstance: '다른 동료의 긴급 업무를 조력하며 상호 배려를 기르는 과정은 "인내성"의 건강한 성취가 됩니다. 희생보다는 동료와 파트너가 되어 윈-윈하는 우연을 만들어보세요.',
    warning: '부탁을 거절하지 못해 남의 일까지 도맡기 주의! 본인의 투두리스트를 우선 정리해야 번아웃을 예방합니다.',
    happenstanceType: '인내성(Persistence)'
  },
  ISFP: {
    title: '평화주의 아티스트',
    mascot: 'smile',
    description: '사내 갈등을 유연하게 피해 가며 조용하고 잔잔하게 팀에 기여하는 예술가! 다정하고 따뜻한 심성을 갖고 있습니다.',
    fortune: '갈등이 없는 평화로운 사무실 분위기 속에서 조용하고 편안하게 루틴 업무를 마칠 수 있는 날입니다.',
    happenstance: '업무상 생기는 사소한 변동 사항에도 융통성 있게 대응하는 당신 특유의 "유연성"은 훌륭한 장점입니다. 오늘 마주하는 돌발 스케줄도 순리대로 편안하게 받아들이세요.',
    warning: '동료의 피드백 요구에 마냥 "다 좋아요"만 대답하다 나중에 꼬이지 않도록, 필요한 의견은 명확히 피력하세요.',
    happenstanceType: '유연성(Flexibility)'
  },
  INTJ: {
    title: '전략 기획실 AI',
    mascot: 'think',
    description: '철저한 데이터 분석과 논리적 아키텍처를 바탕으로 전략을 짜는 사내 브레인! 비효율적인 시스템 개선에 관심이 많습니다.',
    fortune: '장기적인 문제점을 통찰하여 훌륭한 기획 초안을 마련하기에 더없이 좋은 날입니다. 냉철한 비전이 빛을 발합니다.',
    happenstance: '예기치 못한 장애나 시스템 한계 상황을 문제 극복의 "호기심"과 도전의 기회로 바라보세요. 혁신적인 오피스 생존법이나 자동화 단축 아이디어를 탄생시킬 수 있습니다.',
    warning: '지나치게 냉소적인 어조로 피드백을 전달하다 동료의 마음에 스크래치를 내지 않도록 조심하세요.',
    happenstanceType: '호기심(Curiosity)'
  },
  INTP: {
    title: '회의실 구석 씽크탱크',
    mascot: 'think',
    description: '복잡한 이론과 기술적 개념에 깊이 몰두하여 조용히 진리를 밝혀내는 딥씽커! 아이디어의 완벽한 구조를 고민합니다.',
    fortune: '그동안 안 풀리던 문제의 원인을 조용히 밝혀내고 효율화할 수 있는 영감이 스쳐 가는 하루입니다.',
    happenstance: '새로운 난제가 떨어졌을 때 흥미롭게 대처하는 태도는 훌륭한 "호기심"의 실천입니다. 예기치 않은 질문을 받아도 당황하지 말고 논리적인 해법을 차분히 탐색해보세요.',
    warning: '구두 인사 대신 슬랙으로만 소통하다 메신저 소외감을 느끼지 않도록 가벼운 눈인사를 건네보세요.',
    happenstanceType: '호기심(Curiosity)'
  },
  INFJ: {
    title: '직장인 해탈 멘토',
    mascot: 'smile',
    description: '보이지 않는 동료들의 가치와 잠재력을 찾아주고 싶어 하는 사내 상담가! 깊은 공감력과 묵직한 조언을 해줍니다.',
    fortune: '속 깊은 메신저 대화나 티타임을 통해 상대방에게 진정한 영감과 응원을 선사할 수 있는 가치 있는 날입니다.',
    happenstance: '타인의 오해나 실망 앞에서도 장기적인 성장을 바라보며 버티는 "인내성"을 유지하세요. 오늘의 사소한 오해는 결국 서로의 진정성을 깊이 깨닫는 우연한 다리가 됩니다.',
    warning: '사내 가십이나 뒷담화에 휩쓸리지 않도록 한 귀로 듣고 한 귀로 조용히 흘려버리세요.',
    happenstanceType: '인내성(Persistence)'
  },
  INFP: {
    title: '회의실 구석의 평화주의 몽상가',
    mascot: 'sad',
    description: '치열한 사내 정치나 갈등을 지극히 경계하며, 동료들의 정서적 안정을 바라는 이상주의자! 겉은 조용하지만 내면은 따뜻합니다.',
    fortune: '팀원들이 서로 격려하며 일하는 훈훈한 업무 무드 속에 잔잔하게 힐링과 만족감을 채울 수 있는 날입니다.',
    happenstance: '갈등 상황이 빚어지더라도 평정심을 유지하며 상황을 조율하는 "낙관성"과 배려를 발휘해보세요. 예기치 않은 동료의 불만이 따뜻한 진심 교류의 기회가 됩니다.',
    warning: '오후 4시 반, 사소한 단어 선택에 밤잠을 설칠 걱정 주의! 팀장님의 "확인했습니다"는 진짜 확인했다는 뜻이니 확대해석하지 마세요.',
    happenstanceType: '낙관성(Optimism)'
  }
};

export const MBTI_MODIFIERS = {
  ESTJ: '철두철미 엑셀마스터', ESTP: '영업본부 불도저', ESFJ: '사내 복지 복덕방', ESFP: '워크샵 댄싱킹',
  ENTJ: '야망 가득 PM', ENTP: '아이디어 폭격기', ENFJ: '소통의 아이콘', ENFP: '아이디어 부스터',
  ISTJ: '정시퇴근 캘린더', ISTP: '자발적 아웃사이더', ISFJ: '보이지 않는 서포터', ISFP: '평화주의 아티스트',
  INTJ: '전략 기획실 AI', INTP: '회의실 구석 씽크탱크', INFJ: '직장인 해탈 멘토', INFP: '회의실 구석 몽상가'
};

export function generateWitNickname(mbti, zodiac, role, tarotId) {
  let modifier = '평화주의 아티스트';
  if (mbti) {
    modifier = MBTI_MODIFIERS[mbti] || '평화주의 아티스트';
  } else if (tarotId) {
    const tarotNames = { 
      fool: '자유로운 바보', 
      magician: '기획 마법사', 
      empress: '포용력 여황제', 
      hermit: '딥워크 은둔자',
      chariot: '추진력 전차장',
      wheel: '변화무쌍 운명가'
    };
    modifier = tarotNames[tarotId] || '신비로운 운명가';
  }
  
  let roleTitle = '사원';
  if (role.includes('인턴') || role.includes('주니어')) roleTitle = '주니어';
  else if (role.includes('사원') || role.includes('연구원')) roleTitle = '사원';
  else if (role.includes('대리') || role.includes('선임')) roleTitle = '대리';
  else if (role.includes('과장') || role.includes('차장') || role.includes('책임')) roleTitle = '과장';
  else if (role.includes('부장') || role.includes('수석')) roleTitle = '부장';
  else if (role.includes('임원') || role.includes('대표')) roleTitle = '대표';

  return `${modifier} ${zodiac}${roleTitle}`;
}

export function calculateScore(host, guest) {
  let score = 50;
  const hMbti = host.mbti;
  const gMbti = guest.mbti;
  if (!hMbti || !gMbti || hMbti.length !== 4 || gMbti.length !== 4) return score;

  if (hMbti[1] === gMbti[1]) score += 20; // 인식 기능 일치
  if (hMbti[2] !== gMbti[2]) score += 15; // T/F 상호보완
  if (hMbti[0] !== gMbti[0]) score += 10; // 외향/내향 보완
  if (hMbti[3] !== gMbti[3]) score += 5;  // 생활 양식 조화

  const zodiacHarmony = {
    '쥐': ['용', '원숭이'], '소': ['뱀', '닭'], '호랑이': ['말', '개'], '토끼': ['양', '돼지'],
    '용': ['쥐', '원숭이'], '뱀': ['소', '닭'], '말': ['호랑이', '개'], '양': ['토끼', '돼지'],
    '원숭이': ['쥐', '용'], '닭': ['소', '뱀'], '개': ['호랑이', '말'], '돼지': ['토끼', '양']
  };
  if (zodiacHarmony[host.zodiac]?.includes(guest.zodiac)) {
    score += 10;
  }
  return Math.min(100, score);
}

export function analyzeRelationship(host, guest, score) {
  const hMbti = host.mbti;
  const gMbti = guest.mbti;

  if (score >= 85) {
    return {
      type: 'savior',
      title: '오늘의 구원자 👼',
      desc: `답답한 회의나 곤란한 상황에서 기막힌 타이밍의 쉴드로 당신을 구해줄 은인입니다. 오늘 이 동료에게 따뜻한 음료 한 잔을 선물해 보세요!`
    };
  }
  if (score <= 55) {
    return {
      type: 'villain',
      title: '피해야 할 대상 ☠️',
      desc: `오늘 하루만큼은 사소한 의견 차이도 스파크로 번질 수 있습니다. 메신저 답장은 3분 정도 여유를 두고 차분하게 하시는 것을 추천합니다.`
    };
  }
  if (hMbti[1] === 'N' && gMbti[1] === 'N') {
    return {
      type: 'booster',
      title: '아이디어 부스터 🚀',
      desc: `두 사람이 탕비실에서 나누는 사소한 잡담 속에서 회사 미래를 바꿀 대박 기획 아이디어가 탄생할 수 있습니다. 적극적인 스몰토크를 권장합니다.`
    };
  }
  if (hMbti[2] === 'F' && gMbti[2] === 'F') {
    return {
      type: 'charger',
      title: '감정 충전기 🔋',
      desc: `지쳐있는 당신의 멘탈을 따뜻한 공감과 맞장구 리액션으로 100% 충전해 줄 햇살 같은 존재입니다. 오늘 커피 타임 파트너로 제격입니다.`
    };
  }
  if (hMbti[2] === 'T' && gMbti[2] === 'T') {
    return {
      type: 'corrector',
      title: '팩트 폭격기 🎯',
      desc: `오늘 당신의 보고서에서 놓치기 쉬운 오탈자나 수식 오류를 칼같이 찾아내 줄 매서운 조력자입니다. 제출 전에 이분께 먼저 슬쩍 보여주세요.`
    };
  }
  return {
    type: 'workmate',
    title: '야근 동반자 ☕',
    desc: `정신없는 업무 일정 속에서 함께 퇴근 송을 흥얼거리며 버텨줄 의리파 동료입니다. 지친 오후 4시, 당 보충 젤리를 나눠 먹으며 힘내세요.`
  };
}
