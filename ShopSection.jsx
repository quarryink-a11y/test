import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(trailX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(trailY, { stiffness: 80, damping: 20, mass: 0.5 });

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const onEnter = (e) => {
      const t = e.target;
      if (t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button")) {
        setHovered(true);
      }
    };
    const onLeave = () => setHovered(false);
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: clicked ? 0.5 : hovered ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-1.5 h-1.5 bg-white rounded-full"
      />
      <motion.div
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: hovered ? 2.2 : clicked ? 0.8 : 1,
          opacity: hovered ? 0.5 : 0.25,
        }}
        transition={{ duration: 0.25 }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-8 h-8 rounded-full border border-white/50"
      />
    </>
  );
}