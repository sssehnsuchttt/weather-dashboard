import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import WeatherIcon from "../ui/WeatherIcon";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";
import { formatTemperature } from "../../utils/unitSystem";
import { useTranslation } from "react-i18next";

const HourlyForecast = ({ data, isLoading, unitSystem }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const gap = 8;
  const itemMaxWidth = 60;
  const itemMinWidth = 40;
  const [itemWidth, setItemWidth] = useState(itemMaxWidth);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    !isLoading && setHasAppeared(true);
  }, [isLoading]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      let maxItems = Math.floor((containerWidth + gap) / (itemMaxWidth + gap));
      const calculatedItemWidth = Math.max(
        (containerWidth - (maxItems - 1) * gap) / maxItems,
        itemMinWidth,
      );
      setItemWidth(calculatedItemWidth);
    };

    const resizeObserver = new ResizeObserver(updateItemsPerRow);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateItemsPerRow();
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="bg-grainy relative flex h-50 flex-col overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
      <h2 className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {isLoading ? <Skeleton width={140} /> : t("hourly_forecast")}
      </h2>

      <div
        ref={containerRef}
        className={classNames(
          "flex h-full w-full overflow-y-hidden",
          isLoading ? "overflow-x-hidden" : "overflow-x-auto",
        )}
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex">
          {isLoading
            ? [...Array(24)].map((_, i) => (
                <div key={i} className="mb-[6px] flex">
                  <div
                    className="flex h-full flex-col items-center justify-between"
                    style={{
                      minWidth: `${itemWidth}px`,
                      maxWidth: `${itemMaxWidth}px`,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <span className="text-sm">
                      <Skeleton width={40} />
                    </span>
                    <Skeleton width={40} height={40} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <Skeleton width={50} />
                    </span>
                  </div>
                  {i < 23 && (
                    <div className="flex h-full w-2 justify-center">
                      <div className="flex h-full w-[1px] bg-gray-400 dark:bg-gray-700"></div>
                    </div>
                  )}
                </div>
              ))
            : data.map((hour, i) => (
                <div key={i} className="mb-[6px] flex">
                  <motion.div
                    className="flex h-full flex-col items-center justify-between"
                    style={{
                      minWidth: `${itemWidth}px`,
                      maxWidth: `${itemMaxWidth}px`,
                      scrollSnapAlign: "start",
                    }}
                    initial={{ opacity: 0, y: 10, scale: 1 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                      type: "spring",
                      bounce: 0.5,
                      visualDuration: 0.4,
                      delay: !hasAppeared ? 0.03 * i : 0,
                    }}
                    viewport={{ once: false, amount: 0.5 }}
                  >
                    <span className="text-sm text-gray-950 dark:text-cyan-50">
                      {formatTemperature(hour.temperature, unitSystem)}
                    </span>
                    <WeatherIcon
                      className="h-10 w-10 object-contain"
                      code={hour.iconCode}
                      hour={12}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {hour.time}
                    </span>
                  </motion.div>
                  {i < data.length - 1 && (
                    <div className="flex h-full w-2 justify-center">
                      <div className="flex h-full w-[1px] bg-gray-400 dark:bg-gray-700"></div>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

HourlyForecast.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      temperature: PropTypes.number.isRequired,
      iconCode: PropTypes.number.isRequired,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.string.isRequired,
};

export default HourlyForecast;
