import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import PropTypes from "prop-types";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

Chart.register(...registerables);

const PrecipitationChart = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    return {
      labels: isLoading
        ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
        : data.map((item) => item.hour),
      datasets: [
        {
          label: "Осадки (мм)",
          data: isLoading
            ? Array(24).fill(0.5)
            : data.map((item) => item.precipitation),
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
                  chartArea.top,
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
    };
  }, [data, isLoading]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: !isLoading && {
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          titleFont: { size: 14, weight: "bold", family: "Inter" },
          bodyFont: { size: 12, family: "Inter" },
          padding: 8,
          displayColors: false,
        },
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8", font: { size: 12, family: "Inter" } },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: "#94a3b8",
            font: { size: 12, family: "Inter" },
            callback: (value) => `${value} мм`,
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
      animation: isLoading ? false : { duration: 800, easing: "easeInOutQuad" },
    };
  }, [isLoading]);

  return (
    <div className="bg-grainy relative flex h-60 flex-col overflow-hidden rounded-2xl border-t border-white/20 bg-gradient-to-b from-slate-900 to-slate-800 p-4 shadow-lg md:flex-1">
      <h2 className="mb-2 text-sm text-gray-400">
        {isLoading ? <Skeleton width={140} /> : "График осадков"}
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
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
};

export default PrecipitationChart;
