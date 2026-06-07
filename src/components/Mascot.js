'use client';

import React from 'react';

export default function Mascot({ emotion = 'smile', size = 120, mbti = '' }) {
  const normalizedMbti = (mbti || '').toUpperCase();
  
  // MBTI 성향에 따른 안경/수염 여부 판별
  const hasGlasses = normalizedMbti.includes('T');
  const hasMoustache = normalizedMbti.includes('J') && (normalizedMbti.includes('S') || normalizedMbti.includes('T'));
  
  let hatType = null;
  if (normalizedMbti) {
    if (normalizedMbti.includes('E') && normalizedMbti.includes('P')) {
      hatType = 'party';  // 고깔 모자
    } else if (normalizedMbti.includes('E') && normalizedMbti.includes('J')) {
      hatType = 'crown';  // 황금 왕관
    } else if (normalizedMbti.includes('I') && normalizedMbti.includes('P')) {
      hatType = 'beret';  // 화가 베레모
    } else if (normalizedMbti.includes('I') && normalizedMbti.includes('J')) {
      hatType = 'beanie'; // 딥워크 비니
    }
  }

  // 기본 표정을 MBTI 성향에 맞춰 자동 조율 (emotion 지정이 없을 때 보완)
  let mascotEmotion = emotion;
  if (!emotion || emotion === 'smile') {
    if (normalizedMbti.includes('F') && normalizedMbti.includes('P')) {
      mascotEmotion = 'wink';
    } else if (normalizedMbti.includes('T') && normalizedMbti.includes('J')) {
      mascotEmotion = 'think';
    } else if (normalizedMbti.includes('E') && normalizedMbti.includes('F')) {
      mascotEmotion = 'energetic';
    } else if (normalizedMbti.includes('I') && normalizedMbti.includes('T')) {
      mascotEmotion = 'think';
    }
  }

  // 표정별 스타일 및 얼굴 묘사
  const getFaceContent = (emo) => {
    switch (emo) {
      case 'think':
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              <div className="mascot-eye-think"></div>
              <div className="mascot-eye-think"></div>
            </div>
            <div className="mascot-cheeks">
              <div className="mascot-cheek"></div>
              <div className="mascot-cheek"></div>
            </div>
            <div className="mascot-mouth-think"></div>
          </div>
        );
      case 'wink':
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              <div className="mascot-eye"></div>
              <div className="mascot-eye-wink"></div>
            </div>
            <div className="mascot-cheeks">
              <div className="mascot-cheek" style={{ opacity: 0.9 }}></div>
              <div className="mascot-cheek" style={{ opacity: 0.9 }}></div>
            </div>
            <div className="mascot-mouth" style={{ height: '12px' }}></div>
          </div>
        );
      case 'sad':
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              <div className="mascot-eye-sad"></div>
              <div className="mascot-eye-sad"></div>
            </div>
            <div className="mascot-cheeks">
              <div className="mascot-cheek-blue"></div>
              <div className="mascot-cheek-blue"></div>
            </div>
            <div className="mascot-mouth-sad"></div>
          </div>
        );
      case 'energetic':
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              <div className="mascot-eye-star">★</div>
              <div className="mascot-eye-star">★</div>
            </div>
            <div className="mascot-cheeks">
              <div className="mascot-cheek"></div>
              <div className="mascot-cheek"></div>
            </div>
            <div className="mascot-mouth-laugh"></div>
          </div>
        );
      case 'smile':
      default:
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              <div className="mascot-eye"></div>
              <div className="mascot-eye"></div>
            </div>
            <div className="mascot-cheeks">
              <div className="mascot-cheek"></div>
              <div className="mascot-cheek"></div>
            </div>
            <div className="mascot-mouth"></div>
          </div>
        );
    }
  };

  return (
    <div className="mascot-container" style={{ transform: `scale(${size / 120})`, transformOrigin: 'center center' }}>
      <div className="mascot">
        {/* 1. 성향별 모자 데코레이션 */}
        {hatType === 'party' && (
          <div className="mascot-hat-party">
            <div className="cone"></div>
            <div className="pompom"></div>
          </div>
        )}
        {hatType === 'crown' && (
          <div className="mascot-hat-crown">
            <div className="crown-base"></div>
            <div className="crown-jewel"></div>
          </div>
        )}
        {hatType === 'beret' && (
          <div className="mascot-hat-beret">
            <div className="beret-body"></div>
          </div>
        )}
        {hatType === 'beanie' && (
          <div className="mascot-hat-beanie">
            <div className="beanie-body"></div>
          </div>
        )}

        {/* 2. 얼굴 및 본체 영역 */}
        <div className="mascot-face">
          {getFaceContent(mascotEmotion)}
          
          {/* 3. 안경 데코레이션 (눈 위에 절대배치) */}
          {hasGlasses && (
            <div className="mascot-glasses">
              <div className="lens left-lens"></div>
              <div className="lens-bridge"></div>
              <div className="lens right-lens"></div>
            </div>
          )}

          {/* 4. 콧수염 데코레이션 (입 바로 위에 절대배치) */}
          {hasMoustache && (
            <div className="mascot-moustache">
              <div className="mustache-wing left"></div>
              <div className="mustache-wing right"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* 캐릭터 데코레이션용 추가 CSS */}
      <style jsx>{`
        .mascot-container {
          display: inline-block;
          width: 120px;
          height: 120px;
          position: relative;
        }
        .mascot-face-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        /* 생각하는 눈 (일자 모양) */
        .mascot-eye-think {
          width: 16px;
          height: 4px;
          background-color: #1e252b;
          border-radius: 2px;
          margin-top: 5px;
        }
        /* 생각하는 입 (동그라미) */
        .mascot-mouth-think {
          width: 12px;
          height: 12px;
          border: 3px solid #1e252b;
          border-radius: 50%;
          margin: 10px auto 0 auto;
        }
        /* 윙크하는 감은 눈 */
        .mascot-eye-wink {
          width: 14px;
          height: 8px;
          border: 3px solid #1e252b;
          border-top: none;
          border-left: none;
          border-right: none;
          border-radius: 0 0 7px 7px;
          margin-top: 4px;
        }
        /* 슬픈 눈 (눈물 맺힌 눈 모양) */
        .mascot-eye-sad {
          width: 14px;
          height: 14px;
          background-color: #1e252b;
          border-radius: 50%;
          position: relative;
        }
        .mascot-eye-sad::after {
          content: '💧';
          position: absolute;
          font-size: 10px;
          bottom: -10px;
          left: -4px;
          animation: tear-drop 1.5s infinite;
        }
        /* 슬픈 파란 볼터치 */
        .mascot-cheek-blue {
          width: 16px;
          height: 6px;
          background-color: #89cff0;
          border-radius: 50%;
          opacity: 0.8;
        }
        /* 슬픈 입 (역 u 모양) */
        .mascot-mouth-sad {
          width: 16px;
          height: 8px;
          border: 3px solid #1e252b;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          margin: 12px auto 0 auto;
        }
        /* 별 모양 눈 */
        .mascot-eye-star {
          font-size: 18px;
          color: #ffcc00;
          font-weight: bold;
          line-height: 1;
          margin-top: -2px;
        }
        /* 크게 웃는 입 */
        .mascot-mouth-laugh {
          width: 24px;
          height: 14px;
          background-color: #1e252b;
          border-radius: 0 0 16px 16px;
          margin: 8px auto 0 auto;
          position: relative;
          overflow: hidden;
        }
        .mascot-mouth-laugh::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 4px;
          width: 16px;
          height: 6px;
          background-color: #ff8b94;
          border-radius: 8px 8px 0 0;
        }
        
        /* ---------------------------------
           소품 & 모자 데코레이션 스타일
        ---------------------------------- */
        
        /* 1) 고깔 파티모자 (E+P) */
        .mascot-hat-party {
          position: absolute;
          top: -22px;
          left: 42px;
          width: 36px;
          height: 36px;
          z-index: 11;
        }
        .mascot-hat-party .cone {
          width: 0;
          height: 0;
          border-left: 18px solid transparent;
          border-right: 18px solid transparent;
          border-bottom: 30px solid #ff6f3c;
        }
        .mascot-hat-party .pompom {
          position: absolute;
          top: -5px;
          left: 14px;
          width: 8px;
          height: 8px;
          background-color: #f1c40f;
          border-radius: 50%;
        }

        /* 2) 황금 왕관 (E+J) */
        .mascot-hat-crown {
          position: absolute;
          top: -18px;
          left: 37px;
          width: 46px;
          height: 20px;
          z-index: 11;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mascot-hat-crown .crown-base {
          width: 44px;
          height: 15px;
          background-color: #f1c40f;
          clip-path: polygon(0% 100%, 100% 100%, 90% 0%, 70% 60%, 50% 0%, 30% 60%, 10% 0%);
          border-radius: 1px;
        }
        .mascot-hat-crown .crown-jewel {
          width: 24px;
          height: 3px;
          background-color: #e74c3c;
          border-radius: 2px;
          margin-top: 1px;
        }

        /* 3) 화가 베레모 (I+P) */
        .mascot-hat-beret {
          position: absolute;
          top: -12px;
          left: 28px;
          width: 64px;
          height: 20px;
          z-index: 11;
        }
        .mascot-hat-beret .beret-body {
          width: 100%;
          height: 100%;
          background-color: #9b59b6;
          border-radius: 50% 50% 40% 40%;
          transform: rotate(-8deg);
          position: relative;
        }
        .mascot-hat-beret .beret-body::after {
          content: '';
          position: absolute;
          top: -3px;
          left: 30px;
          width: 4px;
          height: 6px;
          background-color: #8e44ad;
          border-radius: 2px;
        }

        /* 4) 딥워크 비니 (I+J) */
        .mascot-hat-beanie {
          position: absolute;
          top: -10px;
          left: 20px;
          width: 80px;
          height: 24px;
          z-index: 11;
        }
        .mascot-hat-beanie .beanie-body {
          width: 100%;
          height: 100%;
          background-color: #34495e;
          border-radius: 35% 35% 15% 15%;
          border-bottom: 4px solid #2c3e50;
        }

        /* 5) 인텔리 안경 (T) */
        .mascot-glasses {
          position: absolute;
          top: 36px;
          left: 10px;
          right: 10px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 8;
          pointer-events: none;
        }
        .mascot-glasses .lens {
          width: 25px;
          height: 25px;
          border: 3px solid #1e252b;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
        }
        .mascot-glasses .lens-bridge {
          width: 12px;
          height: 3px;
          background-color: #1e252b;
        }

        /* 6) 젠틀맨 콧수염 (J + S/T) */
        .mascot-moustache {
          position: absolute;
          top: 55px;
          left: 0;
          right: 0;
          height: 10px;
          display: flex;
          justify-content: center;
          gap: 1px;
          z-index: 9;
          pointer-events: none;
        }
        .mascot-moustache .mustache-wing {
          width: 13px;
          height: 6px;
          background-color: #1e252b;
        }
        .mascot-moustache .mustache-wing.left {
          border-radius: 6px 0 0 6px;
          transform: rotate(-12deg);
        }
        .mascot-moustache .mustache-wing.right {
          border-radius: 0 6px 6px 0;
          transform: rotate(12deg);
        }

        @keyframes tear-drop {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          70% { transform: translateY(6px) scale(0.8); opacity: 0.5; }
          100% { transform: translateY(10px) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
