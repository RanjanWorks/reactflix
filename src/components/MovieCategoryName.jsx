import React from "react";
import { NavLink } from "react-router-dom";
import { LiaAngleRightSolid } from "react-icons/lia";

const MovieCategoryName = ({ title, linkTo }) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <h2 className=" text-md lg:text-xl  text-white my-2 ">
        {title}
      </h2>
      {linkTo ? (
        <NavLink to={linkTo}>
          <button className="py-1 rounded-full text-md lg:text-lg flex items-center text-blue-400">
            View all
            <LiaAngleRightSolid size={15} />
          </button>
        </NavLink>
      ) : (
        ""
      )}
    </div>
  );
};

export default MovieCategoryName;
