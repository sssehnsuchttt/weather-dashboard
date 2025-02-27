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
  transitionDuration = 1000,
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
      className="relative w-full rounded-full border border-gray-600 "
      style={{
        height: `${height}%`,
        background: `linear-gradient(to top, ${bgGradientFill.join(", ")})`,
      }}
    >
      <div className="relative flex w-full h-full rounded-3xl overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-full transition-all ease-in-out "
        style={{
          height: `${animatedValue}%`,
          background: `linear-gradient(to bottom right, ${gradientFill.join(", ")})`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      ></div>
      </div>
      
      <div
        className="absolute w-3 h-3 flex items-center justify-center -translate-x-full translate-y-1/2 transition-all ease-in-out"
        style={{
          bottom: `${animatedValue}%`,
          color: pointerColor,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        <span className="material-symbols-rounded text-gray-400" style={{ fontSize: "14px" }}>
          play_arrow
        </span>
      </div>
    </div>
  );

};

// Валидация пропсов
VerticalBarIndicator.propTypes = {
  value: PropTypes.number.isRequired, // Значение (0-100)
  height: PropTypes.number, // Высота индикатора
  pointerColor: PropTypes.string, // Цвет указателя
  gradientFill: PropTypes.arrayOf(PropTypes.string), // Градиент заполненной части
  bgGradientFill: PropTypes.arrayOf(PropTypes.string), // Градиент фона
  transitionDuration: PropTypes.number, // Длительность анимации (мс)
};


export default VerticalBarIndicator;
