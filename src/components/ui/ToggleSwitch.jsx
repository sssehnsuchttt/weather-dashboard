import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function ToggleSwitch({ isOn, onToggle }) {
  return (
    <button
      className={`flex h-7 w-12 cursor-pointer rounded-full p-1 transition-colors duration-400 focus:outline-none md:h-6 md:w-10 md:p-1 ${
        isOn
          ? "bg-gradient-to-r from-cyan-300 to-blue-400"
          : "bg-gradient-to-r from-gray-600 to-gray-700"
      }`}
      onClick={() => onToggle(!isOn)}
    >
      <motion.div
        className="h-5 w-5 rounded-full bg-white shadow-md md:h-4 md:w-4"
        transition={{
          type: "spring",
          duration: 0.4,
          bounce: 0.4,
        }}
        animate={{ x: isOn ? "100%" : "0%" }}
      />
    </button>
  );
}


ToggleSwitch.propTypes = {
  isOn: PropTypes.bool,
  onToggle: PropTypes.func,
};
