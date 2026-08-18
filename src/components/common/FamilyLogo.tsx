import React from 'react';

interface FamilyLogoProps {
  variant?: 'color' | 'white' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const FamilyLogo: React.FC<FamilyLogoProps> = ({
  variant = 'color',
  size = 'md',
  className = '',
  showText = true,
}) => {
  // Height configurations
  const heights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 420 180"
        className={`${heights[size]} w-auto shrink-0 overflow-visible`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Market Basket & Grocery Items Illustration */}
        <g id="basket-groceries">
          {/* Green Carrot Leaves */}
          <path
            d="M86 42C82 34 85 24 93 22C95 30 90 38 86 42Z"
            fill={isWhite ? '#a7f3d0' : '#4ade80'}
          />
          <path
            d="M92 40C94 30 102 24 108 28C104 35 98 39 92 40Z"
            fill={isWhite ? '#6ee7b7' : '#22c55e'}
          />
          <path
            d="M89 36C87 26 91 18 97 18C100 24 96 32 89 36Z"
            fill={isWhite ? '#a7f3d0' : '#16a34a'}
          />

          {/* Carrot Body */}
          <path
            d="M84 46C96 43 112 55 120 72C118 78 114 83 110 85C95 86 80 66 84 46Z"
            fill={isWhite ? '#fed7aa' : '#f97316'}
          />
          {/* Carrot stripes */}
          <path
            d="M93 54C98 56 103 62 105 67M89 65C94 67 98 73 100 77"
            stroke={isWhite ? '#ffffff' : '#ea580c'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Milk / Juice Carton (Blue) */}
          <path
            d="M112 40L142 30L156 46L126 56L112 40Z"
            fill={isWhite ? '#bae6fd' : '#0284c7'}
          />
          <path
            d="M126 56L156 46V88L126 94V56Z"
            fill={isWhite ? '#7dd3fc' : '#0369a1'}
          />
          <path
            d="M112 40L126 56V94L112 82V40Z"
            fill={isWhite ? '#38bdf8' : '#0ea5e9'}
          />
          {/* Milk cap */}
          <ellipse
            cx="135"
            cy="36"
            rx="6"
            ry="4"
            fill={isWhite ? '#ffffff' : '#e0f2fe'}
          />

          {/* Fresh Orange with Leaf */}
          <circle
            cx="138"
            cy="76"
            r="18"
            fill={isWhite ? '#fef08a' : '#eab308'}
          />
          <circle
            cx="134"
            cy="72"
            r="16"
            fill={isWhite ? '#fde047' : '#facc15'}
          />
          <path
            d="M140 60C146 54 154 56 156 62C150 64 144 64 140 60Z"
            fill={isWhite ? '#86efac' : '#22c55e'}
          />

          {/* Blue Triangle Packets / Groceries */}
          <path
            d="M148 88L172 44L196 88H148Z"
            fill={isWhite ? '#93c5fd' : '#38bdf8'}
          />
          <path
            d="M168 88L192 48L216 88H168Z"
            fill={isWhite ? '#60a5fa' : '#0284c7'}
          />

          {/* Green Leaf Accent */}
          <path
            d="M72 82C66 72 74 62 84 62C88 74 80 84 72 82Z"
            fill={isWhite ? '#86efac' : '#4ade80'}
          />
          <path
            d="M76 80L80 66"
            stroke={isWhite ? '#ffffff' : '#16a34a'}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Basket Curved Handles (Orange Double Loop) */}
          <path
            d="M80 94C110 80 150 88 170 94C200 102 230 70 200 48C175 30 150 78 142 108"
            stroke={isWhite ? '#fdba74' : '#f97316'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M100 96C130 84 175 88 190 94C220 104 250 74 220 52C195 34 170 82 160 114"
            stroke={isWhite ? '#fb923c' : '#ea580c'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Cursive "Family" Calligraphy Brand Text */}
        <g id="family-text">
          <text
            x="76"
            y="138"
            fontFamily="'Outfit', 'Plus Jakarta Sans', 'Segoe UI', cursive, sans-serif"
            fontSize="78"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="-2"
            fill={isWhite ? '#ffffff' : '#2b1c6d'}
          >
            Family
          </text>

          {/* Flowing underline swash looping beneath "Family" and "SUPERMARKET" */}
          <path
            d="M48 128C24 136 28 172 64 168C130 162 250 168 316 156C336 152 344 134 336 122C330 112 316 122 308 132"
            stroke={isWhite ? '#ffffff' : '#2b1c6d'}
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* "SUPERMARKET" Subtitle in Crisp Bold Tracking */}
          {showText && (
            <text
              x="162"
              y="155"
              fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
              fontSize="16.5"
              fontWeight="900"
              letterSpacing="7"
              fill={isWhite ? '#fbbf24' : '#ea580c'}
            >
              SUPERMARKET
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
