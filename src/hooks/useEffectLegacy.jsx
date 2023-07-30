import { useEffect, useRef } from "react";

export const useLegacyEffect = (cb, deps) => {
    const isMountedRef = useRef(false);
  
    useEffect(() => {
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        return undefined;
      }
  
      return cb();
    }, deps);
  };
  
