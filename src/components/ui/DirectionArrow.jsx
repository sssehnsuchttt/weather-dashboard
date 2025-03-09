import { useState, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

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
  transitionDuration = 800,
  className = "",
  style = {},
}) {
  const [animatedAngle, setAnimatedAngle] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedAngle(angle), 100);
    return () => clearTimeout(timeout);
  }, [angle]);

  const tickRadiusOuter = 2000;
  const ticks = [];

  if (showTicks) {
    for (let i = 0; i < tickCount; i++) {
      let tickRadiusInner = 1750;
      tickRadiusInner -= i % (tickCount / 4) === 0 ? 100 : 0;
      const angleDeg = (360 / tickCount) * i;
      const rad = (Math.PI / 180) * angleDeg;

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
        />,
      );
    }
  }

  const gradientId = useMemo(() => generateUniqueId(), []);

  return (
    <div
      className={`relative flex items-center justify-center${className}`}
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
        className="overflow-visible"
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
      </svg>

      <motion.div
        initial={{rotateY: 180}}
        animate={{ rotateZ: animatedAngle}}
        transition={{ duration: transitionDuration / 1000, ease: "easeInOut" }}
        className="absolute -scale-y-100 drop-shadow-sm"
        style={{ width: `${size}px`, height: `${size}px`, scale: "0.7" }}
        //
      >
        <svg viewBox="0 0 4000 4000" preserveAspectRatio="xMidYMid meet">
          <path
            d="M 1999.98 2763.93 L 736.438 3231.18 C 669.541 3254.94 605.605 3260.22 544.837 3247.04 C 483.975 3233.83 432.299 3208.75 389.713 3171.78 C 350.182 3134.83 322.815 3089.97 307.596 3037.17 C 292.375 2984.36 300.041 2930.23 330.481 2874.81 L 1717.17 162.317 C 1744.55 109.487 1784.06 69.282 1835.73 41.524 C 1887.41 13.784 1942.14 0.002 1999.98 0.002 C 2057.78 0.002 2112.53 13.784 2164.18 41.524 C 2215.92 69.282 2255.46 109.487 2282.84 162.317 L 3669.61 2874.81 C 3699.99 2930.23 3707.61 2984.36 3692.39 3037.17 C 3677.18 3089.97 3649.79 3134.83 3610.3 3171.78 C 3567.71 3208.75 3516.01 3233.83 3455.17 3247.04 C 3394.36 3260.22 3330.49 3254.94 3263.58 3231.18 L 1999.98 2763.93 Z"
            fill={gradientFill ? `url(#${gradientId})` : color}
          />
        </svg>
      </motion.div>
    </div>
  );
}

DirectionArrow.propTypes = {
  size: PropTypes.number.isRequired, 
  color: PropTypes.string,
  gradientFill: PropTypes.arrayOf(
    PropTypes.shape({
      offset: PropTypes.string.isRequired, 
      color: PropTypes.string.isRequired, 
    })
  ),
  angle: PropTypes.number, 
  showTicks: PropTypes.bool, 
  tickCount: PropTypes.number,
  ticksColor: PropTypes.string, 
  transitionDuration: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object, 
};

export default DirectionArrow;
