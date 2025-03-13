import PropTypes from "prop-types";
import VerticalBarIndicator from "../ui/VerticalBarIndicator";
import ArcGauge from "../ui/ArcGauge";
import DirectionArrow from "../ui/DirectionArrow";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "next-themes";
import { formatTemperature, formatPressure, formatWindSpeed } from "../../utils/unitSystem";
import { useTranslation } from "react-i18next";


const getUVGradient = (uv) => {
  if (uv <= 2) return ["#2b7fff", "#52eafd"];
  if (uv <= 5) return ["#1eae53", "#4ade80"];
  if (uv <= 7) return ["#f6c309", "#f9e085"]
  if (uv <= 10) return ["#f06215", "#fa8938"];
  return ["#c81e1e", "#e25050"];
};

const getUVLevel = (uv) => {
  if (uv <= 2) return "uv_low";
  if (uv <= 5) return "uv_moderate";
  if (uv <= 7) return "uv_high";
  if (uv <= 10) return "uv_very_high";
  return "uv_extreme";
};

const getPressureLevel = (pressure) => {
  if (pressure < 965) return "pressure_very_low";
  if (pressure >= 965 && pressure < 985) return "pressure_low";
  if (pressure >= 985 && pressure < 1000) return "pressure_reduced";
  if (pressure >= 1000 && pressure < 1015) return "pressure_normal";
  if (pressure >= 1015 && pressure < 1030) return "pressure_increased";
  if (pressure >= 1030) return "pressure_high";
};

const getWindLevel = (windSpeed) => {
  if (windSpeed === 0) return "wind_calm";
  if (windSpeed >= 1 && windSpeed < 3) return "wind_light";
  if (windSpeed >= 3 && windSpeed < 5) return "wind_weak";
  if (windSpeed >= 5 && windSpeed < 7) return "wind_moderate";
  if (windSpeed >= 7 && windSpeed < 15) return "wind_strong";
  if (windSpeed >= 15 && windSpeed < 30) return "wind_storm";
  if (windSpeed >= 30) return "wind_hurricane";
};

const getWindDirection = (degrees) => {
  if (degrees >= 348.75 || degrees < 11.25) return "wind_N";
  if (degrees >= 11.25 && degrees < 33.75) return "wind_NNE";
  if (degrees >= 33.75 && degrees < 56.25) return "wind_NE";
  if (degrees >= 56.25 && degrees < 78.75) return "wind_ENE";
  if (degrees >= 78.75 && degrees < 101.25) return "wind_E";
  if (degrees >= 101.25 && degrees < 123.75) return "wind_ESE";
  if (degrees >= 123.75 && degrees < 146.25) return "wind_SE";
  if (degrees >= 146.25 && degrees < 168.75) return "wind_SSE";
  if (degrees >= 168.75 && degrees < 191.25) return "wind_S";
  if (degrees >= 191.25 && degrees < 213.75) return "wind_SSW";
  if (degrees >= 213.75 && degrees < 236.25) return "wind_SW";
  if (degrees >= 236.25 && degrees < 258.75) return "wind_WSW";
  if (degrees >= 258.75 && degrees < 281.25) return "wind_W";
  if (degrees >= 281.25 && degrees < 303.75) return "wind_WNW";
  if (degrees >= 303.75 && degrees < 326.25) return "wind_NW";
  if (degrees >= 326.25 && degrees < 348.75) return "wind_NNW";
  return "";
};

function getUVIndex(uvMax, current, sunrise, sunset, cloudCover) {

  const timeToSeconds = (time) => {
    const [hours, minutes] = time.split("T")[1].split(":").map(Number);
    return hours * 3600 + minutes * 60;
  }

  const sunriseSec = timeToSeconds(sunrise)
  const sunsetSec = timeToSeconds(sunset)
  const currentSec = timeToSeconds(current)


  if (currentSec > sunsetSec || currentSec < sunriseSec)
    return 0;

  const dayProgress = (currentSec - sunriseSec) / (sunsetSec - sunriseSec);

  const uvFactor = Math.sin(dayProgress * Math.PI);

  if (cloudCover > 90) return (uvMax * uvFactor).toFixed(1) * 0.1; 
  if (cloudCover > 75) return (uvMax * uvFactor).toFixed(1) * 0.3;
  if (cloudCover > 50) return (uvMax * uvFactor).toFixed(1) * 0.5;
  if (cloudCover > 25) return (uvMax * uvFactor).toFixed(1) * 0.7;
  return (uvMax * uvFactor).toFixed(1) * 0.7;
}



const calculateDewPoint = (temperature, humidity) => {
  let a = temperature >= 0 ? 17.27 : 22.452;
  let b = temperature >= 0 ? 237.7 : 272.55;

  let alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100);
  let dewPoint = (b * alpha) / (a - alpha);

  return Number(dewPoint.toFixed(2));
}

