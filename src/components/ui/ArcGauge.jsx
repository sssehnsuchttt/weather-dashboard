import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";


function getArcBoundingBox(cx, cy, r, startAngle, endAngle, strokeWidth) {
  let a1 = Math.min(startAngle, endAngle);
  let a2 = Math.max(startAngle, endAngle);

  const anglesToCheck = [a1, a2];
  for (let mult90 = Math.ceil(a1 / 90) * 90; mult90 < a2; mult90 += 90) {
    anglesToCheck.push(mult90);
  }

  const deg2rad = (deg) => (Math.PI / 180) * deg;
  const xOfAngle = (deg) => cx + r * Math.cos(deg2rad(deg));
  const yOfAngle = (deg) => cy + r * Math.sin(deg2rad(deg));

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  anglesToCheck.forEach((deg) => {
    const x = xOfAngle(deg);
    const y = yOfAngle(deg);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const capR = strokeWidth / 2;
  const sx = xOfAngle(a1),
    sy = yOfAngle(a1);
  const ex = xOfAngle(a2),
    ey = yOfAngle(a2);

  minX = Math.min(minX, sx - capR, ex - capR);
  maxX = Math.max(maxX, sx + capR, ex + capR);
  minY = Math.min(minY, sy - capR, ey - capR);
  maxY = Math.max(maxY, sy + capR, ey + capR);

  return { minX, maxX, minY, maxY };
}

/**
 * Функция для расчета длины дуги (arcLength),
 * где arcAngle – угол дуги в градусах, а r – радиус.
 */
function arcLengthDeg(arcAngle, r) {
  return r * ((Math.PI / 180) * arcAngle);
}

const generateUniqueId = () =>
  `gradient-${Math.random().toString(36).substr(2, 9)}`;

function ArcGauge({
  value,
  size = 70,
  width = 9,
  arcAngle = 180,
  minValue,
  maxValue,
  backgroundColor = "#4b5563",
  fillColor = "#3b82f6",
  gradientFill,
  pointerColor = "#99a1af",
  transitionDuration = 800,
}) {
  const [animatedValue, setAnimatedValue] = useState(minValue);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);

  const gradientId = useMemo(() => generateUniqueId(), []);

  let fraction = (animatedValue - minValue) / (maxValue - minValue);
  fraction = Math.max(0, Math.min(1, fraction));

  const scaleFactor = 100 / size;
  const scaledWidth = width * scaleFactor;

  // Центр и радиус дуги
  const cx = 50,
    cy = 50;
  const r = 50 - scaledWidth / 2;

  // Определяем углы дуги
  const half = arcAngle / 2;
  const startAngle = -90 - half;
  const endAngle = -90 + half;
  // Интерполированный угол для заполненной части
  const currentAngle = startAngle + fraction * (endAngle - startAngle);

  const deg2rad = (deg) => (Math.PI / 180) * deg;
  const polarToX = (angleDeg) => cx + r * Math.cos(deg2rad(angleDeg));
  const polarToY = (angleDeg) => cy + r * Math.sin(deg2rad(angleDeg));

  // Вычисляем точки для фоновой дуги
  const startX = polarToX(startAngle);
  const startY = polarToY(startAngle);
  const endXBackground = polarToX(endAngle);
  const endYBackground = polarToY(endAngle);

  // Флаг дуги
  const largeArcFlag = (angle) => (angle > 180 ? 1 : 0);
  const sweepFlag = 1;
  // Путь для фоновой дуги
  const backgroundPath = `
    M ${startX},${startY}
    A ${r},${r} 0 ${largeArcFlag(
      arcAngle,
    )},${sweepFlag} ${endXBackground},${endYBackground}
  `;

  const filledPath = backgroundPath;

  // Вычисляем длину дуги
  const arcLen = arcLengthDeg(arcAngle, r);

  // Вычисляем bounding box дуги (для корректировки viewBox)
  // eslint-disable-next-line no-unused-vars
  const { minX, maxX, minY, maxY } = getArcBoundingBox(
    cx,
    cy,
    r,
    startAngle,
    endAngle,
    scaledWidth,
  );
  const arcBottom = maxY;

  return (
    <div className="relative flex ">
      <svg
        viewBox={`0 0 100 ${arcBottom}`}
        width={size}
        height={size}
        style={{ overflow: "visible" }}
        className="drop-shadow-sm"
      >
        {/* Градиент */}
        {gradientFill && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientFill.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Фоновая дуга */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={scaledWidth}
          strokeLinecap="round"
        />

        {/* Заполненная дуга */}
        <path
          d={filledPath}
          fill="none"
          stroke={gradientFill ? `url(#${gradientId})` : fillColor}
          strokeWidth={scaledWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: arcLen,
            strokeDashoffset: arcLen * (1 - fraction),
            transition: `stroke-dashoffset ${transitionDuration}ms ease-in-out`,
          }}
        />

        {/* Изначальная реализация, пришлось заменить , так как Safari плохо поддерживает foreignObject и css анимации внутри svg */}

        {/* <g
          transform={`translate(${cx}, ${cy}) rotate(${currentAngle}) translate(${r}, 0)`}
          style={{
            transition: `transform ${transitionDuration}ms ease-in-out`,
          }}
        >
          <circle cx={0} cy={0} r={scaledWidth / 2} fill={pointerColor} />
          <g transform=" rotate(180)">
            <foreignObject width="160" height="160" overflow="visible">
              <div
                className="h-5 w-10 relative text-gray-400"
                style={{
                  marginLeft: `${scaledWidth / 2}px`,
                  transform: `scale(${scaleFactor})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  className="material-symbols-rounded absolute"
                  style={{
                    top: 0,
                    left: 0,
                    fontSize: "14px",
                    transform: "rotate(-180deg) translate(0, 50%)",
                  }}
                >
                  play_arrow
                </div>
              </div>
            </foreignObject>
          </g>
        </g> */}
      </svg>

      <motion.div
        className="absolute right-0 flex w-1/2 origin-left items-center justify-end"
        style={{ height: `${width}px` }}
        initial={{
          y: size / 2 - width / 2 + (((100 - arcBottom) / 100) * size) / 2,
          rotate: startAngle,
        }}
        animate={{ rotate: currentAngle }}
        transition={{ duration: transitionDuration / 1000, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <span
          className="material-symbols-rounded flex h-fit select-none"
          style={{ fontSize: "14px", color: pointerColor }}
        >
          play_arrow
        </span>
        <div
          className="rounded-full bg-gradient-to-bl from-white to-gray-100"
          style={{ height: width, width: width}}
        ></div>
      </motion.div>
    </div>
  );
}

ArcGauge.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number,
  width: PropTypes.number,
  arcAngle: PropTypes.number,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  fillColor: PropTypes.string,
  gradientFill: PropTypes.arrayOf(
    PropTypes.shape({
      offset: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ),
  pointerColor: PropTypes.string,
  transitionDuration: PropTypes.number,
};

export default ArcGauge;
