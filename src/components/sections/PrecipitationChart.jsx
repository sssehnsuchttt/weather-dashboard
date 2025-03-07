import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import PropTypes from "prop-types";
import { useMemo} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "next-themes";
import { formatPrecipitation } from "../../utils/unitSystem";
import { useTranslation } from "react-i18next";

Chart.register(...registerables);

const PrecipitationChart = ({ data, isLoading, unitSystem, isMobile }) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  const chartData = useMemo(() => ({
    labels: isLoading
      ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
      : data.map((item) => item.hour.split(":")[0]),
    datasets: [
      {
        data: isLoading
          ? Array(24).fill(0.5)
          : data.map((item) =>
              formatPrecipitation(item.precipitation, unitSystem).split(" ")[0]
            ),
        backgroundColor: isLoading
          ? "rgba(148, 163, 184, 0.3)"
          : (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return "#3b82f6";
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.bottom,
                0,
                chartArea.top
              );
              gradient.addColorStop(0, "#06b6d4");
              gradient.addColorStop(1, "#3b82f6");
              return gradient;
            },
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  }), [data, isLoading, unitSystem]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    plugins: {
      legend: { display: false },
      tooltip: !isLoading && {
        backgroundColor: "rgba(30, 41, 59, 0.9)",
        titleFont: { size: 14, weight: "bold", family: "Inter" },
        bodyFont: { size: 12, family: "Inter" },
        padding: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => data[tooltipItems[0].dataIndex].hour,
          label: (tooltipItem) =>
            `${t("precipitation")}: ${tooltipItem.raw} ${formatPrecipitation(tooltipItem.raw, unitSystem)
              .split(" ")[1]}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: resolvedTheme === "dark" ? "#99a1af" : "#364153",
          font: { size: 12, family: "Inter" },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: resolvedTheme === "dark" ? "#99a1af" : "#364153",
          font: { size: 12, family: "Inter" },
          stepSize: unitSystem === "imperial" ? 0.05 : undefined,
          callback: (value) => {
            if (unitSystem === "imperial") {
              return value.toFixed(2).replace(/^0+/, "");
            }
            return value;
          },
        },
        grid: { color: resolvedTheme === "dark" ? "#364153" : "#99a1af" },
      },
    },
    animation: isLoading ? false : { duration: 800, easing: "easeInOutQuad" },
  }), [resolvedTheme, isLoading, unitSystem, data, t]);

  return (
    <div
      key={isMobile}
      className="bg-grainy relative flex h-70 flex-col overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 shadow-lg md:flex-1 dark:border-white/20 dark:from-slate-900 dark:to-slate-800"
    >
      <h2 className="mb-2 text-sm text-gray-700 dark:text-gray-400">
        {isLoading ? <Skeleton width={140} /> : t("precipitation_chart")}
      </h2>

      <div className="w-full flex-1">
        {isLoading ? (
          <Skeleton height="100%" width="100%" />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

PrecipitationChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      hour: PropTypes.string.isRequired,
      precipitation: PropTypes.number.isRequired,
    })
  ),
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default PrecipitationChart;
