import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; // или ваш вариант classNames(...)
import { motion, AnimatePresence } from "framer-motion";
import ToggleSwitch from "../ui/ToggleSwitch";
import DropdownMenu from "../ui/DropdownMenu";
import MenuButton from "../ui/MenuButton";

function SearchAndMenu({ menuItems, cityList, onCitySelect, onSearch }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    }
    document.documentElement.classList.remove("theme-loading");
  }, []);

  const pendingToggle = useRef(null);

  // Состояние и таймер для дебаунса поиска
  const [searchValue, setSearchValue] = useState("");
  const typingTimer = useRef(null);

  // Отслеживаем ресайз, чтобы переключать вид (mobile / desktop)
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Показываем / скрываем фоновую подложку при открытии меню
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuBgVisible(true);
    } else {
      // Даём время на анимацию, после чего убираем фон
      setTimeout(() => setIsMenuBgVisible(false), 300);
    }
  }, [isMenuOpen]);

  // Логика открытия/закрытия поиска
  function toggleSearch(forceState = null) {
    const newState = forceState !== null ? forceState : !isSearchOpen;
    // Если хотим открыть поиск, а меню открыто – сначала закрываем меню
    if (newState && isMenuOpen) {
      setIsMenuOpen(false);
      pendingToggle.current = { target: "search", state: true };
      return;
    }
    setIsSearchOpen(newState);
  }

  // Логика открытия/закрытия меню
  function toggleMenu(forceState = null) {
    const newState = forceState !== null ? forceState : !isMenuOpen;
    // Если хотим открыть меню, а поиск открыт – сначала закрываем поиск
    if (newState && isSearchOpen) {
      setIsSearchOpen(false);
      pendingToggle.current = { target: "menu", state: true };
      return;
    }
    setIsMenuOpen(newState);
  }

  // Колбэк, который вызывается, когда exit-анимация компонента завершена (AnimatePresence)
  function handleAnimationComplete() {
    if (pendingToggle.current) {
      if (pendingToggle.current.target === "search") {
        setIsSearchOpen(pendingToggle.current.state);
      } else if (pendingToggle.current.target === "menu") {
        setIsMenuOpen(pendingToggle.current.state);
      }
      pendingToggle.current = null;
    }
  }

  // Обработчик ввода в поле поиска с дебаунсом 1с
  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);

    // Сбрасываем предыдущий таймер
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    // Запускаем новый таймер, который вызовет onSearch через 1с
    typingTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 1000);
  }

  return (
    <>
      {/* Шапка с поиском и меню */}
      <div
        className={classNames(
          "bg-grainy absolute top-0 right-0 left-0 z-40 flex w-full flex-col items-center justify-center p-4 shadow-lg backdrop-blur-lg transition-all duration-400 ease-in-out md:z-auto md:flex-row md:gap-4 md:bg-gray-900 md:backdrop-blur-none",
          isMenuBgVisible ? "z-40 bg-gray-900" : "",
          isMenuOpen
            ? "rounded-b-2xl bg-gray-900 backdrop-blur-none"
            : "bg-gray-900/70",
          isSearchOpen && "shadow-none",
        )}
        data-active={!isMenuOpen}
      >
        <div className="flex w-full max-w-6xl flex-1 flex-col md:flex-row md:gap-4">
          <div className="flex h-10 w-full max-w-6xl items-center justify-between gap-4">
            {/* Поле поиска */}
            <motion.div className="relative flex h-full flex-1 justify-center">
              <div
                className={classNames(
                  "relative z-40 flex h-full w-full items-center overflow-hidden rounded-2xl border-t border-white/20 px-4 transition-all duration-400 ease-in-out",
                  isSearchOpen || isMenuOpen
                    ? "bg-slate-700/70"
                    : "bg-slate-800",
                  isSearchOpen && "ring-1 ring-cyan-50/60",
                )}
              >
                <i className="uil uil-search rotate-y-180 text-xl text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Введите город..."
                  className="w-full bg-transparent px-2 text-base text-cyan-50 placeholder-gray-400 outline-none md:text-sm"
                  onFocus={() => toggleSearch(true)}
                  onChange={handleSearchChange}
                  value={searchValue}
                />
                {/* Кнопка закрыть поиск */}
                <div
                  onClick={() => toggleSearch(false)}
                  className={classNames(
                    "-mr-4 ml-4 flex h-full cursor-pointer items-center px-4 transition-all duration-400 ease-in-out",
                    isSearchOpen ? "translate-x-0" : "translate-x-full",
                  )}
                >
                  <i className="uil uil-multiply h-fit w-fit text-xl text-gray-400 transition-all duration-100 ease-in-out hover:text-gray-100 active:scale-70"></i>
                </div>
              </div>

              {/* Выпадающий список городов */}
              <div className="pointer-events-none absolute top-0 left-0 z-40 -m-4 mt-14 h-dvh w-screen pb-24 md:mx-0 md:w-full">
                <AnimatePresence
                  onExitComplete={handleAnimationComplete}
                  initial={false}
                >
                  {isSearchOpen ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{
                        hidden: { opacity: 0, scale: 0.85, y: 30 },
                        visible: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.85, y: 30 },
                      }}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        visualDuration: 0.4,
                        bounce: 0.4,
                        staggerChildren: 0.1,
                      }}
                      className={classNames(
                        "relative flex max-h-full flex-col items-start justify-between overflow-hidden border-white/20 px-4 md:rounded-2xl md:border-t md:bg-slate-800 md:shadow-lg",
                        isMobile ? "" : "bg-grainy",
                      )}
                    >
                      {cityList.map((item, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: -15 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: 15 },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex w-full cursor-pointer items-center gap-2 border-b border-white/20 p-4 text-base transition-colors duration-400 last:border-none hover:bg-slate-700/30 md:p-0 md:py-4 md:text-sm"
                          onClick={() => onCitySelect?.(item)}
                        >
                          <i
                            className={`uil h-fit w-fit ${item.icon} text-xl text-gray-400`}
                          ></i>
                          <span className="font-medium text-cyan-50">
                            {item.text}
                            <span className="font-normal text-gray-400">
                              {item.subtext}
                            </span>
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Кнопка меню (только на мобильных) */}
            {isMobile && (
              <MenuButton isOpen={isMenuOpen} toggle={() => toggleMenu()} />
            )}
          </div>

          {/* Блок с переключателями и дропдаун-меню */}
          <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isMenuOpen || !isMobile ? (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  ease: "easeInOut",
                  visualDuration: 0.4,
                  bounce: 0.4,
                  staggerChildren: 0.1,
                }}
                className="flex max-w-6xl flex-col justify-center gap-2 overflow-hidden md:max-h-10 md:min-w-fit md:flex-row md:items-center md:justify-end md:gap-4 md:overflow-visible"
              >
                {/* Переключатель темы */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 15 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-4 flex h-8 w-full items-center gap-4 px-4 text-xl text-gray-400 md:mt-0 md:w-fit md:px-0"
                >
                  <span className="text-base text-cyan-50 md:hidden">
                    Выбранная тема
                  </span>
                  <div className="flex items-center gap-2">
                    <i className="uil uil-moon"></i>
                    <ToggleSwitch
                      isOn={theme !== "dark"}
                      onToggle={toggleTheme}
                    />
                    <i className="uil uil-sun"></i>
                  </div>
                </motion.div>

                {/* Переключатель единиц измерения */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 15 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex h-8 w-full items-center gap-4 px-4 text-xl text-gray-400 md:w-fit md:px-0"
                >
                  <span className="text-base text-cyan-50 md:hidden">
                    Единица измерения
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">°F</span>
                    <ToggleSwitch />
                    <span className="text-base font-bold">°C</span>
                  </div>
                </motion.div>

                {/* Выбор языка */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 15 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <DropdownMenu
                    items={menuItems}
                    buttonLabel="Язык"
                    secondLabel="RU"
                    isInline={isMobile}
                    buttonClass="px-4 md:px-0 h-8"
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Затемняющий фон */}
      <div
        className={classNames(
          "absolute top-0 z-30 h-dvh w-full backdrop-blur-xs transition-all duration-400 ease-in-out md:bg-black/70",
          isSearchOpen || isMenuOpen
            ? "opacity-full"
            : "pointer-events-none opacity-0",
          isMenuOpen ? "bg-black/70" : "",
          isSearchOpen && "bg-gray-900",
        )}
      ></div>
    </>
  );
}

SearchAndMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }),
  ),
  cityList: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string,
      subtext: PropTypes.string,
    }),
  ),
  onCitySelect: PropTypes.func,
  /**
   * onSearch вызывается, когда пользователь перестал вводить текст (спустя 1с).
   * Принимает введённую строку.
   */
  onSearch: PropTypes.func,
};

SearchAndMenu.defaultProps = {
  menuItems: [],
  cityList: [
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
  ],
  onCitySelect: () => {},
  onSearch: () => {},
};

export default SearchAndMenu;
