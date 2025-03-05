import PropTypes from "prop-types";
import VerticalBarIndicator from "../ui/VerticalBarIndicator";
import ArcGauge from "../ui/ArcGauge";
import DirectionArrow from "../ui/DirectionArrow";
import Skeleton from "react-loading-skeleton";

const getUVGradient = (uv) => {
  if (uv <= 2) return ["#4ade80", "#1eae53"];
  if (uv <= 5) return ["#facc15", "#c59507"];
  if (uv <= 7) return ["#fa8938", "#ea580c"];
  if (uv <= 10) return ["#e25050", "#c81e1e"];
  return ["#976ef7", "#732deb"];
};

const getUVLevel = (uv) => {
  if (uv <= 2) return "Низкий";
  if (uv <= 5) return "Умеренный";
  if (uv <= 7) return "Высокий";
  if (uv <= 10) return "Очень высокий";
  return "Экстремальный";
};

const getPressureLevel = (pressure) => {
  if (pressure < 970) return "Очень низкое";
  if (pressure >= 970 && pressure < 990) return "Низкое";
  if (pressure >= 990 && pressure < 1005) return "Сниженное";
  if (pressure >= 1005 && pressure < 1020) return "Нормальное";
  if (pressure >= 1020 && pressure < 1030) return "Повышенное";
  if (pressure >= 1030 && pressure < 1040) return "Высокое";
  if (pressure >= 1040) return "Очень высокое";
};

const getWindLevel = (windSpeed) => {
  if (windSpeed === 0) return "Штиль";
  if (windSpeed >= 1 && windSpeed <= 2) return "Лёгкий";
  if (windSpeed >= 3 && windSpeed <= 5) return "Слабый";
  if (windSpeed >= 5 && windSpeed <= 7) return "Умеренный";
  if (windSpeed >= 7 && windSpeed <= 15) return "Сильный";
  if (windSpeed >= 15 && windSpeed <= 29) return "Шторм";
  if (windSpeed >= 30) return "Ураган";
};

const getWindDirection = (degrees) => {
  if (degrees >= 348.75 || degrees < 11.25) return "С";
  if (degrees >= 11.25 && degrees < 33.75) return "С СВ";
  if (degrees >= 33.75 && degrees < 56.25) return "СВ";
  if (degrees >= 56.25 && degrees < 78.75) return "В СВ";
  if (degrees >= 78.75 && degrees < 101.25) return "В";
  if (degrees >= 101.25 && degrees < 123.75) return "В ЮВ";
  if (degrees >= 123.75 && degrees < 146.25) return "ЮВ";
  if (degrees >= 146.25 && degrees < 168.75) return "Ю ЮВ";
  if (degrees >= 168.75 && degrees < 191.25) return "Ю";
  if (degrees >= 191.25 && degrees < 213.75) return "Ю ЮЗ";
  if (degrees >= 213.75 && degrees < 236.25) return "ЮЗ";
  if (degrees >= 236.25 && degrees < 258.75) return "З ЮЗ";
  if (degrees >= 258.75 && degrees < 281.25) return "З";
  if (degrees >= 281.25 && degrees < 303.75) return "З СЗ";
  if (degrees >= 303.75 && degrees < 326.25) return "СЗ";
  if (degrees >= 326.25 && degrees < 348.75) return "С СЗ";
  return "Некорректное значение градусов";
};

