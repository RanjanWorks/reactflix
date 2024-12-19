import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="content lg:mt-[50px]">
        <Outlet />
      </div>
      <div className="lg:hidden">
      <Navigation />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
