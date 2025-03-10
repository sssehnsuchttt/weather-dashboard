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
  const getValidCityData = () => {
    try {
      const storedData = localStorage.getItem("selected_city");
      if (!storedData) throw new Error("Empty city localStorage data");
  
      const parsedData = JSON.parse(storedData);
  
      if (
        !parsedData ||
        typeof parsedData !== "object" ||
        !("id" in parsedData) ||
        !("city" in parsedData) ||
        !("latitude" in parsedData) ||
        !("longitude" in parsedData)
      ) {
        throw new Error("Corrupted city data");
      }
  
      return parsedData;
    } catch (error) {
      console.warn("An error occurred while loading data from localStorage", error.message);
      return {
        admin: "Россия, ",
        saveInHistory: false,
        id: 524901,
        city: "Москва",
        latitude: 55.75222,
        longitude: 37.61556,
      }; 
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const [cityList, setCityList] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("search_history")) || [];
    } catch (error) {
      console.error("Error parsing search history from localStorage:", error);
      return [];
    }
  });
  
  const [selectedCity, setSelectedCity] = useState(getValidCityData());
  const [unitSystem, setUnitSystem] = useState(
    localStorage.getItem("unit_system") || "si",
  );

  useEffect(() => {
    if (!selectedCity || !selectedCity.id || !selectedCity.saveInHistory) return;
  
    setSearchHistory((prevHistory) => {
      const historyArray = Array.isArray(prevHistory) ? prevHistory : [];
  
      const filteredHistory = historyArray.filter(city => city.id !== selectedCity.id);
  
      const updatedHistory = [selectedCity, ...filteredHistory].slice(0, 9); 
  
      localStorage.setItem("search_history", JSON.stringify(updatedHistory));
  
      return updatedHistory;
    });
  }, [selectedCity]);

  const [previousSyncDate, setPreviousSyncDate] = useState(
    Number(localStorage.getItem("previous_sync_date")) || 0,
  );

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selected_city", JSON.stringify(selectedCity));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("weather_data", JSON.stringify(data));
    }
  }, [data])

  const SearchCity = async (name) => {
    const namesList = name
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          name: namesList[namesList.length - 1],
          count: 40,
          language: i18n.language,
        },
      });

      if (!response.data.results || !Array.isArray(response.data.results)) {
        setCityList([{ id: "not_found" }]);
        return;
      }

      setCityList(
        response.data.results
          .map((city) => {
            const adminParts = [city.country, city.admin1, city.admin2].filter(
              (field) => field && field !== city.name,
            );

            return {
              id: city.id,
              saveInHistory: true,
              admin: adminParts.length > 0 ? adminParts.join(", ") + ", " : "",
              city: city.name,
              latitude: city.latitude,
              longitude: city.longitude,
            };
          })
          .filter(
            (city) =>
              namesList.length === 1 ||
              namesList
                .slice(0, -1)
                .some((name) =>
                  city.admin.toLowerCase().includes(name.toLowerCase()),
                ),
          ),
      );
    } catch (err) {
      console.error("Error while search:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!(((Date.now() / 1000) - previousSyncDate) < 60)) {
        setData(JSON.parse(localStorage.getItem("weather_data")));
        setIsLoading(false);
      }
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
              "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,sunset,sunrise,precipitation_sum,precipitation_probability_max",
            timezone: "auto",
            forecast_days: 8,
          },
        });
        const currentHour = new Date(response.data.current.time).getHours();
        localStorage.setItem("previous_sync_date", Date.now() / 1000);
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
            precipitationSum: response.data.daily.precipitation_sum[0],
          },
          dailyData: response.data.daily.time.slice(1, 8).map((_, index) => ({
            time: response.data.daily.time[index + 1],
            weatherCode: response.data.daily.weather_code[index + 1],
            maxTemp: response.data.daily.temperature_2m_max[index + 1],
            minTemp: response.data.daily.temperature_2m_min[index + 1],
            precipitationSum: response.data.daily.precipitation_sum[index + 1],
            precipitationProbabilityMax:
              response.data.daily.precipitation_probability_max[index + 1],
          })),
          hourlyData: response.data.hourly.time
            .slice(currentHour, currentHour + 24)
            .map((_, index) => ({
              time: response.data.hourly.time[currentHour + index],
              weatherCode:
                response.data.hourly.weather_code[currentHour + index],
              temperature:
                response.data.hourly.temperature_2m[currentHour + index],
              precipitation:
                response.data.hourly.precipitation[currentHour + index],
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
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later");
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

  const getCityByCoords = async (latitude, longitude) => {
    const cacheKey = `geo_cache_${latitude}_${longitude}`;
    const cachedData = localStorage.getItem(cacheKey);
    const lastFetchTime = localStorage.getItem(`${cacheKey}_time`);
  
    if (cachedData && lastFetchTime && Date.now() - lastFetchTime < 30000) {
      return JSON.parse(cachedData);
    }
  
  
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          zoom: 10,
          addressdetails: 1,
          "accept-language": i18n.language,
        },
        headers: {
          "User-Agent": "WeatherDashboard/1.0 (https://github.com/sssehnsuchttt/weather-dashboard)",
        },
      });
  
      if (response.data && response.data.address) {
        const cityData = {
          id: response.data.place_id,
          saveInHistory: false,
          city: response.data.address.city || response.data.address.town || response.data.address.village || t("unknown_location"),
          admin: response.data.address.state || "",
          country: response.data.address.country || "",
          latitude,
          longitude,
        };
  
        localStorage.setItem(cacheKey, JSON.stringify(cityData));
        localStorage.setItem(`${cacheKey}_time`, Date.now());
  
        return cityData;
      }
  
      throw new Error("Unable to find city by coordinates");
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };
  

  
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(new Error(`Error getting geolocation: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const handleCitySelect = async (city) => {
    setIsLoading(true);
    setCityList([]);
  
    if (city.id === "current_geo") {
      try {
        const { latitude, longitude } = await getUserLocation();

        console.log(await getCityByCoords(latitude, longitude));
        const nearestCity = await getCityByCoords(latitude, longitude);
        
        if (nearestCity) {
          setSelectedCity(nearestCity);
          localStorage.setItem("selected_city", JSON.stringify(nearestCity));
        }
      } catch (error) {
        console.error("Location error:", error);
      }
    } else {
      setSelectedCity(city);
      localStorage.setItem("selected_city", JSON.stringify(city));
    }
  
    setIsLoading(false);
  };
  

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
            searchHistory={searchHistory}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default App;
