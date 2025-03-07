import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; // или ваш вариант classNames(...)
import { motion, AnimatePresence } from "framer-motion";
import ToggleSwitch from "../ui/ToggleSwitch";
import DropdownMenu from "../ui/DropdownMenu";
import MenuButton from "../ui/MenuButton";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

function SearchAndMenu({
  menuItems,
  scrollProgress,
  cityList,
  onCitySelect,
  onSearch,
  isLoading,
  unitSystem,
  onToggleUnitSystem,
  isMobile,
}) {
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  const pendingToggle = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const typingTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem("unit_system", unitSystem);
  }, [unitSystem]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuBgVisible(true);
    } else {
      setTimeout(() => setIsMenuBgVisible(false), 300);
    }
    console.log(resolvedTheme);
  }, [isMenuOpen]);

  function toggleSearch(forceState = null) {
    const newState = forceState !== null ? forceState : !isSearchOpen;
    if (newState && isMenuOpen) {
      setIsMenuOpen(false);
      pendingToggle.current = { target: "search", state: true };
      return;
    }
    setIsSearchOpen(newState);
  }

  function toggleMenu(forceState = null) {
    const newState = forceState !== null ? forceState : !isMenuOpen;
    if (newState && isSearchOpen) {
      setIsSearchOpen(false);
      pendingToggle.current = { target: "menu", state: true };
      return;
    }
    setIsMenuOpen(newState);
  }

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

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    typingTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 1000);
  }

  return (
    <>
      {/* header */}
      <div
        className={classNames(
          "bg-grainy absolute top-0 right-0 left-0 z-40 flex w-full flex-col items-center justify-center rounded bg-slate-300 p-4 md:z-auto md:flex-row md:gap-4 dark:bg-gray-900",
          isMenuBgVisible && "z-40",
          isMenuOpen && "rounded-b-2xl backdrop-blur-none",
          isSearchOpen && "shadow-none",
          scrollProgress > 0 &&
            !isMenuOpen &&
            !isSearchOpen &&
            "bg-slate-300/10 shadow-lg backdrop-blur-lg dark:bg-gray-900/70",
        )}
        data-active={!isMenuOpen}
      >
        <div className="flex w-full max-w-6xl flex-1 flex-col md:flex-row md:gap-4">
          <div className="flex h-10 w-full max-w-6xl items-center justify-between gap-4">
            {/* searchbar */}
            <motion.div className="relative flex h-full flex-1 justify-center">
              <div
                className={classNames(
                  "relative z-40 flex h-full w-full items-center overflow-hidden rounded-2xl border-t border-white bg-gradient-to-b px-4 dark:border-white/20",
                  isSearchOpen || isMenuOpen
                    ? "from-slate-50 to-sky-50 dark:from-slate-700 dark:to-slate-700"
                    : "from-slate-100 to-sky-50 dark:from-slate-800 dark:to-slate-800",
                  isSearchOpen && "ring-1 ring-cyan-50/60",
                  !isLoading && "transition-duration-400 ease-in-out",
                )}
              >
                <i className="uil uil-search rotate-y-180 text-xl text-gray-600 dark:text-gray-400"></i>
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  className="w-full bg-transparent px-2 text-base text-black placeholder-gray-600 outline-none md:text-sm dark:text-cyan-50 dark:placeholder-gray-400"
                  onFocus={() => toggleSearch(true)}
                  onChange={handleSearchChange}
                  value={searchValue}
                />

                {/* searchbar close button */}
                <div
                  onClick={() => toggleSearch(false)}
                  className={classNames(
                    "-mr-4 ml-4 flex h-full cursor-pointer items-center px-4 transition-all duration-400 ease-in-out",
                    isSearchOpen ? "translate-x-0" : "translate-x-full",
                  )}
                >
                  <i className="uil uil-multiply h-fit w-fit text-xl text-gray-600 transition-all duration-100 ease-in-out hover:text-gray-300 active:scale-70 dark:text-gray-400 dark:hover:text-gray-100"></i>
                </div>
              </div>

              {/* cities dropdown list */}
              <div
                className={classNames(
                  "absolute top-0 left-0 z-40 -m-4 mt-14 h-dvh w-screen pb-24 md:mx-0 md:w-full",
                  !isSearchOpen && "pointer-events-none",
                )}
              >
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
                        hidden: { opacity: 0, scale: 0.85, y: 20 },
                        visible: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.85, y: 20 },
                      }}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        visualDuration: 0.4,
                        bounce: 0.3,
                        staggerChildren: 0.1,
                      }}
                      className={classNames(
                        "relative flex max-h-full flex-col items-start justify-between gap-2 overflow-hidden border-white px-4 md:gap-0 md:rounded-2xl md:border-t md:bg-slate-100 md:px-0 md:shadow-lg dark:border-white/20 md:dark:bg-slate-800",
                        isMobile ? "" : "bg-grainy",
                      )}
                    >
                      {cityList.map((item, index) => (
                        <div
                          key={index}
                          className="flex w-full flex-col rounded-2xl transition-colors duration-400 ease-in-out md:rounded-none md:hover:bg-gray-600/10 md:dark:hover:bg-slate-300/20"
                        >
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: -15 },
                              visible: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: 15 },
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-2 flex h-10 w-full cursor-pointer items-center gap-2 rounded-2xl bg-slate-50 p-4 px-4 text-base transition-colors duration-400 outline-none first:mt-0 md:mt-0 md:h-12 md:rounded-none md:bg-transparent md:text-sm dark:bg-slate-800 md:dark:bg-transparent"
                            onClick={() => {
                              setIsSearchOpen(false);
                              onCitySelect?.(item);
                            }}
                          >
                            <i
                              className={`uil h-fit w-fit ${item.icon} text-xl text-gray-600 dark:text-gray-400`}
                            ></i>
                            <span className="font-medium text-black dark:text-cyan-50">
                              {item.text}
                              <span className="font-normal text-gray-600 dark:text-gray-400">
                                {item.subtext}
                              </span>
                            </span>
                          </motion.div>
                        </div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* menu button */}
            {isMobile && (
              <MenuButton isOpen={isMenuOpen} toggle={() => toggleMenu()} />
            )}
          </div>

          {/* menu */}
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
                  bounce: 0.3,
                  staggerChildren: 0.1,
                }}
                className="flex max-w-6xl flex-col justify-center gap-2 overflow-hidden md:max-h-10 md:min-w-fit md:flex-row md:items-center md:justify-end md:gap-4 md:overflow-visible"
              >
                {/* theme toggle */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 15 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-4 flex h-8 w-full items-center gap-4 px-4 text-xl text-gray-600 md:mt-0 md:w-fit md:px-0 dark:text-gray-400"
                >
                  <span className="text-base text-black md:hidden dark:text-cyan-50">
                    {t("selected_theme")}
                  </span>
                  <div className="flex items-center gap-2">
                    <i className="uil uil-moon"></i>
                    <ToggleSwitch
                      isOn={resolvedTheme === "light"}
                      onToggle={toggleTheme}
                    />
                    <i className="uil uil-sun"></i>
                  </div>
                </motion.div>

                {/* units toggle */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 15 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex h-8 w-full items-center gap-4 px-4 text-xl text-gray-600 md:w-fit md:px-0 dark:text-gray-400"
                >
                  <span className="text-base text-black md:hidden dark:text-cyan-50">
                    {t("unit_system")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">°F</span>
                    <ToggleSwitch
                      isOn={unitSystem == "si"}
                      onToggle={onToggleUnitSystem}
                    />
                    <span className="text-base font-bold">°C</span>
                  </div>
                </motion.div>

                {/* language toggle */}
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
                    buttonLabel={t("language")}
                    secondLabel={i18n.language.toUpperCase()}
                    isInline={isMobile}
                    buttonClass="px-4 md:px-0 h-8"
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* background */}
      <div
        className={classNames(
          "absolute top-0 z-30 h-dvh w-full bg-black/70 transition-all duration-400 ease-in-out",
          isSearchOpen || isMenuOpen
            ? "opacity-full"
            : "pointer-events-none opacity-0",
          isMenuOpen ? "bg-black/70" : "",
          isSearchOpen
            ? "bg-slate-300 md:bg-black/70 md:backdrop-blur-xs dark:bg-gray-900 dark:md:bg-black/70"
            : "backdrop-blur-xs",
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
  ).isRequired,

  scrollProgress: PropTypes.number.isRequired,

  cityList: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      subtext: PropTypes.string,
    }),
  ).isRequired,

  onCitySelect: PropTypes.func.isRequired,

  onSearch: PropTypes.func,

  isLoading: PropTypes.bool,

  unitSystem: PropTypes.oneOf(["si", "imperial"]).isRequired,

  onToggleUnitSystem: PropTypes.func.isRequired,

  isMobile: PropTypes.bool.isRequired,
};

export default SearchAndMenu;
