import React from "react";
import Navbar from "../layout/Navbar";

const Header: React.FC = () => {
  let currentPage: string = window.location.href;

  if (
    currentPage.includes("welcome") ||
    currentPage.includes("redirect") ||
    currentPage.includes("authorized")
  )
    return null;
  else
    return (
      <>
        <div>
          <Navbar />
        </div>
      </>
    );
};

export default Header;
