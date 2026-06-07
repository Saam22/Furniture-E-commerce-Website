import { useState, useCallback, useEffect } from 'react';
import '../styles/ChairDesigner.css';
import Furniture3D from './Furniture3D';
import { getActiveOffers } from '../utils/discountUtils';

const C = {
  FABRIC: [
    { name: 'بيج', value: '#D4C5A9' },
    { name: 'كحلي', value: '#1B2A4A' },
    { name: 'أخضر غابات', value: '#2D5A27' },
    { name: 'عنّابي', value: '#6B2020' },
    { name: 'رمادي غامق', value: '#4A4A4A' },
    { name: 'تركواز', value: '#1A6B65' },
    { name: 'خردلي', value: '#D4A538' },
    { name: 'وردي فاتح', value: '#D4A0A0' },
  ],
  WOOD: [
    { name: 'بلوط فاتح', value: '#DEB887' },
    { name: 'جوز', value: '#5C4033' },
    { name: 'ماهوجني', value: '#4A2C1A' },
    { name: 'أسود', value: '#1a1a1a' },
    { name: 'رمادي', value: '#8a8a8a' },
    { name: 'أبيض', value: '#f0f0f0' },
  ],
  LEGS: [
    { name: 'مستقيم', value: 'straight' },
    { name: 'مائل', value: 'angled' },
    { name: 'متقاطع', value: 'cross' },
    { name: 'معدن', value: 'metal' },
    { name: 'ذيل سمكة', value: 'flared' },
  ],
  CUSHION: [
    { name: 'ناعم فخم', value: 'plush' },
    { name: 'ثابت', value: 'firm' },
    { name: 'متوسط', value: 'medium' },
    { name: 'ذاكرة', value: 'memory' },
  ],
  TYPES: [
    { id: 'chair', name: 'كرسي', icon: '◊' },
    { id: 'sofa', name: 'كنبة', icon: '▣' },
    { id: 'table', name: 'طاولة', icon: '⌂' },
    { id: 'bed', name: 'سرير', icon: '▤' },
    { id: 'cabinet', name: 'خزانة', icon: '◫' },
    { id: 'office-chair', name: 'كرسي مكتب', icon: '▥' },
    { id: 'desk', name: 'مكتب', icon: '⊞' },
    { id: 'bookshelf', name: 'رف كتب', icon: '✦' },
  ],
  SOFA_SEATS: [
    { name: 'مقعدين', value: '2-seat' },
    { name: 'ثلاثة مقاعد', value: '3-seat' },
    { name: 'شكل L', value: 'l-shape' },
  ],
  SOFA_BACK: [
    { name: 'مستقيم', value: 'straight' },
    { name: 'ملفوف', value: 'rolled' },
    { name: 'مبطن', value: 'tufted' },
  ],
  SOFA_ARM: [
    { name: 'مربع', value: 'square' },
    { name: 'دائري', value: 'round' },
    { name: 'ملفوف', value: 'rolled' },
    { name: 'مسطح', value: 'track' },
  ],
  SOFA_DEPTH: [
    { name: 'قياسي', value: 'standard' },
    { name: 'عميق', value: 'deep' },
  ],
  TABLE_SHAPES: [
    { name: 'دائري', value: 'round' },
    { name: 'مستطيل', value: 'rect' },
    { name: 'مربع', value: 'square' },
    { name: 'بيضاوي', value: 'oval' },
  ],
  TABLE_LEGS: [
    { name: '4 أرجل', value: '4legs' },
    { name: 'قاعدة وسط', value: 'pedestal' },
    { name: 'قاعدة حديد', value: 'trestle' },
    { name: 'شكل X', value: 'xbase' },
  ],
  TABLE_SIZES: [
    { name: 'صغير', value: 'small' },
    { name: 'متوسط', value: 'medium' },
    { name: 'كبير', value: 'large' },
    { name: 'كبير جداً', value: 'xlarge' },
  ],
  TABLE_EDGE: [
    { name: 'مستقيم', value: 'straight' },
    { name: 'مشطوف', value: 'beveled' },
    { name: 'دائري', value: 'rounded' },
  ],
  TABLE_MATERIAL: [
    { name: 'خشب صلب', value: 'solid-wood' },
    { name: 'زجاج', value: 'glass' },
    { name: 'رخام', value: 'marble' },
    { name: 'معدن', value: 'metal' },
  ],
  BED_SIZES: [
    { name: 'مفرد', value: 'single' },
    { name: 'مزدوج', value: 'double' },
    { name: 'ملكة', value: 'queen' },
    { name: 'ملكي', value: 'king' },
  ],
  HEADBOARD: [
    { name: 'بسيط', value: 'simple' },
    { name: 'مبطن', value: 'panel' },
    { name: 'مضلع', value: 'tufted' },
    { name: 'أنيق', value: 'sleek' },
  ],
  FOOTBOARD: [
    { name: 'مسطح', value: 'flat' },
    { name: 'ألواح', value: 'paneled' },
    { name: 'شرائح', value: 'slatted' },
    { name: 'بدون', value: 'none' },
  ],
  BED_STORAGE: [
    { name: 'أدراج', value: 'drawers' },
    { name: 'رفع هيدروليك', value: 'hydraulic' },
    { name: 'بدون', value: 'none' },
  ],
  CABINET_DOORS: [
    { name: 'بابين', value: 2 },
    { name: 'ثلاثة أبواب', value: 3 },
    { name: 'أربعة أبواب', value: 4 },
  ],
  CABINET_STYLES: [
    { name: 'مودرن', value: 'modern' },
    { name: 'كلاسيك', value: 'classic' },
    { name: 'ريفي', value: 'rustic' },
    { name: 'صناعي', value: 'industrial' },
  ],
  HANDLE_STYLE: [
    { name: 'بار', value: 'bar' },
    { name: 'كبسول', value: 'knob' },
    { name: 'غائر', value: 'recessed' },
    { name: 'بدون', value: 'none' },
  ],
  CABINET_HEIGHT: [
    { name: 'قصير', value: 'short' },
    { name: 'متوسط', value: 'medium' },
    { name: 'طويل', value: 'tall' },
  ],
  FINISH: [
    { name: 'مات', value: 'matte' },
    { name: 'لامع', value: 'glossy' },
  ],
  FRAME: [
    { name: 'أسود', value: '#222' },
    { name: 'فضي', value: '#aaa' },
    { name: 'أبيض', value: '#eee' },
    { name: 'رمادي', value: '#555' },
    { name: 'ذهبي', value: '#C9A84C' },
  ],
  OC_MATERIAL: [
    { name: 'قماش', value: 'fabric' },
    { name: 'شبك', value: 'mesh' },
    { name: 'جلد', value: 'leather' },
  ],
  DESK_SHAPES: [
    { name: 'مستطيل', value: 'rect' },
    { name: 'شكل L', value: 'lshape' },
    { name: 'زاوية', value: 'corner' },
  ],
  DESK_SIZES: [
    { name: 'صغير', value: 'small' },
    { name: 'متوسط', value: 'medium' },
    { name: 'كبير', value: 'large' },
  ],
  SHELF_COUNTS: [
    { name: '3 رفوف', value: 3 },
    { name: '4 رفوف', value: 4 },
    { name: '5 رفوف', value: 5 },
    { name: '6 رفوف', value: 6 },
  ],
  SHELF_STYLES: [
    { name: 'مفتوح', value: 'open' },
    { name: 'بأبواب', value: 'closed' },
    { name: 'مختلط', value: 'mixed' },
  ],
  BS_SHAPE: [
    { name: 'قياسي', value: 'standard' },
    { name: 'غير متماثل', value: 'asymmetric' },
    { name: 'سلم', value: 'ladder' },
  ],
  BACKREST: [
    { name: 'عالي', value: 'high' },
    { name: 'متوسط', value: 'mid' },
    { name: 'منخفض', value: 'low' },
  ],
  ARMSTYLE: [
    { name: 'مبطن', value: 'padded' },
    { name: 'خشبي', value: 'wooden' },
    { name: 'معدني', value: 'metal' },
    { name: 'بدون', value: 'none' },
  ],
  BASE_TYPE: [
    { name: '4 أرجل', value: '4leg' },
    { name: 'دوار', value: 'swivel' },
    { name: 'هزاز', value: 'rocker' },
  ],
  LED_COLORS: [
    { name: 'دافئ', value: '#FFD700' },
    { name: 'بارد', value: '#F0F8FF' },
    { name: 'أزرق', value: '#00BFFF' },
    { name: 'أخضر', value: '#39FF14' },
    { name: 'بنفسجي', value: '#BF40BF' },
    { name: 'RGB', value: '#FF1493' },
  ],
};

