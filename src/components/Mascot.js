'use client';

import React from 'react';

export default function Mascot({ emotion = 'smile', size = 120 }) {
  // 표정별 스타일 및 얼굴 묘사
  const getFaceContent = () => {
    switch (emotion) {
      case 'think':
        return (
          <div className="mascot-face-inner">
            <div className="mascot-eyes">
              {/* 생각 중인 눈 모양 (가로 선 또는 사선) */}
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
    <div className="mascot-container" style={{ transform: `scale(${size / 120})` }}>
      <div className="mascot">
        <div className="mascot-face">
          {getFaceContent()}
        </div>
      </div>
      
      {/* 캐릭터 표정용 추가 CSS (인라인 style 처리 또는 CSS 파일에 오버라이드) */}
      <style jsx>{`
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
        @keyframes tear-drop {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          70% { transform: translateY(6px) scale(0.8); opacity: 0.5; }
          100% { transform: translateY(10px) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
