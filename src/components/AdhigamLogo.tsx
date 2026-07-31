import React from 'react';

interface AdhigamLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showMotto?: boolean;
}

export const AdhigamLogo: React.FC<AdhigamLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showMotto = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const dimensions = sizeMap[size] || 'w-10 h-10';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* SVG Seal Emblem */}
      <div className={`relative ${dimensions} shrink-0`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Canvas (Soft Parchment Cream) */}
          <circle cx="100" cy="100" r="96" fill="#FDFBF7" stroke="#0F2C59" strokeWidth="4" />
          <circle cx="100" cy="100" r="88" stroke="#0F2C59" strokeWidth="1.5" strokeDasharray="none" />

          {/* Golden Laurel Wreath (Left & Right) */}
          {/* Left Laurel Leaves */}
          <g fill="#C5892A">
            <path d="M 42 105 C 38 90, 45 75, 52 65 C 50 72, 48 82, 50 90 Z" />
            <path d="M 48 115 C 42 102, 46 88, 56 78 C 52 86, 52 96, 55 105 Z" />
            <path d="M 55 125 C 48 115, 50 100, 62 90 C 58 98, 58 108, 62 118 Z" />
            {/* Right Laurel Leaves */}
            <path d="M 158 105 C 162 90, 155 75, 148 65 C 150 72, 152 82, 150 90 Z" />
            <path d="M 152 115 C 158 102, 154 88, 144 78 C 148 86, 148 96, 145 105 Z" />
            <path d="M 145 125 C 152 115, 150 100, 138 90 C 142 98, 142 108, 138 118 Z" />
          </g>

          {/* Open Book (Center) */}
          <path
            d="M 60 110 C 75 105, 95 106, 100 112 C 105 106, 125 105, 140 110 L 138 80 C 122 75, 105 76, 100 81 C 95 76, 78 75, 62 80 Z"
            fill="#FFF"
            stroke="#0F2C59"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Book Spine and Page Lines */}
          <path d="M 100 81 L 100 112" stroke="#0F2C59" strokeWidth="2" />
          <path d="M 68 87 Q 82 83 94 88" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
          <path d="M 68 94 Q 82 90 94 95" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
          <path d="M 68 101 Q 82 97 94 102" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
          <path d="M 106 88 Q 118 83 132 87" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
          <path d="M 106 95 Q 118 90 132 94" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />
          <path d="M 106 102 Q 118 97 132 101" stroke="#0F2C59" strokeWidth="1" strokeLinecap="round" />

          {/* Diya Lamp (Top Center above book) */}
          <path
            d="M 82 66 C 82 76, 118 76, 118 66 C 112 73, 88 73, 82 66 Z"
            fill="#B45309"
            stroke="#0F2C59"
            strokeWidth="1.5"
          />
          <path
            d="M 84 66 C 88 62, 112 62, 116 66 C 110 70, 90 70, 84 66 Z"
            fill="#D97706"
            stroke="#0F2C59"
            strokeWidth="1"
          />
          {/* Flame */}
          <path
            d="M 100 40 C 107 50, 105 58, 100 62 C 95 58, 93 50, 100 40 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1"
          />
          <path
            d="M 100 46 C 104 52, 103 57, 100 60 C 97 57, 96 52, 100 46 Z"
            fill="#FEF08A"
          />

          {/* Ink Pot & Quill Pen (Right side on top of book) */}
          {/* Ink pot */}
          <path
            d="M 122 102 L 132 102 L 134 108 C 134 110, 120 110, 120 108 Z"
            fill="#0F2C59"
          />
          {/* Quill Pen */}
          <path
            d="M 127 102 Q 140 80 148 68 C 145 74 135 88 127 102 Z"
            fill="#0F2C59"
          />

          {/* Text inside Seal */}
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fill="#0F2C59"
            fontSize="14"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="1"
          >
            ADHIGAM IAS
          </text>

          {/* Bottom Open Ribbon Icon */}
          <path
            d="M 85 138 Q 100 144 115 138 Q 100 148 85 138 Z"
            fill="#0F2C59"
          />

          {/* Circular Motto Text Arc along bottom perimeter */}
          <path id="mottoPath" d="M 28 125 A 78 78 0 0 0 172 125" fill="none" />
          <text fontSize="7.5" fontWeight="700" fill="#0F2C59" letterSpacing="0.4">
            <textPath href="#mottoPath" startOffset="50%" textAnchor="middle">
              DRIVEN BY DISCIPLINE, FUELED BY KNOWLEDGE
            </textPath>
          </text>
        </svg>
      </div>

      {/* Optional Side Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif-heading font-extrabold text-base sm:text-lg text-[#0F2C59] tracking-tight leading-none">
            ADHIGAM IAS
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#D97706] tracking-wider uppercase mt-0.5">
            Premier Civil Services Academy
          </span>
          {showMotto && (
            <span className="text-[9px] text-slate-500 font-medium tracking-wide mt-0.5 hidden lg:block">
              Driven by Discipline, Fueled by Knowledge
            </span>
          )}
        </div>
      )}
    </div>
  );
};