const WeatherIndicators = ({ data, isLoading }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {isLoading ? (
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg"
          >
            <div className="flex h-full w-full flex-row">
              <div className="flex flex-col justify-between">
                <span className="mr-3 text-sm text-gray-400">
                  <Skeleton />
                </span>
                <span className="text-3xl leading-[0.7] font-semibold text-cyan-50">
                  <Skeleton width={60} />
                </span>
                <span className="mr-2 text-sm text-gray-400">
                  <Skeleton />
                </span>
              </div>
              <div className="flex flex-1 items-center justify-end">
                <Skeleton width={75} height={75} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          {/* Карточка влажности */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
            <div className="flex h-full w-full flex-row gap-2">
              <div className="flex flex-col justify-between">
                <span className="text-sm text-gray-400">Влажность</span>
                <span className="text-3xl font-semibold text-cyan-50">
                  {data.humidity}
                  <span className="text-base font-normal"> %</span>
                </span>
                <span className="text-sm text-gray-400">
                  Точка росы {data.dewPoint}°C
                </span>
              </div>

              <div className="flex flex-1 justify-end">
                <div className="relative flex h-full w-8 flex-col items-center justify-between gap-0.5 text-xs text-gray-400 select-none">
                  <span>100</span>

                  <VerticalBarIndicator value={data.humidity} height={100} />

                  <span>0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Карточка давления */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
            <div className="flex h-full w-full flex-row">
              {/* Левая часть с текстом */}
              <div className="flex flex-col justify-between">
                <span className="w-3 text-sm whitespace-nowrap text-gray-400">
                  Давление
                </span>
                <span className="text-3xl leading-[0.7] font-semibold text-cyan-50">
                  {data.pressure}{" "}
                  <span className="text-base font-normal">мбар</span>
                </span>
                <span className="w-3 text-sm whitespace-nowrap text-gray-400">
                  {getPressureLevel(data.pressure)}
                </span>
              </div>

              {/* Спидометр давления */}
              <div className="flex flex-1 items-center justify-end">
                <ArcGauge
                  value={data.pressure}
                  minValue={950}
                  maxValue={1050}
                  size={75}
                  width={10}
                  arcAngle={240}
                  backgroundColor="#4b5563"
                  fillColor="#3b82f6"
                  pointerColor="white"
                  gradientFill={[
                    { offset: "0%", color: "#3b82f6" },
                    { offset: "100%", color: "#06b6d4" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 🔹 Карточка УФ-индекса */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
            <div className="flex h-full w-full flex-row">
              {/* Левая часть с текстом */}
              <div className="flex flex-col justify-between">
                <span className="w-3 text-sm whitespace-nowrap text-gray-400">
                  УФ-индекс
                </span>
                <span className="text-3xl font-semibold text-cyan-50">
                  {data.uvIndex}
                </span>
                <span className="w-3 text-sm whitespace-nowrap text-gray-400">
                  {getUVLevel(data.uvIndex)}
                </span>
              </div>

              {/* Спидометр скорости ветра */}
              <div className="flex min-w-fit flex-1 items-center justify-end">
                <ArcGauge
                  value={data.uvIndex}
                  minValue={0}
                  maxValue={11}
                  size={75}
                  width={10}
                  arcAngle={240}
                  backgroundColor="#4b5563"
                  pointerColor="white"
                  gradientFill={[
                    {
                      offset: "0%",
                      color: getUVGradient(data.uvIndex)[0],
                    },
                    {
                      offset: "100%",
                      color: getUVGradient(data.uvIndex)[1],
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
            <div className="flex h-full w-full flex-row justify-between gap-2">
              {/* Левая часть с текстом */}
              <div className="flex flex-col justify-between">
                <span className="text-sm text-gray-400">Скорость ветра</span>
                <span className="text-3xl font-semibold text-cyan-50">
                  {data.windSpeed}{" "}
                  <span className="text-base font-normal">м/с</span>
                </span>
                <div className="flex flex-wrap gap-x-1 text-sm text-gray-400">
                  <span className="whitespace-nowrap">
                    {getWindLevel(data.windSpeed)}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">
                    {getWindDirection(data.windDirection)}
                  </span>
                </div>
              </div>

              {/* Спидометр УФ-индекса */}
              <div className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-400 select-none">
                <span>C</span>
                <DirectionArrow
                  size={75}
                  color="#facc15"
                  angle={
                    data.windDirection > 180
                      ? -360 + data.windDirection
                      : data.windDirection
                  }
                  className="rounded-full"
                  gradientFill={[
                    { offset: "0%", color: "#f6c309" },
                    { offset: "100%", color: "#f9e085" },
                  ]}
                />
                <span>Ю</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

WeatherIndicators.propTypes = {
  data: PropTypes.shape({
    humidity: PropTypes.number.isRequired,
    dewPoint: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    uvIndex: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windDirection: PropTypes.number.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default WeatherIndicators;
