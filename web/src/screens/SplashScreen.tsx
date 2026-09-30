import React, { useEffect, useState } from 'react';
import { StatusBar } from '../components/StatusBar';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] relative overflow-hidden select-none">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-between px-6 py-8">
        {/* Header Title & Greetings */}
        <div className="flex flex-col items-center text-center mt-4">
          <h1 className="font-serif text-4xl font-bold text-[#9E1B1B] tracking-wide mb-1">
            Ất Tỵ
          </h1>
          <span className="font-serif text-3xl font-bold text-[#9E1B1B] mb-3">
            2025
          </span>
          
          <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
            <span>An khang</span>
            <span className="text-[#9E1B1B]">•</span>
            <span>Thịnh vượng</span>
          </div>
          <p className="text-slate-600 text-sm mt-0.5">
            Vạn sự như ý
          </p>
        </div>

        {/* Central Zodiac Artwork (Ất Tỵ / Vietnamese Tet Artwork) */}
        <div className="relative w-64 h-64 my-auto flex items-center justify-center">
          {/* Decorative halo */}
          <div className="absolute inset-0 rounded-full bg-red-100/50 filter blur-xl"></div>
          
          {/* Snake Illustration Matching Wireframe Screen 1 */}
          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C62828" />
                <stop offset="50%" stopColor="#D32F2F" />
                <stop offset="100%" stopColor="#8E0000" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9A825" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>
            </defs>
            
            {/* Background clouds / apricot blossoms */}
            <circle cx="35" cy="45" r="7" fill="#FFCDD2" opacity="0.8" />
            <circle cx="28" cy="52" r="5" fill="#E57373" opacity="0.6" />
            <circle cx="165" cy="65" r="8" fill="#FFCDD2" opacity="0.8" />
            <circle cx="175" cy="55" r="6" fill="#E57373" opacity="0.7" />

            {/* Stylized Red Golden Snake (Ất Tỵ) */}
            <path
              d="M100 25 C125 25 140 42 140 60 C140 85 105 95 85 110 C65 125 60 145 75 165 C95 190 145 185 155 160 C145 175 110 175 95 160 C80 145 88 130 105 115 C128 95 155 80 155 55 C155 30 130 15 100 15 C75 15 50 30 50 55 C50 70 60 78 70 78 C80 78 88 70 88 60 C88 45 75 42 70 42 C68 42 66 43 65 44 C72 32 85 25 100 25 Z"
              fill="url(#snakeGrad)"
              stroke="#B71C1C"
              strokeWidth="2"
            />
            {/* Intricate decorative scales / patterns */}
            <path d="M98 32 Q105 38 112 32" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M115 45 Q122 52 128 46" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M120 62 Q125 70 130 65" stroke="#FFE082" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M85 125 Q92 132 99 126" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M75 145 Q82 152 89 146" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M105 170 Q115 178 125 172" stroke="#FFE082" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Snake eye & golden crown crest */}
            <circle cx="68" cy="50" r="3.5" fill="#FFE082" />
            <circle cx="67" cy="50" r="1.5" fill="#212121" />
          </svg>
        </div>

        {/* Loading Progress Bar & Status (Khớp Screen 1) */}
        <div className="w-full max-w-xs flex flex-col items-center mb-6">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-[#B3261E] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-3">
            Đang tải ứng dụng...
          </span>

          <button
            onClick={onFinish}
            className="mt-4 text-xs font-semibold text-[#B3261E] hover:underline"
          >
            Chạm để vào ngay &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
