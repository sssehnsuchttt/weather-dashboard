import PropTypes from "prop-types";
import WeatherIcon from "../ui/WeatherIcon";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const WeeklyForecast = ({ data, isLoading }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-grainy relative flex flex-1 flex-col self-stretch overflow-hidden rounded-2xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
      <h2 className="mb-4 text-sm text-gray-400">
        {isLoading ? <Skeleton width={110} /> : "Прогноз на 7 дней"}
      </h2>

      <div className="flex min-h-100 flex-col gap-1 md:flex-1">
        {isLoading
          ? [...Array(7)].map((_, index) => (
              <div
                key={index}
                className="relative flex flex-1 items-center justify-between"
              >
                {index !== data.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-full border-t border-gray-700"></div>
                )}

                <span className="text-sm text-cyan-50">
                  <Skeleton width={80} />
                </span>

                <div className="relative flex items-center">
                  <div className="absolute right-0 mr-26 flex min-w-12 items-center justify-center">
                    <Skeleton width={40} height={40} />
                  </div>

                  <div className="flex min-w-[72px] items-center gap-1 text-right text-sm text-gray-400">
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
                  <div className="absolute bottom-0 left-0 w-full border-t border-gray-700"></div>
                )}

                <span className="text-sm text-cyan-50">{day.day}</span>

                <div className="relative flex items-center">
                  <div className="absolute right-0 mr-26 flex min-w-12 items-center justify-center">
                    <WeatherIcon
                      className="h-10 w-10 object-contain"
                      code={day.code}
                      hour={12}
                    />
                  </div>

                  <div className="flex min-w-[72px] items-center gap-1 text-right text-sm text-gray-400">
                    <span className="text-cyan-50">{day.maxTemp}°C</span>
                    <span>/</span>
                    <span>{day.minTemp}°C</span>
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
      code: PropTypes.number.isRequired,
      maxTemp: PropTypes.number.isRequired,
      minTemp: PropTypes.number.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default WeeklyForecast;
