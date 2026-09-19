import React from 'react';
import { SilhouetteType, ShoeColor } from '../types';

interface ShoePlaceholderMockupProps {
  silhouette: SilhouetteType;
  primaryColor?: ShoeColor;
  aspectRatio?: '4:3' | '16:9' | '1:1';
  className?: string;
  shoeName?: string;
  showTechnicalDetails?: boolean;
  wireframeOnly?: boolean;
}

export const ShoePlaceholderMockup: React.FC<ShoePlaceholderMockupProps> = ({
  silhouette,
  primaryColor,
  aspectRatio = '4:3',
  className = '',
  shoeName,
  showTechnicalDetails = true,
  wireframeOnly = false,
}) => {
  const accentHex = primaryColor?.hex || '#38bdf8';
  const colorName = primaryColor?.name || 'Standard Spec';

  const ratioClass = 
    aspectRatio === '16:9' ? 'aspect-video' :
    aspectRatio === '1:1' ? 'aspect-square' :
    'aspect-[4/3]';

  // Vector silhouette renderer based on footwear type
  const renderShoeSilhouette = () => {
    switch (silhouette) {
      case 'sneaker-running':
        return (
          <g>
            {/* Sole & Midsole */}
            <path
              d="M 60 215 Q 120 220 200 220 Q 280 220 330 200 Q 340 195 345 185 L 340 180 Q 280 200 180 198 Q 110 198 60 215 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.25}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cushion pods */}
            <path d="M 120 210 Q 150 218 180 210" stroke={accentHex} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
            <path d="M 210 210 Q 240 218 270 210" stroke={accentHex} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
            {/* Upper body */}
            <path
              d="M 60 215 C 65 160 100 130 140 120 C 170 112 185 135 220 150 C 260 165 310 170 340 180 L 330 200 C 270 200 180 198 60 215 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.12}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Collar & Tongue */}
            <path d="M 140 120 C 130 105 150 95 165 105 C 180 115 175 130 185 135" stroke={accentHex} strokeWidth="2" fill="none" />
            <path d="M 145 110 C 135 125 135 145 140 155" stroke={accentHex} strokeWidth="1.5" fill="none" />
            {/* Lacing eyelet stay */}
            <line x1="170" y1="125" x2="225" y2="152" stroke={accentHex} strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="180" y1="130" x2="190" y2="140" stroke={accentHex} strokeWidth="2" />
            <line x1="195" y1="137" x2="205" y2="147" stroke={accentHex} strokeWidth="2" />
            <line x1="210" y1="144" x2="220" y2="154" stroke={accentHex} strokeWidth="2" />
            {/* Swoop / Flow lines */}
            <path d="M 90 175 Q 160 160 260 175" stroke={accentHex} strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
          </g>
        );

      case 'sneaker-high':
        return (
          <g>
            {/* High collar ankle support */}
            <path
              d="M 85 85 L 140 90 L 145 135 L 205 145 C 260 160 305 170 335 180 L 330 205 C 270 208 170 208 80 205 L 80 110 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.15}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cupsole */}
            <rect x="75" y="205" width="260" height="15" rx="3" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.3" stroke={accentHex} strokeWidth="2" />
            {/* Ankle strap & collar padding */}
            <path d="M 85 105 L 142 110" stroke={accentHex} strokeWidth="2.5" />
            <circle cx="115" cy="120" r="14" stroke={accentHex} strokeWidth="1.5" fill="none" />
            {/* Toe perforations */}
            <circle cx="280" cy="180" r="1.5" fill={accentHex} />
            <circle cx="290" cy="183" r="1.5" fill={accentHex} />
            <circle cx="300" cy="186" r="1.5" fill={accentHex} />
          </g>
        );

      case 'oxford-brogue':
        return (
          <g>
            {/* Sleek low profile formal silhouette */}
            <path
              d="M 65 195 C 65 160 85 135 125 130 C 155 128 175 142 225 152 C 275 162 320 170 345 185 C 345 195 330 205 315 208 L 65 208 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.18}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Stacked heel & leather sole */}
            <rect x="65" y="208" width="55" height="18" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.4" stroke={accentHex} strokeWidth="2" />
            <path d="M 120 208 L 330 208 C 340 208 340 200 335 198 L 120 208" fill={wireframeOnly ? 'none' : accentHex} stroke={accentHex} strokeWidth="2" />
            {/* Brogue cap toe perforation line */}
            <path d="M 270 170 C 275 188 285 200 290 208" stroke={accentHex} strokeWidth="2" strokeDasharray="3 3" />
            {/* Closed lace eyelet tabs */}
            <path d="M 155 132 L 185 145" stroke={accentHex} strokeWidth="2.5" />
            <line x1="162" y1="135" x2="162" y2="142" stroke={accentHex} strokeWidth="2" />
            <line x1="172" y1="139" x2="172" y2="146" stroke={accentHex} strokeWidth="2" />
            <line x1="182" y1="143" x2="182" y2="150" stroke={accentHex} strokeWidth="2" />
          </g>
        );

      case 'loafer-leather':
        return (
          <g>
            {/* Slip-on low cut */}
            <path
              d="M 65 200 C 65 165 90 148 135 148 C 170 148 190 162 235 165 C 280 168 315 175 340 190 L 330 208 L 65 208 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.18}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Stacked heel */}
            <rect x="65" y="208" width="50" height="15" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.35" stroke={accentHex} strokeWidth="2" />
            <line x1="115" y1="208" x2="330" y2="208" stroke={accentHex} strokeWidth="2" />
            {/* Penny strap & moc toe apron */}
            <path d="M 175 155 Q 240 158 290 185" stroke={accentHex} strokeWidth="2" fill="none" />
            <rect x="190" y="152" width="22" height="18" rx="2" stroke={accentHex} strokeWidth="2" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.4" />
          </g>
        );

      case 'chelsea-boot':
        return (
          <g>
            {/* Boot upper with ankle rise */}
            <path
              d="M 85 85 L 140 90 L 150 145 C 190 155 240 162 280 170 C 315 178 335 188 330 205 L 85 205 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.16}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Elastic side gusset V shape */}
            <polygon points="105,95 130,97 122,165 110,165" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.3" stroke={accentHex} strokeWidth="2" />
            {/* Pull tab */}
            <path d="M 85 85 C 80 70 95 70 95 86" stroke={accentHex} strokeWidth="2.5" fill="none" />
            {/* Commando lugged sole */}
            <rect x="80" y="205" width="255" height="18" rx="2" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.3" stroke={accentHex} strokeWidth="2" />
            {/* Sole lug notches */}
            <line x1="95" y1="223" x2="95" y2="218" stroke={accentHex} strokeWidth="2" />
            <line x1="120" y1="223" x2="120" y2="218" stroke={accentHex} strokeWidth="2" />
            <line x1="180" y1="223" x2="180" y2="218" stroke={accentHex} strokeWidth="2" />
            <line x1="240" y1="223" x2="240" y2="218" stroke={accentHex} strokeWidth="2" />
            <line x1="300" y1="223" x2="300" y2="218" stroke={accentHex} strokeWidth="2" />
          </g>
        );

      case 'hiking-boot':
        return (
          <g>
            {/* Heavy high ankle shaft */}
            <path
              d="M 80 80 L 150 85 L 160 135 C 200 145 250 155 300 165 C 330 172 345 185 340 205 L 75 205 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.16}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Padded collar ribs */}
            <path d="M 85 92 Q 115 95 145 96" stroke={accentHex} strokeWidth="3" strokeLinecap="round" />
            <path d="M 88 104 Q 115 107 142 108" stroke={accentHex} strokeWidth="3" strokeLinecap="round" />
            {/* Reinforced rubber toe bumper */}
            <path d="M 285 190 Q 320 188 335 205 L 280 205 Z" fill={accentHex} fillOpacity="0.35" stroke={accentHex} strokeWidth="2" />
            {/* Deep cleated lugs sole */}
            <path d="M 75 205 L 340 205 L 340 226 L 75 226 Z" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.4" stroke={accentHex} strokeWidth="2" />
            {/* Speed lace D-rings */}
            <circle cx="160" cy="118" r="3" fill={accentHex} />
            <circle cx="175" cy="132" r="3" fill={accentHex} />
            <circle cx="195" cy="144" r="3" fill={accentHex} />
            <circle cx="220" cy="154" r="3" fill={accentHex} />
          </g>
        );

      case 'slide-sandal':
        return (
          <g>
            {/* Ergonomic contoured cork footbed */}
            <path
              d="M 70 195 C 100 205 140 205 170 198 C 210 192 270 195 330 200 L 330 215 C 270 215 140 215 70 215 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.28}
              stroke={accentHex}
              strokeWidth="2.5"
            />
            {/* Wide buckled upper strap */}
            <path
              d="M 150 198 C 150 145 250 145 260 196"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.2}
              stroke={accentHex}
              strokeWidth="3.5"
            />
            {/* Buckle details */}
            <rect x="180" y="160" width="16" height="20" rx="3" stroke={accentHex} strokeWidth="2" fill="none" />
            <rect x="220" y="162" width="16" height="20" rx="3" stroke={accentHex} strokeWidth="2" fill="none" />
          </g>
        );

      case 'strappy-sandal':
        return (
          <g>
            {/* Thin minimalist sole */}
            <line x1="75" y1="210" x2="330" y2="210" stroke={accentHex} strokeWidth="3.5" strokeLinecap="round" />
            {/* Toe loop / strap */}
            <path d="M 290 210 Q 300 185 310 210" stroke={accentHex} strokeWidth="2.5" fill="none" />
            {/* Criss-cross instep straps */}
            <path d="M 170 210 Q 200 160 250 185" stroke={accentHex} strokeWidth="2" fill="none" />
            <path d="M 220 210 Q 190 165 160 180" stroke={accentHex} strokeWidth="2" fill="none" />
            {/* Ankle lace wrap */}
            <path d="M 120 210 Q 115 140 135 110" stroke={accentHex} strokeWidth="2" fill="none" />
            <path d="M 140 210 Q 145 140 125 110" stroke={accentHex} strokeWidth="2" fill="none" />
          </g>
        );

      case 'pump-heel':
        return (
          <g>
            {/* High arch feminine pump silhouette */}
            <path
              d="M 110 130 C 120 170 150 195 210 200 C 260 200 300 195 330 205 L 320 215 C 260 215 210 210 170 195 C 130 180 100 160 100 130 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.22}
              stroke={accentHex}
              strokeWidth="2.5"
            />
            {/* Sculpted block / stiletto heel */}
            <polygon points="102,135 116,135 105,215 95,215" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.45" stroke={accentHex} strokeWidth="2" />
            {/* Delicate ankle buckle strap */}
            <path d="M 105 130 C 95 100 135 90 145 115" stroke={accentHex} strokeWidth="2" fill="none" />
          </g>
        );

      case 'canvas-casual':
        return (
          <g>
            {/* Vulcanized classic skater canvas profile */}
            <path
              d="M 65 200 C 70 165 95 148 135 145 C 170 142 200 155 245 165 C 285 172 320 180 340 195 L 330 205 L 65 205 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.15}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Vulcanized foxing tape band */}
            <rect x="62" y="205" width="278" height="15" rx="3" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.35" stroke={accentHex} strokeWidth="2" />
            {/* Rubber toe cap cap */}
            <path d="M 290 185 Q 335 185 338 205 L 290 205 Z" fill={accentHex} fillOpacity="0.25" stroke={accentHex} strokeWidth="2" />
            {/* Metal eyelets and flat laces */}
            <circle cx="150" cy="155" r="2.5" fill={accentHex} />
            <circle cx="170" cy="160" r="2.5" fill={accentHex} />
            <circle cx="190" cy="165" r="2.5" fill={accentHex} />
            <circle cx="210" cy="170" r="2.5" fill={accentHex} />
          </g>
        );

      case 'kids-trainer':
      default:
        return (
          <g>
            {/* Rounded chunky durable kids trainer */}
            <path
              d="M 80 205 C 80 155 110 135 150 135 C 185 135 210 150 250 160 C 285 170 315 180 325 195 L 320 205 Z"
              fill={wireframeOnly ? 'none' : accentHex}
              fillOpacity={wireframeOnly ? 0 : 0.2}
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Flexible bumper sole */}
            <rect x="75" y="205" width="250" height="18" rx="8" fill={wireframeOnly ? 'none' : accentHex} fillOpacity="0.3" stroke={accentHex} strokeWidth="2" />
            {/* Dual velcro strap tabs */}
            <rect x="155" y="142" width="55" height="10" rx="3" fill={accentHex} fillOpacity="0.4" stroke={accentHex} strokeWidth="1.5" />
            <rect x="180" y="157" width="55" height="10" rx="3" fill={accentHex} fillOpacity="0.4" stroke={accentHex} strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative w-full ${ratioClass} overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-900 flex items-center justify-center select-none group ${className}`}
      style={{
        background: wireframeOnly
          ? 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
          : `radial-gradient(ellipse at 50% 60%, ${accentHex}18 0%, #090d16 85%)`,
      }}
    >
      {/* Blueprint grid pattern overlay for initial design mockup aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accentHex}22 1px, transparent 1px),
            linear-gradient(to bottom, ${accentHex}22 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Crosshair precision marks in corners */}
      <div className="absolute top-2.5 left-2.5 text-[10px] font-mono font-medium text-neutral-500 tracking-wider flex items-center gap-1.5">
        <span className="text-neutral-400">+</span>
        <span>MOCKUP REF // {silhouette.toUpperCase()}</span>
      </div>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-neutral-800/90 text-neutral-300 border border-neutral-700">
          DESIGN ASSET
        </span>
      </div>

      {/* Main Vector SVG Footwear Silhouette Canvas */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full p-6 transition-transform duration-500 ease-out group-hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle horizontal alignment baseline */}
        <line x1="40" y1="235" x2="360" y2="235" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

        {/* Dynamic Shoe Silhouette */}
        {renderShoeSilhouette()}

        {/* Color tone dot indicator in SVG */}
        <circle cx="345" cy="55" r="5" fill={accentHex} />
        <circle cx="345" cy="55" r="9" stroke={accentHex} strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      </svg>

      {/* Bottom Technical Spec Footer */}
      {showTechnicalDetails && (
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-neutral-950/75 backdrop-blur-xs px-2.5 py-1 rounded border border-neutral-800">
          <span className="truncate max-w-[170px] text-neutral-300 font-medium">
            {shoeName || silhouette}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentHex }} />
              <span className="text-neutral-400">{colorName}</span>
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-emerald-400 font-semibold">PLACEHOLDER</span>
          </div>
        </div>
      )}
    </div>
  );
};
