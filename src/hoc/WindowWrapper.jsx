import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";

const WindowWrapper = (Component, windowkey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex } = windows[windowkey];
    const ref = useRef(null);

    //open the window
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;
      el.style.display = "block";

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }, [isOpen]);

    //make draggable window
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowkey),
      });
      return () => instance.kill();
    }, []);

    //how do we make the window off at start
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    return (
      <section id={windowkey} ref={ref} style={{ zIndex }} className="absolute">
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.diaplayName || Component.name || "Component"
  })`;
  return Wrapped;
};

export default WindowWrapper;
