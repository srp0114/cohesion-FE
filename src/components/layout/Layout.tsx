import Header from "./Header";
import React from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