const WeatherIndicators = ({ data, isLoading, unitSystem, isMobile}) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-4">
      {isLoading ? (
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:dark:from-slate-900 dark:dark:to-slate-800"
          >
            <div className="flex h-full w-full flex-row">
              <div className="flex flex-col justify-between">
                <span className="mr-3 text-sm text-gray-600 dark:text-gray-400">
                  <Skeleton />
                </span>
                <span className="text-3xl leading-[0.7] font-semibold text-gray-950 dark:text-cyan-50">
                  <Skeleton width={60} />
                </span>
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  <Skeleton />
                </span>
              </div>
              <div className="flex flex-1 items-center justify-end">
                <Skeleton width={isMobile ? 60 : 75} height={isMobile ? 60 : 75} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          {/* humidity */}
          <div className="bg-grainy dark: relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full w-full flex-row gap-2">
              <div className="flex flex-col justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("humidity")}
                </span>
                <span className="text-3xl font-semibold text-gray-950 dark:text-cyan-50">
                  {data.humidity}
                  <span className="text-base font-normal"> %</span>
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("dew_point")} {formatTemperature(calculateDewPoint(data.temperature, data.humidity), unitSystem)}
                </span>
              </div>

              <div className="flex flex-1 justify-end">
                <div className="relative flex h-full w-8 flex-col items-center justify-between gap-0.5 text-xs text-gray-600 select-none dark:text-gray-400">
                  <span>100</span>

                  <VerticalBarIndicator
                    value={data.humidity}
                    height={100}
                    pointerColor={resolvedTheme === "dark" ? "#99a1af" : "#4a5565"}
                  />

                  <span>0</span>
                </div>
              </div>
            </div>
          </div>

          {/* pressure */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full w-full flex-row">

              <div className="flex flex-col justify-between">
                <span className="w-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                {t("pressure")}
                </span>
                <span className="text-3xl leading-[0.7] font-semibold text-gray-950 dark:text-cyan-50">
                  {formatPressure(data.pressure, unitSystem).split(" ")[0]}{" "}
                  <span className="text-base font-normal">{t(formatPressure(data.pressure, unitSystem).split(" ")[1])}</span>
                </span>
                <span className="w-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                {t(getPressureLevel(data.pressure))}
                </span>
              </div>

              <div className="flex flex-1 items-center justify-end">
                <ArcGauge
                  key={isMobile}
                  value={data.pressure}
                  minValue={950}
                  maxValue={1070}
                  size={isMobile ? 60 : 75}
                  width={10}
                  arcAngle={240}
                  backgroundColor={resolvedTheme === "dark" ? "#4b5563" : "#99a1af"}
                  fillColor="#3b82f6"
                  pointerColor={resolvedTheme === "dark" ? "#99a1af" : "#4a5565"}
                  gradientFill={[
                    { offset: "0%", color: "#3b82f6" },
                    { offset: "100%", color: "#06b6d4" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* uv-index */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full w-full flex-row">
              <div className="flex flex-col justify-between">
                <span className="w-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {t("uv_index")}
                </span>
                <span className="text-3xl font-semibold text-gray-950 dark:text-cyan-50">
                  {Math.round(getUVIndex(data.uvIndex, data.time, data.sunrise, data.sunset, data.cloudCover))}
                </span>
                <span className="w-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {t(getUVLevel(getUVIndex(data.uvIndex, data.time, data.sunrise, data.sunset, data.cloudCover)))}
                </span>
              </div>

              <div className="flex min-w-fit flex-1 items-center justify-end">
                <ArcGauge
                  key={isMobile}
                  value={getUVIndex(data.uvIndex, data.time, data.sunrise, data.sunset, data.cloudCover)}
                  minValue={0}
                  maxValue={11}
                  size={isMobile ? 60 : 75}
                  width={10}
                  arcAngle={240}
                  backgroundColor={resolvedTheme === "dark" ? "#4b5563" : "#99a1af"}
                  pointerColor={resolvedTheme === "dark" ? "#99a1af" : "#4a5565"}
                  gradientFill={[
                    {
                      offset: "0%",
                      color: getUVGradient(Math.round(getUVIndex(data.uvIndex, data.time, data.sunrise, data.sunset, data.cloudCover)))[0],
                    },
                    {
                      offset: "100%",
                      color: getUVGradient(Math.round(getUVIndex(data.uvIndex, data.time, data.sunrise, data.sunset, data.cloudCover)))[1],
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          

          {/* wind */}
          <div className="bg-grainy relative flex h-35 flex-col items-start justify-between overflow-hidden rounded-xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full w-full flex-row justify-between gap-2">
              <div className="flex flex-col justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("wind")}
                </span>
                <span className="text-3xl font-semibold leading-[0.7] text-gray-950 dark:text-cyan-50">
                  {formatWindSpeed(data.windSpeed, unitSystem).split(" ")[0]}{" "}
                  <span className="text-base font-normal">{t(formatWindSpeed(data.windSpeed, unitSystem).split(" ")[1])}</span>
                </span>
                <div className="flex flex-wrap gap-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="whitespace-nowrap">
                    {t(getWindLevel(data.windSpeed))}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="whitespace-nowrap hidden md:inline">
                    {t(getWindDirection(data.windDirection))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-600 select-none dark:text-gray-400">
                <span>{t("wind_N")}</span>
                <DirectionArrow
                  size={isMobile ? 60 : 75}
                  color="#facc15"
                  ticksColor={resolvedTheme === "dark" ? "#99a1af" : "#4a5565"}
                  angle={
                    data.windDirection > 180
                      ? -360 + data.windDirection
                      : data.windDirection
                  }
                  className="rounded-full "
                  gradientFill={[
                    { offset: "0%", color: "#f6c309" },
                    { offset: "100%", color: "#f9e085" },
                  ]}
                />
                <span>{t("wind_S")}</span>
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
    temperature: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    uvIndex: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windDirection: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    sunrise: PropTypes.string.isRequired,
    sunset: PropTypes.string.isRequired,
    cloudCover: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default WeatherIndicators;
