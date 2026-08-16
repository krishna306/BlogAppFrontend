import React, { useEffect, useState } from "react";
import fallback from "../images/nature-image-for-website.webp";

export function toHttps(url) {
  if (!url) return "";
  return String(url).replace(/^http:\/\//i, "https://");
}

function CoverImage({ src, alt = "", className, ...rest }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = failed ? fallback : toHttps(src) || fallback;

  return (
    <img
      className={className}
      src={resolved}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}

export default CoverImage;
