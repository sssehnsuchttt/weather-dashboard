import { useState, useRef, useEffect, useId, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 0, height: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.4,
      visualDuration: 0.4,
      type: "spring",
      bounce: 0.4,
      // when: "beforeChildren",
      ease: "easeInOut",

      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0.7, y: 0, height: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

const DropdownMenu = ({
  items,
  buttonLabel = "Dropdown",
  secondLabel,
  buttonClass = "",
  isInline,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonId = useId();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-center text-base ${buttonClass} focus:outline-none`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={buttonId}
      >
        {isInline && <span>{buttonLabel}</span>}
        <div className="flex items-center">
          {secondLabel && (
            <span className="ml-4 font-semibold text-gray-400 md:ml-0">
              {secondLabel}
            </span>
          )}
          <motion.svg
            className="ml-2 h-2.5 w-2.5 stroke-gray-400"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </motion.svg>
        </div>
      </button>

      {/* Выпадающее меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={buttonId}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={classNames(
              "right-0 z-10 flex flex-col overflow-hidden rounded-2xl md:absolute md:mt-5 md:min-w-35 md:origin-top-right md:gap-0 md:border-t md:border-white/20 md:bg-white md:shadow-xl md:dark:bg-gray-700",
            )}
          >
            {items.map((item, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.05,
                }}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className="mt-2 block h-8 w-full rounded-lg px-8 py-2 text-left text-base text-gray-400 transition-colors duration-400 ease-in-out hover:bg-gray-100 md:mt-0 md:h-auto md:rounded-none md:px-4 md:text-sm md:text-cyan-50 dark:hover:bg-white/10 dark:hover:text-cyan-50"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
