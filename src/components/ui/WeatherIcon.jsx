import PropTypes from "prop-types";
import classNames from "classnames";

const basePath = import.meta.env.DEV ? "./" : import.meta.env.BASE_URL;

const weatherIcons = {
  0: {
    day: "sunny",
    night: "moon-stars",
    glow: { day: "rgba(255, 200, 0, 0.4)", night: "rgba(70, 82, 198, 0.9)" },
  },
  1: {
    day: "partly-cloudy",
    night: "partly-cloudy-night",
    glow: { day: "rgba(255, 220, 100, 0.3)", night: "rgba(70, 82, 198, 0.9)" },
  },
  2: {
    day: "partly-cloudy",
    night: "partly-cloudy-night",
    glow: { day: "rgba(255, 220, 100, 0.3)", night: "rgba(70, 82, 198, 0.9)" },
  },
  3: {
    day: "cloud",
    night: "cloud",
    glow: {
      day: "rgba(200, 200, 255, 0.4)",
      night: "rgba(200, 200, 255, 0.4)",
    },
  },
  45: {
    day: "fog",
    night: "fog",
    glow: {
      day: "rgba(180, 180, 180, 0.5)",
      night: "rgba(180, 180, 180, 0.5)",
    },
  },
  48: {
    day: "fog",
    night: "fog",
    glow: {
      day: "rgba(180, 180, 180, 0.5)",
      night: "rgba(180, 180, 180, 0.5)",
    },
  },
  51: {
    day: "wet",
    night: "wet",
    glow: {
      day: "rgba(125, 197, 249, 0.5)",
      night: "rgba(125, 197, 249, 0.5)",
    },
  },
  53: {
    day: "wet",
    night: "wet",
    glow: {
      day: "rgba(125, 197, 249, 0.5)",
      night: "rgba(125, 197, 249, 0.5)",
    },
  },
  55: {
    day: "wet",
    night: "wet",
    glow: {
      day: "rgba(125, 197, 249, 0.5)",
      night: "rgba(125, 197, 249, 0.5)",
    },
  },
  56: {
    day: "wet",
    night: "wet",
    glow: {
      day: "rgba(125, 197, 249, 0.5)",
      night: "rgba(125, 197, 249, 0.5)",
    },
  },
  57: {
    day: "wet",
    night: "wet",
    glow: {
      day: "rgba(125, 197, 249, 0.5)",
      night: "rgba(125, 197, 249, 0.5)",
    },
  },
  61: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  63: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  65: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  66: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  67: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  71: {
    day: "snow",
    night: "snow",
    glow: {
      day: "rgba(180, 220, 255, 0.4)",
      night: "rgba(180, 220, 255, 0.4)",
    },
  },
  73: {
    day: "snow",
    night: "snow",
    glow: {
      day: "rgba(180, 220, 255, 0.4)",
      night: "rgba(180, 220, 255, 0.4)",
    },
  },
  75: {
    day: "snow",
    night: "snow",
    glow: {
      day: "rgba(180, 220, 255, 0.4)",
      night: "rgba(180, 220, 255, 0.4)",
    },
  },
  77: {
    day: "moderate-snow",
    night: "moderate-snow",
    glow: {
      day: "rgba(180, 220, 255, 0.4)",
      night: "rgba(180, 220, 255, 0.4)",
    },
  },
  80: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  81: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  82: {
    day: "heavy-rain",
    night: "heavy-rain",
    glow: {
      day: "rgba(100, 150, 255, 0.4)",
      night: "rgba(100, 150, 255, 0.4)",
    },
  },
  85: {
    day: "blizzard",
    night: "blizzard",
    glow: {
      day: "rgba(200, 230, 255, 0.3)",
      night: "rgba(200, 230, 255, 0.3)",
    },
  },
  86: {
    day: "blizzard",
    night: "blizzard",
    glow: {
      day: "rgba(200, 230, 255, 0.3)",
      night: "rgba(200, 230, 255, 0.3)",
    },
  },
  95: {
    day: "thunderstorm",
    night: "thunderstorm",
    glow: {
      day: "rgba(200, 230, 255, 0.3)",
      night: "rgba(200, 230, 255, 0.3)",
    },
  },
  96: {
    day: "thunderstorm",
    night: "thunderstorm",
    glow: {
      day: "rgba(200, 230, 255, 0.3)",
      night: "rgba(200, 230, 255, 0.3)",
    },
  },
  99: {
    day: "thunderstorm",
    night: "thunderstorm",
    glow: {
      day: "rgba(200, 230, 255, 0.3)",
      night: "rgba(200, 230, 255, 0.3)",
    },
  },
};

const WeatherIcon = ({ code, isDay, className, glow = false }) => {
  const iconData = weatherIcons[code] || weatherIcons[3];
  const iconName = iconData[isDay === 1 ? "day" : "night"];
  const glowColor = iconData.glow[isDay === 1 ? "day" : "night"];

  return (
    <div className="relative flex items-center justify-center select-none">
      {glow && (
        <div
          className="absolute h-28 w-28 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
        ></div>
      )}

      <img
        src={`${basePath}assets/icons/${iconName}.svg`}
        alt={iconName}
        className={classNames("relative", className)}
      />
    </div>
  );
};

WeatherIcon.propTypes = {
  code: PropTypes.number.isRequired,
  isDay: PropTypes.bool.isRequired,
  className: PropTypes.string,
  glow: PropTypes.bool,
};

export default WeatherIcon;
