import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogData, setDialogData] = useState(null);

  const openDialog = useCallback(({ title, message, buttons }) => {
    setDialogData({ title, message, buttons });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogData(null);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <AnimatePresence>
        {dialogData && <Dialog {...dialogData} />}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);

const Dialog = ({ title, message, buttons }) => {
  const { closeDialog } = useDialog();

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeDialog();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeDialog}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <motion.div
        className="bg-grainy relative mx-8 flex min-h-35 w-full flex-col justify-between rounded-2xl border-t border-white bg-gradient-to-b from-slate-100 to-sky-50 p-4 text-base shadow-lg sm:w-fit md:max-w-md md:text-sm dark:border-white/20 dark:from-slate-900 dark:to-slate-900"
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.4,
          visualDuration: 0.4,
          type: "spring",
          bounce: 0.4,
          ease: "easeInOut",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-base font-semibold text-gray-600 dark:text-gray-400">
            {title}
          </h2>
        )}

        <p className="text-gray-950 dark:text-cyan-50">{message}</p>

        <div className="mt-4 flex justify-end gap-2">
          {buttons?.map(({ text, onClick, variant }, index) => (
            <button
              key={index}
              onClick={() => {
                if (onClick) onClick();
                closeDialog();
              }}
              className={`-mb-1 cursor-pointer rounded-sm p-1 px-2 transition-all duration-300 ease-in-out select-none hover:bg-gray-900/10 active:scale-90 hover:dark:bg-gray-100/10 ${
                variant === "primary"
                  ? "text-gray-950 dark:text-cyan-50"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.oneOf(["primary", "secondary"]),
    }),
  ),
};

DialogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
