import React, { useState } from 'react';

interface AdhigamLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  showMotto?: boolean;
}

export const AdhigamLogo: React.FC<AdhigamLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showMotto = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: 'w-10 h-10',       // 40px
    md: 'w-14 h-14',       // 56px - Prominent in Nav
    lg: 'w-22 h-22',       // 88px
    xl: 'w-36 h-36',       // 144px - Hero Crest
    '2xl': 'w-48 h-48',    // 192px - Grand Display
  };

  const dimensions = sizeMap[size] || 'w-14 h-14';

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Official Seal Emblem */}
      <div className={`relative ${dimensions} shrink-0 rounded-full overflow-hidden drop-shadow-md bg-white p-0.5 border border-amber-400/40 flex items-center justify-center`}>
        {!imageError ? (
          <img
            src="/adhigam-logo.png"
            alt="ADHIGAM IAS Official Seal"
            className="w-full h-full object-contain rounded-full transition-transform hover:scale-105 duration-200"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Vector Fallback matching the official emblem */
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="97" fill="#FDFBF7" stroke="#0F2C59" strokeWidth="4.5" />
            <circle cx="100" cy="100" r="89" stroke="#C5892A" strokeWidth="2" />
            <circle cx="100" cy="100" r="85" stroke="#0F2C59" strokeWidth="1" strokeDasharray="2 3" />

            {/* Golden Laurel Wreath */}
            <g fill="#C5892A">
              <path d="M 42 105 C 38 90, 45 75, 52 65 C 50 72, 48 82, 50 90 Z" />
              <path d="M 48 115 C 42 102, 46 88, 56 78 C 52 86, 52 96, 55 105 Z" />
              <path d="M 55 125 C 48 115, 50 100, 62 90 C 58 98, 58 108, 62 118 Z" />
              <path d="M 158 105 C 162 90, 155 75, 148 65 C 150 72, 152 82, 150 90 Z" />
              <path d="M 152 115 C 158 102, 154 88, 144 78 C 148 86, 148 96, 145 105 Z" />
              <path d="M 145 125 C 152 115, 150 100, 138 90 C 142 98, 142 108, 138 118 Z" />
            </g>

            {/* Open Book */}
            <path
              d="M 60 110 C 75 105, 95 106, 100 112 C 105 106, 125 105, 140 110 L 138 80 C 122 75, 105 76, 100 81 C 95 76, 78 75, 62 80 Z"
              fill="#FFF"
              stroke="#0F2C59"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M 100 81 L 100 112" stroke="#0F2C59" strokeWidth="2" />
            <path d="M 68 87 Q 82 83 94 88" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
            <path d="M 68 94 Q 82 90 94 95" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
            <path d="M 106 88 Q 118 83 132 87" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
            <path d="M 106 95 Q 118 90 132 94" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />

            {/* Diya Lamp */}
            <path d="M 82 66 C 82 76, 118 76, 118 66 C 112 73, 88 73, 82 66 Z" fill="#B45309" stroke="#0F2C59" strokeWidth="1.5" />
            <path d="M 84 66 C 88 62, 112 62, 116 66 C 110 70, 90 70, 84 66 Z" fill="#D97706" stroke="#0F2C59" strokeWidth="1" />
            <path d="M 100 40 C 107 50, 105 58, 100 62 C 95 58, 93 50, 100 40 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <path d="M 100 46 C 104 52, 103 57, 100 60 C 97 57, 96 52, 100 46 Z" fill="#FEF08A" />

            {/* Inkpot & Quill Pen */}
            <path d="M 122 102 L 132 102 L 134 108 C 134 110, 120 110, 120 108 Z" fill="#0F2C59" />
            <path d="M 127 102 Q 140 80 148 68 C 145 74 135 88 127 102 Z" fill="#0F2C59" />

            {/* Text inside Seal */}
            <text x="100" y="130" textAnchor="middle" fill="#0F2C59" fontSize="14.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.2">
              ADHIGAM IAS
            </text>

            <path d="M 85 138 Q 100 144 115 138 Q 100 148 85 138 Z" fill="#C5892A" />

            {/* Circular Motto Text Arc */}
            <path id="mottoPath" d="M 26 126 A 79 79 0 0 0 174 126" fill="none" />
            <text fontSize="7.8" fontWeight="800" fill="#0F2C59" letterSpacing="0.45">
              <textPath href="#mottoPath" startOffset="50%" textAnchor="middle">
                DRIVEN BY DISCIPLINE, FUELED BY KNOWLEDGE
              </textPath>
            </text>
          </svg>
        )}
      </div>

      {/* Accompanying Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif-heading font-black text-lg sm:text-xl text-[#0F2C59] tracking-tight leading-tight">
            ADHIGAM IAS
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[#D97706] tracking-wider uppercase">
            Academy for Civil Services
          </span>
          {showMotto && (
            <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 hidden lg:block">
              Driven by Discipline, Fueled by Knowledge
            </span>
          )}
        </div>
      )}
    </div>
  );
};
