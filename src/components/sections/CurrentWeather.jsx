import PropTypes from "prop-types";
import WeatherIcon from "../ui/WeatherIcon";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatTemperature } from "../../utils/unitSystem";
import { useTranslation } from "react-i18next";

const CurrentWeather = ({ data, isLoading, unitSystem }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-grainy relative overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-gray-950 dark:text-cyan-50">
            {isLoading ? <Skeleton width={100} /> : data.city}
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              new Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })
                .format(new Date(data.time))
                .replace(/^\p{L}/u, (char) => char.toUpperCase())
            )}
          </span>
        </div>

        <hr className="my-2 mb-2 border-t border-gray-400 dark:border-gray-700" />

        <div className="mb-2 flex">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
              <span
                className={
                  "bg-gradient-to-t from-gray-600 to-gray-500 bg-clip-text text-5xl font-bold text-transparent dark:from-sky-100 dark:to-cyan-50"
                }
              >
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  formatTemperature(data.temperature, unitSystem)
                )}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold text-gray-950 dark:text-cyan-50">
                {isLoading ? (
                  <Skeleton width={80} />
                ) : (
                  t(`weather_code_${data.weatherCode}`)
                )}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <Skeleton width={140} />
                ) : (
                  `${t("feels_like")} ${formatTemperature(data.feelsLike, unitSystem)}`
                )}
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {isLoading ? (
              <Skeleton width={96} height={96} />
            ) : (
              <WeatherIcon
                className="h-24 w-24 drop-shadow-sm"
                code={data.weatherCode}
                isDay={data.isDay}
                glow
              />
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-gray-400 pt-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {isLoading ? (
            <Skeleton width={220} />
          ) : (
            <>
              <span>
                {t("max_temp")} {formatTemperature(data.maxTemp, unitSystem)}
              </span>
              <span>•</span>
              <span>
                {t("min_temp")} {formatTemperature(data.minTemp, unitSystem)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CurrentWeather.propTypes = {
  data: PropTypes.shape({
    city: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    maxTemp: PropTypes.number.isRequired,
    minTemp: PropTypes.number.isRequired,
    weatherCode: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    isDay: PropTypes.string.isRequired,
  }),
  unitSystem: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CurrentWeather;
