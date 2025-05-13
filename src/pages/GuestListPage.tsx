import React from "react";
import GuestList from "../components/GuestList/GuestList";
import { NavBar } from "../components/NavBar/NavBar";

const GuestPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <GuestList />
    </div>
  );
};

export default GuestPage;
