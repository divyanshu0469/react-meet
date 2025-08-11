import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, HTMLMotionProps } from "motion/react";

interface WebcamButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  isActive?: boolean;
  variant?: "default" | "destructive";
  icon?: boolean;
  tooltip?: string;
}

const WebcamButton = ({
  children,
  className = "",
  isActive,
  variant,
  icon,
  tooltip,
  ...props
}: WebcamButtonProps) => {
  return tooltip ? (
    <Tooltip.Root delayDuration={1000}>
      <Tooltip.Trigger asChild>
        <motion.button
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          whileHover={{
            borderRadius: icon ? "0.75rem" : undefined,
          }}
          whileTap={{ scale: 0.95 }}
          {...props}
          className={[
            "cursor-pointer flex items-center justify-center gap-1",
            icon ? "p-3 rounded-full" : "px-3 py-1 rounded-lg",
            variant
              ? variant === "default"
                ? isActive
                  ? "bg-blue text-light hover:bg-blue-hover"
                  : "bg-dark-gray text-light hover:bg-dark-gray-hover"
                : variant === "destructive"
                ? isActive
                  ? "bg-dark-gray text-light hover:bg-dark-gray-hover"
                  : "bg-red text-light hover:bg-red-hover"
                : "bg-dark-gray text-light hover:bg-dark-gray-hover"
              : "bg-dark-gray text-light hover:bg-dark-gray-hover",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </motion.button>
      </Tooltip.Trigger>
      {tooltip && (
        <Tooltip.Content className="bg-light rounded-lg px-2 py-1 text-dark font-light m-2 text-sm">
          {tooltip}
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  ) : (
    <motion.button
      whileHover={{
        borderRadius: icon ? "0.75rem" : undefined,
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
      className={[
        "cursor-pointer flex items-center justify-center gap-1",
        icon ? "p-3 rounded-full" : "px-3 py-1 rounded-lg",
        variant
          ? variant === "default"
            ? isActive
              ? "bg-blue text-light hover:bg-blue-hover"
              : "bg-dark-gray text-light hover:bg-dark-gray-hover"
            : variant === "destructive"
            ? isActive
              ? "bg-dark-gray text-light hover:bg-dark-gray-hover"
              : "bg-red text-light hover:bg-red-hover"
            : "bg-dark-gray text-light hover:bg-dark-gray-hover"
          : "bg-dark-gray text-light hover:bg-dark-gray-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </motion.button>
  );
};

WebcamButton.displayName = "WebcamButton";

export default WebcamButton;
