import WeatherIcon from "./components/WeatherIcon";

const DUMMY_FORECAST = [
  { day: "Чт, 27 февр.", code: 2, minTemp: -16, maxTemp: -6 },
  { day: "Пт, 28 февр.", code: 3, minTemp: -14, maxTemp: -5 },
  { day: "Сб, 1 марта", code: 2, minTemp: -10, maxTemp: -3 },
  { day: "Вс, 2 марта", code: 3, minTemp: -8, maxTemp: -2 },
  { day: "Ср, 3 марта", code: 1, minTemp: -9, maxTemp: -1 },
  { day: "Чт, 4 марта", code: 2, minTemp: -11, maxTemp: -3 },
  { day: "Пт, 5 марта", code: 1, minTemp: -12, maxTemp: -4 },
];

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-white">
      {/* Контейнер для всей сетки */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-4">
        {/* Левый контейнер */}
        <div className="flex flex-col gap-4 w-full md:w-120">
          {/* Карточка погоды */}
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-2xl border-t border-white/20 p-4 overflow-hidden">
            <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-2xl opacity-10 pointer-events-none" />
            <div className="flex flex-col z-20">
              <div className="w-full flex gap-3 justify-between items-center">
                <h1 className="font-semibold text-cyan-50 text-lg">
                  Красноярск
                </h1>
                <span className="text-sm text-gray-400">
                  Вт, 25 февр. 02:28
                </span>
              </div>
              <hr className="border-t border-gray-700 my-2 mb-2" />
              <div className="flex mb-2">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    <span className="text-5xl font-bold bg-gradient-to-t from-cyan-200 to-cyan-50 bg-clip-text text-transparent">
                      -12°C
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-xl text-cyan-50">
                      Облачно
                    </span>
                    <span className="text-sm text-gray-400">
                      Ощущается как -16°C
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center justify-center">
                  <WeatherIcon
                    className="z-10 w-24 h-24"
                    code={3}
                    hour={12}
                    glow
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center text-gray-400 text-sm mt-auto pt-2 border-t border-gray-700">
                <span>Максимум -6°C</span>
                <span>•</span>
                <span>Минимум -16°C</span>
              </div>
            </div>
          </div>

          {/* Сетка для параметров */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-xl border-t border-white/20 p-4 overflow-hidden h-30 flex items-start">
              <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-xl opacity-10 pointer-events-none" />
              <span className="text-sm text-gray-400">Влажность</span>
              <span></span>
            </div>
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-xl border-t border-white/20 p-4 overflow-hidden h-30 flex items-start">
              <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-xl opacity-10 pointer-events-none" />
              <span className="font-semibold text-cyan-50">Давление</span>
            </div>
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-xl border-t border-white/20 p-4 overflow-hidden h-30 flex items-start">
              <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-xl opacity-10 pointer-events-none" />
              <span className="font-semibold text-cyan-50">УФ-индекс</span>
            </div>
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-xl border-t border-white/20 p-4 overflow-hidden h-30 flex items-start">
              <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-xl opacity-10 pointer-events-none" />
              <span className="font-semibold text-cyan-50">Скорость ветра</span>
            </div>
          </div>
        </div>

        {/* Контейнер для прогноза на 7 дней */}
        <div className="flex flex-col relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-2xl border-t border-white/20 p-4 flex-1 self-stretch overflow-hidden">
          <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-2xl opacity-10 pointer-events-none" />
          <h2 className="text-sm text-gray-400 mb-4">Прогноз на 7 дней</h2>

          <div className="flex flex-col gap-1 md:flex-1 min-h-100">
            {DUMMY_FORECAST.map((day, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between flex-1"
              >
                {index !== DUMMY_FORECAST.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-full border-t border-gray-700"></div>
                )}

                <span className="text-sm text-cyan-50">{day.day}</span>

                <div className="relative flex items-center gap-4">
            
                  <div className="absolute right-0 mr-26 flex items-center justify-center min-w-12">
                    <WeatherIcon
                      className="w-10 h-10 object-contain"
                      code={day.code}
                      hour={12}
                    />
                  </div>

                  <div className="flex gap-1 items-center text-gray-400 text-sm min-w-[72px] text-right">
                    <span className="text-cyan-50">{day.maxTemp}°C</span>
                    <span>/</span>
                    <span>{day.minTemp}°C</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-6xl mx-auto gap-4 mt-4">
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-2xl border-t border-white/20 p-4 overflow-hidden h-40">
          <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-2xl opacity-10 pointer-events-none" />
          <h2 className="text-lg font-semibold text-cyan-50">
            Почасовой прогноз
          </h2>
        </div>

        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg rounded-2xl border-t border-white/20 p-4 overflow-hidden h-60">
          <div className="bg-grainy absolute left-0 top-0 z-10 h-full w-full rounded-2xl opacity-10 pointer-events-none" />
          <h2 className="text-lg font-semibold text-cyan-50">
            Какой-нибудь график хз
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;
