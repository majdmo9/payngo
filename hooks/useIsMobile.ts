import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const mobileKeywords = ["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "Windows Phone"];
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
    setIsMobile(isMobile);
  }, []);
  return { isMobile };
};