function LegIcon({ value }) {
  if (value === 'flared')
    return <path d="M 14 5 L 10 35 L 16 35 L 18 5 Z" fill="currentColor" />;
  if (value === 'straight')
    return <rect x="14" y="5" width="12" height="30" rx="3" fill="currentColor" />;
  if (value === 'angled')
    return <path d="M 16 5 L 8 35 L 16 35 L 24 5 Z" fill="currentColor" />;
  if (value === 'cross')
    return (<><line x1="10" y1="5" x2="30" y2="35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><line x1="30" y1="5" x2="10" y2="35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></>);
  return (<><rect x="16" y="5" width="4" height="28" rx="2" fill="currentColor" /><rect x="14" y="25" width="8" height="3" rx="1" fill="currentColor" /></>);
}

function CushionIcon({ value }) {
  const rx = value === 'plush' ? 8 : value === 'firm' ? 2 : 5;
  return (
    <svg viewBox="0 0 40 24" className="opt-icon">
      <rect x="4" y="4" width="32" height="16" rx={rx} fill="currentColor" />
      {value === 'memory' && <ellipse cx="20" cy="16" rx="12" ry="3" fill="rgba(0,0,0,0.15)" />}
    </svg>
  );
}

function darken(hex, amt) {
  const c = parseInt(hex.replace('#', ''), 16);
  const r = Math.max((c >> 16) - amt, 0);
  const g = Math.max(((c >> 8) & 0xff) - amt, 0);
  const b = Math.max((c & 0xff) - amt, 0);
  return `rgb(${r},${g},${b})`;
}

function depthRects(color, depth) {
  return { fill: darken(color, 30), opacity: 0.5 };
}

function ChairSVG({ fabric, wood, legs, cushion, backrest, armstyle, basetype }) {
  const seatY = cushion === 'plush' ? 165 : 175;
  const seatH = cushion === 'plush' ? 85 : cushion === 'firm' ? 65 : 75;
  const backH = backrest === 'high' ? 155 : backrest === 'low' ? 110 : 140;
  const seatRx = cushion === 'plush' ? 14 : cushion === 'firm' ? 4 : 8;
  const legColor = legs === 'metal' ? '#888' : wood;
  const hasArms = armstyle !== 'none';
  const armW = armstyle === 'padded' ? 24 : armstyle === 'wooden' ? 14 : armstyle === 'metal' ? 10 : 0;

  const renderLegs = () => {
    if (basetype === 'swivel')
      return (<><rect x="190" y="260" width="20" height="20" rx="4" fill={legColor} /><ellipse cx="200" cy="310" rx="40" ry="10" fill={legColor} opacity="0.7" /></>);
    if (basetype === 'rocker')
      return (<><path d="M 110 300 Q 200 330 290 300" fill="none" stroke={legColor} strokeWidth="8" strokeLinecap="round" /><rect x="175" y="270" width="8" height="30" rx="3" fill={legColor} /><rect x="217" y="270" width="8" height="30" rx="3" fill={legColor} /></>);
    if (legs === 'cross')
      return (<g><path d="M 135 260 L 105 315 L 125 315 L 155 260 Z" fill={legColor} /><path d="M 245 260 L 275 315 L 255 315 L 225 260 Z" fill={legColor} /><line x1="125" y1="290" x2="255" y2="290" stroke={legColor} strokeWidth="6" strokeLinecap="round" /></g>);
    if (legs === 'flared')
      return (<g><path d="M 138 258 L 120 310 L 138 310 L 150 258 Z" fill={legColor} /><path d="M 250 258 L 262 310 L 280 310 L 262 258 Z" fill={legColor} /></g>);
    if (legs === 'angled')
      return (<g><path d="M 130 260 L 112 310 L 128 310 L 145 260 Z" fill={legColor} /><path d="M 255 260 L 240 310 L 256 310 L 270 260 Z" fill={legColor} /></g>);
    if (legs === 'metal')
      return (<g><rect x="138" y="260" width="6" height="50" rx="2" fill={legColor} /><rect x="256" y="260" width="6" height="50" rx="2" fill={legColor} /><line x1="130" y1="290" x2="270" y2="290" stroke={legColor} strokeWidth="4" strokeLinecap="round" /></g>);
    return (<g><rect x="135" y="260" width="12" height="50" rx="3" fill={legColor} /><rect x="253" y="260" width="12" height="50" rx="3" fill={legColor} /></g>);
  };

  return (
    <svg viewBox="0 0 400 350" className="preview-svg">
      {renderLegs()}
      <rect x="288" y={backrest === 'low' ? 80 : 40} width="10" height={backH} rx="4" fill={darken(fabric, 35)} opacity="0.6" />
      <rect x={110} y={backrest === 'low' ? 80 : 40} width="180" height={backH} rx="12" fill={fabric} />
      {backrest === 'high' && <rect x="120" y="35" width="160" height="14" rx="7" fill={fabric} opacity="0.85" />}
      {cushion !== 'firm' && [130, 160, 200, 240, 270].map(x => (
        <line key={x} x1={x} y1={x === 200 ? 55 : x < 200 ? 70 : 65} x2={x} y2={35 + backH - 18} stroke="rgba(0,0,0,0.07)" strokeWidth="2" />
      ))}
      <rect x="283" y={35 + backH - 16} width="8" height="16" rx="3" fill={darken(fabric, 35)} opacity="0.5" />
      <rect x="115" y={35 + backH - 16} width="170" height="16" rx="6" fill={fabric} opacity="0.85" />
      {cushion === 'plush' && <rect x="95" y={seatY - 5} width="210" height={seatH + 10} rx={seatRx + 4} fill={fabric} opacity="0.25" />}
      <rect x="298" y={seatY} width="8" height={seatH} rx="3" fill={darken(fabric, 35)} opacity="0.5" />
      <rect x="100" y={seatY} width="200" height={seatH} rx={seatRx} fill={fabric} />
      {cushion === 'memory' && <ellipse cx="200" cy={seatY + seatH / 2 + 5} rx="70" ry="7" fill="rgba(0,0,0,0.08)" />}
      {cushion === 'plush' && <line x1="105" y1={seatY + seatH - 8} x2="295" y2={seatY + seatH - 8} stroke="rgba(0,0,0,0.05)" strokeWidth="3" strokeLinecap="round" />}
      {cushion === 'memory' && <ellipse cx="200" cy={seatY + 12} rx="55" ry="4" fill="rgba(255,255,255,0.15)" />}
      {cushion === 'firm' && <rect x="103" y={seatY + 2} width="194" height="3" rx="1.5" fill="rgba(0,0,0,0.06)" />}
      {hasArms && armW > 0 && (
        <><rect x={78 - (armW - 14) / 2} y={seatY - 12} width={armW} height={seatH} rx={armstyle === 'wooden' ? 4 : 6} fill={armstyle === 'wooden' ? wood : armstyle === 'metal' ? '#888' : fabric} opacity={armstyle === 'padded' ? 0.92 : 0.95} />
        <rect x={322 - (armW - 14) / 2} y={seatY - 12} width={armW} height={seatH} rx={armstyle === 'wooden' ? 4 : 6} fill={armstyle === 'wooden' ? wood : armstyle === 'metal' ? '#888' : fabric} opacity={armstyle === 'padded' ? 0.92 : 0.95} /></>
      )}
      <rect x="78" y={seatY - 10} width="244" height="6" rx="3" fill={fabric} opacity="0.95" />
    </svg>
  );
}

