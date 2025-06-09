import React from "react";
import { ToastContainer } from "react-toastify";
import PersonalDetails from "./PersonalDetails";
import BookedVendors from "./BookedVendors";

const Profile: React.FC = () => {
  return (
    <div className="pageMain">
      <div className="pageContainer">
        <h2 className="pageHeader">Your Profile</h2>

        <PersonalDetails /> 
        <hr className="divider"/> 
        <BookedVendors />
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Profile;