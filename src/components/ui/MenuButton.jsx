import { motion } from "framer-motion";
import PropTypes from "prop-types";

const MenuButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="flex h-8 w-8 cursor-pointer items-center justify-center p-1 transition-all duration-100 ease-in-out active:scale-70"
    >
      <svg
        className="h-full w-full stroke-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.line
          x1="3"
          y1="7"
          x2="21"
          y2="7"
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          animate={isOpen ? { x1: 12, x2: 12 } : { x1: 3, x2: 21 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />

        <motion.line
          x1="3"
          y1="17"
          x2="21"
          y2="17"
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </svg>
    </button>
  );
};

MenuButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default MenuButton;
