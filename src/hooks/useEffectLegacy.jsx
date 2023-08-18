import { useEffect, useRef } from "react";

export const useLegacyEffect = (cb, deps) => {
  console.log('Legacy effect')
    const isMountedRef = useRef(false);
  
    useEffect(() => {
      /* if (!isMountedRef.current) {
        isMountedRef.current = true;
        return undefined;
      } */
  console.log('invoked')
      return cb();
    }, deps);
  };
  
