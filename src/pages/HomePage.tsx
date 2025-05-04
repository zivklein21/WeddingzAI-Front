import React from "react";
import Home from "../components/Home/Home";
import { NavBar } from "../components/NavBar/NavBar";

const HomePage: React.FC = () => {

  return (
    <div>
      <NavBar />
      <Home />
    </div>
  );
};

export default HomePage;
