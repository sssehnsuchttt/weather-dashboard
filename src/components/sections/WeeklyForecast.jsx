import PropTypes from "prop-types";
import WeatherIcon from "../ui/WeatherIcon";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { formatTemperature } from "../../utils/unitSystem";
import { useTranslation } from "react-i18next";

const WeeklyForecast = ({ data, isLoading, unitSystem }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-grainy relative flex flex-1 flex-col self-stretch overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
      <h2 className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {isLoading ? <Skeleton width={110} /> : t("weekly_forecast")}
      </h2>

      <div className="flex min-h-100 flex-col gap-1 md:flex-1">
        {isLoading
          ? [...Array(7)].map((_, index) => (
              <div
                key={index}
                className="relative flex flex-1 items-center justify-between"
              >
                {index !== 6 && (
                  <div className="absolute bottom-0 left-0 w-full border-t border-gray-400 dark:border-gray-700"></div>
                )}

                <span className="text-sm text-gray-950 dark:text-cyan-50">
                  <Skeleton width={80} />
                </span>

                <div className="relative flex items-center">
                  <div className="absolute right-0 mr-26 flex min-w-12 items-center justify-center">
                    <Skeleton width={40} height={40} />
                  </div>

                  <div className="flex min-w-[72px] items-center gap-1 text-right text-sm text-gray-600 dark:text-gray-400">
                    <Skeleton width={70} />
                  </div>
                </div>
              </div>
            ))
          : data.map((day, index) => (
              <motion.div
                key={index}
                className="relative flex flex-1 items-center justify-between"
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  visualDuration: 0.4,
                  type: "spring",
                  ease: "easeInOut",
                  bounce: 0.6,
                  delay: index * 0.05,
                }}
              >
                {index !== data.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-full border-t border-gray-400 dark:border-gray-700"></div>
                )}

                <span className="text-sm text-gray-950 dark:text-cyan-50">
                  {new Intl.DateTimeFormat(i18n.language, {
                    weekday: "short", 
                    day: "numeric", 
                    month: "short", 
                  }).format(new Date(day.time)).replace(/^\p{L}/u, (char) => char.toUpperCase())}
                </span>

                <div className="relative flex items-center">
                  <div className="absolute right-0 mr-26 flex min-w-12 items-center justify-center">
                    <WeatherIcon
                      className="h-10 w-10 object-contain drop-shadow-sm"
                      code={day.weatherCode}
                      isDay={1}
                    />
                  </div>

                  <div className="flex min-w-[72px] items-center gap-1 text-right text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-950 dark:text-cyan-50">
                      {formatTemperature(day.maxTemp, unitSystem)}
                    </span>
                    <span>/</span>
                    <span>{formatTemperature(day.minTemp, unitSystem)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

WeeklyForecast.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      weatherCode: PropTypes.number.isRequired,
      maxTemp: PropTypes.number.isRequired,
      minTemp: PropTypes.number.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.string.isRequired,
};

export default WeeklyForecast;
