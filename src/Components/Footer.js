import React from "react";

const year = new Date().getFullYear();

function Footer() {
  return (
    <footer className="site-footer mt-4 py-4 text-center">
      Inkline · {year}
    </footer>
  );
}

export default Footer;
