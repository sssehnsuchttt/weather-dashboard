import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Вертикальный индикатор с градиентной заливкой, анимацией и стрелкой-указателем.
 */
const VerticalBarIndicator = ({
  value,
  height = 100,
  pointerColor = "#e3e3e3",
  gradientFill = ["#52eafd", "#2b7fff"],
  bgGradientFill = ["#ecfeff", "#a2f3fd"],
  transitionDuration = 800,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Анимированное значение
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(clampedValue), 100);
    return () => clearTimeout(timeout);
  }, [clampedValue]);

  return (
    <div
      className="relative w-full rounded-full select-none"
      style={{
        height: `${height}%`,
        background: `linear-gradient(to top, ${bgGradientFill.join(", ")})`,
      }}
    >
      <div className="relative flex h-full w-full overflow-hidden rounded-3xl">
        <div
          className="absolute bottom-0 left-0 w-full transition-all ease-in-out"
          style={{
            height: `${animatedValue}%`,
            background: `linear-gradient(to bottom right, ${gradientFill.join(", ")})`,
            transitionDuration: `${transitionDuration}ms`,
          }}
        ></div>
      </div>

      <div
        className="absolute flex h-3 w-3 -translate-x-full translate-y-1/2 items-center justify-center transition-[bottom] ease-in-out"
        style={{
          bottom: `${animatedValue}%`,
          color: pointerColor,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "14px" }}
        >
          play_arrow
        </span>
      </div>
    </div>
  );
};

VerticalBarIndicator.propTypes = {
  value: PropTypes.number.isRequired, 
  height: PropTypes.number,
  pointerColor: PropTypes.string, 
  gradientFill: PropTypes.arrayOf(PropTypes.string), 
  bgGradientFill: PropTypes.arrayOf(PropTypes.string),
  transitionDuration: PropTypes.number, 
};

export default VerticalBarIndicator;
