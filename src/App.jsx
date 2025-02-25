// import React from "react";
import WeatherIcon from "./components/WeatherIcon";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white" data-role="app">
      <div
        className="relative w-96 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-2xl border-t border-white/20 p-4 overflow-hidden"
        data-role="weather-card"
      >
        {/* Текстура шума */}
        <div
          className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-2xl opacity-10 pointer-events-none"
          data-role="grainy-background"
        ></div>

        <div className="flex flex-col z-20 h-full" data-role="weather-content">
          {/* Заголовок */}
          <div className="w-full flex gap-3 justify-between items-center" data-role="weather-header">
            <h1 className="font-semibold text-cyan-50 text-lg" data-role="city-name">Красноярск</h1>
            <span className="text-sm text-gray-400" data-role="date-time">Вт, 25 февр. 02:28</span>
          </div>

          <hr className="border-t border-gray-700 my-2 mb-2" data-role="divider" />

          {/* Основной блок с температурой */}
          <div className="flex mb-2" data-role="temperature-block">
            <div className="flex flex-1 flex-col h-full justify-center gap-2" data-role="temperature-info">
              <div className="flex gap-4 items-center" data-role="main-temperature">
                {/* Температура с легким светящимся эффектом */}
                <span
                  className="text-5xl font-bold bg-gradient-to-t from-cyan-200 to-cyan-50 bg-clip-text text-transparent"
                  data-role="temperature"
                >
                  -12°C
                </span>
              </div>

              {/* Состояние погоды */}
              <div className="flex flex-col items-start justify-center" data-role="weather-description">
                <span className="font-semibold text-xl text-cyan-50" data-role="weather-condition">Облачно</span>
                <span className="text-sm text-gray-400" data-role="feels-like">Ощущается как -16°C</span>
              </div>
            </div>

            {/* Иконка погоды */}
            <div className="relative flex items-center justify-center" data-role="weather-icon">
              <WeatherIcon className="z-10 w-24 h-24 filter shadow-cyan-500/50" code={3} hour={12} glow />
            </div>
          </div>

          {/* Минимальная и максимальная температура */}
          <div className="flex gap-2 items-center text-gray-400 text-sm mt-auto pt-2 border-t border-gray-700" data-role="footer">
            <span data-role="max-temperature">Максимум -3°C</span>
            <span>•</span>
            <span data-role="min-temperature">Минимум -9°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
