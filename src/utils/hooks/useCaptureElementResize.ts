import { useEffect, useRef, useState } from "react";

/** @Hack: to capture the table container element width and based on that we decide to calculate the columns widths 
 passed to react-table for accurate calculation on in different resolutions of screen. Here we have one caveat.
 In case of tabs the element of table hide and ref element don't have correct calculation so we decide to pass ref from 
 top most parent which is above and override the behavior of useCaptureElementResize.
 *  */
export const useCaptureElementResize = (ref?: any) => {
  const resizeElementRef = useRef();
  const [size, setSize] = useState<ClientRect>();

  useEffect(() => {
    const containerRef = ref || resizeElementRef;

    const measuer = () => {
      setSize(containerRef?.current?.getBoundingClientRect());
    };

    window.addEventListener("resize", measuer);

    setTimeout(() => {
      measuer();
    }, 500);

    return () => {
      window.removeEventListener("resize", measuer);
    };
  }, [resizeElementRef, ref]);

  return { resizeElementRef: ref || resizeElementRef, size };
};
