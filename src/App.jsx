import { useState, useEffect, useRef } from "react";
import HourlyForecast from "./components/sections/HourlyForecast";
import PrecipitationChart from "./components/sections/PrecipitationChart";
import CurrentWeather from "./components/sections/CurrentWeather";
import WeatherIndicators from "./components/sections/WeatherIndicators";
import WeeklyForecast from "./components/sections/WeeklyForecast";
import SearchAndMenu from "./components/sections/SearchAndMenu";
import { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "next-themes";
import "./App.css";
import { throttle } from "lodash";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";
import axios from "axios";

const API_URL = "https://api.open-meteo.com/v1/forecast";
const SEARCH_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const languageNames = {
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  zh: "中文 (简体)",
  // ar: "العربية"
};


const menuItems = Object.keys(languageNames).map((lng) => ({
  label: languageNames[lng],
  onClick: () => {
    i18n.changeLanguage(lng);
  },
}));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState({
    "icon": "uil-search rotate-y-180",
    "admin": "Россия, Забайкальский Край, ",
    "id": 2016284,
    "city": "Солонцы",
    "latitude": 51.45332,
    "longitude": 118.85263
});

  const [unitSystem, setUnitSystem] = useState(
    localStorage.getItem("unit_system") || "si",
  );

  const SearchCity = async (name) => {
    const namesList = name.split(",").map(item => item.trim()).filter(Boolean);
  
    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          name: namesList[namesList.length - 1],
          count: 40,
          language: i18n.language,
        },
      });
  
      if (!response.data.results || !Array.isArray(response.data.results)) {
        setCityList([{id: "not_found"}]); 
        return;
      }
  
      setCityList(
        response.data.results
          .map((city) => {
            
            const adminParts =
              [city.country, city.admin1, city.admin2]
                .filter((field) => field && field !== city.name);

            return {
            id: city.id,
            admin: adminParts.length > 0 ? adminParts.join(", ") + ", " : "",
            city: city.name,
            latitude: city.latitude,
            longitude: city.longitude
            };
          })
          .filter((city) => namesList.length === 1 || namesList.slice(0, -1).some(name => city.admin.toLowerCase().includes(name.toLowerCase())))
      );
  
    } catch (err) {
      console.error("Error while search:", err);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(API_URL, {
          params: {
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude,
            current:
              "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,is_day,cloud_cover",
            hourly:
              "temperature_2m,precipitation,precipitation_probability,weather_code",
            daily:
              "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,sunset,sunrise,precipitation_sum",
            timezone: "auto",
            forecast_days: 8,
          },
        });
        const currentHour = new Date(response.data.current.time).getHours();
        setData({
          currentData: {
            city: selectedCity.city,
            temperature: response.data.current.temperature_2m,
            feelsLike: response.data.current.apparent_temperature,
            weatherCode: response.data.current.weather_code,
            maxTemp: response.data.daily.temperature_2m_max[0],
            minTemp: response.data.daily.temperature_2m_min[0],
            time: response.data.current.time,
            humidity: response.data.current.relative_humidity_2m,
            pressure: response.data.current.pressure_msl,
            uvIndex: response.data.daily.uv_index_max[0],
            windSpeed: response.data.current.wind_speed_10m,
            windDirection: response.data.current.wind_direction_10m,
            isDay: response.data.current.is_day,
            cloudCover: response.data.current.cloud_cover,
            sunrise: response.data.daily.sunrise[0],
            sunset: response.data.daily.sunset[0],
            precipitationSum: response.data.daily.precipitation_sum[0]

          },
          dailyData: response.data.daily.time.slice(1, 8).map((_, index) => ({
            time: response.data.daily.time[index + 1],
            weatherCode: response.data.daily.weather_code[index + 1],
            maxTemp: response.data.daily.temperature_2m_max[index + 1],
            minTemp: response.data.daily.temperature_2m_min[index + 1],
            precipitationSum: response.data.daily.precipitation_sum[index + 1]
          })),
          hourlyData: response.data.hourly.time
            .slice(currentHour, currentHour + 24)
            .map((_, index) => ({
              time: response.data.hourly.time[currentHour + index],
              weatherCode:
                response.data.hourly.weather_code[currentHour + index],
              temperature:
                response.data.hourly.temperature_2m[currentHour + index],
              precipitation: response.data.hourly.precipitation[currentHour + index],
              precipitationProbability:
                response.data.hourly.precipitation_probability[
                  currentHour + index
                ],
              isDay: (() => {
                const hourlyTime = response.data.hourly.time[
                  currentHour + index
                ].slice(11, 16);
                const sunriseTime = response.data.daily.sunrise[0].slice(
                  11,
                  16,
                );
                const sunsetTime = response.data.daily.sunset[0].slice(11, 16);

                return hourlyTime > sunriseTime && hourlyTime < sunsetTime;
              })(),
            })),
        });
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError("Не удалось загрузить данные. Попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  const toggleUnitSystem = () =>
    setUnitSystem(unitSystem === "si" ? "imperial" : "si");

  const handleScroll = () => {
    const scrollTop = scrollRef.current.scrollTop;
    const scrollHeight =
      scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    setScrollProgress(Math.floor(((scrollTop / scrollHeight) * 100) / 5) * 5);
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth < 768);
    }, 200);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel && handleResize.cancel();
    };
  }, []);

  // Когда пользователь кликает по городу из списка
  const handleCitySelect = (city) => {
    if (city.id !== "not_found") {
      setSelectedCity(city);
      setIsLoading(true);
    }
    setCityList([]);
  };

  // Когда пользователь перестал вводить текст в поле поиска
  const handleSearch = (value) => {
    SearchCity(value);
  };

  return (
    <SkeletonTheme
      baseColor={resolvedTheme == "dark" ? "#364153" : "#b4bcca"}
      highlightColor={resolvedTheme == "dark" ? "#4a5565" : "#d1d5dc"}
      borderRadius="0.4rem"
    >
      <div className="relative flex h-dvh w-full justify-center overflow-hidden bg-slate-300 dark:bg-gray-900">
        <div className="flex h-full w-full flex-col overflow-y-auto text-white">
          <div
            className="flex min-h-dvh max-w-screen flex-1 flex-col items-center overflow-y-auto p-4 pt-0 text-white"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            <div className="mx-auto mt-18 flex w-full max-w-6xl flex-col gap-4 md:flex-row">
              <div className="flex w-full flex-col gap-4 md:w-120">
                <CurrentWeather
                  data={data?.currentData}
                  isLoading={isLoading}
                  unitSystem={unitSystem}
                />
                <WeatherIndicators
                  data={data?.currentData}
                  isLoading={isLoading}
                  unitSystem={unitSystem}
                  isMobile={isMobile}
                />
              </div>
              <WeeklyForecast
                data={data?.dailyData}
                isLoading={isLoading}
                unitSystem={unitSystem}
              ></WeeklyForecast>
            </div>
            <div className="mx-auto mt-4 flex w-full max-w-6xl flex-1 flex-col gap-4">
              <HourlyForecast
                data={data?.hourlyData}
                isLoading={isLoading}
                unitSystem={unitSystem}
              />
              <PrecipitationChart
                data={data}
                isLoading={isLoading}
                unitSystem={unitSystem}
                isMobile={isMobile}
              />
            </div>
          </div>

          <SearchAndMenu
            menuItems={menuItems}
            scrollProgress={scrollProgress}
            isLoading={isLoading}
            cityList={cityList}
            onCitySelect={handleCitySelect}
            onSearch={handleSearch}
            unitSystem={unitSystem}
            onToggleUnitSystem={toggleUnitSystem}
            isMobile={isMobile}
            onSearchClose={() => setCityList([])}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default App;
