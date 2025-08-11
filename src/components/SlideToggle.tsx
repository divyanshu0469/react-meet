import { motion } from "motion/react";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10 cursor-pointer";

const SliderToggle = ({
  selected,
  toggleOn,
  toggleOff,
  offLabel,
  onLabel,
  off,
  on,
}: {
  selected: boolean;
  toggleOn: () => void;
  toggleOff: () => void;
  offLabel?: string;
  onLabel?: string;
  off?: React.ReactNode;
  on?: React.ReactNode;
}) => {
  return (
    <div className="relative flex w-fit items-center rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${
          !selected ? "text-light" : "text-dark"
        }`}
        onClick={toggleOff}
      >
        {off}
        <span className="relative">{offLabel}</span>
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${selected ? "text-light" : "text-dark"}`}
        onClick={toggleOn}
      >
        {on}
        <span className="relative">{onLabel}</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 50, stiffness: 300 }}
          className="h-full w-1/2 rounded-full bg-dark"
        />
      </div>
    </div>
  );
};

export default SliderToggle;