function SofaSVG({ fabric, wood, legs, cushion, seats, backstyle, armstyle, depth }) {
  const isL = seats === 'l-shape';
  const isDeep = depth === 'deep';
  const seatH = cushion === 'plush' ? (isDeep ? 90 : 80) : cushion === 'firm' ? (isDeep ? 70 : 60) : (isDeep ? 80 : 70);
  const seatY = 180;
  const baseW = seats === '2-seat' ? 220 : seats === '3-seat' ? 300 : 260;
  const baseX = (400 - (isL ? 300 : baseW)) / 2;
  const legColor = legs === 'metal' ? '#888' : wood;

  const renderLegs = () => {
    if (legs === 'metal')
      return (<><rect x={baseX + 10} y={seatY + seatH - 5} width="6" height="45" rx="2" fill={legColor} /><rect x={baseX + baseW - 16} y={seatY + seatH - 5} width="6" height="45" rx="2" fill={legColor} /><line x1={baseX + 5} y1={seatY + seatH + 25} x2={baseX + baseW - 5} y2={seatY + seatH + 25} stroke={legColor} strokeWidth="4" strokeLinecap="round" /></>);
    return (<><rect x={baseX + 8} y={seatY + seatH - 5} width="12" height="45" rx="3" fill={legColor} /><rect x={baseX + baseW - 20} y={seatY + seatH - 5} width="12" height="45" rx="3" fill={legColor} /></>);
  };

  return (
    <svg viewBox="0 0 400 330" className="preview-svg">
      {renderLegs()}
      <rect x={baseX + baseW + 2} y="35" width="10" height="165" rx="4" fill={darken(fabric, 35)} opacity="0.5" />
      <rect x={baseX - 5} y="35" width={baseW + 10} height="165" rx={backstyle === 'rolled' ? 18 : 12} fill={fabric} />
      {backstyle === 'tufted' && [baseX + 25, baseX + baseW / 4 + 20, baseX + baseW / 2, baseX + baseW * 0.75 - 20, baseX + baseW - 25].map((x, i) => (
        <circle key={i} cx={x} cy="100" r="5" fill={fabric} opacity="0.5" />
      ))}
      {backstyle === 'rolled' && (<><ellipse cx={baseX + 5} cy="100" rx="14" ry="40" fill={fabric} opacity="0.85" /><ellipse cx={baseX + baseW + 5} cy="100" rx="14" ry="40" fill={fabric} opacity="0.85" /></>)}
      {cushion !== 'firm' && [baseX + 15, baseX + baseW * 0.3, baseX + baseW * 0.5, baseX + baseW * 0.7, baseX + baseW - 15].map((x, i) => (
        <line key={i} x1={x} y1="70" x2={x} y2="180" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
      ))}
      <rect x={baseX + baseW - 4} y={seatY} width="10" height={seatH} rx="4" fill={darken(fabric, 35)} opacity="0.5" />
      <rect x={baseX} y={seatY} width={baseW} height={seatH} rx="10" fill={fabric} />
      {armstyle === 'square' && (<><rect x={baseX - 16} y={seatY} width="20" height={seatH - 5} rx="4" fill={fabric} opacity="0.9" /><rect x={baseX + baseW - 4} y={seatY} width="20" height={seatH - 5} rx="4" fill={fabric} opacity="0.9" /></>)}
      {armstyle === 'round' && (<><ellipse cx={baseX - 6} cy={seatY + (seatH - 5) / 2} rx="12" ry={(seatH - 5) / 2} fill={fabric} opacity="0.9" /><ellipse cx={baseX + baseW + 6} cy={seatY + (seatH - 5) / 2} rx="12" ry={(seatH - 5) / 2} fill={fabric} opacity="0.9" /></>)}
      {armstyle === 'rolled' && (<><rect x={baseX - 18} y={seatY + 5} width="22" height={seatH - 20} rx="10" fill={fabric} opacity="0.92" /><rect x={baseX + baseW - 4} y={seatY + 5} width="22" height={seatH - 20} rx="10" fill={fabric} opacity="0.92" /></>)}
      {armstyle === 'track' && (<><rect x={baseX - 12} y={seatY + 2} width="16" height={seatH - 8} rx="2" fill={fabric} opacity="0.95" /><rect x={baseX + baseW - 4} y={seatY + 2} width="16" height={seatH - 8} rx="2" fill={fabric} opacity="0.95" /></>)}
      {isL && <rect x={baseX + baseW - 10} y={seatY - 25} width="45" height={seatH + 55} rx="8" fill={fabric} opacity="0.55" />}
      <rect x={baseX - 5} y={seatY - 5} width={baseW + 10} height="6" rx="3" fill={fabric} opacity="0.95" />
    </svg>
  );
}

