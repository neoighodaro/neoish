import { useEffect } from "react";

const useStyle = (url, attributes = {}) => {
  useEffect(() => {
    const style = document.createElement("link");

    style.type = "text/css";
    style.href = url;
    style.rel = "stylesheet";

    Object.keys(attributes).forEach((key) => (style[key] = attributes[key]));

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [url]);
};

export default useStyle;
