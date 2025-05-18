import React from "react";
import Home from "../components/Home/Home";
import { NavBar } from "../components/NavBar/NavBar";

const HomePage: React.FC = () => {

  return (
    <>
      <NavBar title="My Wedding"/>
      <Home />
    </>
  );
};

export default HomePage;