function TableSVG({ wood, shape, legs, size, edge, material }) {
  const dim = size === 'small' ? 1 : size === 'medium' ? 1.12 : size === 'large' ? 1.28 : 1.42;
  const w = 180 * dim;
  const h = (shape === 'round' || shape === 'oval') ? 180 * dim : 100 * dim;
  const tX = (400 - w) / 2;
  const tY = 80;
  const matColor = material === 'glass' ? '#d4e8e8' : material === 'marble' ? '#e8e0d8' : material === 'metal' ? '#bbb' : wood;

  const renderLegs = () => {
    if (legs === 'pedestal') return <rect x={195} y={tY + h - 5} width="10" height="110" rx="4" fill={wood} />;
    if (legs === 'trestle') return (<><rect x={tX + 20} y={tY + h - 5} width="20" height="100" rx="4" fill={wood} /><rect x={tX + w - 40} y={tY + h - 5} width="20" height="100" rx="4" fill={wood} /><line x1={tX + 5} y1={tY + h + 70} x2={tX + w - 5} y2={tY + h + 70} stroke={wood} strokeWidth="8" strokeLinecap="round" /></>);
    if (legs === 'xbase') return (<><line x1={tX + 20} y1={tY + h - 5} x2={tX + 50} y2={tY + h + 100} stroke={wood} strokeWidth="8" strokeLinecap="round" /><line x1={tX + w - 20} y1={tY + h - 5} x2={tX + w - 50} y2={tY + h + 100} stroke={wood} strokeWidth="8" strokeLinecap="round" /><line x1={tX + 10} y1={tY + h + 70} x2={tX + w - 10} y2={tY + h + 70} stroke={wood} strokeWidth="6" strokeLinecap="round" /></>);
    return (<><rect x={tX + 10} y={tY + h - 5} width="10" height="105" rx="3" fill={wood} /><rect x={tX + w - 20} y={tY + h - 5} width="10" height="105" rx="3" fill={wood} /></>);
  };

  const edgeRx = edge === 'beveled' ? 3 : edge === 'rounded' ? 12 : 0;
  const edgeClass = edge === 'beveled' ? 'beveled' : edge === 'rounded' ? 'rounded' : 'straight';

  const matGrad = material === 'solid-wood' ? `url(#woodGrad)` : material === 'metal' ? `url(#metalGrad)` : material === 'marble' ? `url(#marbleGrad)` : undefined;
  const isRect = shape !== 'round' && shape !== 'oval';
  const isOval = shape === 'round' || shape === 'oval';

  const matContent = (useGrad, opacity) => {
    if (isRect) return <rect x={tX} y={tY} width={w} height={h} rx={edgeRx || 4} fill={useGrad || matColor} opacity={opacity} />;
    return <ellipse cx="200" cy={tY + h / 2} rx={w / 2} ry={h / 2} fill={useGrad || matColor} opacity={opacity} />;
  };

  const grainLines = (count, spacing) => isOval ? null : [...Array(count)].map((_, i) => (
    <line key={`g${i}`} x1={tX + 4} y1={tY + spacing * (i + 1)} x2={tX + w - 4} y2={tY + spacing * (i + 1)} stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />
  ));

  return (
    <svg viewBox="0 0 400 310" className="preview-svg">
      <defs>
        <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={matColor} />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="50%" stopColor={matColor} />
          <stop offset="80%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="100%" stopColor={darken(matColor, 30)} />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wood} />
          <stop offset="50%" stopColor={darken(wood, 10)} />
          <stop offset="100%" stopColor={wood} />
        </linearGradient>
        <radialGradient id="marbleGrad" cx="0.4" cy="0.3" r="0.7">
          <stop offset="0%" stopColor={matColor} />
          <stop offset="40%" stopColor="#f5ede4" />
          <stop offset="60%" stopColor={matColor} />
          <stop offset="100%" stopColor="#d8d0c8" />
        </radialGradient>
        <linearGradient id="glassReflect" x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {renderLegs()}
      <rect x={tX + w - 4} y={tY + 8} width="6" height={h - 8} rx="2" fill={darken(matColor, 40)} opacity="0.4" />

      {material === 'glass' && isRect && (
        <><rect x={tX} y={tY} width={w} height={h} rx={edgeRx || 4} fill={matColor} opacity="0.35" stroke="#aac" strokeWidth="1" /><rect x={tX} y={tY} width={w} height={h} rx={edgeRx || 4} fill="url(#glassReflect)" /><line x1={tX + 6} y1={tY + 6} x2={tX + w * 0.3} y2={tY + 6} stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" /><line x1={tX + 6} y1={tY + 14} x2={tX + w * 0.2} y2={tY + 14} stroke="#fff" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" /></>
      )}
      {material === 'glass' && isOval && (
        <><ellipse cx="200" cy={tY + h / 2} rx={w / 2} ry={h / 2} fill={matColor} opacity="0.35" stroke="#aac" strokeWidth="1" /><ellipse cx="200" cy={tY + h / 2} rx={w / 2} ry={h / 2} fill="url(#glassReflect)" /></>
      )}

      {material === 'marble' && matContent('url(#marbleGrad)', 0.95)}
      {material === 'marble' && isRect && (
        <g opacity="0.12">
          {[...Array(5)].map((_, i) => (
            <path key={i} d={`M${tX + 10 + i * 35} ${tY + 5} Q${tX + 20 + i * 30} ${tY + h * 0.4} ${tX + 5 + i * 40} ${tY + h - 5}`} stroke="#666" strokeWidth="1" fill="none" />
          ))}
          {[...Array(3)].map((_, i) => (
            <path key={`mv${i}`} d={`M${tX + 5} ${tY + 10 + i * 30} Q${tX + w * 0.5} ${tY + 15 + i * 25} ${tX + w - 5} ${tY + 8 + i * 35}`} stroke="#888" strokeWidth="0.6" fill="none" />
          ))}
        </g>
      )}
      {material === 'marble' && isOval && <ellipse cx="196" cy={tY + h / 2 - 2} rx={w / 2 - 4} ry={h / 2 - 4} fill="none" stroke="#888" strokeWidth="0.6" opacity="0.1" />}

      {material === 'solid-wood' && matContent('url(#woodGrad)', 0.95)}
      {material === 'solid-wood' && isRect && grainLines(10, h / 12)}
      {material === 'solid-wood' && isOval && <ellipse cx="200" cy={tY + h / 2 + 3} rx={(w / 2) * 0.85} ry={3} fill="rgba(0,0,0,0.05)" />}

      {material === 'metal' && matContent('url(#metalGrad)', 0.95)}
      {material === 'metal' && isRect && <rect x={tX + w * 0.1} y={tY + h * 0.1} width={w * 0.8} height={h * 0.8} rx={edgeRx || 3} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.15" />}
      {material === 'metal' && isOval && <ellipse cx="200" cy={tY + h / 2} rx={w / 2 - 5} ry={h / 2 - 5} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.15" />}

      {isOval && <ellipse cx="204" cy={tY + h / 2 + 2} rx={w / 2 - 4} ry={h / 2 - 4} fill={darken(matColor, 35)} opacity="0.3" />}
    </svg>
  );
}

function BedSVG({ fabric, wood, size, headboard, footboard, storage }) {
  const w = size === 'single' ? 160 : size === 'double' ? 200 : size === 'queen' ? 240 : 280;
  const x = (400 - w) / 2;
  const hbH = headboard === 'sleek' ? 55 : headboard === 'tufted' ? 65 : 50;
  const showStorage = storage !== 'none';

  return (
    <svg viewBox="0 0 400 300" className="preview-svg">
      {headboard === 'tufted' && (
        <g><rect x={x} y="30" width={w} height={hbH} rx="8" fill={fabric} />
        {[x + w * 0.15, x + w * 0.3, x + w / 2, x + w * 0.7, x + w * 0.85].map((bx, i) => (
          <circle key={i} cx={bx} cy={30 + hbH / 2} r="5" fill={fabric} opacity="0.5" />))}</g>
      )}
      {headboard === 'panel' && <><rect x={x + w} y="32" width="6" height={hbH} rx="2" fill={darken(fabric, 35)} opacity="0.5" /><rect x={x} y="30" width={w} height={hbH} rx="6" fill={fabric} /></>}
      {headboard === 'simple' && <rect x={x} y="40" width={w} height="40" rx="4" fill={wood} />}
      {headboard === 'sleek' && <rect x={x + 20} y="35" width={w - 40} height="50" rx="3" fill={fabric} opacity="0.9" />}
      <rect x={x - 15} y="85" width={w + 30} height="130" rx="6" fill="#f5f5f0" />
      <rect x={x - 10} y="90" width={w + 20} height="120" rx="4" fill="#fff" />
      {footboard !== 'none' && (
        <rect x={x - 15} y="195" width={w + 30} height={footboard === 'slatted' ? 12 : 18} rx={footboard === 'paneled' ? 4 : 3} fill={wood} opacity={footboard === 'slatted' ? 0.6 : 0.8} />
      )}
      {footboard === 'slatted' && [x + 10, x + w / 2 - 10, x + w - 30].map((sx, i) => (
        <rect key={i} x={sx} y="197" width="6" height="10" rx="1" fill={wood} opacity="0.9" />
      ))}
      <rect x={x + 5} y="215" width={w - 10} height="10" rx="3" fill={wood} />
      <rect x={x} y="225" width={w} height="8" rx="2" fill={wood} opacity="0.7" />
      {[x + 20, x + w - 20].map((lx, i) => <rect key={i} x={lx} y="233" width="10" height="30" rx="3" fill={wood} />)}
      {showStorage && (
        <><rect x={x + 15} y="235" width={w - 30} height="20" rx="4" fill={wood} opacity="0.15" />
        {storage === 'drawers' && <circle cx={x + w - 30} cy="245" r="3" fill={wood} opacity="0.4" />}
        {storage === 'hydraulic' && <line x1={x + w / 2 - 15} y1="240" x2={x + w / 2 + 15} y2="240" stroke={wood} strokeWidth="3" strokeLinecap="round" opacity="0.5" />}</>
      )}
      <rect x={x + 10} y="95" width={w - 20} height="3" rx="1.5" fill="#e8e8e0" />
      <rect x={x + 10} y={150} width={w - 20} height="3" rx="1.5" fill="#e8e8e0" />
      <ellipse cx={x + 45} cy={135} rx="18" ry="10" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

function CabinetSVG({ wood, doors, style, handle, height, finish }) {
  const cabH = height === 'short' ? 200 : height === 'tall' ? 280 : 250;
  const doorW = 180 / doors;
  const isGlossy = finish === 'glossy';

  return (
    <svg viewBox="0 0 400 320" className="preview-svg">
      <rect x="308" y="32" width="8" height={cabH} rx="2" fill={darken(wood, 35)} opacity="0.5" />
      <rect x="90" y="30" width="220" height={cabH} rx="4" fill={wood} opacity={isGlossy ? 0.96 : 0.92} />
      {isGlossy && (
        <><rect x="92" y="32" width="216" height={cabH - 4} rx="3" fill={wood} opacity="0.3"><animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeatCount="indefinite" /></rect>
        <rect x="92" y="32" width="216" height="6" rx="2" fill="#fff" opacity="0.08" /></>
      )}
      {!isGlossy && <g opacity="0.06">{Array.from({length: 18}).map((_, i) => <line key={i} x1="96" y1={40 + i * 12} x2="304" y2={40 + i * 12} stroke="#000" strokeWidth="0.5" />)}</g>}
      <rect x="96" y="36" width="208" height={cabH - 12} rx="2" fill={style === 'rustic' ? '#f5ead0' : style === 'classic' ? '#f0ead6' : style === 'industrial' ? '#e0ddd8' : '#f8f8f8'} />
      {style === 'industrial' && <line x1="96" y1="36" x2="304" y2="36" stroke="#888" strokeWidth="2" opacity="0.3" />}
      {Array.from({ length: doors }).map((_, i) => (
        <g key={i}>
          <rect x={96 + i * doorW} y="40" width={doorW - 4} height={cabH - 56} rx="2" fill={style === 'rustic' ? '#efe0c0' : style === 'classic' ? '#e8dcc8' : style === 'industrial' ? '#d5d5d0' : '#fff'} stroke={wood} strokeWidth="1" />
          {style === 'classic' && <rect x={96 + i * doorW + 8} y="50" width={doorW - 20} height={cabH - 76} rx="2" fill="none" stroke={wood} strokeWidth="0.5" opacity="0.35" />}
          {style === 'industrial' && <rect x={96 + i * doorW + 6} y="50" width={doorW - 16} height={cabH - 96} rx="1" fill="none" stroke="#999" strokeWidth="1" opacity="0.4" />}
          {handle === 'bar' && <rect x={96 + i * doorW + doorW - 18} y={40 + (cabH - 56) / 2 - 10} width="12" height="20" rx="2" fill={wood} opacity="0.7" />}
          {handle === 'knob' && <circle cx={96 + i * doorW + doorW - 14} cy={40 + (cabH - 56) / 2} r="5" fill={wood} opacity="0.6" />}
          {handle === 'recessed' && <rect x={96 + i * doorW + doorW - 18} y={40 + (cabH - 56) / 2 - 8} width="12" height="16" rx="2" fill={wood} opacity="0.15" />}
          {style === 'modern' && <line x1={96 + i * doorW + 4} y1="45" x2={96 + i * doorW + 4} y2={cabH - 20} stroke={wood} strokeWidth="1.5" opacity="0.2" />}
        </g>
      ))}
      <rect x="96" y={cabH - 14} width="208" height="36" rx="2" fill={wood} opacity="0.12" />
      <rect x="100" y={cabH - 10} width="200" height="28" rx="2" fill={style === 'rustic' ? '#efe0c0' : style === 'classic' ? '#e8dcc8' : style === 'industrial' ? '#d5d5d0' : '#fff'} />
      <rect x="90" y={30 + cabH} width="220" height="8" rx="2" fill={wood} opacity="0.8" />
    </svg>
  );
}

function OfficeChairSVG({ fabric, frame, armrests, lumbar, headrest, material, tilt }) {
  const fc = frame;
  const matColor = material === 'mesh' ? fabric : material === 'leather' ? fabric : fabric;
  const matOpacity = material === 'mesh' ? 0.75 : material === 'leather' ? 0.98 : 0.92;

  return (
    <svg viewBox="0 0 400 370" className="preview-svg">
      {headrest === 'yes' && <rect x="125" y="15" width="150" height="35" rx="10" fill={matColor} opacity={matOpacity} />}
      <rect x="298" y={headrest === 'yes' ? 50 : 25} width="8" height="135" rx="3" fill={darken(fabric, 35)} opacity="0.4" />
      <rect x="100" y={headrest === 'yes' ? 50 : 25} width="200" height="135" rx="14" fill={matColor} opacity={matOpacity} />
      {material === 'mesh' && [...Array(7)].map((_, i) => <line key={i} x1={110} y1={55 + i * 16} x2="290" y2={55 + i * 16} stroke={fabric} strokeWidth="1" opacity="0.2" />)}
      {material === 'leather' && <rect x="105" y="55" width="190" height="100" rx="8" fill="none" stroke={fabric} strokeWidth="1" opacity="0.15" />}
      {lumbar === 'yes' && <rect x="108" y="110" width="184" height="28" rx="6" fill={matColor} opacity={Math.min(matOpacity + 0.08, 1)} />}
      <rect x="293" y="160" width="8" height="55" rx="3" fill={darken(fabric, 35)} opacity="0.4" />
      <rect x="105" y="160" width="190" height="55" rx="8" fill={matColor} opacity={matOpacity} />
      {armrests === 'yes' && (
        <><rect x="78" y="115" width="22" height="55" rx="6" fill={fc} /><rect x="300" y="115" width="22" height="55" rx="6" fill={fc} /></>
      )}
      <rect x="180" y="215" width="40" height="30" rx="6" fill={fc} />
      <rect x="185" y="242" width="30" height="8" rx="3" fill={fc} opacity="0.7" />
      {tilt === 'yes' && <rect x="195" y="250" width="10" height="12" rx="2" fill={fc} opacity="0.6" />}
      {[170, 190, 210, 230].map((cx, i) => (
        <line key={i} x1={cx} y1="250" x2={i < 2 ? cx - 55 : cx + 55} y2="310" stroke={fc} strokeWidth="5" strokeLinecap="round" />
      ))}
      <ellipse cx="200" cy="315" rx="90" ry="14" fill={fc} opacity="0.8" />
      {[140, 170, 200, 230, 260].map((wx, i) => <circle key={i} cx={wx} cy="318" r="7" fill="#555" />)}
      <line x1={armrests === 'yes' ? 80 : 175} y1="250" x2={armrests === 'yes' ? 320 : 225} y2="250" stroke={fc} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function DeskSVG({ wood, shape, size, drawers, cable, standing }) {
  const w = size === 'small' ? 200 : size === 'large' ? 300 : 260;
  const x = (400 - w) / 2;
  const isL = shape === 'lshape' || shape === 'corner';

  return (
    <svg viewBox="0 0 400 300" className="preview-svg">
      <rect x={x} y="60" width={w} height="14" rx="3" fill={wood} opacity="0.92" />
      <rect x={x + w - 2} y="62" width="6" height="14" rx="2" fill={darken(wood, 35)} opacity="0.5" />
      <rect x={x} y="74" width={w} height="4" fill={wood} opacity="0.65" />
      {standing === 'yes' && <><rect x={x + 5} y="78" width="12" height="130" rx="3" fill={wood} opacity="0.5" /><rect x={x + w - 17} y="78" width="12" height="130" rx="3" fill={wood} opacity="0.5" /></>}
      {standing !== 'yes' && <rect x={x + 5} y="80" width={w - 10} height="130" rx="2" fill={wood} opacity="0.06" />}
      {drawers === 'yes' && (
        <><rect x={x + 5} y="145" width={w * 0.35} height="60" rx="2" fill={wood} opacity="0.12" /><rect x={x + 5} y="147" width={w * 0.35} height="26" rx="1" fill={wood} opacity="0.08" /><circle cx={x + 5 + w * 0.35 - 14} cy="175" r="3" fill={wood} opacity="0.4" /><circle cx={x + 14} cy="160" r="3" fill={wood} opacity="0.4" /></>
      )}
      {drawers === 'yes' && (
        <><rect x={x + w - w * 0.35 - 5} y="120" width={w * 0.35} height="85" rx="2" fill={wood} opacity="0.12" /><rect x={x + w - w * 0.35 - 5} y="122" width={w * 0.35} height="26" rx="1" fill={wood} opacity="0.08" /><circle cx={x + w - 14} cy="150" r="3" fill={wood} opacity="0.4" /></>
      )}
      {cable === 'yes' && <ellipse cx={x + w - 25} cy="80" rx="6" ry="4" fill={wood} opacity="0.3" />}
      {standing !== 'yes' && (<><rect x={x + 10} y="80" width="10" height="130" rx="3" fill={wood} /><rect x={x + w - 20} y="80" width="10" height="130" rx="3" fill={wood} /></>)}
      {standing !== 'yes' && <rect x={x + w / 2 - 10} y="80" width="10" height="130" rx="3" fill={wood} opacity="0.4" />}
      {isL && <rect x={x + w - 25} y="100" width="80" height="80" rx="3" fill={wood} opacity="0.06" />}
      {standing !== 'yes' && (<><rect x={x + 8} y="210" width="12" height="50" rx="3" fill={wood} /><rect x={x + w - 20} y="210" width="12" height="50" rx="3" fill={wood} /></>)}
      {standing === 'yes' && (<><rect x={x + 2} y="210" width="18" height="50" rx="3" fill={wood} opacity="0.7" /><rect x={x + w - 20} y="210" width="18" height="50" rx="3" fill={wood} opacity="0.7" /></>)}
    </svg>
  );
}

function BookshelfSVG({ wood, shelves, style, shape, backpanel }) {
  const gap = 200 / (shelves - 1);
  const isLadder = shape === 'ladder';
  const hasBack = backpanel === 'yes';

  return (
    <svg viewBox="0 0 400 320" className="preview-svg">
      <rect x="298" y="32" width="8" height="250" rx="2" fill={darken(wood, 35)} opacity="0.5" />
      <rect x="100" y="30" width="200" height="250" rx="4" fill={wood} opacity="0.92" />
      <rect x="106" y="36" width="188" height="238" rx="2" fill={hasBack ? wood : 'transparent'} opacity={hasBack ? 0.06 : 0} />
      {isLadder && <line x1="100" y1="30" x2="300" y2="280" stroke={wood} strokeWidth="2" opacity="0.08" />}
      {isLadder && [160, 220, 280].map((sy, i) => (
        <rect key={i} x={100 + (sy - 30) * 0.45} y={sy} width="180" height="6" rx="2" fill={wood} opacity="0.6" />
      ))}
      {!isLadder && Array.from({ length: shelves }).map((_, i) => (
        <rect key={i} x={style === 'mixed' && i % 2 === 0 ? 120 : 100} y={30 + i * gap} width={style === 'mixed' && i % 2 === 0 ? 160 : 200} height="6" rx="2" fill={wood} opacity="0.85" />
      ))}
      {style === 'open' && !isLadder && Array.from({ length: shelves - 1 }).map((_, i) => (
        <g key={i}>{Array.from({ length: 3 }).map((_, j) => (
          <rect key={j} x={115 + j * 56} y={38 + i * gap} width="40" height={gap - 14} rx="2" fill={wood} opacity={0.08 + j * 0.02} />
        ))}</g>
      ))}
      {style === 'closed' && (
        <><rect x="106" y="40" width="85" height={gap - 10} rx="2" fill={wood} opacity="0.12" /><rect x="199" y="40" width="95" height={gap - 10} rx="2" fill={wood} opacity="0.12" /><circle cx="280" cy={40 + (gap - 10) / 2} r="3" fill={wood} opacity="0.5" /></>
      )}
      {style === 'mixed' && (
        <><rect x="106" y="40" width="85" height={gap - 10} rx="2" fill={wood} opacity="0.12" /></>
      )}
      <rect x={isLadder ? 100 + (280 - 30) * 0.45 : 100} y="276" width={isLadder ? 100 : 200} height="8" rx="2" fill={wood} opacity="0.8" />
      {[120, isLadder ? 160 : 280].map((fx, i) => <rect key={i} x={fx} y="284" width="8" height="25" rx="3" fill={wood} />)}
    </svg>
  );
}

const PRICE_MODS = {
  material: { 'leather': 500, 'mesh': -200, 'marble': 800, 'glass': 300, 'metal': 150, 'solid-wood': 0 },
  size: { 'small': -300, 'medium': 0, 'large': 500, 'xlarge': 900 },
  seats: { '2-seat': 0, '3-seat': 600, 'l-shape': 1200 },
  storage: { 'drawers': 350, 'hydraulic': 600, 'none': 0 },
  standing: { 'yes': 900, 'no': 0 },
  drawers: { 'yes': 180, 'no': 0 },
  cable: { 'yes': 120, 'no': 0 },
  headboard: { 'tufted': 400, 'panel': 250, 'sleek': 150, 'simple': 0 },
  doors: { 2: 0, 3: 500, 4: 900 },
  finish: { 'glossy': 250, 'matte': 0 },
  style_cabinet: { 'classic': 300, 'industrial': 150, 'modern': 0, 'rustic': 0 },
  depth_sofa: { 'deep': 400, 'standard': 0 },
  basetype: { 'swivel': 200, 'rocker': 350, '4leg': 0 },
  backrest: { 'high': 0, 'mid': 0, 'low': -100 },
  armrests: { 'yes': 0, 'no': -150 },
  lumbar: { 'yes': 120, 'no': 0 },
  headrest: { 'yes': 200, 'no': 0 },
  tilt: { 'yes': 150, 'no': 0 },
  ocMaterial: { 'leather': 600, 'mesh': 0, 'fabric': 0 },
  shelves: { 3: 0, 4: 150, 5: 300, 6: 500 },
  backpanel: { 'yes': 200, 'no': 0 },
  bsshape: { 'standard': 0, 'asymmetric': 300, 'ladder': 400 },
  height: { 'short': -200, 'medium': 0, 'tall': 400 },
  handle: { 'recessed': 100, 'bar': 0, 'knob': 0, 'none': -50 },
  storage_bed: { 'hydraulic': 600, 'drawers': 350, 'none': 0 },
};

const LED_POSITIONS = {
  chair:      { opts: ['seat','back','arms','base'], labels: { seat:'المقعد', back:'الظهر', arms:'المساند', base:'القاعدة' } },
  sofa:       { opts: ['seat','back','arms','base'], labels: { seat:'المقعد', back:'الظهر', arms:'المساند', base:'القاعدة' } },
  table:      { opts: ['top','base'],                labels: { top:'السطح', base:'القاعدة' } },
  bed:        { opts: ['headboard','sides','base'],  labels: { headboard:'رأس السرير', sides:'الجوانب', base:'القاعدة' } },
  cabinet:    { opts: ['top','bottom','doors'],      labels: { top:'العلوية', bottom:'السفلية', doors:'الأبواب' } },
  'office-chair': { opts: ['seat','back','base'],    labels: { seat:'المقعد', back:'الظهر', base:'القاعدة' } },
  desk:       { opts: ['top','front','base'],        labels: { top:'السطح', front:'الأمامية', base:'القاعدة' } },
  bookshelf:  { opts: ['shelves','top','sides'],     labels: { shelves:'الرفوف', top:'العلوية', sides:'الجوانب' } },
};

const LABEL_MAP = {
  fabric: 'قماش', wood: 'خشب', legs: 'أرجل', cushion: 'وسادة',
  seats: 'مقاعد', backstyle: 'ظهر', armstyle: 'مساند', depth: 'عمق',
  shape: 'شكل', size: 'حجم', edge: 'حافة', material: 'خامة',
  headboard: 'رأس السرير', footboard: 'قدم السرير', storage: 'تخزين',
  doors: 'أبواب', style: 'نمط', handle: 'مقابض', height: 'ارتفاع', finish: 'لمسة',
  frame: 'هيكل', armrests: 'مساند', lumbar: 'دعم ظهر', headrest: 'مسند رأس',
  ocMaterial: 'خامة الجلوس', tilt: 'إمالة',
  drawers: 'أدراج', cable: 'إدارة كابلات', standing: 'قابل للتعديل',
  shelves: 'رفوف', shelftyle: 'نوع', bsshape: 'شكل', backpanel: 'لوح خلفي',
  backrest: 'مسند الظهر', armstyle_chair: 'نوع المسند', basetype: 'نوع القاعدة',
  led: 'إضاءة LED',
};

const FEATURE_MAP = {
  chair: {
    label: 'كرسي', price: 1800, category: 'كراسي مخصصة',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=420&fit=crop',
    fields: [
      { key: 'fabric', label: 'لون القماش', type: 'swatch', opts: 'FABRIC' },
      { key: 'wood', label: 'نوع الخشب', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'backrest', label: 'مسند الظهر', type: 'btn', opts: 'BACKREST' },
      { key: 'armstyle_chair', label: 'المساند', type: 'btn', opts: 'ARMSTYLE' },
      { key: 'cushion', label: 'الوسادة', type: 'btn', opts: 'CUSHION', icon: 'cushion' },
      { key: 'legs', label: 'الأرجل', type: 'btn', opts: 'LEGS', icon: 'leg' },
      { key: 'basetype', label: 'القاعدة', type: 'btn', opts: 'BASE_TYPE' },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.chair },
    ],
    defaults: {
      fabric: C.FABRIC[0].value, wood: C.WOOD[0].value, backrest: 'mid',
      armstyle_chair: 'padded', cushion: 'medium', legs: 'straight', basetype: '4leg', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['fabric', 'wood', 'backrest', 'armstyle_chair', 'cushion', 'legs', 'basetype', 'led_positions'],
    SVG: ChairSVG,
    svgMap: (s) => s,
  },
  sofa: {
    label: 'كنبة', price: 3500, category: 'كنب مخصصة',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=420&fit=crop',
    fields: [
      { key: 'fabric', label: 'لون القماش', type: 'swatch', opts: 'FABRIC' },
      { key: 'wood', label: 'نوع الخشب', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'seats', label: 'عدد المقاعد', type: 'btn', opts: 'SOFA_SEATS' },
      { key: 'backstyle', label: 'شكل الظهر', type: 'btn', opts: 'SOFA_BACK' },
      { key: 'armstyle', label: 'المساند', type: 'btn', opts: 'SOFA_ARM' },
      { key: 'depth', label: 'العمق', type: 'btn', opts: 'SOFA_DEPTH' },
      { key: 'cushion', label: 'الوسادة', type: 'btn', opts: 'CUSHION', icon: 'cushion' },
      { key: 'legs', label: 'الأرجل', type: 'btn', opts: 'LEGS', icon: 'leg' },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.sofa },
    ],
    defaults: {
      fabric: C.FABRIC[0].value, wood: C.WOOD[0].value, seats: '3-seat',
      backstyle: 'straight', armstyle: 'square', depth: 'standard',
      cushion: 'medium', legs: 'straight', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['fabric', 'wood', 'seats', 'backstyle', 'cushion', 'legs', 'led_positions'],
    SVG: SofaSVG,
    svgMap: (s) => ({ ...s, seats: s.seats, backstyle: s.backstyle, armstyle: s.armstyle, depth: s.depth }),
  },
  table: {
    label: 'طاولة', price: 2500, category: 'طاولات مخصصة',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=420&fit=crop',
    fields: [
      { key: 'material', label: 'الخامة', type: 'btn', opts: 'TABLE_MATERIAL' },
      { key: 'wood', label: 'اللون', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'shape', label: 'الشكل', type: 'btn', opts: 'TABLE_SHAPES' },
      { key: 'edge', label: 'الحافة', type: 'btn', opts: 'TABLE_EDGE' },
      { key: 'size', label: 'الحجم', type: 'btn', opts: 'TABLE_SIZES' },
      { key: 'legs', label: 'الأرجل', type: 'btn', opts: 'TABLE_LEGS' },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.table },
    ],
    defaults: {
      material: 'solid-wood', wood: C.WOOD[1].value,
      shape: 'round', edge: 'straight', size: 'medium', legs: '4legs', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['material', 'wood', 'shape', 'size', 'legs', 'led_positions'],
    SVG: TableSVG,
    svgMap: (s) => s,
  },
  bed: {
    label: 'سرير', price: 4000, category: 'أسرة مخصصة',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=420&fit=crop',
    fields: [
      { key: 'fabric', label: 'لون رأس السرير', type: 'swatch', opts: 'FABRIC' },
      { key: 'wood', label: 'لون الإطار', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'headboard', label: 'رأس السرير', type: 'btn', opts: 'HEADBOARD' },
      { key: 'footboard', label: 'قدم السرير', type: 'btn', opts: 'FOOTBOARD' },
      { key: 'size', label: 'المقاس', type: 'btn', opts: 'BED_SIZES' },
      { key: 'storage', label: 'التخزين', type: 'btn', opts: 'BED_STORAGE' },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.bed },
    ],
    defaults: {
      fabric: C.FABRIC[1].value, wood: C.WOOD[1].value,
      headboard: 'panel', footboard: 'flat', size: 'double', storage: 'drawers', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['fabric', 'wood', 'headboard', 'size', 'storage', 'led_positions'],
    SVG: BedSVG,
    svgMap: (s) => s,
  },
  cabinet: {
    label: 'خزانة', price: 3200, category: 'خزائن مخصصة',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=420&fit=crop',
    fields: [
      { key: 'wood', label: 'اللون', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'style', label: 'النمط', type: 'btn', opts: 'CABINET_STYLES' },
      { key: 'doors', label: 'الأبواب', type: 'btn', opts: 'CABINET_DOORS' },
      { key: 'handle', label: 'المقابض', type: 'btn', opts: 'HANDLE_STYLE' },
      { key: 'height', label: 'الارتفاع', type: 'btn', opts: 'CABINET_HEIGHT' },
      { key: 'finish', label: 'اللمسة', type: 'btn', opts: 'FINISH' },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.cabinet },
    ],
    defaults: {
      wood: C.WOOD[2].value, style: 'modern', doors: 2,
      handle: 'bar', height: 'medium', finish: 'matte', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['wood', 'style', 'doors', 'height', 'finish', 'led_positions'],
    SVG: CabinetSVG,
    svgMap: (s) => s,
  },
  'office-chair': {
    label: 'كرسي مكتب', price: 1200, category: 'كراسي مكتب مخصصة',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=420&fit=crop',
    fields: [
      { key: 'fabric', label: 'لون القماش', type: 'swatch', opts: 'FABRIC' },
      { key: 'ocMaterial', label: 'خامة الجلوس', type: 'btn', opts: 'OC_MATERIAL' },
      { key: 'frame', label: 'لون الهيكل', type: 'swatch', opts: 'FRAME' },
      { key: 'armrests', label: 'مساند اليد', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'lumbar', label: 'دعم الظهر', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'headrest', label: 'مسند رأس', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'tilt', label: 'إمالة', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS['office-chair'] },
    ],
    defaults: {
      fabric: C.FABRIC[4].value, ocMaterial: 'fabric', frame: C.FRAME[0].value,
      armrests: 'yes', lumbar: 'yes', headrest: 'yes', tilt: 'yes', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['fabric', 'ocMaterial', 'frame', 'armrests', 'lumbar', 'headrest', 'led_positions'],
    SVG: OfficeChairSVG,
    svgMap: (s) => ({ ...s, material: s.ocMaterial }),
  },
  desk: {
    label: 'مكتب', price: 2000, category: 'مكاتب مخصصة',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=420&fit=crop',
    fields: [
      { key: 'wood', label: 'اللون', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'shape', label: 'الشكل', type: 'btn', opts: 'DESK_SHAPES' },
      { key: 'size', label: 'الحجم', type: 'btn', opts: 'DESK_SIZES' },
      { key: 'drawers', label: 'الأدراج', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'cable', label: 'إدارة كابلات', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'standing', label: 'ارتفاع قابل للتعديل', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.desk },
    ],
    defaults: {
      wood: C.WOOD[1].value, shape: 'rect', size: 'medium',
      drawers: 'yes', cable: 'yes', standing: 'no', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['wood', 'shape', 'size', 'drawers', 'standing', 'led_positions'],
    SVG: DeskSVG,
    svgMap: (s) => s,
  },
  bookshelf: {
    label: 'رف كتب', price: 1500, category: 'رفوف كتب مخصصة',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=420&fit=crop',
    fields: [
      { key: 'wood', label: 'اللون', type: 'btn', opts: 'WOOD', icon: 'wood' },
      { key: 'style', label: 'النمط', type: 'btn', opts: 'SHELF_STYLES' },
      { key: 'bsshape', label: 'الشكل', type: 'btn', opts: 'BS_SHAPE' },
      { key: 'shelves', label: 'عدد الرفوف', type: 'btn', opts: 'SHELF_COUNTS' },
      { key: 'backpanel', label: 'لوح خلفي', type: 'btn', opts: null, optsInline: ['yes', 'no'] },
      { key: 'addon_led', label: '✦ إضاءة LED', type: 'addon-led', ledPositions: LED_POSITIONS.bookshelf },
    ],
    defaults: {
      wood: C.WOOD[0].value, style: 'open', bsshape: 'standard',
      shelves: 4, backpanel: 'no', led_positions: [], ledColor: '#FFD700',
    },
    specKeys: ['wood', 'style', 'bsshape', 'shelves', 'led_positions'],
    SVG: BookshelfSVG,
    svgMap: (s) => ({ ...s, shape: s.bsshape, backpanel: s.backpanel }),
  },
};

function NameLookup(key, val) {
  const maps = {
    yes: 'موجود', no: 'بدون', '2-seat': 'مقعدين', '3-seat': 'ثلاثة مقاعد',
    'l-shape': 'شكل L', standard: 'قياسي', deep: 'عميق',
    round: 'دائري', rect: 'مستطيل', square: 'مربع', oval: 'بيضاوي',
    '4legs': '4 أرجل', pedestal: 'قاعدة وسط', trestle: 'قاعدة حديد', xbase: 'شكل X',
    small: 'صغير', medium: 'متوسط', large: 'كبير', xlarge: 'كبير جداً',
    'solid-wood': 'خشب صلب', glass: 'زجاج', marble: 'رخام', metal: 'معدن',
    straight: 'مستقيم', beveled: 'مشطوف', rounded: 'دائري',
    simple: 'بسيط', panel: 'مبطن', tufted: 'مضلع', sleek: 'أنيق',
    flat: 'مسطح', paneled: 'ألواح', slatted: 'شرائح', none: 'بدون',
    drawers: 'أدراج', hydraulic: 'رفع هيدروليك',
    modern: 'مودرن', classic: 'كلاسيك', rustic: 'ريفي', industrial: 'صناعي',
    bar: 'بار', knob: 'كبسول', recessed: 'غائر',
    short: 'قصير', medium: 'متوسط', tall: 'طويل',
    matte: 'مات', glossy: 'لامع',
    fabric: 'قماش', mesh: 'شبك', leather: 'جلد',
    rect: 'مستطيل', lshape: 'شكل L', corner: 'زاوية',
    open: 'مفتوح', closed: 'بأبواب', mixed: 'مختلط',
    high: 'عالي', mid: 'متوسط', low: 'منخفض',
    padded: 'مبطن', wooden: 'خشبي', metal: 'معدني',
    '4leg': '4 أرجل', swivel: 'دوار', rocker: 'هزاز',
    standard: 'قياسي', asymmetric: 'غير متماثل', ladder: 'سلم',
    'yes': 'موجود', 'no': 'بدون',
  };
  return maps[val] || val;
}

export default function FurnitureDesigner({ addToCart }) {
  const [type, setType] = useState('chair');
  const [name, setName] = useState('');
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const cfg = FEATURE_MAP[type];
  const [state, setState] = useState(cfg.defaults);

  useEffect(() => {
    if (!autoRotate) { setRotation(0); }
  }, [autoRotate]);

  const handleTypeChange = useCallback((id) => {
    setType(id);
    setState(FEATURE_MAP[id].defaults);
    setRotation(0);
    setAutoRotate(false);
  }, []);

  const set = (key) => (val) => setState(p => ({ ...p, [key]: val }));

  const getSpecs = () => {
    const keys = cfg.specKeys;
    const m = cfg.label === 'كرسي مكتب' ? { ...state, material: state.ocMaterial } : state;
    return keys.map(k => NameLookup(k, m[k] ?? state[k]));
  };

  const getPrice = () => {
    let price = cfg.price;
    if (type === 'chair') {
      price += PRICE_MODS.backrest[state.backrest] || 0;
      price += state.basetype === 'swivel' ? 200 : state.basetype === 'rocker' ? 350 : 0;
      price += state.armstyle_chair === 'padded' ? 0 : state.armstyle_chair === 'wooden' ? 100 : state.armstyle_chair === 'none' ? -100 : 0;
    }
    if (type === 'sofa') {
      price += PRICE_MODS.seats[state.seats] || 0;
      price += state.depth === 'deep' ? 400 : 0;
    }
    if (type === 'table') {
      price += PRICE_MODS.material[state.material] || 0;
      price += PRICE_MODS.size[state.size] || 0;
    }
    if (type === 'bed') {
      price += PRICE_MODS.size[state.size] || 0;
      price += PRICE_MODS.headboard[state.headboard] || 0;
      price += PRICE_MODS.storage_bed[state.storage] || 0;
    }
    if (type === 'cabinet') {
      price += PRICE_MODS.doors[state.doors] || 0;
      price += PRICE_MODS.height[state.height] || 0;
      price += PRICE_MODS.finish[state.finish] || 0;
      price += PRICE_MODS.handle[state.handle] || 0;
    }
    if (type === 'office-chair') {
      price += PRICE_MODS.ocMaterial[state.ocMaterial] || 0;
      price += state.armrests === 'no' ? -150 : 0;
      price += state.lumbar === 'yes' ? 120 : 0;
      price += state.headrest === 'yes' ? 200 : 0;
      price += state.tilt === 'yes' ? 150 : 0;
    }
    if (type === 'desk') {
      price += PRICE_MODS.size[state.size] || 0;
      price += PRICE_MODS.drawers[state.drawers] || 0;
      price += PRICE_MODS.cable[state.cable] || 0;
      price += state.standing === 'yes' ? 900 : 0;
    }
    if (type === 'bookshelf') {
      price += PRICE_MODS.shelves[state.shelves] || 0;
      price += PRICE_MODS.bsshape[state.bsshape] || 0;
      price += state.backpanel === 'yes' ? 200 : 0;
    }
    price += (state.led_positions?.length || 0) * 100;
    return Math.max(price, 500);
  };

  const totalPrice = getPrice();

  const handleAdd = () => {
    const specs = getSpecs();
    const specStr = cfg.specKeys.map((k, i) => `${LABEL_MAP[k] || k}: ${specs[i]}`).join('، ');
    const n = name.trim() || `${cfg.label} ${specs[0] || ''}`;
    addToCart({
      id: `custom-${type}-${Date.now()}`,
      name: n,
      price: totalPrice,
      originalPrice: Math.round(totalPrice * 1.22),
      image: cfg.image,
      category: cfg.category,
      description: `${cfg.label} بتصميم مخصص: ${specStr}.`,
      rating: 5, reviews: 0, isNew: true, discount: 18,
    });
    setName('');
  };

  const renderField = (field) => {
    if (field.type === 'section') {
      return <div className="control-section-label">{field.label}</div>;
    }
    if (field.type === 'addon-led') {
      const positions = state.led_positions || [];
      const ledColor = state.ledColor || '#FFD700';
      const colorOpts = C.LED_COLORS;
      const lp = field.ledPositions || { opts: [], labels: {} };
      return (
        <div className="addon-card" key={field.key}>
          <div className="addon-header">
            <span className="addon-icon">✦</span>
            <span className="addon-title">إضاءة LED</span>
            <span className={`addon-badge ${positions.length > 0 ? 'on' : ''}`}>
              {positions.length > 0 ? `${positions.length} × ${positions.length * 100} ج.م` : 'غير مفعلة'}
            </span>
          </div>
          <div className="addon-positions">
            {lp.opts.map(o => {
              const isActive = positions.includes(o);
              return (
                <button key={o} className={`addon-pos-btn ${isActive ? 'active' : ''}`}
                  onClick={() => set('led_positions')(isActive ? positions.filter(v => v !== o) : [...positions, o])}>
                  {lp.labels[o] || o}
                </button>
              );
            })}
          </div>
          {positions.length > 0 && (
            <div className="addon-colors">
              <span className="addon-color-label">لون الإضاءة:</span>
              <div className="addon-swatches">
                {colorOpts.map(c => (
                  <button key={c.value} className={`addon-color-btn ${ledColor === c.value ? 'active' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => set('ledColor')(c.value)}
                    title={c.name}>
                    {ledColor === c.value && <span className="check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="addon-preview">
                <span className="addon-preview-light" style={{ backgroundColor: ledColor, boxShadow: `0 0 12px ${ledColor}` }} />
                <span>معاينة الإضاءة</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    const optsArr = field.opts ? C[field.opts] : (field.optsInline ? field.optsInline.map(v => ({ name: NameLookup(v, v), value: v })) : []);
    const val = state[field.key];

    if (field.type === 'swatch') {
      return (
        <div className="swatch-group" key={field.key}>
          {optsArr.map(o => (
            <button key={o.value} className={`swatch ${val === o.value ? 'active' : ''}`} style={{ backgroundColor: o.value }} onClick={() => set(field.key)(o.value)} title={o.name}>
              {val === o.value && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      );
    }

    if (field.icon === 'wood') {
      return (
        <div className="wood-grid" key={field.key}>
          {optsArr.map(o => {
            const isActive = val === o.value;
            return (
              <button key={o.value} className={`wood-opt ${isActive ? 'active' : ''}`} onClick={() => set(field.key)(o.value)}>
                <span className="wood-sample" style={{ background: o.color || o.value }}>
                  <span className="wood-grain" />
                  {isActive && <span className="wood-check">✓</span>}
                </span>
                <span className="wood-label">{o.name}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="opt-group" key={field.key}>
        {optsArr.map(o => {
          const isActive = val === o.value;
          return (
            <button key={o.value} className={`opt-btn ${isActive ? 'active' : ''}`} onClick={() => set(field.key)(o.value)}>
              {field.icon === 'leg' && <svg viewBox="0 0 40 40" className="opt-icon"><LegIcon value={o.value} /></svg>}
              {field.icon === 'cushion' && <CushionIcon value={o.value} />}
              <span>{o.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section className="furniture-designer" id="furniture-designer">
      <div className="container">
        <div className="designer-header">
          <h2 className="designer-title">صمم قطعة الأثاث اللي تناسبك</h2>
          <p className="designer-subtitle">اختر النوع، حدد الخامات والألوان والتفاصيل — واصنع قطعة فريدة لبيتك أو مكتبك</p>
        </div>

        <div className="type-tabs">
          {C.TYPES.map(t => (
            <button key={t.id} className={`type-tab ${type === t.id ? 'active' : ''}`} onClick={() => handleTypeChange(t.id)}>
              <span className="type-icon">{t.icon}</span>
              <span className="type-name">{t.name}</span>
            </button>
          ))}
        </div>

        {getActiveOffers(type).length > 0 && (
          <div className="designer-offers">
            {getActiveOffers(type).map(o => (
              <div key={o.id} className="designer-offer-banner" style={{ borderColor: o.color }}>
                <div className="designer-offer-badge" style={{ background: o.color }}>{o.badge}</div>
                <div className="designer-offer-info">
                  <span className="designer-offer-title">{o.title}</span>
                  <span className="designer-offer-desc">{o.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="designer-layout">
          <div className="designer-preview">
            <div className="preview-scene preview-scene-3d">
              <Furniture3D type={type} props={cfg.svgMap(state)} rotation={rotation} autoRotate={autoRotate} onRotationChange={setRotation} />
            </div>
            <div className="rotation-controls">
              <button
                className={`rot-btn ${autoRotate ? 'active' : ''}`}
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'إيقاف الدوران' : 'تشغيل الدوران التلقائي'}
              >
                <span className={`rot-icon ${autoRotate ? 'spinning' : ''}`}>⟳</span>
              </button>
              <input
                type="range"
                className="rot-slider"
                min="0"
                max="360"
                value={rotation}
                onChange={e => { setRotation(Number(e.target.value)); setAutoRotate(false); }}
              />
              <div className="rot-angles">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                  <button
                    key={a}
                    className={`rot-angle-btn ${rotation === a ? 'active' : ''}`}
                    onClick={() => { setRotation(a); setAutoRotate(false); }}
                  >
                    {a}°
                  </button>
                ))}
              </div>
            </div>
            <div className="preview-footer">
              <div className="preview-price">
                <span className="price-label">السعر المقدر</span>
                <span className="price-value">{totalPrice.toLocaleString()} <small>ج.م</small></span>
              </div>
              <div className="designer-specs">
                {getSpecs().map((v, i) => v && <span key={i}>{v}</span>)}
              </div>
            </div>
          </div>

          <div className="designer-controls">
            {cfg.fields.map(f => (
              <div className="control-group" key={f.key}>
                <h4>{f.label}</h4>
                {renderField(f)}
              </div>
            ))}

            <div className="control-group">
              <h4>اسم مخصص (اختياري)</h4>
              <input type="text" className="custom-name-input" placeholder={`مثلاً: ${cfg.label} العائلة`} value={name} onChange={e => setName(e.target.value)} />
            </div>

            <button className="btn btn-primary designer-add-btn" onClick={handleAdd}>
              <span>أضف للسلة — {totalPrice.toLocaleString()} ج.م</span>
              <span className="btn-icon">+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
