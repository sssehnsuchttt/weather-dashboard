import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { formatPrecipitation } from "../../utils/unitSystem";
import i18n from "../../i18n";
import { initial } from "lodash";

const PrecipitationChart = ({ data, isLoading, unitSystem }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const gap = 8;
  const itemMaxWidth = 39;
  const itemMinWidth = 30;
  const [itemWidth, setItemWidth] = useState(itemMaxWidth);
  const [hasAppeared, setHasAppeared] = useState(false);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const value = Math.max(
        ...data.hourlyData.map((item) => item.precipitation),
      );
      setMaxValue(value === 0 ? 1 : value);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!isLoading) setHasAppeared(true);
  }, [isLoading]);

  const updateItemsPerRow = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    let maxItems = Math.floor((containerWidth + gap) / (itemMaxWidth + gap));
    const calculatedItemWidth = Math.max(
      (containerWidth - (maxItems - 1) * gap) / maxItems,
      itemMinWidth,
    );

    setItemWidth((prevWidth) =>
      prevWidth !== calculatedItemWidth ? calculatedItemWidth : prevWidth,
    );
  }, [gap, itemMaxWidth, itemMinWidth]);

  useEffect(() => {
    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [updateItemsPerRow]);

  return (
    <div className="bg-grainy relative flex h-75 max-h-150 flex-col overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg md:min-h-80 md:flex-1 dark:border-white/20 dark:from-slate-900 dark:to-slate-800">
      <h2 className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {isLoading ? (
          <Skeleton width={140} />
        ) : (
          `${t("precipitation_chart")} (${t(formatPrecipitation(0, unitSystem).split(" ")[1])})`
        )}
      </h2>

      {isLoading ? (
        <>
          <span className="text-xl font-semibold text-gray-950 dark:text-cyan-50">
            <Skeleton width={60}></Skeleton>
          </span>
          <span className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            <Skeleton width={130}></Skeleton>
          </span>
        </>
      ) : (
        <>
          <span className="text-xl font-semibold text-gray-950 dark:text-cyan-50">
            {Number(
              formatPrecipitation(
                data.currentData.precipitationSum,
                unitSystem,
              ).split(" ")[0],
            ).toLocaleString(i18n.language)}
            {` ${t(formatPrecipitation(0, unitSystem).split(" ")[1])}`}
          </span>
          <span className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            {t("daily_precipitation_amount")}
          </span>
        </>
      )}
      <div
        ref={containerRef}
        className={classNames(
          "flex h-full w-full overflow-y-hidden",
          isLoading ? "overflow-x-hidden" : "overflow-x-auto",
        )}
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-2">
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
                    <div className="relative mt-13 h-full w-full">
                      <Skeleton
                        style={{
                          height: `${Math.abs(Math.sin((i / 24) * Math.PI * 2)) * 100 * Math.random()}%`,
                          position: "absolute",
                          bottom: "0",
                          minHeight: "8px",
                        }}
                        borderRadius="8px"
                      ></Skeleton>
                    </div>
                    <div className="mt-2 w-full text-xs">
                      <Skeleton width={"100%"}></Skeleton>
                    </div>
                  </div>
                </div>
              ))
            : data.hourlyData.map((hour, i) => (
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
                      delay: !hasAppeared ? 0.01 * i : 0,
                    }}
                    viewport={{ once: false, amount: 0.5 }}
                  >
                    <div className="relative mt-13 h-full w-full">
                      <motion.div
                        className={classNames(
                          "absolute bottom-0 min-h-2 w-full rounded-lg bg-gradient-to-t",
                          hour.precipitation >= 0.1
                            ? "from-sky-400 to-cyan-300"
                            : "from-gray-500 to-gray-500",
                        )}
                        variants={{
                          initial: { height: "0%" },
                          visible: {
                            height: `${(hour.precipitation / maxValue) * 100}%`,
                          },
                        }}
                        initial="initial"
                        animate="visible"
                        transition={{
                          duration: hour.precipitation >= 0.1 ? 0.8 : 0,
                          ease: "easeInOut",
                          delay: 0.1,
                        }}
                      >
                        <div className="-mt-2 flex h-12 w-full -translate-y-full flex-col items-center justify-end gap-1 text-sm font-semibold">
                          {hour.precipitation >= 0.1 && (
                            <>
                              <span className="text-gray-950 dark:text-cyan-50">
                                {Number(
                                  formatPrecipitation(
                                    hour.precipitation,
                                    unitSystem,
                                  ).split(" ")[0],
                                ) < 0.01
                                  ? `<${(0.01).toLocaleString(i18n.language)}`
                                  : Number(
                                      formatPrecipitation(
                                        hour.precipitation,
                                        unitSystem,
                                      ).split(" ")[0],
                                    ).toLocaleString(i18n.language)}
                              </span>
                              <span className="font-semibold text-sky-400 dark:text-sky-200">
                                {hour.precipitationProbability}%
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </div>
                    <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {hour.time.slice(11, 16)}
                    </span>
                  </motion.div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

PrecipitationChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      precipitation: PropTypes.number.isRequired,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.string.isRequired,
};

export default PrecipitationChart;
