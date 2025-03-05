import { useState, useEffect } from "react";
import HourlyForecast from "./components/sections/HourlyForecast";
import PrecipitationChart from "./components/sections/PrecipitationChart";
import CurrentWeather from "./components/sections/CurrentWeather";
import WeatherIndicators from "./components/sections/WeatherIndicators";
import WeeklyForecast from "./components/sections/WeeklyForecast";
import SearchAndMenu from "./components/sections/SearchAndMenu";
import "./App.css";

const DUMMY_FORECAST = [
  { day: "Чт, 27 февр.", code: 2, minTemp: -16, maxTemp: -6 },
  { day: "Пт, 28 февр.", code: 3, minTemp: -14, maxTemp: -5 },
  { day: "Сб, 1 марта", code: 2, minTemp: -10, maxTemp: -3 },
  { day: "Вс, 2 марта", code: 3, minTemp: -8, maxTemp: -2 },
  { day: "Ср, 3 марта", code: 1, minTemp: -9, maxTemp: -1 },
  { day: "Чт, 4 марта", code: 2, minTemp: -11, maxTemp: -3 },
  { day: "Пт, 5 марта", code: 1, minTemp: -12, maxTemp: -4 },
];

const WEATHER_DATA = {
  city: "Красноярск",
  temperature: -12,
  feelsLike: -16,
  condition: "Облачно",
  maxTemp: -6,
  minTemp: -16,
  iconCode: 3,
  time: "Вт, 25 февр. 02:28",
  humidity: 59,
  dewPoint: -15,
  pressure: 1000,
  uvIndex: 2,
  windSpeed: 4,
  windDirection: 240,
};

const DUMMY_HOURLY_DATA = [...Array(24)].map((_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: Math.floor(Math.random() * 15) - 15,
  iconCode: i % 3 === 0 ? 2 : 3,
}));

const DUMMY_PRECIPITATION = [
  { hour: "00:00", precipitation: 0.1 },
  { hour: "01:00", precipitation: 0 },
  { hour: "02:00", precipitation: 0 },
  { hour: "03:00", precipitation: 0.3 },
  { hour: "04:00", precipitation: 0.6 },
  { hour: "05:00", precipitation: 1.2 },
  { hour: "06:00", precipitation: 2.4 },
  { hour: "07:00", precipitation: 1.8 },
  { hour: "08:00", precipitation: 0.7 },
  { hour: "09:00", precipitation: 0.2 },
  { hour: "10:00", precipitation: 0 },
  { hour: "11:00", precipitation: 0 },
  { hour: "12:00", precipitation: 0 },
  { hour: "13:00", precipitation: 0.4 },
  { hour: "14:00", precipitation: 0.9 },
  { hour: "15:00", precipitation: 1.5 },
  { hour: "16:00", precipitation: 2.2 },
  { hour: "17:00", precipitation: 3.8 },
  { hour: "18:00", precipitation: 2.7 },
  { hour: "19:00", precipitation: 1.3 },
  { hour: "20:00", precipitation: 0.6 },
  { hour: "21:00", precipitation: 0.2 },
  { hour: "22:00", precipitation: 0.1 },
  { hour: "23:00", precipitation: 0 },
];

const menuItems = [
  { label: "Русский", onClick: () => console.log("Русский выбран") },
  { label: "English", onClick: () => console.log("English выбран") },
  { label: "Deutsch", onClick: () => console.log("Deutsch выбран") },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Имитируем загрузку данных
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Когда пользователь кликает по городу из списка
  const handleCitySelect = (city) => {
    console.log("Выбран город:", city);
    // Ваша логика (например, запрос погоды для этого города)
  };

  // Когда пользователь перестал вводить текст в поле поиска
  const handleSearch = (value) => {
    console.log("Поиск:", value);
    // Ваша логика поиска
  };

  return (
    <div className="relative flex h-dvh w-full justify-center overflow-hidden bg-gray-900">
      <div className="flex h-full w-full flex-col overflow-y-auto text-white">
        <div className="flex min-h-dvh max-w-screen flex-1 flex-col items-center overflow-y-auto p-4 pt-0 text-white">
          <div className="mx-auto mt-18 flex w-full max-w-6xl flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col gap-4 md:w-120">
              <CurrentWeather data={WEATHER_DATA} isLoading={isLoading} />
              <WeatherIndicators data={WEATHER_DATA} isLoading={isLoading} />
            </div>
            <WeeklyForecast
              data={DUMMY_FORECAST}
              isLoading={isLoading}
            ></WeeklyForecast>
          </div>
          <div className="mx-auto mt-4 flex w-full max-w-6xl flex-1 flex-col gap-4">
            <HourlyForecast data={DUMMY_HOURLY_DATA} isLoading={isLoading} />
            <PrecipitationChart
              data={DUMMY_PRECIPITATION}
              isLoading={isLoading}
            />
          </div>
        </div>

        <SearchAndMenu
          menuItems={menuItems}
          cityList={[
            {
              icon: "uil-map-marker",
              text: "Текущее местоположение",
              subtext: "",
            },
            {
              icon: "uil-search rotate-y-180",
              text: "Красноярск",
              subtext: ", Красноярский край",
            },
            {
              icon: "uil-search rotate-y-180",
              text: "Краснодар",
              subtext: ", Краснодарский край",
            },
          ]}
          onCitySelect={handleCitySelect}
          onSearch={handleSearch}
        />
      </div>

    </div>
  );
}

export default App;
