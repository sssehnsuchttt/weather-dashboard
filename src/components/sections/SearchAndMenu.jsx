import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; 
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
  onSearchClose,
  searchHistory,
}) {
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
  const [isSearchProcessing, setIsSearchProcessing] = useState(false);
  const isFirstRenderRef = useRef(true);
  const [isFirstRender, SetIsFirstRender] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  const pendingToggle = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const typingTimer = useRef(null);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      SetIsFirstRender(false);
      isFirstRenderRef.current = false;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("unit_system", unitSystem);
  }, [unitSystem]);

  useEffect(() => {
    setIsSearchProcessing(false);
  }, [cityList]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuBgVisible(true);
    } else {
      setTimeout(() => setIsMenuBgVisible(false), 300);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobile]);

  function toggleSearch(forceState = null) {
    const newState = forceState !== null ? forceState : !isSearchOpen;
    if (newState && isMenuOpen) {
      setIsMenuOpen(false);
      pendingToggle.current = { target: "search", state: true };
      return;
    }
    setIsSearchOpen(newState);
  }

  const toggleTheme = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");

  function toggleMenu(forceState = null) {
    const newState = forceState !== null ? forceState : !isMenuOpen;
    if (newState && isSearchOpen) {
      setIsSearchOpen(false);
      pendingToggle.current = { target: "menu", state: true };
      return;
    }
    setIsMenuOpen(newState);
  }

  function closeAll() {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    onSearchClose();
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
  
    setIsSearchProcessing(true);
  
    typingTimer.current = setTimeout(() => {
      if (value.trim().length > 0) {
        if (onSearch) {
          onSearch(value.trim());
        }
      } else {
        onSearchClose();
        setIsSearchProcessing(false);
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
          !isFirstRender && "transition-all duration-400"
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
                <AnimatePresence>
                  {isSearchProcessing && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      role="status"
                      className="absolute top-1/2 right-0 mr-12 -translate-y-1/2"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-[16px] w-[16px] animate-spin fill-gray-200 text-gray-600 dark:text-gray-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* searchbar close button */}
                <div
                  onClick={() => {
                    setSearchValue("");
                    onSearchClose();
                    toggleSearch(false);
                  }}
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
                  "absolute top-0 left-0 z-40 mt-14 -ml-4 h-dvh w-screen md:mx-0 md:max-h-121 md:w-full",
                  !isSearchOpen && "pointer-events-none",
                )}
                onClick={closeAll}
              >
                <AnimatePresence
                  onExitComplete={handleAnimationComplete}
                  initial={false}
                >
                  {isSearchOpen && !isSearchProcessing ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={
                        isMobile
                          ? {
                              hidden: { opacity: 0, scale: 1, y: 0 },
                              visible: { opacity: 1, scale: 1, y: 0 },
                              exit: { opacity: 0, scale: 1, y: 0 },
                            }
                          : {
                              hidden: {
                                opacity: 0,
                                scale: 0.75,
                                y: 20,
                              },
                              visible: { opacity: 1, scale: 1, y: 0 },
                              exit: {
                                opacity: 0,
                                scale: 0.75,
                                y: 20,
                              },
                            }
                      }
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        visualDuration: 0.4,
                        ease: "easeInOut",
                        bounce: 0.4,
                        staggerChildren: 0.02,
                      }}
                      className={classNames(
                        "relative flex max-h-full origin-top flex-col items-start justify-between gap-0 overflow-hidden pb-4 md:rounded-2xl md:p-0 md:shadow-lg",
                        isMobile ? "" : "bg-grainy",
                      )}
                    >
                      <div className="h-full w-full overflow-y-auto border-white md:rounded-2xl md:border-t md:bg-slate-100 dark:border-white/20 md:dark:bg-slate-800">
                        {(!cityList.length
                          ? [
                              {
                                id: "current_geo",
                                icon: "uil-map-marker",
                                admin: "",
                                city: t("current_location"),
                              },
                              ...searchHistory.map((city) => ({
                                ...city,
                                icon: "uil-history",
                              })),
                            ]
                          : [
                              ...cityList.map((city) => ({
                                icon:
                                  city.id === "not_found"
                                    ? "uil-multiply"
                                    : "uil-search rotate-y-180",
                                admin:
                                  city.id === "not_found" && t("not_found"),
                                ...city,
                              })),
                            ]
                        ).map((item, index) => (
                          <div
                            key={index}
                            className="flex w-full flex-col px-4 transition-colors duration-400 ease-in-out last:border-none hover:bg-gray-600/10 md:rounded-none md:px-0 dark:hover:bg-slate-300/20"
                          >
                            <motion.div
                              variants={
                                isMobile
                                  ? {
                                      hidden: {
                                        opacity: 0.5,
                                        scale: 0.8,
                                        y: 10,
                                      },
                                      visible: { opacity: 1, scale: 1, y: 0 },
                                      exit: { opacity: 0.5, scale: 0.8, y: 10 },
                                    }
                                  : {
                                      hidden: { opacity: 0.5, scale: 1, y: 10 },
                                      visible: { opacity: 1, scale: 1, y: 0 },
                                      exit: { opacity: 0.5, scale: 1, y: 10 },
                                    }
                              }
                              transition={{
                                type: "spring",
                                duration: 0.4,
                                visualDuration: 0.4,
                                ease: "easeInOut",
                                bounce: 0.3,
                              }}
                              className="mt-2 flex min-h-14 w-full cursor-pointer items-center gap-2 p-4 px-4 py-0 text-base transition-colors duration-400 outline-none first:mt-0 md:mt-0 md:min-h-12 md:rounded-none md:bg-transparent md:text-sm md:dark:bg-transparent"
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchValue("");
                                setIsSearchProcessing(false);
                                onCitySelect?.(item);
                              }}
                            >
                              <i
                                className={`uil h-fit w-fit ${item.icon} text-xl text-gray-600 dark:text-gray-400`}
                              ></i>
                              <span className="font-medium text-gray-600 dark:text-gray-400">
                                {item.admin}
                                <span className="font-normal text-black dark:text-cyan-50">
                                  {item.city}
                                </span>
                              </span>
                            </motion.div>
                          </div>
                        ))}
                      </div>
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
          (isSearchOpen && !isMobile) || isMenuOpen
            ? "opacity-full backdrop-blur-xs"
            : "pointer-events-none opacity-0",
        )}
        onClick={closeAll}
      ></div>

      <div
        className={classNames(
          "absolute top-0 z-30 h-dvh w-full bg-slate-300 transition-all duration-400 ease-in-out dark:bg-gray-900",
          isSearchOpen && isMobile
            ? "opacity-full backdrop-blur-xs"
            : "pointer-events-none opacity-0",
        )}
        onClick={closeAll}
      ></div>
    </>
  );
}

SearchAndMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  scrollProgress: PropTypes.number.isRequired,
  cityList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      city: PropTypes.string.isRequired,
      admin: PropTypes.string,
      icon: PropTypes.string,
    })
  ).isRequired,
  onCitySelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  unitSystem: PropTypes.oneOf(["si", "imperial"]).isRequired,
  onToggleUnitSystem: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onSearchClose: PropTypes.func.isRequired,
  searchHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      city: PropTypes.string.isRequired,
      admin: PropTypes.string,
    })
  ).isRequired,
};


export default SearchAndMenu;
