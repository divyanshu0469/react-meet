import { motion } from "motion/react";
import { useRef, useState } from "react";

const SlideTabs = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [position, setPosition] = useState({
    left: 4,
    width: 79.5390625,
    opacity: 1,
  });
  const [selectedPosition, setSelectedPosition] = useState({
    left: 4,
    width: 79.5390625,
    opacity: 1,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          ...selectedPosition,
        }));
        console.log(position, selectedPosition);
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-dark bg-light p-1"
    >
      <Tab
        setPosition={setPosition}
        setSelectedPosition={setSelectedPosition}
        onClick={() => setActiveTab("audio")}
      >
        Audio
      </Tab>
      <Tab
        setPosition={setPosition}
        setSelectedPosition={setSelectedPosition}
        onClick={() => setActiveTab("camera")}
      >
        Camera
      </Tab>
      <Tab
        setPosition={setPosition}
        setSelectedPosition={setSelectedPosition}
        onClick={() => setActiveTab("other")}
      >
        Other
      </Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  setSelectedPosition,
  onClick,
}: {
  children: React.ReactNode;
  setPosition: (position: {
    left: number;
    width: number;
    opacity: number;
  }) => void;
  setSelectedPosition: (position: {
    left: number;
    width: number;
    opacity: number;
  }) => void;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onClick={() => {
        if (!ref?.current) return;

        const { width } = ref.current?.getBoundingClientRect();

        setSelectedPosition({
          left: ref.current?.offsetLeft,
          width,
          opacity: 1,
        });
        onClick();
      }}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current?.getBoundingClientRect();

        setPosition({
          left: ref.current?.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 uppercase text-light mix-blend-difference max-sm:text-xs"
    >
      {children}
    </li>
  );
};

const Cursor = ({
  position,
}: {
  position: { left: number; width: number; opacity: number };
}) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-10 rounded-full bg-dark-gray max-sm:h-8"
    />
  );
};

export default SlideTabs;
