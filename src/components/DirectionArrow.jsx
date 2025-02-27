import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const generateUniqueId = () =>
  `gradient-${Math.random().toString(36).substr(2, 9)}`;

function DirectionArrow({
  size = 100,
  color = "#e3e3e3",
  gradientFill,
  angle = 0,
  showTicks = true,
  tickCount = 16,
  ticksColor = "#99a1af",
  transitionDuration = 1000,
  className = "",
  style = {},
}) {
  const [animatedAngle, setAnimatedAngle] = useState(0); 
  
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedAngle(angle), 200); // Плавный старт
    return () => clearTimeout(timeout);
  }, [angle]);

  const tickRadiusOuter = 2000;
  const ticks = [];

  if (showTicks) {
    for (let i = 0; i < tickCount; i++) {
      let tickRadiusInner = 1750;
      const angleDeg = (360 / tickCount) * i;
      const rad = (Math.PI / 180) * angleDeg;

      tickRadiusInner -= (i % (tickCount / 4) === 0) ? 150 : 0;

      const x1 = Math.cos(rad) * tickRadiusInner;
      const y1 = Math.sin(rad) * tickRadiusInner;
      const x2 = Math.cos(rad) * tickRadiusOuter;
      const y2 = Math.sin(rad) * tickRadiusOuter;

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={ticksColor}
          strokeWidth="70"
          strokeLinecap="round"
        />
      );
    }
  }

  const gradientId = useMemo(() => generateUniqueId(), []);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2000 -2000 4000 4000"
        width="100%"
        height="100%"
      >
        {ticks}

        {gradientFill && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientFill.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        )}

        <g
          transform={`
            rotate(${animatedAngle})  
            translate(-1400, 1150)  
            scale(0.7)  
          `}
          style={{
            transition: `transform ${transitionDuration}ms ease-in-out`,
          }}
        >
          <path
            d="M2000 -687.5 845.833 -195.833q-91.667 37.5 -175 16.667t-141.667 -79.167q-54.167 -58.333 -75 -141.667t20.833 -170.833l1266.667 -2854.167q37.5 -83.333 108.333 -127.083t150 -43.75 150 43.75 108.333 127.083l1266.667 2854.167q41.667 87.5 20.833 170.833t-75 141.667q-58.333 58.333 -141.667 79.167t-175 -16.667z"
            fill={gradientFill ? `url(#${gradientId})` : color}
          />
        </g>
      </svg>
    </div>
  );
}

DirectionArrow.propTypes = {
  size: PropTypes.number, 
  color: PropTypes.string, 
  angle: PropTypes.number, 
  showTicks: PropTypes.bool, 
  tickCount: PropTypes.number, 
  className: PropTypes.string,
  style: PropTypes.object,
  transitionDuration: PropTypes.number, 
};

export default DirectionArrow;
