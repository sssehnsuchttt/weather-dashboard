import PropTypes from "prop-types";
import WeatherIcon from "../ui/WeatherIcon";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CurrentWeather = ({ data, isLoading }) => {
  return (
    <div className="bg-grainy relative overflow-hidden rounded-2xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg">
      <div className="flex flex-col">
        {/* Название города и время */}
        <div className="flex w-full items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-cyan-50">
            {isLoading ? <Skeleton width={100} /> : data.city}
          </h1>
          <span className="text-sm text-gray-400">
            {isLoading ? <Skeleton width={100} /> : data.time}
          </span>
        </div>

        <hr className="my-2 mb-2 border-t border-gray-700" />

        <div className="mb-2 flex">
          {/* Левая часть: температура и описание */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="bg-gradient-to-t from-cyan-200 to-cyan-50 bg-clip-text text-5xl font-bold text-transparent">
                {isLoading ? <Skeleton width={100} /> : `${data.temperature}°C`}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold text-cyan-50">
                {isLoading ? <Skeleton width={80} /> : data.condition}
              </span>
              <span className="text-sm text-gray-400">
                {isLoading ? (
                  <Skeleton width={140} />
                ) : (
                  `Ощущается как ${data.feelsLike}°C`
                )}
              </span>
            </div>
          </div>

          {/* Правая часть: иконка погоды */}
          <div className="relative flex items-center justify-center">
            {isLoading ? (
              <Skeleton width={96} height={96} />
            ) : (
              <WeatherIcon
                className="h-24 w-24"
                code={data.iconCode}
                hour={12}
                glow
              />
            )}
          </div>
        </div>

        {/* Минимальная и максимальная температура */}
        <div className="mt-auto flex items-center gap-2 border-t border-gray-700 pt-2 text-sm text-gray-400">
          {isLoading ? (
            <Skeleton width={220} />
          ) : (
            <>
              <span>Максимум {data.maxTemp}°C</span>
              <span>•</span>
              <span>Минимум {data.minTemp}°C</span>
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
    condition: PropTypes.string.isRequired,
    maxTemp: PropTypes.number.isRequired,
    minTemp: PropTypes.number.isRequired,
    iconCode: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
};

export default CurrentWeather;
